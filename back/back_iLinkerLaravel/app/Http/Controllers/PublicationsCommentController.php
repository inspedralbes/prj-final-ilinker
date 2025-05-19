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
                'data' => $comments
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
            $this->deleteReplies($comment);
            $comment->delete();

            // Actualizar contador de comentarios
            $publication = Publication::find($publicationId);
            if ($publication && $publication->comments_count > 0) {
                $publication->decrement('comments_count');
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
        foreach ($comment->replies as $reply) {
            $this->deleteReplies($reply);
            $reply->delete();
        }
    }
}
