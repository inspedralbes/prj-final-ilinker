<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{


    /**
     * @OA\Get(
     *     path="/posts",
     *     summary="Listar todas las publicaciones",
     *     description="Este endpoint devuelve una lista de todas las publicaciones en orden descendente por fecha de creación. Cada publicación incluye sus relaciones con el usuario, comentarios y 'likes'.",
     *     operationId="getAllPublications",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de publicaciones obtenida correctamente",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="user_id", type="integer", example=3),
     *                 @OA\Property(property="content", type="string", example="Este es el contenido de una publicación."),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T13:45:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T13:45:00Z"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=3),
     *                     @OA\Property(property="name", type="string", example="Ana Pérez"),
     *                     @OA\Property(property="email", type="string", example="ana@example.com")
     *                 ),
     *                 @OA\Property(
     *                     property="comments",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=10),
     *                         @OA\Property(property="content", type="string", example="Muy buena publicación."),
     *                         @OA\Property(
     *                             property="user",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=4),
     *                             @OA\Property(property="name", type="string", example="Luis Torres")
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="likes",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=7),
     *                         @OA\Property(property="user_id", type="integer", example=5)
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Post::with(['user', 'comments.user', 'likes'])->latest()->get();
    }


    /**
     * @OA\Post(
     *     path="/api/publications",
     *     summary="Crear una nueva publicación",
     *     description="Este endpoint permite a un usuario autenticado crear una nueva publicación con contenido de texto y, opcionalmente, una imagen.",
     *     operationId="createPublicationPost",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"content"},
     *                 @OA\Property(
     *                     property="content",
     *                     type="string",
     *                     description="El contenido del post",
     *                     example="Esta es una nueva publicación."
     *                 ),
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="La imagen opcional que se desea subir (máximo 2MB)",
     *                     example="post.jpg"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Publicación creada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=12),
     *             @OA\Property(property="user_id", type="integer", example=3),
     *             @OA\Property(property="content", type="string", example="Esta es una nueva publicación."),
     *             @OA\Property(property="image", type="string", example="posts/post.jpg"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T14:00:00Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T14:00:00Z")
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
     *                     property="content",
     *                     type="array",
     *                     @OA\Items(type="string", example="The content field is required.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $imagePath = $request->file('image') ? $request->file('image')->store('posts') : null;

        return Auth::user()->posts()->create([
            'content' => $request->content,
            'image' => $imagePath
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/publications/{post}",
     *     summary="Obtener una publicación específica",
     *     description="Este endpoint devuelve los detalles de una publicación, incluyendo el usuario que la creó, los comentarios con sus respectivos usuarios y los likes.",
     *     operationId="getPublicationById",
     *     tags={"Publicaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="post",
     *         in="path",
     *         description="El ID de la publicación",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la publicación",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=5),
     *             @OA\Property(property="user_id", type="integer", example=2),
     *             @OA\Property(property="content", type="string", example="Esta es una publicación de ejemplo."),
     *             @OA\Property(property="image", type="string", example="posts/ejemplo.jpg"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T14:10:00Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T14:10:00Z"),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=2),
     *                 @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                 @OA\Property(property="email", type="string", example="juan@example.com")
     *             ),
     *             @OA\Property(
     *                 property="comments",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=7),
     *                     @OA\Property(property="content", type="string", example="Comentario de ejemplo."),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=4),
     *                         @OA\Property(property="name", type="string", example="Ana Gómez")
     *                     )
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="likes",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="user_id", type="integer", example=3),
     *                     @OA\Property(property="post_id", type="integer", example=5)
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function show(Post $post)
    {
        return $post->load(['user', 'comments.user', 'likes']);
    }
}

