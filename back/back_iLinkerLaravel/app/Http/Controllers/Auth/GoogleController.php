<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google_Client;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GoogleController extends Controller
{
    public function loginWithGoogle(Request $request)
    {
        try {
            Log::info('Google login attempt', ['email' => $request->input('email')]);

            // No necesitamos verificar el id_token ya que NextAuth ya lo ha verificado
            $email = $request->input('email');
            $name = $request->input('name');

            if (!$email) {
                Log::error('No email provided in Google login');
                return response()->json(['status' => 'error', 'message' => 'Email is required'], 400);
            }

            // Find or create user
            $user = User::where('email', $email)->first();

            if (!$user) {
                // Extraer nombre y apellido del nombre completo
                $nameParts = explode(' ', $name);
                $firstName = $nameParts[0];
                $surname = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : 'User';

                Log::info('Creating new user from Google login', ['email' => $email]);

                $user = User::create([
                    'name' => $firstName,
                    'surname' => $surname,
                    'email' => $email,
                    'password' => bcrypt(uniqid() . time()),
                    'active' => true,
                    'birthday' => Carbon::now()->subYears(18), // Default birthday
                    'email_verified_at' => now(),
                    'rol' => 'student' // Default role
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Google login successful', ['email' => $email]);

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Authentication failed',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
