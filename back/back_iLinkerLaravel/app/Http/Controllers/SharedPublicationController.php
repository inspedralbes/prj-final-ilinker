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
     * @OA\Post(
     *     path="/api/publications/share",
     *     summary="Compartir una publicación",
     *     description="Este endpoint permite a un usuario autenticado compartir una publicación existente con contenido opcional adicional.",
     *     operationId="sharePublication",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"original_publication_id"},
     *             @OA\Property(property="original_publication_id", type="integer", example=15),
     *             @OA\Property(property="content", type="string", maxLength=1000, example="Miren esta publicación, está genial.")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Publicación compartida exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Publicación compartida exitosamente"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=12),
     *                 @OA\Property(property="content", type="string", example="Miren esta publicación, está genial."),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-01T12:34:56.000000Z"),
     *                 @OA\Property(
     *                     property="shared_by",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=5),
     *                     @OA\Property(property="name", type="string", example="Carlos Ruiz")
     *                 ),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=8),
     *                     @OA\Property(property="name", type="string", example="Ana Torres")
     *                 ),
     *                 @OA\Property(
     *                     property="media",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=3),
     *                         @OA\Property(property="file_path", type="string", example="https://tuapp.com/storage/media/example.jpg"),
     *                         @OA\Property(property="media_type", type="string", example="image"),
     *                         @OA\Property(property="display_order", type="integer", example=1)
     *                     )
     *                 ),
     *                 @OA\Property(property="has_media", type="boolean", example=true),
     *                 @OA\Property(property="location", type="string", example="Madrid, España"),
     *                 @OA\Property(property="likes_count", type="integer", example=20),
     *                 @OA\Property(property="comments_count", type="integer", example=5),
     *                 @OA\Property(property="liked", type="boolean", example=false),
     *                 @OA\Property(property="saved", type="boolean", example=false),
     *                 @OA\Property(property="shared", type="boolean", example=true),
     *                 @OA\Property(property="original_publication_id", type="integer", example=15)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="original_publication_id",
     *                     type="array",
     *                     @OA\Items(type="string", example="The original publication id field is required.")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al compartir la publicación"),
     *             @OA\Property(property="error", type="string", example="Mensaje del error interno")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/publications/shared/{userId}",
     *     summary="Obtener publicaciones compartidas por un usuario",
     *     description="Este endpoint devuelve las publicaciones que han sido compartidas por un usuario específico. Cada entrada incluye información de la publicación original, el usuario que la compartió y los medios relacionados.",
     *     operationId="getSharedPublicationsByUser",
     *     tags={"Publicaciones"},
     *
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="El ID del usuario del cual se desean obtener las publicaciones compartidas",
     *         @OA\Schema(type="integer", example=15)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de publicaciones compartidas obtenida correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=3),
     *                         @OA\Property(property="content", type="string", example="Comentario del usuario que comparte"),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:34:56Z"),
     *                         @OA\Property(
     *                             property="shared_by",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=15),
     *                             @OA\Property(property="name", type="string", example="Carlos López")
     *                         ),
     *                         @OA\Property(
     *                             property="user",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=8),
     *                             @OA\Property(property="name", type="string", example="Laura Sánchez")
     *                         ),
     *                         @OA\Property(
     *                             property="media",
     *                             type="array",
     *                             @OA\Items(
     *                                 @OA\Property(property="id", type="integer", example=21),
     *                                 @OA\Property(property="file_path", type="string", example="https://example.com/storage/media/imagen.jpg"),
     *                                 @OA\Property(property="media_type", type="string", example="image"),
     *                                 @OA\Property(property="display_order", type="integer", example=1)
     *                             )
     *                         ),
     *                         @OA\Property(property="has_media", type="boolean", example=true),
     *                         @OA\Property(property="location", type="string", example="Barcelona"),
     *                         @OA\Property(property="likes_count", type="integer", example=12),
     *                         @OA\Property(property="comments_count", type="integer", example=5)
     *                     )
     *                 ),
     *                 @OA\Property(property="last_page", type="integer", example=1),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=1)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener las publicaciones compartidas",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al obtener las publicaciones compartidas"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/publications/shared/{id}",
     *     summary="Eliminar una publicación compartida",
     *     description="Este endpoint permite a un usuario autenticado eliminar una publicación que previamente haya compartido.",
     *     operationId="deleteSharedPublication",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="El ID de la publicación compartida a eliminar",
     *         @OA\Schema(type="integer", example=8)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Publicación compartida eliminada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Publicación compartida eliminada exitosamente")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=403,
     *         description="No autorizado para eliminar la publicación compartida",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No tienes permiso para eliminar esta publicación compartida")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Publicación compartida no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No se pudo encontrar la publicación compartida")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al eliminar la publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al eliminar la publicación compartida"),
     *             @OA\Property(property="error", type="string", example="Mensaje del error interno")
     *         )
     *     )
     * )
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
