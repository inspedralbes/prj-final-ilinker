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

    public function suggestedLogout()
    {
        $users = User::with(['institutions', 'company', 'student'])
            ->withCount([
                'publications',
                'followers as followers_count' => function ($query) {
                    $query->where('followers.status', 'approved');
                }
            ])
            ->where('rol', '!=', 'admin')
            ->orderByDesc('followers_count')
            ->orderByDesc('publications_count')
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Usuarios obtenidos correctamente',
            'users' => $users
        ]);
    }

    public function suggestedLogin()
    {
        $authUser = auth()->user();

        // IDs de seguidores del usuario
        $followerIds = $authUser->followers()->pluck('users.id');

        // IDs de usuarios a los que sigue el usuario
        $followingIds = $authUser->following()->pluck('users.id');

        // IDs combinados (seguidores y seguidos)
        $knownCircleIds = $followerIds->merge($followingIds)->unique();

        // Usuarios que son seguidores de mis seguidores/seguidos
        $suggestedIds = User::whereHas('followers', function ($query) use ($knownCircleIds) {
            $query->whereIn('followers.follower_id', $knownCircleIds)
                ->where('followers.status', 'approved');
        })
            ->where('id', '!=', $authUser->id)
            ->whereNotIn('id', $followingIds)
            ->pluck('id')
            ->unique();

        // Obtener los usuarios sugeridos con relaciones y conteos
        $users = User::with(['institutions', 'company', 'student'])
            ->withCount([
                'publications',
                'followers as followers_count' => function ($query) {
                    $query->where('followers.status', 'approved');
                }
            ])
            ->whereIn('id', $suggestedIds)
            ->where('rol', '!=', 'admin')
            ->orderByDesc('followers_count')
            ->orderByDesc('publications_count')
            ->take(5)
            ->get();

        // Si hay menos de 5 usuarios sugeridos, completar con los más populares
        if ($users->count() < 5) {
            $alreadyIncludedIds = $users->pluck('id')->merge([$authUser->id])->merge($followingIds);

            $complementaryUsers = User::with(['institutions', 'company', 'student'])
                ->withCount([
                    'publications',
                    'followers as followers_count' => function ($query) {
                        $query->where('followers.status', 'approved');
                    }
                ])
                ->whereNotIn('id', $alreadyIncludedIds)
                ->where('rol', '!=', 'admin')
                ->orderByDesc('followers_count')
                ->orderByDesc('publications_count')
                ->take(5 - $users->count())
                ->get();

            $users = $users->concat($complementaryUsers);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Usuarios sugeridos correctamente',
            'users' => $users,
        ]);
    }



}
