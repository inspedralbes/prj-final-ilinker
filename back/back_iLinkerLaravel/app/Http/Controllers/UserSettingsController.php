<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}
