<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserSettingsController extends Controller
{


    /**
     * @OA\Post(
     *     path="/account/toggle-privacy",
     *     summary="Alternar privacidad de la cuenta del usuario autenticado",
     *     description="Permite al usuario autenticado cambiar el estado de privacidad de su cuenta. Si es pública, cambia a privada y viceversa.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Estado actualizado de la privacidad de la cuenta",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tu cuenta ahora es privada"),
     *             @OA\Property(property="is_public_account", type="boolean", example=false)
     *         )
     *     ),
     * )
     */
    public function toggleAccountPrivacy()
    {
        $user = Auth::user();

        // Cambiar el estado actual a su opuesto
        $user->is_public_account = !$user->is_public_account;
        $user->save();

        $status = $user->is_public_account ? 'pública' : 'privada';

        return response()->json([
            'message' => "Tu cuenta ahora es {$status}",
            'is_public_account' => $user->is_public_account
        ]);
    }


    /**
     * @OA\Get(
     *     path="/account/privacy-status",
     *     summary="Obtener el estado de privacidad de la cuenta del usuario autenticado",
     *     description="Devuelve si la cuenta del usuario autenticado es pública o privada.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Estado de privacidad pública",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tu cuenta es pública"),
     *             @OA\Property(property="is_public_account", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=202,
     *         description="Estado de privacidad privada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tu cuenta es privada"),
     *             @OA\Property(property="is_public_account", type="boolean", example=false)
     *         )
     *     )
     * )
     */
    public function getAccountStatus()
    {
        $user = Auth::user();

        $status = $user->is_public_account ? 'pública' : 'privada';

        return response()->json([
            'message' => "Tu cuenta es {$status}",
            'is_public_account' => $user->is_public_account
        ]);
    }


    /**
     * @OA\Get(
     *     path="/profile",
     *     summary="Obtener el perfil completo del usuario autenticado",
     *     description="Devuelve el perfil del usuario autenticado, incluyendo relaciones como instituciones, empresa y estudiante si existen.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Perfil completo del usuario autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="profile",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Laura Gómez"),
     *                 @OA\Property(property="email", type="string", example="laura@example.com"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-09-15T10:00:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-11-01T12:00:00.000000Z"),
     *                 @OA\Property(
     *                     property="institutions",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=2),
     *                         @OA\Property(property="name", type="string", example="Universidad Central")
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="company",
     *                     type="object",
     *                     nullable=true,
     *                     @OA\Property(property="id", type="integer", example=3),
     *                     @OA\Property(property="name", type="string", example="TechCorp")
     *                 ),
     *                 @OA\Property(
     *                     property="student",
     *                     type="object",
     *                     nullable=true,
     *                     @OA\Property(property="id", type="integer", example=5),
     *                     @OA\Property(property="major", type="string", example="Ingeniería Informática")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getProfile()
    {
        $profile = User::with(['institutions', 'company', 'student'])
            ->where('id', Auth::id())
            ->first();

        return response()->json([
            'status' => 'success',
            'profile' => $profile
        ]);
    }


    /**
     * @OA\Post(
     *     path="/user/update-password",
     *     summary="Actualizar la contraseña del usuario autenticado",
     *     description="Permite cambiar la contraseña proporcionando la actual, la nueva y su confirmación. Solo se actualiza si la actual es válida y las nuevas coinciden.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"current_password","new_password","confirm_password"},
     *             @OA\Property(property="current_password", type="string", example="actual123", description="La contraseña actual del usuario"),
     *             @OA\Property(property="new_password", type="string", example="nuevaSegura456", description="La nueva contraseña que se desea establecer"),
     *             @OA\Property(property="confirm_password", type="string", example="nuevaSegura456", description="Confirmación de la nueva contraseña, debe coincidir con new_password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contraseña actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Contraseña actualizada correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="current_password", type="array", @OA\Items(type="string", example="La contraseña actual es requerida")),
     *                 @OA\Property(property="new_password", type="array", @OA\Items(type="string", example="La nueva contraseña es requerida")),
     *                 @OA\Property(property="confirm_password", type="array", @OA\Items(type="string", example="La confirmación de la nueva contraseña es requerida"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Las contraseñas no coinciden",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Las contraseñas no coinciden")
     *         )
     *     ),
     * )
     */
    public function updatePassword(Request $request)
    {
        $rules = [
            'current_password' => 'required',
            'new_password' => 'required',
            'confirm_password' => 'required'
        ];

        $messages = [
            'current_password.required' => 'La contraseña actual es requerida',
            'new_password.required' => 'La nueva contraseña es requerida',
            'confirm_password.required' => 'La confirmación de la nueva contraseña es requerida',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ]);
        }

        try {
            if ($request->new_password !== $request->confirm_password) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Las contraseñas no coinciden'
                ]);
            }

            // Obtener el usuario actual
            $user = Auth::user();

            // Verificar que la contraseña actual es correcta
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'La contraseña actual es incorrecta'
                ]);
            }

            // Actualizar la contraseña
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Contraseña actualizada correctamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }
    }


    /**
     * @OA\Post(
     *     path="/user/update-email",
     *     summary="Actualizar el correo electrónico del usuario autenticado",
     *     description="Permite al usuario autenticado actualizar su dirección de correo electrónico.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="nuevo@email.com", description="El nuevo correo electrónico del usuario")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email editado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Email editado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="email", type="array", @OA\Items(type="string", example="El email es requerido"))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="errors", type="string", example="Error interno del servidor o mensaje de excepción")
     *         )
     *     )
     * )
     */
    public function updateEmail(Request $request)
    {
        $rules = [
            'email' => 'required|email'
        ];

        $messages = [
            'email.required' => 'El email es requerido'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ]);
        }

        try {
            $user = Auth::user();
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Email editado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }
    }
}
