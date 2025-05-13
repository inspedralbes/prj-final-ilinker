<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserSettingsController extends Controller
{
    /**
     * Cambiar la privacidad de la cuenta (pública/privada)
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
     * Obtener el estado actual de la cuenta
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

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ]);
        }

        try{
            if($request->new_password !== $request->confirm_password){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Las contraseñas no coinciden'
                ]);
            }

            // Obtener el usuario actual
            $user = Auth::user();

            // Verificar que la contraseña actual es correcta
            if(!Hash::check($request->current_password, $user->password)){
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

        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }
    }

    public function updateEmail(Request $request)
    {
        $rules = [
            'email' => 'required|email'
        ];

        $messages = [
            'email.required' => 'El email es requerido'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ]);
        }

        try{
            $user = Auth::user();
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Email editado correctamente'
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'errors' => $e->getMessage()
            ]);
        }
    }
}
