<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class FollowerController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/follows",
     *     summary="Seguir a un usuario",
     *     description="Permite al usuario autenticado seguir a otro usuario. Valida el ID, evita autoseguimiento, bloqueos y duplicados. La relación puede aprobarse automáticamente o quedar pendiente.",
     *     operationId="followUser",
     *     tags={"Follows"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="integer", example=2, description="ID del usuario a seguir")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Seguimiento exitoso o ya existente",
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(
     *                     type="object",
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="Ahora sigues a este usuario"),
     *                     @OA\Property(property="follow_status", type="string", example="approved"),
     *                     @OA\Property(
     *                         property="newFollow",
     *                         type="object",
     *                         @OA\Property(property="follower_id", type="integer", example=1),
     *                         @OA\Property(property="following_id", type="integer", example=2),
     *                         @OA\Property(property="status", type="string", example="approved")
     *                     )
     *                 ),
     *                 @OA\Schema(
     *                     type="object",
     *                     @OA\Property(property="status", type="string", example="warning"),
     *                     @OA\Property(property="message", type="string", example="Ya sigues a este usuario")
     *                 )
     *             }
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="Intento de autoseguimiento",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No puedes seguirte a ti mismo")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validación fallida",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="object",
     *                 @OA\Property(property="user_id", type="array", @OA\Items(type="string", example="El id del usuario es requerido"))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Usuario no encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Usuario no encontrado")
     *         )
     *     )
     * )
     */
    public function follow(Request $request)
    {
        Log::info("follow user");
        Log::info($request);
        $rules = [
            'user_id' => 'required',
        ];

        $messages = [
            'user_id.required' => 'El id del usuario es requerido',
        ];

        $validate = Validator::make($request->all(), $rules, $messages);

        if ($validate->fails()) {
            return response([
                'status' => 'error',
                'message' => $validate->errors()
            ]);
        }

        $follower_id = Auth::id();
        $following_id = $request->user_id;

        // Verificar que no sea el mismo usuario
        if ($follower_id == $following_id) {
            return response()->json(['message' => 'No puedes seguirte a ti mismo'], 400);
        }

        // Obtener el usuario a seguir
        $userToFollow = User::findOrFail($following_id);

        // Verificar si el usuario está bloqueado
        $isBlocked = DB::table('blocked_users')
            ->where(function ($query) use ($follower_id, $following_id) {
                $query->where('user_id', $following_id)
                    ->where('blocked_user_id', $follower_id);
            })->exists();

        if ($isBlocked) {
            return response()->json([
                'status' => 'error',
                'message' => 'No puedes seguir a este usuario'
            ]);
        }

        // Verificar si ya existe una relación de seguimiento
        $existingFollow = DB::table('followers')
            ->where('follower_id', $follower_id)
            ->where('following_id', $following_id)
            ->first();

        if ($existingFollow) {
            if ($existingFollow->status === 'approved') {
                return response()->json([
                    'status' => 'warning',
                    'message' => 'Ya sigues a este usuario'
                ]);
            } else {
                return response()->json([
                    'status' => 'warning',
                    'message' => 'Ya has enviado una solicitud de seguimiento'
                ]);
            }
        }

        // Determinar el estado según la configuración de privacidad
        $status = $userToFollow->is_public_account ? 'approved' : 'pending';

        // Crear la relación
        $newFollow = new Follower();
        $newFollow->follower_id = $follower_id;
        $newFollow->following_id = $following_id;
        $newFollow->status = $status;
        $newFollow->save();

        if ($status === 'approved') {
            return response()->json([
                'status' => 'success',
                'message' => 'Ahora sigues a este usuario',
                'follow_status' => 'approved',
                'newFollow' => $newFollow
            ]);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'Solicitud de seguimiento enviada. Esperando aprobación',
                'follow_status' => 'pending',
                'newFollow' => $newFollow
            ]);
        }
    }


    /**
     * @OA\Delete(
     *     path="/api/follows/{user_id}",
     *     summary="Deixar de seguir a un usuari",
     *     description="Permet al usuari autenticat deixar de seguir a un altre usuari eliminant la relació de seguiment.",
     *     operationId="unfollowUser",
     *     tags={"Follows"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         description="ID de l'usuari al qual es deixa de seguir",
     *         required=true,
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Resposta d'èxit quan es deixa de seguir o ja no es segueix l'usuari",
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(
     *                     type="object",
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="Has dejado de seguir a este usuario"),
     *                     @OA\Property(property="unfollow", type="integer", example=1)
     *                 ),
     *                 @OA\Schema(
     *                     type="object",
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="No sigues a este usuario"),
     *                     @OA\Property(property="unfollow", type="integer", example=0)
     *                 )
     *             }
     *         )
     *     )
     * )
     */
    public function unfollow($user_id)
    {
        $follower_id = Auth::id();

        $deleted = DB::table('followers')
            ->where('follower_id', $follower_id)
            ->where('following_id', $user_id)
            ->delete();

        if ($deleted) {
            return response()->json([
                'status' => 'success',
                'message' => 'Has dejado de seguir a este usuario',
                'unfollow' => $deleted
            ]);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'No sigues a este usuario',
                'unfollow' => $deleted
            ]);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/follows/approve/{follower_id}",
     *     summary="Aprova una sol·licitud de seguiment pendent",
     *     description="Canvia l'estat de la relació de seguiment de 'pending' a 'approved' per un usuari que vol seguir l'usuari autenticat.",
     *     operationId="approveFollowRequest",
     *     tags={"Follows"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="follower_id",
     *         in="path",
     *         description="ID de l'usuari que ha enviat la sol·licitud de seguiment",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Sol·licitud de seguiment aprovada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Solicitud de seguimiento aprobada")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No s'ha trobat la sol·licitud de seguiment",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No se encontró la solicitud de seguimiento")
     *         )
     *     )
     * )
     */
    public function approveFollowRequest($follower_id)
    {
        $following_id = Auth::id();

        $updated = DB::table('followers')
            ->where('follower_id', $follower_id)
            ->where('following_id', $following_id)
            ->where('status', 'pending')
            ->update(['status' => 'approved', 'updated_at' => now()]);

        if ($updated) {
            return response()->json(['message' => 'Solicitud de seguimiento aprobada']);
        } else {
            return response()->json(['message' => 'No se encontró la solicitud de seguimiento'], 404);
        }
    }


    /**
     * @OA\Delete(
     *     path="/api/follows/reject/{follower_id}",
     *     summary="Rebutja una sol·licitud de seguiment pendent",
     *     description="Elimina la relació de seguiment amb estat 'pending' d'un usuari que vol seguir l'usuari autenticat.",
     *     operationId="rejectFollowRequest",
     *     tags={"Follows"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="follower_id",
     *         in="path",
     *         description="ID de l'usuari que ha enviat la sol·licitud de seguiment",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Sol·licitud de seguiment rebutjada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Solicitud de seguimiento rechazada")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No s'ha trobat la sol·licitud de seguiment",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No se encontró la solicitud de seguimiento")
     *         )
     *     )
     * )
     */
    public function rejectFollowRequest($follower_id)
    {
        $following_id = Auth::id();

        $deleted = DB::table('followers')
            ->where('follower_id', $follower_id)
            ->where('following_id', $following_id)
            ->where('status', 'pending')
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Solicitud de seguimiento rechazada']);
        } else {
            return response()->json(['message' => 'No se encontró la solicitud de seguimiento'], 404);
        }
    }


    /**
     * @OA\Post(
     *     path="/block-user",
     *     summary="Bloqueja un usuari especificat per l'usuari autenticat",
     *     description="Valida que el `user_id` existeixi i que no sigui el mateix usuari que fa la crida.
     *                  Comprova si l'usuari ja està bloquejat.
     *                  Elimina les relacions de seguidors entre ambdós usuaris (en ambdós sentits).
     *                  Inserta el registre de bloqueig a la taula `blocked_users`.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     * @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="integer", description="ID de l'usuari a bloquejar")
     *         )
     *     ),
     * @OA\Response(
     *         response=200,
     *         description="Acció realitzada amb èxit o advertència",
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="Usuario bloqueado exitosamente")
     *                 ),
     *                 @OA\Schema(
     *                     @OA\Property(property="status", type="string", example="warning"),
     *                     @OA\Property(property="message", type="string", example="Este usuario ya está bloqueado")
     *                 )
     *             }
     *         )
     *     ),
     * @OA\Response(
     *         response=400,
     *         description="Error per intentar bloquejar-se a un mateix usuari",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No puedes bloquearte a ti mismo")
     *         )
     *     ),
     * @OA\Response(
     *         response=422,
     *         description="Error de validació de dades",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="user_id",
     *                     type="array",
     *                     @OA\Items(type="string", example="El campo user_id es obligatorio y debe existir en la tabla users.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function blockUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user_id = Auth::id();
        $blocked_id = $request->user_id;

        // Verificar que no sea el mismo usuario
        if ($user_id == $blocked_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'No puedes bloquearte a ti mismo'
            ]);
        }

        // Verificar si ya está bloqueado
        $alreadyBlocked = DB::table('blocked_users')
            ->where('user_id', $user_id)
            ->where('blocked_user_id', $blocked_id)
            ->exists();

        if ($alreadyBlocked) {
            return response()->json([
                'status' => 'warning',
                'message' => 'Este usuario ya está bloqueado'
            ]);
        }

        // Eliminar relaciones de seguidores en ambos sentidos
        DB::table('followers')
            ->where(function ($query) use ($user_id, $blocked_id) {
                $query->where('follower_id', $user_id)
                    ->where('following_id', $blocked_id);
            })->orWhere(function ($query) use ($user_id, $blocked_id) {
                $query->where('follower_id', $blocked_id)
                    ->where('following_id', $user_id);
            })->delete();

        // Crear bloqueo
        DB::table('blocked_users')->insert([
            'user_id' => $user_id,
            'blocked_user_id' => $blocked_id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario bloqueado exitosamente'
        ]);
    }


    /**
     * @OA\Post(
     *     path="/unblock-user/{user_id}",
     *     summary="Desbloquea un usuario previamente bloqueado por el usuario autenticado",
     *     description="Elimina el registro de bloqueo correspondiente de la tabla `blocked_users`.
     *                  Si se elimina correctamente, devuelve un mensaje de éxito.
     *                  Si no existía el bloqueo, devuelve un mensaje de advertencia.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         description="ID del usuario que se desea desbloquear",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Respuesta exitosa o advertencia",
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="Usuario desbloqueado exitosamente")
     *                 ),
     *                 @OA\Schema(
     *                     @OA\Property(property="status", type="string", example="warning"),
     *                     @OA\Property(property="message", type="string", example="Este usuario no está bloqueado")
     *                 )
     *             }
     *         )
     *     )
     * )
     */
    public function unblockUser($user_id)
    {
        $deleted = DB::table('blocked_users')
            ->where('user_id', Auth::id())
            ->where('blocked_user_id', $user_id)
            ->delete();

        if ($deleted) {
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario desbloqueado exitosamente'
            ]);
        } else {
            return response()->json([
                'status' => 'warning',
                'message' => 'Este usuario no está bloqueado'
            ]);
        }
    }


    /**
     * @OA\Get(
     *     path="/following",
     *     summary="Obtiene la lista de usuarios que el usuario autenticado está siguiendo",
     *     description="Recupera la relación `following` del usuario autenticado y la devuelve en formato JSON.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Respuesta exitosa con la lista de usuarios seguidos",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 example="success"
     *             ),
     *             @OA\Property(
     *                 property="following",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Usuario Ejemplo")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getFollowing()
    {
        $user = Auth::user();
        $following = $user->following;

        return response()->json([
            'status' => 'success',
            'following' => $following
        ]);
    }


    /**
     * @OA\Get(
     *     path="/follow/check/{user_id}",
     *     summary="Verificar si el usuario autenticado sigue a otro usuario",
     *     description="Este endpoint permite verificar si el usuario autenticado ya está siguiendo a un usuario específico mediante su ID.",
     *    security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         description="El ID del usuario a verificar si es seguido",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Respuesta exitosa indicando si sigue o no al usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="follow", type="boolean", example=true)
     *         )
     *     )
     * )
     */
    public function followCheck($user_id)
    {
        $user = Auth::user();
        $follow = $user->followCheck($user_id);

        return response()->json([
            'status' => 'success',
            'follow' => $follow
        ]);
    }


    /**
     * @OA\Get(
     *     path="/followers",
     *     summary="Obtener los seguidores del usuario autenticado",
     *     description="Devuelve la lista de usuarios que siguen al usuario autenticado. Incluye información adicional sobre si el usuario autenticado sigue a cada seguidor (`follow`) y si ese seguidor también sigue al usuario autenticado (`isFollowed`).",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de seguidores con estado de seguimiento mutuo",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="followers",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=3),
     *                     @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                     @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-01T12:34:56.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-11-01T15:45:30.000000Z"),
     *                     @OA\Property(property="follow", type="boolean", example=true),
     *                     @OA\Property(property="isFollowed", type="boolean", example=false)
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getMyFollowers()
    {
        $user = Auth::user();
        $followers = $user->followers;

        foreach ($followers as $follower) {
            $follower->follow = $user->followCheck($follower->id);
            $follower->isFollowed = $follower->followCheck($user->id);
        }

        return response()->json([
            'status' => 'success',
            'followers' => $followers
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/followers/list",
     *     summary="Obtener seguidores de un usuario",
     *     description="Valida que se proporcione el `user_id`. Opcionalmente puede recibir `me_id` para comprobar seguimiento mutuo.",
     *     operationId="getUserFollowers",
     *     tags={"Followers"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="integer", example=1, description="ID del usuario cuyos seguidores se quieren obtener"),
     *             @OA\Property(property="me_id", type="integer", example=2, description="ID del usuario autenticado (opcional)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Seguidores recuperados correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="followers",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Follower Name"),
     *                     @OA\Property(property="follow", type="boolean", example=true),
     *                     @OA\Property(property="isFollowed", type="boolean", example=false)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Faltan campos requeridos o inválidos",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Errors validation: The user id field is required.")
     *         )
     *     )
     * )
     */
    public function getFollowersUser(Request $request)
    {
        $rules = [
            'user_id' => 'required',
        ];

        $messages = [
            'user_id.required' => 'El id del usuario es requerido',
        ];

        $validate = Validator::make($request->all(), $rules, $messages);

        if ($validate->fails()) {
            return response([
                'status' => 'error',
                'message' => 'Errors validation:' . $validate->errors()
            ]);
        }

        $me = $request->me_id ? User::find($request->me_id) : null;

        $user = User::findOrFail($request->user_id);

        $followers = $user->followers;

        foreach ($followers as $follower) {
            $follower->follow = $user->followCheck($follower->id);
            $follower->isFollowed = $me
                ? (bool)$me->followCheck($follower->id)
                : false;
        }

        return response()->json([
            'status' => 'success',
            'followers' => $followers
        ]);
    }


    /**
     * @OA\Get(
     *     path="/follow-requests/pending",
     *     summary="Obtener solicitudes de seguimiento pendientes",
     *     description="Devuelve una lista de usuarios que han enviado solicitudes de seguimiento al usuario autenticado que aún no han sido aceptadas ni rechazadas.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de solicitudes pendientes",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="pending_requests",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=7),
     *                     @OA\Property(property="name", type="string", example="Carlos López"),
     *                     @OA\Property(property="email", type="string", format="email", example="carlos@example.com"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-11-01T08:15:00.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-11-05T10:20:00.000000Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getPendingFollowRequests()
    {
        $user = Auth::user();
        $pendingRequests = $user->pendingFollowRequests;

        return response()->json(['pending_requests' => $pendingRequests]);
    }


    /**
     * @OA\Get(
     *     path="/follow-requests/pending-sent",
     *     summary="Obtener solicitudes de seguimiento enviadas pendientes",
     *     description="Devuelve una lista de solicitudes de seguimiento que el usuario autenticado ha enviado y que aún no han sido aceptadas ni rechazadas.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de solicitudes enviadas pendientes",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="pending_sent",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=12),
     *                     @OA\Property(property="name", type="string", example="Lucía Fernández"),
     *                     @OA\Property(property="email", type="string", format="email", example="lucia@example.com"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-11-04T10:15:00.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-11-07T13:20:00.000000Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getPendingSentRequests()
    {
        $user = Auth::user();
        $pendingSent = $user->pendingSentRequests;

        return response()->json(['pending_sent' => $pendingSent]);
    }


    /**
     * @OA\Get(
     *     path="/blocked-users",
     *     summary="Obtener usuarios bloqueados",
     *     description="Devuelve una lista de usuarios que han sido bloqueados por el usuario autenticado.",
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios bloqueados",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="blocked_users",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=18),
     *                     @OA\Property(property="name", type="string", example="Pedro Ramírez"),
     *                     @OA\Property(property="email", type="string", format="email", example="pedro@example.com"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-15T11:00:00.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-11-05T12:30:00.000000Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getBlockedUsers()
    {
        $user = Auth::user();
        $blockedUsers = $user->blockedUsers;

        return response()->json(['blocked_users' => $blockedUsers]);
    }
}
