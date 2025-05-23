<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminInstitutionController extends Controller
{


    /**
     * @OA\Get(
     *     path="/api/instituciones",
     *     summary="Listar instituciones",
     *     description="Devuelve una lista paginada de instituciones registradas junto con la información del usuario asociado. Solo accesible para usuarios autenticados.",
     *     operationId="listInstitutions",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de instituciones obtenida correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Institución Ejemplo"),
     *                         @OA\Property(
     *                             property="user",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=10),
     *                             @OA\Property(property="name", type="string", example="Nombre del Usuario")
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(property="total", type="integer", example=15)
     *             )
     *         )
     *     ),
     *
     * @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     ),
     *
     * @OA\Response(
     *         response=500,
     *         description="Error al cargar instituciones",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al cargar instituciones: Detalle del error")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $institutions = Institutions::with(['user'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $institutions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar instituciones: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/instituciones/{id}",
     *     summary="Mostrar detalle de una institución",
     *     description="Devuelve la información detallada de una institución específica, incluyendo el usuario asociado.",
     *     operationId="getInstitutionDetail",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la institución",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Detalle de la institución obtenido correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=5),
     *                 @OA\Property(property="name", type="string", example="Instituto Superior"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=12),
     *                     @OA\Property(property="name", type="string", example="Juan Pérez")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Institución no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Institución no encontrada")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $institution = Institutions::with(['user'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $institution
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Institución no encontrada'
            ], 404);
        }
    }


    /**
     * @OA\Put(
     *     path="/institutions/{id}",
     *     summary="Actualizar una institución",
     *     description="Permite actualizar los datos de una institución específica. Solo usuarios autorizados pueden acceder.",
     *     operationId="updateInstitutionAdmin",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la institución a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string", example="Universidad Nacional", description="El nombre de la institución"),
     *             @OA\Property(property="slug", type="string", example="universidad-nacional", description="Slug amigable de la institución"),
     *             @OA\Property(property="NIF", type="string", example="A12345678", description="Número de identificación fiscal"),
     *             @OA\Property(property="type", type="string", example="universidad", description="Tipo de institución"),
     *             @OA\Property(property="email", type="string", format="email", example="contacto@universidad.es", description="Correo electrónico de la institución"),
     *             @OA\Property(property="phone", type="string", example="912345678", description="Teléfono de contacto"),
     *             @OA\Property(property="website", type="string", format="url", example="https://www.universidad.es", description="URL del sitio web"),
     *             @OA\Property(property="responsible_name", type="string", example="Ana Gómez", description="Nombre del responsable"),
     *             @OA\Property(property="responsible_email", type="string", format="email", example="ana@universidad.es", description="Correo del responsable"),
     *             @OA\Property(property="responsible_phone", type="string", example="654321987", description="Teléfono del responsable"),
     *             @OA\Property(property="founded_year", type="integer", example=1995, description="Año de fundación"),
     *             @OA\Property(
     *                 property="specialties",
     *                 type="array",
     *                 @OA\Items(type="string"),
     *                 example={"Informática", "Derecho"},
     *                 description="Lista de especialidades ofrecidas"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Institución actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=3),
     *                 @OA\Property(property="name", type="string", example="Universidad Nacional"),
     *                 @OA\Property(property="email", type="string", example="contacto@universidad.es"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Institución no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Institución no encontrada")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validación fallida",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="email",
     *                     type="array",
     *                     @OA\Items(type="string"),
     *                     example={"El campo email ya está en uso."}
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al actualizar institución"),
     *             @OA\Property(property="error", type="string", example="Mensaje de error interno (solo visible en modo debug)")
     *         )
     *     )
     * )
     */

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $institution = Institutions::find($id);

            if (!$institution) {
                return response()->json([
                    'success' => false,
                    'message' => 'Institución no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255|unique:institutions,name,' . $id,
                // ... otras reglas de validación ...
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only([
                'name',
                'slug',
                'NIF',
                'type',
                'email',
                'phone',
                'website',
                'responsible_name',
                'responsible_email',
                'responsible_phone',
                'founded_year',
                'specialties'
            ]);

            // Convertir arrays a JSON si existen
            if (isset($data['languages']) && is_array($data['languages'])) {
                $data['languages'] = json_encode($data['languages']);
            }

            if (isset($data['specialties']) && is_array($data['specialties'])) {
                $data['specialties'] = json_encode($data['specialties']);
            }

            $institution->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $institution->fresh(['user'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar institución',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }


    /**
     * @OA\Delete(
     *     path="/institutions/{id}",
     *     summary="Eliminar una institución",
     *     description="Elimina permanentemente una institución por su ID. Requiere autenticación.",
     *     operationId="deleteInstitution",
     *     tags={"Instituciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la institución que se desea eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Institución eliminada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Institución eliminada correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Institución no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="No se pudo encontrar la institución")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al eliminar institución",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al eliminar institución: error interno")
     *         )
     *     )
     * )
     */

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $institution = Institutions::findOrFail($id);
            $institution->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Institución eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar institución: ' . $e->getMessage()
            ], 500);
        }
    }
}
