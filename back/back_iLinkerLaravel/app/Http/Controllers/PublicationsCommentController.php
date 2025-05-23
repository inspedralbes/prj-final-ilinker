<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PublicationsCommentController extends Controller
{
    // Listar comentarios de una publicación

    /**
     * @OA\Get(
     *     path="/api/publications/{publicationId}/comments",
     *     summary="Obtiene los comentarios principales de una publicación",
     *     description="Obtiene los comentarios principales (sin padre) y sus respuestas anidadas de una publicación específica, si los comentarios están habilitados. Incluye información de usuario con roles (estudiante, empresa, institución).",
     *     operationId="getPublicationComments",
     *     tags={"Comments"},
     *     @OA\Parameter(
     *         name="publicationId",
     *         in="path",
     *         required=true,
     *         description="ID de la publicación",
     *         @OA\Schema(type="integer", example=123)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comentarios obtenidos correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="publication_id", type="integer", example=123),
     *                     @OA\Property(property="user_id", type="integer", example=10),
     *                     @OA\Property(property="content", type="string", example="Comentario principal"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:00:00Z"),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=10),
     *                         @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                         @OA\Property(property="rol", type="string", example="student"),
     *                         @OA\Property(
     *                             property="student",
     *                             type="object",
     *                             nullable=true,
     *                             @OA\Property(property="user_id", type="integer", example=10),
     *                             @OA\Property(property="photo_pic", type="string", format="url", example="https://example.com/photos/juan.jpg"),
     *                             @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                             @OA\Property(property="uuid", type="string", example="uuid-student-123")
     *                         ),
     *                         @OA\Property(property="company", type="object", nullable=true),
     *                         @OA\Property(property="institutions", type="object", nullable=true)
     *                     ),
     *                     @OA\Property(
     *                         property="replies",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=2),
     *                             @OA\Property(property="publication_id", type="integer", example=123),
     *                             @OA\Property(property="parent_comment_id", type="integer", example=1),
     *                             @OA\Property(property="user_id", type="integer", example=11),
     *                             @OA\Property(property="content", type="string", example="Respuesta al comentario"),
     *                             @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:30:00Z"),
     *                             @OA\Property(
     *                                 property="user",
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=11),
     *                                 @OA\Property(property="name", type="string", example="Empresa X"),
     *                                 @OA\Property(property="rol", type="string", example="company"),
     *                                 @OA\Property(property="student", type="object", nullable=true),
     *                                 @OA\Property(
     *                                     property="company",
     *                                     type="object",
     *                                     nullable=true,
     *                                     @OA\Property(property="user_id", type="integer", example=11),
     *                                     @OA\Property(property="logo", type="string", format="url", example="https://example.com/logos/companyx.png"),
     *                                     @OA\Property(property="name", type="string", example="Empresa X"),
     *                                     @OA\Property(property="slug", type="string", example="empresa-x")
     *                                 ),
     *                                 @OA\Property(property="institutions", type="object", nullable=true)
     *                             )
     *                         )
     *                     )
     *                 )
     *             ),
     *             @OA\Property(property="num_comment", type="integer", example=5)
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Comentarios deshabilitados para esta publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Comments are disabled for this publication")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Publicación no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Publication not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error retrieving comments"),
     *             @OA\Property(property="error", type="string", example="Detalle del error")
     *         )
     *     )
     * )
     */
    public function index($publicationId)
    {
        try {
            $publication = Publication::findOrFail($publicationId);

            // Verificar si los comentarios están habilitados
            if (!$publication->comments_enabled) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Comments are disabled for this publication'
                ], 403);
            }

            $comments = PublicationComment::where('publication_id', $publicationId)
                ->whereNull('parent_comment_id')
                ->with(['user' => function ($query) {
                    $query->select('id', 'name', 'rol')
                        ->with(['student:user_id,photo_pic,name', 'company:user_id,logo,name', 'institutions:user_id,logo,name']);
                }, 'replies' => function ($query) {
                    $query->with(['user' => function ($q) {
                        $q->select('id', 'name', 'rol')
                            ->with(['student:user_id,photo_pic,name,uuid', 'company:user_id,logo,name,slug', 'institutions:user_id,logo,name,slug']);
                    }]);
                }])
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $comments,
                'num_comment' => $publication->comments_count,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching comments: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving comments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Crear un comentario en una publicación


    /**
     * @OA\Post(
     *     path="/api/publications/{publicationId}/comments",
     *     summary="Crear comentario en una publicación",
     *     description="Este endpoint permite al usuario autenticado añadir un comentario o una respuesta a una publicación existente.",
     *     operationId="createCommentPubli",
     *     tags={"Comentarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="publicationId",
     *         in="path",
     *         required=true,
     *         description="El ID de la publicación a la que se desea comentar",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", example="¡Gran publicación!"),
     *             @OA\Property(property="parent_comment_id", type="integer", nullable=true, example=12)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Comentario creado con éxito",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Comment created successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=25),
     *                 @OA\Property(property="publication_id", type="integer", example=7),
     *                 @OA\Property(property="user_id", type="integer", example=3),
     *                 @OA\Property(property="content", type="string", example="¡Gran publicación!"),
     *                 @OA\Property(property="parent_comment_id", type="integer", nullable=true, example=null),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-21T12:45:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-10-21T12:45:00Z"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=3),
     *                     @OA\Property(property="name", type="string", example="Ana Martínez"),
     *                     @OA\Property(property="rol", type="string", example="student"),
     *                     @OA\Property(
     *                         property="student",
     *                         type="object",
     *                         @OA\Property(property="user_id", type="integer", example=3),
     *                         @OA\Property(property="photo_pic", type="string", format="url", example="https://example.com/photos/ana.jpg"),
     *                         @OA\Property(property="name", type="string", example="Ana Martínez")
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="replies",
     *                     type="array",
     *                     @OA\Items(type="object")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Publicación no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Publication not found")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validación fallida",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="content",
     *                     type="array",
     *                     @OA\Items(type="string", example="The content field is required.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request, $publicationId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'parent_comment_id' => 'nullable|exists:publication_comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $publication = Publication::findOrFail($publicationId);
            $comment = PublicationComment::create([
                'publication_id' => $publication->id,
                'user_id' => Auth::id(),
                'content' => $request->content,
                'parent_comment_id' => $request->input('parent_comment_id'),
            ]);
            // Actualizar contador de comentarios
            $publication->increment('comments_count');

            $comment->load([
                'user' => function ($query) {
                    $query->select('id', 'name', 'rol')
                        ->with(['student:user_id,photo_pic,name', 'company:user_id,logo,name', 'institutions:name,user_id,logo,name']);
                },
                'replies' => function ($query) {
                    $query->with(['user' => function ($q) {
                        $q->select('id', 'name', 'rol')
                            ->with(['student:user_id,photo_pic,name', 'company:user_id,logo,name', 'institutions:user_id,logo,name']);
                    }]);
                }
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Comment created successfully',
                'data' => $comment
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        }
    }

    // Eliminar un comentario (y sus respuestas si existen)

    /**
     * @OA\Delete(
     *     path="/api/publications/{publicationId}/comments/{commentId}",
     *     summary="Eliminar un comentario de una publicación",
     *     description="Este endpoint permite al usuario autenticado eliminar uno de sus propios comentarios de una publicación, incluyendo sus respuestas anidadas si las hubiera.",
     *     operationId="deleteComment",
     *     tags={"Comentarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="publicationId",
     *         in="path",
     *         required=true,
     *         description="El ID de la publicación a la que pertenece el comentario",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *
     *     @OA\Parameter(
     *         name="commentId",
     *         in="path",
     *         required=true,
     *         description="El ID del comentario que se desea eliminar",
     *         @OA\Schema(type="integer", example=21)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Comentario eliminado con éxito",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Comment deleted successfully")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=403,
     *         description="No autorizado para eliminar el comentario",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthorized to delete this comment")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Comentario o publicación no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Comment or publication not found")
     *         )
     *     )
     * )
     */
    public function destroy($publicationId, $commentId)
    {
        try {
            $comment = PublicationComment::where('publication_id', $publicationId)
                ->where('id', $commentId)
                ->firstOrFail();

            if ($comment->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to delete this comment'
                ], 403);
            }

            // Eliminar recursivamente las respuestas
            $repliesDeleted = $this->deleteReplies($comment);
            $comment->delete();
            $totalDeleted = $repliesDeleted + 1; // el comentario original + sus respuestas


            // Actualizar contador de comentarios
            $publication = Publication::find($publicationId);
            //Log::info("Publication deleted successfully", ["pubid" => $publicationId]);

            if ($publication && $publication->comments_count >= $totalDeleted) {
                $publication->decrement('comments_count', $totalDeleted);
                //Log::info("count", ["deleted" => $totalDeleted]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Comment deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Comment or publication not found'
            ], 404);
        }
    }

    // Función recursiva para eliminar respuestas anidadas
    private function deleteReplies(PublicationComment $comment)
    {
        $deletedCount = 0;

        foreach ($comment->replies as $reply) {
            $deletedCount += $this->deleteReplies($reply);
            $reply->delete();
            $deletedCount++;
        }
        return $deletedCount;
    }
}
