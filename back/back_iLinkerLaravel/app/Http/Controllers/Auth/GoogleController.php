<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google_Client;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class GoogleController extends Controller
{
    public function loginWithGoogle(Request $request)
    {
        try {
            $idToken = $request->input('id_token');
            $email = $request->input('email');
            $name = $request->input('name');

            // Validate the token
            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($idToken);

            if ($payload) {
                // Find or create user
                $user = User::where('email', $email)->first();

                if (!$user) {
                    $user = User::create([
                        'name' => $name ?? 'Usuario Google',
                        'surname' => '',
                        'email' => $email,
                        'password' => bcrypt(uniqid()),
                        'active' => true,
                        'email_verified_at' => now(),
                        'rol' => 'user' // Set default role
                    ]);
                }

                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'token' => $token,
                    'user' => $user,
                ]);
            }

            return response()->json(['status' => 'error', 'message' => 'Invalid token'], 401);
        } catch (\Exception $e) {
            Log::error('Google login error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Authentication failed'], 500);
        }
    }
}
