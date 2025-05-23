<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{


    /**
     * @OA\Post(
     *     path="/api/publications/{post}/like-toggle",
     *     summary="Alternar 'me gusta' en una publicación",
     *     description="Este endpoint permite al usuario autenticado dar 'me gusta' o quitar el 'me gusta' de una publicación. Si el usuario ya dio like, lo quita; si no, lo agrega.",
     *     operationId="toggleLike",
     *     tags={"Likes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="post",
     *         in="path",
     *         description="El ID de la publicación a la que se desea dar o quitar 'me gusta'",
     *         required=true,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Estado del like",
     *         @OA\JsonContent(
     *             @OA\Property(property="liked", type="boolean", example=true)
     *         )
     *     )
     * )
     */
    public function toggle(Post $post)
    {
        $user = Auth::user();

        if ($post->isLikedBy($user)) {
            $post->likes()->detach($user->id);
            return response()->json(['liked' => false]);
        } else {
            $post->likes()->attach($user->id);
            return response()->json(['liked' => true]);
        }
    }
}

