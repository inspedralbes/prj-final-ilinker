<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\CambiarContraseña;
use App\Mail\SendPasswordResetCode;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class CambiarContraseñaController extends Controller
{
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
        Mail::to($request->email)->send (new SendPasswordResetCode($code));

        return response()->json(['message' => 'Código enviat correctament']);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email'=> 'required|email',
            'code' => 'required|string|digits:6'
        ]);

        $RestablecerContraseña = CambiarContraseña::where('email',$request->email)
            ->where(('code'),$request->code)
            ->where('expires_at','>=',now())
            ->first();

            if(!$RestablecerContraseña){
                return response()->json(['message' => 'Codi invalid o caducat'], 400);
            }

            return response()->json(['message'=>'Codi valid']);
    }

    public function resetPassword(Request $request){
             $request->validate([
            'email'=> 'required|email',
            'code'=> 'required|string|digits:6',
            'password'=> 'required|string|confirmed'
             ]);
        $passwordReset = CambiarContraseña::where('email',$request->email)
            ->where('code',$request->code)
            ->where('expires_at','>=',now())
            ->first();

              if(!$passwordReset){
                return response()->json(['message' => 'Codi invalid o caducat'], 400);
            }

            $user = User::where('email',$request->email)->first();
            $user->password = bcrypt($request->password);
            $user->save();

            // Eliminar el codigo usado
            $passwordReset->DB::select();

            return response()->json(['message'=>'Contrasenya actualitzada correctament']);

    }
}
