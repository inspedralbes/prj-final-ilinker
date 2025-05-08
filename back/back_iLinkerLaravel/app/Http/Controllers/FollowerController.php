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
     * Seguir a un usuario
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
                    'status'=>'warning',
                    'message' => 'Ya sigues a este usuario'
                ]);
            } else {
                return response()->json([
                    'status'=>'warning',
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
     * Dejar de seguir a un usuario
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
     * Aprobar solicitud de seguimiento
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
     * Rechazar solicitud de seguimiento
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
     * Bloquear usuario
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
     * Desbloquear usuario
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
     * Listar usuarios que sigo
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
     * Listar usuarios que sigo
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
     * Listar usuarios que me siguen
     */
    public function getMyFollowers()
    {
        $user = Auth::user();
        $followers = $user->followers;

        foreach ($followers as $follower){
            $follower->follow = $user->followCheck($follower->id);
            $follower->isFollowed = $follower->followCheck($user->id);
        }

        return response()->json([
            'status' => 'success',
            'followers' => $followers
        ]);
    }

    /**
     * Listar usuarios que me siguen
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
                'message' => 'Errors validation:'. $validate->errors()
            ]);
        }

        $me   = $request->me_id ? User::find($request->me_id) : null;

        $user = User::findOrFail($request->user_id);

        $followers = $user->followers;

        foreach ($followers as $follower){
            $follower->follow = $user->followCheck($follower->id);
            $follower->isFollowed = $me
                ? (bool) $me->followCheck($follower->id)
                : false;
        }

        return response()->json([
            'status' => 'success',
            'followers' => $followers
        ]);
    }

    /**
     * Listar solicitudes de seguimiento pendientes
     */
    public function getPendingFollowRequests()
    {
        $user = Auth::user();
        $pendingRequests = $user->pendingFollowRequests;

        return response()->json(['pending_requests' => $pendingRequests]);
    }

    /**
     * Listar solicitudes enviadas pendientes
     */
    public function getPendingSentRequests()
    {
        $user = Auth::user();
        $pendingSent = $user->pendingSentRequests;

        return response()->json(['pending_sent' => $pendingSent]);
    }

    /**
     * Listar usuarios bloqueados
     */
    public function getBlockedUsers()
    {
        $user = Auth::user();
        $blockedUsers = $user->blockedUsers;

        return response()->json(['blocked_users' => $blockedUsers]);
    }
}
