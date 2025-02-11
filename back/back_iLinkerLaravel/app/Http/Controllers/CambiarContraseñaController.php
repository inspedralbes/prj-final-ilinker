<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\CambiarContraseña;
use App\Mail\SendPasswordResetCode;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class CambiarContraseñaController extends Controller
{
    public function sendCode(Request $request)
    {
        try {
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

    public function verifyCode(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'code' => 'required|string|digits:6'
            ]);

            $RestablecerContraseña = CambiarContraseña::where('email', $request->email)
                ->where('code', $request->code)
                ->where('expires_at', '>=', now())
                ->first();

            if(!$RestablecerContraseña){
                return response()->json(['status' => 'error', 'message' => 'Codi invàlid o caducat'], 400);
            }

            return response()->json(['status' => 'success', 'message' => 'Codi correcte']);
    }

    public function resetPassword(Request $request){

             $request->validate([
            'email'=> 'required|email',
            'code'=> 'required|string|digits:6',
            'password'=> 'required|string'
             ]);

            $passwordReset = CambiarContraseña::where('email', $request->email)
                ->where('code', $request->code)
                ->where('expires_at', '>=', now())
                ->first();

              if(!$passwordReset){
                return response()->json(['status' => 'error', 'message' => 'Codi invàlid o caducat'], 400);
            }

            $user = User::where('email', $request->email)->first();
            $user->password = bcrypt($request->password);
            $user->save();

            return response()->json(['status' => 'success', 'message' => 'Contrasenya restablerta correctament']);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validació',
                'errors' => $e->errors()
            ], 422);

        } catch (QueryException $e) {
            Log::error('Database error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error en la base de dades'
            ], 500);

        } catch (Exception $e) {
            Log::error('Error resetting password: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error en actualitzar la contrasenya'
            ], 500);
        }
    }
}
