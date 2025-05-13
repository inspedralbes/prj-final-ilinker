<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\CompanyService;
use App\Services\InstitutionService;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required',
            'surname' => 'required',
            'birthday' => 'required',
            'email' => 'required',
        ]);

        $user = $this->userService->updateUser($validated);
        return response()->json(['status' => 'success', 'user' => $user]);

    }

    public function deactivate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        $user = $this->userService->deactivateUser($validated['id']);
        if ($user) {
            return response()->json(['status' => 'success', 'user' => $user, 'message' => 'El usuario a sido dado de baja correctamente']);
        }

        return response()->json(['status' => 'warning', 'message' => 'El usuario no pudo ser dado de baja']);
    }

    public function activate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        $user = $this->userService->activateUser($validated['id']);
        if ($user) {
            return response()->json(['status' => 'success', 'user' => $user, 'message' => 'El usuario a sido dado de alta correctamente']);
        }

        return response()->json(['status' => 'warning', 'message' => 'El usuario no pudo ser dado de baja']);

    }


    public function getUser(Request $request)
    {

        $validated = $request->validate([
            'id' => 'required',
        ]);

        $user = $this->userService->getUserByIdWithInfo($validated['id']);

        if (!$user) {
            return response()->json(['status' => 'warning', 'message' => 'El usuario no se encuentra registrado']);
        }

        return response()->json(['status' => 'success', 'user' => $user]);
    }

    public function getAllUsers()
    {
        $users = $this->userService->getUsers();

        Log::info("Datos a enviar los usuarios", ["users" => $users]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuarios obtenidos correctamente',
            'users' => $users]);
    }


}
