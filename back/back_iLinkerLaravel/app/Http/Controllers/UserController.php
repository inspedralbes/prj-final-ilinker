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

    /**
     * @OA\Put(
     *     path="/api/user/update",
     *     summary="Actualizar los datos del usuario",
     *     description="Valida los campos recibidos y actualiza la información del usuario mediante el servicio UserService.",
     *     operationId="updateUser",
     *     tags={"Usuarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id", "name", "surname", "birthday", "email"},
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Juan"),
     *             @OA\Property(property="surname", type="string", example="Pérez"),
     *             @OA\Property(property="birthday", type="string", format="date", example="1990-01-01"),
     *             @OA\Property(property="email", type="string", format="email", example="juan.perez@example.com")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Datos del usuario actualizados correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="user", type="object", description="Datos actualizados del usuario")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 additionalProperties={
     *                     "type": "array",
     *                     "items": {
     *                         "type": "string"
     *                     }
     *                 },
     *                 example={
     *                     "email": {
     *                         "El correo electrónico ya está en uso."
     *                     }
     *                 }
     *             )
     *         )
     *     )
     * )
     */
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


    /**
     * @OA\Post(
     *     path="/api/user/deactivate",
     *     summary="Da de baja (desactiva) a un usuario por su ID",
     *     description="Valida que se reciba el ID del usuario y utiliza el servicio UserService para desactivar al usuario.",
     *     operationId="deactivateUser",
     *     tags={"Usuarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Usuario desactivado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="El usuario a sido dado de baja correctamente"),
     *             @OA\Property(property="user", type="object", description="Datos del usuario desactivado")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo dar de baja al usuario",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="warning"),
     *             @OA\Property(property="message", type="string", example="El usuario no pudo ser dado de baja")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 additionalProperties={
     *                     "type": "array",
     *                     "items": {
     *                         "type": "string"
     *                     }
     *                 },
     *                 example={
     *                     "id": {
     *                         "El ID del usuario es obligatorio."
     *                     }
     *                 }
     *             )
     *         )
     *     )
     * )
     */
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


    /**
     * @OA\Post(
     *     path="/api/user/activate",
     *     summary="Da de alta (activa) a un usuario por su ID",
     *     description="Valida que se reciba el ID del usuario y utiliza el servicio UserService para activar al usuario.",
     *     operationId="activateUser",
     *     tags={"Usuarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Usuario activado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="El usuario a sido dado de alta correctamente"),
     *             @OA\Property(property="user", type="object", description="Datos del usuario activado")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="No se pudo activar al usuario",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="warning"),
     *             @OA\Property(property="message", type="string", example="El usuario no pudo ser dado de baja")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 additionalProperties={
     *                     "type": "array",
     *                     "items": {
     *                         "type": "string"
     *                     }
     *                 },
     *                 example={
     *                     "id": {
     *                         "El ID del usuario es obligatorio."
     *                     }
     *                 }
     *             )
     *         )
     *     )
     * )
     */
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


    /**
     * @OA\Post(
     *     path="/api/user/detail",
     *     summary="Obtiene la información detallada de un usuario por su ID",
     *     description="Valida que se reciba el ID del usuario y devuelve la información completa utilizando el servicio UserService.",
     *     operationId="getUserDetail",
     *     tags={"Usuarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Usuario encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="user", type="object", description="Datos detallados del usuario")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Usuario no registrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="warning"),
     *             @OA\Property(property="message", type="string", example="El usuario no se encuentra registrado")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 additionalProperties={
     *                     "type": "array",
     *                     "items": {
     *                         "type": "string"
     *                     }
     *                 },
     *                 example={
     *                     "id": {
     *                         "El ID del usuario es obligatorio."
     *                     }
     *                 }
     *             )
     *         )
     *     )
     * )
     */
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


    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Obtener todos los usuarios",
     *     description="Recupera todos los usuarios usando el servicio de usuarios y los devuelve en formato JSON.",
     *     operationId="getAllUsers",
     *     tags={"Users"},
     *     @OA\Response(
     *         response=200,
     *         description="Usuarios obtenidos correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Usuarios obtenidos correctamente"),
     *             @OA\Property(
     *                 property="users",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Nombre Usuario"),
     *                     @OA\Property(property="email", type="string", example="usuario@example.com")
     *                 )
     *             )
     *         )
     *     )
     * )
     */

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
