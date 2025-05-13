<?php

namespace App\Http\Controllers;

use App\Models\SharedPublication;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SharedPublicationController extends Controller
{
    /**
     * Compartir una publicación
     */
    public function share(Request $request)
    {
        try {
            $request->validate([
                'original_publication_id' => 'required|exists:publications,id',
                'content' => 'nullable|string|max:1000'
            ]);

            $userId = Auth::id();
            $originalPublication = Publication::with(['user', 'media'])->findOrFail($request->original_publication_id);

            $sharedPublication = SharedPublication::create([
                'user_id' => $userId,
                'original_publication_id' => $request->original_publication_id,
                'content' => $request->content
            ]);

            // Cargar la relación con la publicación original y su usuario
            $sharedPublication->load(['originalPublication.user', 'originalPublication.media']);

            return response()->json([
                'status' => 'success',
                'message' => 'Publicación compartida exitosamente',
                'data' => $sharedPublication
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al compartir la publicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener las publicaciones compartidas por un usuario
     */
    public function getUserSharedPublications($userId)
    {
        try {
            $sharedPublications = SharedPublication::with([
                'user:id,name',
                'originalPublication.user:id,name',
                'originalPublication.media'
            ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => $sharedPublications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener las publicaciones compartidas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una publicación compartida
     */
    public function delete($id)
    {
        try {
            $sharedPublication = SharedPublication::findOrFail($id);

            // Verificar que el usuario sea el propietario de la publicación compartida
            if ($sharedPublication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No tienes permiso para eliminar esta publicación compartida'
                ], 403);
            }

            $sharedPublication->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Publicación compartida eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar la publicación compartida',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 