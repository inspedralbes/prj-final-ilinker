<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationMedia;
use App\Models\PublicationLike;
use App\Models\PublicationComment;
use App\Models\PublicationSaved;
use App\Models\SharedPublication;
use App\Services\PublicationFileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class PublicationsController extends Controller
{
    protected $fileService;

    public function __construct(PublicationFileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * @OA\Get(
     *     path="/api/publications",
     *     summary="Obtiene todas las publicaciones y compartidas del usuario autenticado",
     *     description="Este endpoint recupera las publicaciones propias y compartidas del usuario autenticado, incluyendo sus relaciones.",
     *     operationId="getUserPublications33",
     *     tags={"Publications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Publicaciones obtenidas correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=123),
     *                         @OA\Property(property="content", type="string", example="Texto de la publicación"),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:34:56Z"),
     *                         @OA\Property(
     *                             property="user",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="name", type="string", example="Usuario Ejemplo")
     *                         ),
     *                         @OA\Property(
     *                             property="shared_by",
     *                             type="object",
     *                             nullable=true,
     *                             @OA\Property(property="id", type="integer", example=2),
     *                             @OA\Property(property="name", type="string", example="Otro Usuario")
     *                         ),
     *                         @OA\Property(
     *                             property="media",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=10),
     *                                 @OA\Property(property="file_path", type="string", format="url", example="https://example.com/media/imagen1.jpg"),
     *                                 @OA\Property(property="media_type", type="string", example="image"),
     *                                 @OA\Property(property="display_order", type="integer", example=1)
     *                             )
     *                         ),
     *                         @OA\Property(property="liked", type="boolean", example=true),
     *                         @OA\Property(property="saved", type="boolean", example=false),
     *                         @OA\Property(property="shared", type="boolean", example=false),
     *                         @OA\Property(property="likes_count", type="integer", example=5),
     *                         @OA\Property(property="comments_count", type="integer", example=2),
     *                         @OA\Property(property="original_publication_id", type="integer", example=789, nullable=true)
     *                     )
     *                 ),
     *                 @OA\Property(property="total", type="integer", example=2),
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="per_page", type="integer", example=2),
     *                 @OA\Property(property="last_page", type="integer", example=1)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error retrieving publications"),
     *             @OA\Property(property="error", type="string", example="Detalle del error")
     *         )
     *     )
     * )
     */

    public function index()
    {
        try {
            $userId = Auth::id();

            // Obtener publicaciones normales
            $publications = Publication::with([
                'user:id,name',
                'media',
                'comments.user:id,name',
                'likes',
                'savedPublications',
                'sharedPublications.user:id,name'
            ])
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->get();

            // Obtener publicaciones compartidas
            $sharedPublications = SharedPublication::with([
                'user:id,name',
                'originalPublication.user:id,name',
                'originalPublication.media',
                'originalPublication.likes',
                'originalPublication.comments.user:id,name',
                'originalPublication.savedPublications'
            ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($sharedPub) use ($userId) {
                    // Transformar las URLs de los medios
                    $media = $sharedPub->originalPublication->media->map(function ($media) {
                        return [
                            'id' => $media->id,
                            'file_path' => $this->fileService->getFileUrl($media->file_path),
                            'media_type' => $media->media_type,
                            'display_order' => $media->display_order
                        ];
                    });

                    return [
                        'id' => $sharedPub->id,
                        'content' => $sharedPub->content,
                        'created_at' => $sharedPub->created_at,
                        'shared_by' => [
                            'id' => $sharedPub->user->id,
                            'name' => $sharedPub->user->name,
                        ],
                        'user' => [
                            'id' => $sharedPub->originalPublication->user->id,
                            'name' => $sharedPub->originalPublication->user->name,
                        ],
                        'content' => $sharedPub->originalPublication->content,
                        'media' => $media,
                        'has_media' => $sharedPub->originalPublication->has_media,
                        'location' => $sharedPub->originalPublication->location,
                        'likes_count' => $sharedPub->originalPublication->likes_count,
                        'comments_count' => $sharedPub->originalPublication->comments_count,
                        'liked' => $sharedPub->originalPublication->likes->contains('user_id', $userId),
                        'saved' => $sharedPub->originalPublication->savedPublications->contains('user_id', $userId),
                        'shared' => true,
                        'original_publication_id' => $sharedPub->original_publication_id
                    ];
                });

            // Combinar y ordenar todas las publicaciones por fecha
            $allPublications = $publications->map(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            })->concat($sharedPublications)
                ->sortByDesc('created_at')
                ->values();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'data' => $allPublications,
                    'total' => $allPublications->count(),
                    'current_page' => 1,
                    'per_page' => $allPublications->count(),
                    'last_page' => 1
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving publications',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Post(
     *     path="/publications",
     *     summary="Crear una nueva publicación",
     *     description="Permite al usuario autenticado crear una publicación de texto, con ubicación opcional, estado y archivos multimedia.",
     *     operationId="createPublication",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(
     *                     property="content",
     *                     type="string",
     *                     description="Contenido textual de la publicación. Requerido si no se sube media.",
     *                     example="Hoy fue un gran día en la playa."
     *                 ),
     *                 @OA\Property(
     *                     property="location",
     *                     type="string",
     *                     description="Ubicación relacionada con la publicación.",
     *                     example="Barcelona, España"
     *                 ),
     *                 @OA\Property(
     *                     property="comments_enabled",
     *                     type="boolean",
     *                     description="Indica si los comentarios están habilitados.",
     *                     example=true,
     *                     default=true
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="string",
     *                     description="Estado de la publicación. Valores permitidos: published, draft, archived.",
     *                     example="published",
     *                     default="published",
     *                     enum={"published", "draft", "archived"}
     *                 ),
     *                 @OA\Property(
     *                     property="media",
     *                     type="array",
     *                     description="Archivos multimedia adjuntos (imágenes o videos). Máximo 50MB por archivo.",
     *                     @OA\Items(
     *                         type="string",
     *                         format="binary"
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Publicación creada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Publication created successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=10),
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="content", type="string", example="Hoy fue un gran día en la playa."),
     *                 @OA\Property(property="location", type="string", example="Barcelona, España"),
     *                 @OA\Property(property="comments_enabled", type="boolean", example=true),
     *                 @OA\Property(property="status", type="string", example="published"),
     *                 @OA\Property(property="has_media", type="boolean", example=true),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:00:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T12:00:00.000000Z"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Ana Ruiz")
     *                 ),
     *                 @OA\Property(
     *                     property="media",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=55),
     *                         @OA\Property(property="file_path", type="string", format="url", example="https://miapp.com/storage/media/abc123.jpg")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="media.0",
     *                     type="array",
     *                     @OA\Items(type="string", example="El archivo debe ser una imagen o video y no puede superar los 50MB")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error creating publication"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */

    public function store(Request $request)
    {
        try {
            // Increase the file size limits in the validation rules
            $validator = Validator::make($request->all(), [
                'content' => 'required_without:media|string|nullable',
                'location' => 'nullable|string',
                'comments_enabled' => 'boolean',
                'status' => 'in:published,draft,archived',
                'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:50000', // Increased to 50MB per file
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $publication = Publication::create([
                'user_id' => Auth::id(),
                'content' => $request->content,
                'location' => $request->location,
                'comments_enabled' => $request->input('comments_enabled', true),
                'status' => $request->input('status', 'published'),
                'has_media' => $request->hasFile('media')
            ]);

            if ($request->hasFile('media')) {
                $this->handleMediaUpload($request->file('media'), $publication);
            }

            $publication->load(['user:id,name', 'media']);

            // Process media URLs before returning
            if ($publication->media && count($publication->media) > 0) {
                foreach ($publication->media as $media) {
                    $media->file_path = $this->fileService->getFileUrl($media->file_path);
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Publication created successfully',
                'data' => $publication
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'Error creating publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/publications/detail",
     *     summary="Obtener una publicación con detalles",
     *     description="Obtiene una publicación específica junto con archivos multimedia, comentarios (y respuestas), likes y estado de guardado del usuario autenticado.",
     *     operationId="getPublicationDetail",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         description="ID del usuario que solicita la publicación",
     *         required=true,
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\Parameter(
     *         name="id_publication",
     *         in="query",
     *         description="ID de la publicación que se desea mostrar",
     *         required=true,
     *         @OA\Schema(type="integer", example=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publicación obtenida correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=15),
     *                     @OA\Property(property="content", type="string", example="Una caminata por la montaña"),
     *                     @OA\Property(property="location", type="string", example="Pirineos"),
     *                     @OA\Property(property="liked", type="boolean", example=true),
     *                     @OA\Property(property="saved", type="boolean", example=false),
     *                     @OA\Property(
     *                         property="media",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=102),
     *                             @OA\Property(property="file_path", type="string", format="url", example="https://miapp.com/storage/media/file123.jpg")
     *                         )
     *                     ),
     *                     @OA\Property(
     *                         property="likes",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(
     *                                 property="user",
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=3),
     *                                 @OA\Property(property="name", type="string", example="Ana")
     *                             )
     *                         )
     *                     ),
     *                     @OA\Property(
     *                         property="comments",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=22),
     *                             @OA\Property(property="content", type="string", example="¡Hermoso lugar!"),
     *                             @OA\Property(
     *                                 property="user",
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=5),
     *                                 @OA\Property(property="name", type="string", example="Carlos"),
     *                                 @OA\Property(property="rol", type="string", example="usuario")
     *                             ),
     *                             @OA\Property(
     *                                 property="replies",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Property(property="id", type="integer", example=23),
     *                                     @OA\Property(property="content", type="string", example="Totalmente de acuerdo"),
     *                                     @OA\Property(
     *                                         property="user",
     *                                         type="object",
     *                                         @OA\Property(property="id", type="integer", example=6),
     *                                         @OA\Property(property="name", type="string", example="Laura"),
     *                                         @OA\Property(property="rol", type="string", example="usuario")
     *                                     )
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
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
     *         description="Error interno al obtener la publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error retrieving publication"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */
    public function show(Request $request)
    {
        try {
            $userId = $request->id;
            $publications = Publication::with([
                'media',
                'comments.user',
                'comments.replies.user',
                'likes.user',
                'comments.user:id,name,rol',
                'likes',
                'savedPublications'
            ])
                ->where('id', $request->id_publication)
                ->orderBy('created_at', 'asc')
                ->get();

            // Add liked status and transform media URLs for each publication
            // Ahora puedes transformar la colección
            $publications->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);
                $publication->saved = $publication->savedPublications->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });


            return response()->json([
                'status' => 'success',
                'data' => $publications
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Put(
     *     path="/publications/{id}",
     *     summary="Actualizar una publicación existente",
     *     description="Permite al usuario autenticado actualizar su propia publicación. Se pueden modificar contenido, ubicación, estado, comentarios habilitados y agregar nuevos archivos multimedia.",
     *     operationId="updatePublication",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la publicación que se desea actualizar",
     *         required=true,
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="content", type="string", example="Actualizando mi día."),
     *             @OA\Property(property="location", type="string", example="Madrid, España"),
     *             @OA\Property(property="comments_enabled", type="boolean", example=true),
     *             @OA\Property(property="status", type="string", enum={"published","draft","archived"}, example="draft"),
     *             @OA\Property(
     *                 property="media",
     *                 type="array",
     *                 @OA\Items(type="string", format="binary", description="Archivos multimedia (jpeg, png, jpg, gif, mp4, mov, avi). Máx 50MB por archivo")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publicación actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Publication updated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=12),
     *                 @OA\Property(property="content", type="string", example="Actualizando mi día."),
     *                 @OA\Property(property="location", type="string", example="Madrid, España"),
     *                 @OA\Property(property="status", type="string", example="draft"),
     *                 @OA\Property(property="comments_enabled", type="boolean", example=true),
     *                 @OA\Property(property="has_media", type="boolean", example=true),
     *                 @OA\Property(
     *                     property="media",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=201),
     *                         @OA\Property(property="file_path", type="string", format="url", example="https://miapp.com/storage/media/nuevoarchivo.jpg")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No autorizado para actualizar esta publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthorized to update this publication")
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
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="content",
     *                     type="array",
     *                     @OA\Items(type="string", example="The content must be a string.")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al actualizar la publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error updating publication"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $publication = Publication::findOrFail($id);

            if ($publication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this publication'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'nullable|string',
                'location' => 'nullable|string',
                'comments_enabled' => 'boolean',
                'status' => 'in:published,draft,archived',
                'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:50000', // Increased to 50MB per file
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $publication->update([
                'content' => $request->input('content', $publication->content),
                'location' => $request->input('location', $publication->location),
                'comments_enabled' => $request->input('comments_enabled', $publication->comments_enabled),
                'status' => $request->input('status', $publication->status),
                'has_media' => $publication->has_media || $request->hasFile('media')
            ]);

            if ($request->hasFile('media')) {
                $this->handleMediaUpload($request->file('media'), $publication);
            }

            $publication->load(['user:id,name', 'media']);

            return response()->json([
                'status' => 'success',
                'message' => 'Publication updated successfully',
                'data' => $publication
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Delete(
     *     path="/publications/{id}",
     *     summary="Eliminar una publicación",
     *     description="Permite al usuario autenticado eliminar una de sus publicaciones junto con archivos multimedia, comentarios y 'me gusta' asociados.",
     *     operationId="deletePublication",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la publicación a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publicación eliminada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Publication deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No autorizado para eliminar esta publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthorized to delete this publication")
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
     *         description="Error interno al eliminar la publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error deleting publication"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        try {
            $publication = Publication::findOrFail($id);

            if ($publication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to delete this publication'
                ], 403);
            }

            // Delete associated media files
            foreach ($publication->media as $media) {
                $this->fileService->deleteFile($media->file_path);
                $media->delete();
            }

            // Delete associated likes and comments
            $publication->likes()->delete();
            $publication->comments()->delete();

            $publication->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Publication deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // mejorar el manejo de los archivos de media para que se puedan subir mas de un archivo de media
    private function handleMediaUpload($files, Publication $publication)
    {
        if (!is_array($files)) {
            $files = [$files];
        }

        $order = $publication->media()->max('display_order') ?? 0;

        foreach ($files as $file) {

            $order++;
            $mediaType = strpos($file->getMimeType(), 'video') !== false ? 'video' : 'image';

            // Store file using the file service
            $filePath = $this->fileService->storeFile($file, Auth::id());

            PublicationMedia::create([
                'publication_id' => $publication->id,
                'file_path' => $filePath,
                'media_type' => $mediaType,
                'display_order' => $order
            ]);

        }
    }

    public function removeMedia($publicationId, $mediaId)
    {
        try {
            $publication = Publication::findOrFail($publicationId);

            if ($publication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to modify this publication'
                ], 403);
            }

            $media = PublicationMedia::where('publication_id', $publicationId)
                ->where('id', $mediaId)
                ->firstOrFail();

            // Delete file from storage
            $this->fileService->deleteFile($media->file_path);
            $media->delete();

            if ($publication->media()->count() === 0) {
                $publication->update(['has_media' => false]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Media removed successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication or media not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error removing media',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/publications/user",
     *     summary="Obtener publicaciones de un usuario",
     *     description="Este endpoint devuelve todas las publicaciones realizadas por un usuario específico, incluyendo sus medios, comentarios, likes y estado de guardado.",
     *     operationId="getUserPublications",
     *     tags={"Publicaciones"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=true,
     *         description="El ID del usuario del cual se quieren obtener las publicaciones",
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de publicaciones obtenidas correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="content", type="string", example="Mi primera publicación"),
     *                     @OA\Property(property="liked", type="boolean", example=true),
     *                     @OA\Property(property="saved", type="boolean", example=false),
     *                     @OA\Property(
     *                         property="media",
     *                         type="array",
     *                         @OA\Items(
     *                             @OA\Property(property="file_path", type="string", example="https://example.com/storage/media/imagen.jpg")
     *                         )
     *                     ),
     *                     @OA\Property(property="likes", type="array", @OA\Items(type="object")),
     *                     @OA\Property(property="comments", type="array", @OA\Items(type="object"))
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al recuperar las publicaciones",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error retrieving your publications"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */
    public function myPublications(Request $request)
    {
        try {
            $userId = $request->id;
            $publications = Publication::with([
                'media',
                'comments.user',
                'comments.replies.user',
                'likes.user',
                'comments.user:id,name,rol',
                'likes',
                'savedPublications'
            ])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'asc')
                ->get();

            // Add liked status and transform media URLs for each publication
            // Ahora puedes transformar la colección
            $publications->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);
                $publication->saved = $publication->savedPublications->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });

            return response()->json([
                'status' => 'success',
                'data' => $publications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving your publications',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/publications/liked",
     *     summary="Obtener publicaciones que me han gustado",
     *     description="Devuelve una lista de publicaciones que el usuario autenticado ha marcado con 'me gusta'. Cada publicación incluye contenido multimedia y relaciones con usuarios que comentaron o dieron 'me gusta'.",
     *     operationId="getLikedPublications",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de publicaciones con 'me gusta' del usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="content", type="string", example="Texto de la publicación"),
     *                     @OA\Property(property="liked", type="boolean", example=true),
     *                     @OA\Property(
     *                         property="media",
     *                         type="array",
     *                         @OA\Items(
     *                             @OA\Property(property="file_path", type="string", example="https://example.com/storage/media/archivo.jpg")
     *                         )
     *                     ),
     *                     @OA\Property(
     * property="comments",
     * type="array",
     * description="Comentarios asociados",
     * @OA\Items(
     * type="object",
     * @OA\Property(property="id", type="integer", example=10),
     * @OA\Property(property="content", type="string", example="Un comentario"),
     * @OA\Property(property="user", type="object",
     * @OA\Property(property="id", type="integer", example=5),
     * @OA\Property(property="name", type="string", example="Juan Pérez")
     * )
     * )
     * ),
     * @OA\Property(
     * property="likes",
     * type="array",
     * description="Usuarios que dieron me gusta",
     * @OA\Items(
     * type="object",
     * @OA\Property(property="id", type="integer", example=3),
     * @OA\Property(property="user_id", type="integer", example=7),
     * @OA\Property(property="user_name", type="string", example="María López")
     * )
     * )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al obtener publicaciones con 'me gusta'",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error recogiendo tus me gusta."),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */
    public function myLikedPublications()
    {
        try {
            $userId = Auth::id();
            $idsLikedPublications = PublicationLike::where('user_id', $userId)
                ->get()
                ->pluck('publication_id');

            $publications = Publication::with([
                'media',
                'comments.user.student:id,user_id,name,uuid,photo_pic',
                'comments.user.company:id,user_id,name,slug,logo',
                'comments.user.institutions:id,user_id,name,slug,logo',
                'likes.user.student:id,user_id,name,uuid,photo_pic',
                'likes.user.company:id,user_id,name,slug,logo',
                'likes.user.institutions:id,user_id,name,slug,logo',
            ])
                ->whereIn('id', $idsLikedPublications)
                ->orderBy('created_at', 'asc')
                ->get();

            // Add liked status and transform media URLs for each publication
            $publications->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });

            return response()->json([
                'status' => 'success',
                'data' => $publications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error recogiendo tus me gusta.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Patch(
     *     path="/publications/{publicationId}/toggle-like",
     *     summary="Alternar 'Me gusta' en una publicación",
     *     description="Permite al usuario autenticado dar o quitar 'me gusta' a una publicación. Si ya ha dado 'me gusta', lo quita; si no, lo agrega. También actualiza el contador de 'likes'.",
     *     operationId="toggleLikePublication",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="publicationId",
     *         in="path",
     *         description="ID de la publicación",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Operación exitosa",
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="Publication liked successfully"),
     *                     @OA\Property(property="liked", type="boolean", example=true),
     *                     @OA\Property(property="likes_count", type="integer", example=12)
     *                 ),
     *                 @OA\Schema(
     *                     @OA\Property(property="status", type="string", example="success"),
     *                     @OA\Property(property="message", type="string", example="Publication unliked successfully"),
     *                     @OA\Property(property="liked", type="boolean", example=false),
     *                     @OA\Property(property="likes_count", type="integer", example=11)
     *                 )
     *             }
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
     *         description="Error al alternar 'me gusta'",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error toggling like"),
     *             @OA\Property(property="error", type="string", example="Mensaje del error")
     *         )
     *     )
     * )
     */
    public function toggleLike($publicationId, Request $request)
    {
        try {
            $publication = Publication::findOrFail($publicationId);
            $userId = Auth::id();

            Log::info("Usuario logueado", ["user" => Auth::user()]);
            Log::info("Usuario Reques", ["user" => $request->all()]);

            $existingLike = PublicationLike::where('publication_id', $publicationId)
                ->where('user_id', $userId)
                ->first();

            if ($existingLike) {
                $existingLike->delete();
                $publication->decrement('likes_count');

                return response()->json([
                    'status' => 'success',
                    'message' => 'Publication unliked successfully',
                    'liked' => false,
                    'likes_count' => $publication->likes_count
                ]);
            } else {
                PublicationLike::create([
                    'publication_id' => $publicationId,
                    'user_id' => $userId
                ]);
                $publication->increment('likes_count');

                return response()->json([
                    'status' => 'success',
                    'message' => 'Publication liked successfully',
                    'liked' => true,
                    'likes_count' => $publication->likes_count
                ]);
            }
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error in toggleLike: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error toggling like',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/publications/{publicationId}/toggle-save",
     *     summary="Alterna el guardado de una publicación para el usuario autenticado",
     *     description="Si la publicación ya está guardada por el usuario, la elimina. Si no, crea un registro de guardado para la publicación y usuario.",
     *     operationId="toggleSavePublication",
     *     tags={"Publications"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="publicationId",
     *         in="path",
     *         required=true,
     *         description="ID de la publicación a guardar o desguardar",
     *         @OA\Schema(type="integer", example=42)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Publicación guardada exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Publication saved successfully"),
     *             @OA\Property(property="saved", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Publicación no encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Publication not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error en el servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error toggling save"),
     *             @OA\Property(property="error", type="string", example="Mensaje detallado del error")
     *         )
     *     )
     * )
     */
    public function toggleSave($publicationId)
    {
        try {
            $publication = Publication::findOrFail($publicationId);
            $userId = Auth::id();

            $existingSave = PublicationSaved::where('publication_id', $publicationId)
                ->where('user_id', $userId)
                ->first();

            if ($existingSave) {
                $existingSave->delete();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Publication unsaved successfully',
                    'saved' => false
                ]);
            } else {
                PublicationSaved::create([
                    'publication_id' => $publicationId,
                    'user_id' => $userId
                ]);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Publication saved successfully',
                    'saved' => true
                ]);
            }
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error toggling save',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/publications/saved",
     *     summary="Obtener las publicaciones guardadas por el usuario autenticado",
     *     description="Retorna una lista de publicaciones guardadas por el usuario, incluyendo datos del autor, medios, comentarios, likes y estado de like/guardado.",
     *     operationId="getSavedPublications",
     *     tags={"Publications"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de publicaciones guardadas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="title", type="string", example="Ejemplo de publicación"),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=10),
     *                         @OA\Property(property="name", type="string", example="Nombre Usuario")
     *                     ),
     *                     @OA\Property(
     *                         property="media",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=100),
     *                             @OA\Property(property="file_path", type="string", example="https://example.com/storage/media1.jpg")
     *                         )
     *                     ),
     *                     @OA\Property(
     *                         property="comments",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=500),
     *                             @OA\Property(property="content", type="string", example="Comentario"),
     *                             @OA\Property(
     *                                 property="user",
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=20),
     *                                 @OA\Property(property="name", type="string", example="Comentario Usuario")
     *                             )
     *                         )
     *                     ),
     *                     @OA\Property(property="likes", type="array", @OA\Items(type="object")),
     *                     @OA\Property(property="liked", type="boolean", example=true),
     *                     @OA\Property(property="saved", type="boolean", example=true)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al recuperar publicaciones guardadas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error retrieving saved publications"),
     *             @OA\Property(property="error", type="string", example="Mensaje detallado del error")
     *         )
     *     )
     * )
     */
    public function getSavedPublications()
    {
        try {
            $userId = Auth::id();
            $savedPublications = Publication::with([
                'user:id,name',
                'media',
                'comments.user:id,name',
                'likes'
            ])
                ->whereHas('savedPublications', function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            // Add liked status and transform media URLs for each publication
            $savedPublications->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);
                $publication->saved = true;

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });

            return response()->json([
                'status' => 'success',
                'data' => $savedPublications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving saved publications',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
