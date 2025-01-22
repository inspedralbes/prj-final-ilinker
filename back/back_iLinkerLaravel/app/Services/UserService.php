<?php

namespace App\Services;

use App\Models\User;
use Laravel\Sanctum\HasApiTokens;


class UserService
{

    use HasApiTokens;

    public function __construct(){

    }

    public function createUser($newUser)
    {
        $user = new User();

        $user->name = $newUser['name'];
        $user->email = $newUser['email'];
        $user->password = $newUser['password'];
        $user->rol = $newUser['rol'];
        $user->save();

        // Generar un token para el usuario
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function updateUser($newUser)
    {
        $user = User::find0rFail($newUser['id']);

        $user->name = $newUser['name'];
        $user->email = $newUser['email'];
        $user->password = $newUser['password'];
        $user->rol = $newUser['role'];

        $user->save();

        return $user;
    }

    public function deleteUser($newUser)
    {
        $user = User::findOrFail($newUser['id']);
        $user->delete();
        return $user;
    }

    public function getUsers()
    {
        return User::all();
    }

    public function getUserById($id)
    {
        $user = User::findOrFail($id);
        return $user;
    }

    public function checkIFUserExists($userData)
    {
        return User::where('email', '=', $userData['email'])->exists();

    }

}
