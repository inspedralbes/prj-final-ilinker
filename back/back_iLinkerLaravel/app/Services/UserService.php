<?php

namespace App\Services;

use App\Models\User;
use DateTime;
use Exception;
use Illuminate\Support\Facades\Auth;
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
        $user->surname = $newUser['surname'];

        if (!empty($newUser['birthday'])) {
            $fecha = DateTime::createFromFormat('d/m/Y', $newUser['birthday']);

            if (!$fecha) {
                $fecha = DateTime::createFromFormat('Y-m-d', $newUser['birthday']);
            }

            if ($fecha) {
                $user->birthday = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                throw new Exception("Formato de fecha inválido: " . $newUser['birthday']);
            }
        }

        $user->email = $newUser['email'];
        $user->password = $newUser['password'];
        $user->rol = $newUser['rol'];
        $user->save();

        // Generar un token para el usuario
        $token = $user->createToken('auth_token')->plainTextToken;
        Auth::login($user);

        return [
            'user' => $user ,
            'token' => $token,
        ];
    }

    public function updateUser($newUser)
    {

        $user = User::findOrFail($newUser['id']);

        $user->name = $newUser['name'];
        $user->email = $newUser['email'];
        $user->password = $newUser['password'] ?? $user->password;
        $user->save();

        return $user;
    }

    public function deactivateUser($id)
    {
        try{
        $user = User::findOrFail($id);
        $user->active = false;
        return $user;

        }catch (Exception $e){
            return false;
        }
    }

    public function activateUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->active = true;
            return $user;

        }catch (Exception $e){
            return false;
        }

    }

    public function getUsers()
    {
        return User::all();
    }

    public function getUserByIdWithInfo($id)
    {
        try {
            $user = User::findOrFail($id);

            // Inicializa el objeto del usuario con la relación correspondiente
            $userInfo = match ($user->rol) {
                'company' => User::with('company')->where('id', $id)->first(),
                'institutions' => User::with('institutions')->where('id', $id)->first(),
                'student' => User::with(['student','education', 'experience', 'skills' => function ($query) {
                    $query->select('skills.id', 'skills.name');
                }])->where('id', $id)->first(),
                default => null,
            };

            return $userInfo;
        }catch (Exception $e){
            return false;
        }
    }

    public function checkIFUserExists($userData)
    {
        return User::where('email', '=', $userData['email'])->exists();

    }

}
