<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/publications/{post}/comments",
     *     summary="Crear un comentario en una publicación",
     *     description="Este endpoint permite agregar un nuevo comentario a una publicación existente.",
     *     operationId="createComment",
     *     tags={"Comentarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="post",
     *         in="path",
     *         description="El ID de la publicación en la que se quiere comentar",
     *         required=true,
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", example="¡Excelente publicación!")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Comentario creado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=12),
     *             @OA\Property(property="post_id", type="integer", example=3),
     *             @OA\Property(property="user_id", type="integer", example=5),
     *             @OA\Property(property="content", type="string", example="¡Excelente publicación!"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T15:45:00Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T15:45:00Z")
     *         )
     *     )
     * )
     */
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        return $post->comments()->create([
            'content' => $request->content,
            'user_id' => Auth::id()
        ]);
    }
}

