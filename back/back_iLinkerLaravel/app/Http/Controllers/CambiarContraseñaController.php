<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\CambiarContraseña;
use App\Mail\SendPasswordResetCode;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use OpenApi\Annotations as OA;

class CambiarContraseñaController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/password/code",
     *     summary="Enviar codi de recuperació de contrasenya",
     *     description="Aquest endpoint genera i envia un codi de 6 dígits al correu electrònic proporcionat per a recuperar la contrasenya. El codi és vàlid durant 15 minuts.",
     *     operationId="sendPasswordRecoveryCode",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Codi enviat correctament",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Codi enviat correctament")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dades no vàlides",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="email",
     *                     type="array",
     *                     @OA\Items(type="string", example="The email field is required.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */

    public function sendCode(Request $request)
    {

        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        // Generar codi de 6 dígits
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Guardar codi en la base de dades
        CambiarContraseña::updateOrCreate(
            ['email' => $request->email],
            ['code' => $code, 'expires_at' => now()->addMinutes(15)]
        );

        // Enviar email
        Mail::to($request->email)->send(new SendPasswordResetCode($code));

        return response()->json(['status' => 'success', 'message' => 'Codi enviat correctament']);
    }


    /**
     * @OA\Post(
     *     path="/api/password/verify-code",
     *     summary="Verificar codi de recuperació de contrasenya",
     *     description="Aquest endpoint comprova si el codi enviat per correu és vàlid i no ha caducat.",
     *     operationId="verifyRecoveryCode",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "code"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="code", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Codi correcte",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Codi correcte")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Codi invàlid o caducat",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Codi invàlid o caducat")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dades no vàlides",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="email",
     *                     type="array",
     *                     @OA\Items(type="string", example="The email field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="code",
     *                     type="array",
     *                     @OA\Items(type="string", example="The code field is required.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|digits:6'
        ]);

        $RestablecerContraseña = CambiarContraseña::where('email', $request->email)
            ->where(('code'), $request->code)
            ->where('expires_at', '>=', now())
            ->first();

        if (!$RestablecerContraseña) {
            return response()->json(['status' => 'error', 'message' => 'Codi invàlid o caducat'], 400);
        }

        return response()->json(['status' => 'success', 'message' => 'Codi correcte']);
    }


    /**
     * @OA\Post(
     *     path="/api/password/reset",
     *     summary="Restablir contrasenya d'usuari",
     *     description="Aquest endpoint permet canviar la contrasenya mitjançant un codi de verificació vàlid.",
     *     operationId="resetPassword",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "code", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="code", type="string", example="123456"),
     *             @OA\Property(property="password", type="string", example="novaContrasenya123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contrasenya restablerta correctament",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Contrasenya restablerta correctament")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Codi invàlid o caducat",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Codi invàlid o caducat")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dades no vàlides",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="email",
     *                     type="array",
     *                     @OA\Items(type="string", example="The email field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="code",
     *                     type="array",
     *                     @OA\Items(type="string", example="The code field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="array",
     *                     @OA\Items(type="string", example="The password field is required.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */

    public function resetPassword(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|digits:6',
            'password' => 'required|string'
        ]);

        $passwordReset = CambiarContraseña::where('email', $request->email)
            ->where('code', $request->code)
            ->where('expires_at', '>=', now())
            ->first();

        if (!$passwordReset) {
            return response()->json(['status' => 'error', 'message' => 'Codi invàlid o caducat'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json(['status' => 'success', 'message' => 'Contrasenya restablerta correctament']);

    }
}
