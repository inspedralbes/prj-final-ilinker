<?php

namespace App\Http\Controllers;

use App\Models\SharedPublication;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\PublicationFileService;

class SharedPublicationController extends Controller
{
    protected $fileService;

    public function __construct(PublicationFileService $fileService)
    {
        $this->fileService = $fileService;
    }

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
            $sharedPublication->load(['user', 'originalPublication.user', 'originalPublication.media']);

            // Transformar las URLs de los medios
            $media = $sharedPublication->originalPublication->media->map(function ($media) {
                return [
                    'id' => $media->id,
                    'file_path' => $this->fileService->getFileUrl($media->file_path),
                    'media_type' => $media->media_type,
                    'display_order' => $media->display_order
                ];
            });

            // Transformar la respuesta para incluir la información del usuario que comparte
            $response = [
                'id' => $sharedPublication->id,
                'content' => $sharedPublication->content,
                'created_at' => $sharedPublication->created_at,
                'shared_by' => [
                    'id' => $sharedPublication->user->id,
                    'name' => $sharedPublication->user->name,
                ],
                'user' => [
                    'id' => $sharedPublication->originalPublication->user->id,
                    'name' => $sharedPublication->originalPublication->user->name,
                ],
                'content' => $sharedPublication->originalPublication->content,
                'media' => $media,
                'has_media' => $sharedPublication->originalPublication->has_media,
                'location' => $sharedPublication->originalPublication->location,
                'likes_count' => $sharedPublication->originalPublication->likes_count,
                'comments_count' => $sharedPublication->originalPublication->comments_count,
                'liked' => false,
                'saved' => false,
                'shared' => true,
                'original_publication_id' => $sharedPublication->original_publication_id
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'Publicación compartida exitosamente',
                'data' => $response
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

            // Transformar la respuesta para incluir la información del usuario que comparte
            $sharedPublications->getCollection()->transform(function ($sharedPublication) {
                return [
                    'id' => $sharedPublication->id,
                    'content' => $sharedPublication->content,
                    'created_at' => $sharedPublication->created_at,
                    'shared_by' => [
                        'id' => $sharedPublication->user->id,
                        'name' => $sharedPublication->user->name,
                    ],
                    'user' => [
                        'id' => $sharedPublication->originalPublication->user->id,
                        'name' => $sharedPublication->originalPublication->user->name,
                    ],
                    'content' => $sharedPublication->originalPublication->content,
                    'media' => $sharedPublication->originalPublication->media,
                    'has_media' => $sharedPublication->originalPublication->has_media,
                    'location' => $sharedPublication->originalPublication->location,
                    'likes_count' => $sharedPublication->originalPublication->likes_count,
                    'comments_count' => $sharedPublication->originalPublication->comments_count,
                ];
            });

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