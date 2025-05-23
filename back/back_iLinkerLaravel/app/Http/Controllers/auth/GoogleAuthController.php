<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'provider_id' => $googleUser->id,
                    'provider' => 'google',
                ]);
            }

            $token = $user->createToken('google-token')->plainTextToken;

            $redirectUrl = config('app.frontend_url') . '/auth/google/callback?' . http_build_query([
                'token' => $token,
                'user' => json_encode($user)
            ]);

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            return redirect(config('app.frontend_url') . '/login?error=Unable to login with Google');
        }
    }
}
