<?php

namespace App\Http\Controllers;

use App\Models\Institutions;
use App\Models\User;
use App\Services\InstitutionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;


/**
 * @OA\Schema(
 *     schema="Institution",
 *     type="object",
 *     required={"id", "name"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Instituto XYZ"),
 *     @OA\Property(property="address", type="string", example="Calle Falsa 123"),
 *     @OA\Property(property="email", type="string", format="email", example="contacto@instituto.xyz")
 * )
 */
class InstitutionController extends Controller
{

    protected InstitutionService $institutionService;

    public function __construct(InstitutionService $institutionService)
    {
        $this->institutionService = $institutionService;
    }

    /**
     * @OA\Get(
     *     path="/api/institution",
     *     summary="Obtiene todas las instituciones con su usuario relacionado",
     *     description="Devuelve un array JSON con cada institución y la información del usuario asociado.",
     *     operationId="getInstitutionsWithUser",
     *     tags={"Institutions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de instituciones",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Institución Ejemplo"),
     *                 @OA\Property(property="logo", type="string", example="logo.png"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="Usuario Asociado")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $institutions = Institutions::with('user')->get();
        return response()->json($institutions);
    }

    /**
     * @OA\Get(
     *     path="/api/institutions",
     *     summary="Obtener todas las instituciones",
     *     operationId="getAllInstitutions",
     *     tags={"Institutions"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de instituciones",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Institution")
     *         )
     *     )
     * )
     */
    public function getInstitutions()
    {
        try {
            $institutions = $this->institutionService->getInstitutions();
            return response()->json(['success' => 'success', 'institutions' => $institutions]);
        } catch (\Exception $exception) {
            return response()->json(['status' => 'error', 'message' => $exception->getMessage()]);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/institution/create",
     *     summary="Crea una nueva institución",
     *     description="Valida y crea una nueva institución. Si el usuario está autenticado, se asocia la institución a dicho usuario. Genera un slug automáticamente si no se proporciona.",
     *     operationId="createInstitution",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Nombre Institución"),
     *             @OA\Property(property="slug", type="string", maxLength=255, example="nombre-institucion"),
     *             @OA\Property(property="custom_url", type="string", maxLength=255, example="institucion-personalizada"),
     *             @OA\Property(property="slogan", type="string", maxLength=255, example="Educando para el futuro"),
     *             @OA\Property(property="about", type="string", example="Descripción completa de la institución"),
     *             @OA\Property(property="type", type="string", maxLength=255, example="Universidad"),
     *             @OA\Property(property="location", type="string", maxLength=255, example="Madrid, España"),
     *             @OA\Property(property="size", type="string", maxLength=255, example="Grande"),
     *             @OA\Property(property="sector", type="string", maxLength=255, example="Educación"),
     *             @OA\Property(property="founded_year", type="string", maxLength=255, example="1985"),
     *             @OA\Property(property="languages", type="array", @OA\Items(type="string", example="Español")),
     *             @OA\Property(property="specialties", type="array", @OA\Items(type="string", example="Ingeniería")),
     *             @OA\Property(property="website", type="string", maxLength=255, example="https://www.ejemplo.edu"),
     *             @OA\Property(property="phone", type="string", maxLength=255, example="+34 123 456 789"),
     *             @OA\Property(property="email", type="string", format="email", maxLength=255, example="info@ejemplo.edu"),
     *             @OA\Property(property="user_id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Institución creada exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Institution created successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nombre Institución"),
     *                 @OA\Property(property="slug", type="string", example="nombre-institucion")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Fallo de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="name", type="array", @OA\Items(type="string", example="The name field is required."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error creating institution")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:institutions|max:255',
            'slug' => 'nullable|string|max:255',
            'custom_url' => 'nullable|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'about' => 'nullable|string',
            'type' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'founded_year' => 'nullable|string|max:255',
            'languages' => 'nullable|array',
            'specialties' => 'nullable|array',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:institutions|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();

            if (Auth::check()) {
                $data['user_id'] = Auth::id();
            }

            // Generate slug from name if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);

                // Ensure slug uniqueness
                $slug = $data['slug'];
                $counter = 1;
                while (Institutions::where('slug', $data['slug'])->exists()) {
                    $data['slug'] = $slug . '-' . $counter;
                    $counter++;
                }
            }

            $institution = Institutions::create($data);
            return response()->json([
                'status' => 'success',
                'message' => 'Institution created successfully',
                'data' => $institution
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating institution'
            ], 500);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/institution/update",
     *     summary="Actualiza una institución existente",
     *     description="Permite al usuario autenticado actualizar una institución de su propiedad. Se pueden modificar datos básicos y archivos (logo y cover). Si se cambia el nombre, se genera un nuevo slug.",
     *     operationId="updateInstitution",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"id"},
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nueva Institución"),
     *                 @OA\Property(property="slogan", type="string", example="Innovando la educación"),
     *                 @OA\Property(property="about", type="string", example="Somos una institución dedicada a la excelencia académica."),
     *                 @OA\Property(property="type", type="string", example="Universidad"),
     *                 @OA\Property(property="location", type="string", example="Barcelona, España"),
     *                 @OA\Property(property="size", type="string", example="Grande"),
     *                 @OA\Property(property="founded_year", type="string", example="1990"),
     *                 @OA\Property(property="languages[]", type="array", @OA\Items(type="string"), example={"Español", "Inglés"}),
     *                 @OA\Property(property="specialties[]", type="array", @OA\Items(type="string"), example={"Ciencias", "Ingeniería"}),
     *                 @OA\Property(property="website", type="string", example="https://www.nueva.edu"),
     *                 @OA\Property(property="phone", type="string", example="+34 600 123 456"),
     *                 @OA\Property(property="email", type="string", format="email", example="contacto@nueva.edu"),
     *                 @OA\Property(property="logo", type="file", description="Archivo para logo"),
     *                 @OA\Property(property="cover", type="file", description="Archivo para foto de portada")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Institución actualizada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Institution updated successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nueva Institución"),
     *                 @OA\Property(property="slug", type="string", example="nueva-institucion"),
     *                 @OA\Property(property="logo", type="string", example="institutions/logo_1.png"),
     *                 @OA\Property(property="cover", type="string", example="institutions/cover_1.png"),
     *                 @OA\Property(property="logo_url", type="string", example="https://tuapp.com/storage/institutions/logo_1.png"),
     *                 @OA\Property(property="cover_url", type="string", example="https://tuapp.com/storage/institutions/cover_1.png")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=403,
     *         description="No autorizado para modificar la institución",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthorized to update this institution")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Fallo de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="name", type="array", @OA\Items(type="string", example="The name has already been taken."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error en el servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error updating institution: [mensaje del error]")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            if (!$request->has('id')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Institution ID is required'
                ], 422);
            }

            $institution = Institutions::findOrFail($request->id);

            // Check if authenticated user owns this institution
            if ($institution->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this institution'
                ], 403);
            }

            // si hay archivos de logo o cover se actualizan
            if ($request->hasFile('logo') || $request->hasFile('cover')) {
                if ($request->hasFile('logo')) {
                    $fileName = "logo_{$institution->id}." . $request->file('logo')->getClientOriginalExtension();
                    $request->file('logo')->move(storage_path('app/public/institutions'), $fileName);
                    $institution->logo = "institutions/{$fileName}";
                }

                if ($request->hasFile('cover')) {
                    $fileName = "cover_{$institution->id}." . $request->file('cover')->getClientOriginalExtension();
                    $request->file('cover')->move(storage_path('app/public/institutions'), $fileName);
                    $institution->cover = "institutions/{$fileName}";
                }

                $institution->save();
            } else {
                // For regular data updates
                $validator = Validator::make($request->all(), [
                    'id' => 'required|exists:institutions,id',
                    'name' => ['nullable', 'string', Rule::unique('institutions')->ignore($institution->id)],
                    'slogan' => 'nullable|string',
                    'about' => 'nullable|string',
                    'type' => 'nullable|string',
                    'location' => 'nullable|string',
                    'size' => 'nullable|string',
                    'founded_year' => 'nullable|string',
                    'languages' => 'nullable|array',
                    'languages.*' => 'string',
                    'specialties' => 'nullable|array',
                    'specialties.*' => 'string',
                    'website' => 'nullable|string',
                    'phone' => 'nullable|string',
                    'email' => ['nullable', 'email', Rule::unique('institutions')->ignore($institution->id)]
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Validation failed',
                        'errors' => $validator->errors()
                    ], 422);
                }

                $updateData = $request->only([
                    'name', 'slogan', 'about', 'type', 'location',
                    'size', 'founded_year', 'languages', 'specialties',
                    'website', 'phone', 'email'
                ]);

                foreach ($updateData as $key => $value) {
                    if ($value !== null) {
                        $institution->$key = $value;

                        // Update slug if name changes
                        if ($key === 'name') {
                            $newSlug = Str::slug($value);
                            $originalSlug = $newSlug;
                            $counter = 1;

                            // Ensure slug uniqueness excluding current institution
                            while (Institutions::where('slug', $newSlug)
                                ->where('id', '!=', $institution->id)
                                ->exists()) {
                                $newSlug = $originalSlug . '-' . $counter;
                                $counter++;
                            }

                            $institution->slug = $newSlug;
                        }
                    }
                }

                $institution->save();
            }

            // Prepare response with full URLs
            $responseData = $institution->fresh()->toArray();
            $baseUrl = config('app.url') . '/storage';
            $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
            $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

            return response()->json([
                'status' => 'success',
                'message' => 'Institution updated successfully',
                'data' => $responseData
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating institution: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/institutions/{id}",
     *     summary="Obtiene los datos de una institución por su ID",
     *     description="Devuelve la información detallada de una institución identificada por su ID, incluyendo los datos del usuario asociado, logo y portada.",
     *     operationId="getInstitutionById",
     *     tags={"Institutions"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la institución",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Institución encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Institución Ejemplo"),
     *                 @OA\Property(property="slug", type="string", example="institucion-ejemplo"),
     *                 @OA\Property(property="logo", type="string", example="logos/logo.png"),
     *                 @OA\Property(property="cover", type="string", example="covers/cover.png"),
     *                 @OA\Property(property="logo_url", type="string", example="https://tuapp.com/storage/logos/logo.png"),
     *                 @OA\Property(property="cover_url", type="string", example="https://tuapp.com/storage/covers/cover.png"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="Usuario Asociado")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Institución no encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Institution not found")
     *         )
     *     )
     * )
     */
    public function show(string $id)
    {
        try {
            $institution = Institutions::with('user')->findOrFail($id);

            $baseUrl = config('app.url') . '/storage';
            $responseData = $institution->toArray();
            $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
            $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

            return response()->json([
                'status' => 'success',
                'data' => $responseData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/institutions/{slug}",
     *     summary="Obtiene los datos de una institución por su slug",
     *     description="Retorna la información detallada de una institución incluyendo su usuario asociado, logo y cover.",
     *     operationId="getInstitutionBySlug",
     *     tags={"Institutions"},
     *     @OA\Parameter(
     *         name="slug",
     *         in="path",
     *         required=true,
     *         description="El slug único de la institución",
     *         @OA\Schema(type="string", example="institucion-ejemplo")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Institución encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Institución Ejemplo"),
     *                 @OA\Property(property="slug", type="string", example="institucion-ejemplo"),
     *                 @OA\Property(property="logo", type="string", example="logos/logo.png"),
     *                 @OA\Property(property="cover", type="string", example="covers/cover.png"),
     *                 @OA\Property(property="logo_url", type="string", example="https://tuapp.com/storage/logos/logo.png"),
     *                 @OA\Property(property="cover_url", type="string", example="https://tuapp.com/storage/covers/cover.png"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="Usuario Asociado")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Institución no encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Institution not found")
     *         )
     *     )
     * )
     */
    public function getInstitution($slug)
    {
        $institution = Institutions::where('slug', $slug)->with('user')->first();

        $institutionFollowers = User::findOrFail($institution->user_id)
            ->followers->count();

        $institution->followers = $institutionFollowers;

        if (!$institution) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
        }

        $baseUrl = config('app.url') . '/storage';
        $responseData = $institution->toArray();
        $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
        $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

        return response()->json([
            'status' => 'success',
            'data' => $responseData
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/institutions/url/{customUrl}",
     *     summary="Obtiene los datos de una institución por su slug o URL personalizada",
     *     description="Devuelve la información detallada de una institución identificada por su slug o custom_url, incluyendo datos del usuario asociado, logo y cover.",
     *     operationId="getInstitutionBySlugOrCustomUrl",
     *     tags={"Institutions"},
     *     @OA\Parameter(
     *         name="customUrl",
     *         in="path",
     *         required=true,
     *         description="Slug o URL personalizada de la institución",
     *         @OA\Schema(type="string", example="institucion-custom")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Institución encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Institución Ejemplo"),
     *                 @OA\Property(property="slug", type="string", example="institucion-ejemplo"),
     *                 @OA\Property(property="custom_url", type="string", example="institucion-custom"),
     *                 @OA\Property(property="logo", type="string", example="logos/logo.png"),
     *                 @OA\Property(property="cover", type="string", example="covers/cover.png"),
     *                 @OA\Property(property="logo_url", type="string", example="https://tuapp.com/storage/logos/logo.png"),
     *                 @OA\Property(property="cover_url", type="string", example="https://tuapp.com/storage/covers/cover.png"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="Usuario Asociado")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Institución no encontrada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Institution not found")
     *         )
     *     )
     * )
     */

    public function getByCustomUrl($customUrl)
    {
        $institution = Institutions::where('slug', $customUrl)->orWhere('custom_url', $customUrl)->with('user')->first();

        if (!$institution) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
        }

        $baseUrl = config('app.url') . '/storage';
        $responseData = $institution->toArray();
        $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
        $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

        return response()->json([
            'status' => 'success',
            'data' => $responseData
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/institution/check-owner",
     *     summary="Verifica si un usuario es propietario de una institución",
     *     description="Valida que los IDs del usuario e institución existan en la base de datos y determina si el usuario es el dueño de la institución.",
     *     operationId="checkInstitutionOwner",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id", "institution_id"},
     *             @OA\Property(property="user_id", type="integer", example=3),
     *             @OA\Property(property="institution_id", type="integer", example=12)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Indica si el usuario es propietario de la institución",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="isOwner", type="boolean", example=true)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Fallo de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="user_id", type="array", @OA\Items(type="string", example="The selected user id is invalid.")),
     *                 @OA\Property(property="institution_id", type="array", @OA\Items(type="string", example="The selected institution id is invalid."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al verificar propiedad",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error checking institution ownership")
     *         )
     *     )
     * )
     */
    public function checkOwner(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'institution_id' => 'required|exists:institutions,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $institution = Institutions::findOrFail($request->institution_id);
            $isOwner = $institution->user_id === $request->user_id;

            return response()->json([
                'status' => 'success',
                'isOwner' => $isOwner
            ]);
        } catch (\Exception $e) {
            Log::error('Error checking institution ownership: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error checking institution ownership'
            ], 500);
        }
    }
}
