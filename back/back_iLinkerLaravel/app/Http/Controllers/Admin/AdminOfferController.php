<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AdminOfferController extends Controller
{
    /**
     * @OA\Get(
     *     path="/offers",
     *     summary="Listar todas las ofertas",
     *     description="Devuelve un listado paginado de las ofertas disponibles junto con la información de la empresa asociada.",
     *     operationId="listOffers",
     *     tags={"Ofertas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Número de página para paginación",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listado paginado de ofertas",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="title", type="string", example="Desarrollador Backend"),
     *                     @OA\Property(property="description", type="string", example="Buscamos desarrollador con experiencia en Laravel."),
     *                     @OA\Property(
     *                         property="company",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=3),
     *                         @OA\Property(property="name", type="string", example="Tech Solutions")
     *                     ),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-06-01T10:00:00Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-06-01T10:00:00Z")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al cargar ofertas",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al cargar ofertas: error interno")
     *         )
     *     )
     * )
     */

    public function index()
    {
        try {
            $offers = Offer::with(['company'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $offers->items(), // Esto devuelve solo los items del paginador
                // O si prefieres el paginador completo:
                // 'data' => $offers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar ofertas: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/offers/{id}",
     *     summary="Mostrar detalles de una oferta",
     *     description="Recupera los detalles de una oferta específica, incluyendo la empresa que la publicó y los usuarios interesados.",
     *     operationId="showOfferAdmin",
     *     tags={"Ofertas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la oferta",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la oferta",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=5),
     *                 @OA\Property(property="title", type="string", example="Desarrollador Frontend"),
     *                 @OA\Property(property="description", type="string", example="Se busca desarrollador con experiencia en Vue.js"),
     *                 @OA\Property(
     *                     property="company",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=2),
     *                     @OA\Property(property="name", type="string", example="WebTech S.A.")
     *                 ),
     *                 @OA\Property(
     *                     property="users_interested",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=12),
     *                         @OA\Property(property="name", type="string", example="Juan Pérez")
     *                     )
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-07-01T09:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-07-01T09:00:00Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Oferta no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Oferta no encontrada")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $offer = Offer::with(['company', 'usersInterested'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $offer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Oferta no encontrada'
            ], 404);
        }
    }


    /**
     * @OA\Put(
     *     path="/offers/{id}",
     *     summary="Actualizar una oferta",
     *     description="Permite actualizar los campos de una oferta existente. Se puede enviar solo los campos que se deseen modificar. Este endpoint requiere autenticación.",
     *     operationId="updateOffer",
     *     tags={"Ofertas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la oferta a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="title", type="string", example="Desarrollador Backend"),
     *             @OA\Property(property="description", type="string", example="Experiencia en PHP y Laravel."),
     *             @OA\Property(
     *                 property="skills",
     *                 type="array",
     *                 @OA\Items(type="string"),
     *                 example={"PHP", "Laravel", "MySQL"}
     *             ),
     *             @OA\Property(property="salary", type="string", example="30000-35000€"),
     *             @OA\Property(property="location_type", type="string", example="remoto"),
     *             @OA\Property(property="city", type="string", example="Madrid"),
     *             @OA\Property(property="vacancies", type="integer", example=2),
     *             @OA\Property(property="active", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Oferta actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=7),
     *                 @OA\Property(property="title", type="string", example="Desarrollador Backend"),
     *                 @OA\Property(property="description", type="string", example="Experiencia en PHP y Laravel."),
     *                 @OA\Property(property="salary", type="string", example="30000-35000€"),
     *                 @OA\Property(property="location_type", type="string", example="remoto"),
     *                 @OA\Property(property="city", type="string", example="Madrid"),
     *                 @OA\Property(property="vacancies", type="integer", example=2),
     *                 @OA\Property(property="active", type="boolean", example=true),
     *                 @OA\Property(
     *                     property="company",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=3),
     *                     @OA\Property(property="name", type="string", example="TechCorp")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="title",
     *                     type="array",
     *                     @OA\Items(type="string"),
     *                     example={"El campo title es obligatorio."}
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al actualizar oferta",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al actualizar oferta")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $offer = Offer::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'skills' => 'nullable|array',
                'salary' => 'sometimes|string|max:100',
                'location_type' => 'nullable|in:hibrido,remoto,presencial',
                'city' => 'sometimes|string|max:100',
                'vacancies' => '',
                'active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Solo toma los campos que son fillable
            $fillableFields = $offer->getFillable();
            $data = $request->only($fillableFields);

            // Convertir skills a JSON si es un array
            if (isset($data['skills'])) {
                $data['skills'] = is_array($data['skills'])
                    ? json_encode($data['skills'])
                    : $data['skills'];
            }

            $offer->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $offer->fresh(['company'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar oferta',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }


    /**
     * @OA\Patch(
     *     path="/offers/{id}/status",
     *     summary="Actualizar el estado de una oferta",
     *     description="Permite activar o desactivar una oferta específica. Este endpoint requiere autenticación.",
     *     operationId="updateOfferStatus",
     *     tags={"Ofertas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la oferta a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer", example=4)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"active"},
     *             @OA\Property(property="active", type="boolean", description="Indica si la oferta está activa (true) o inactiva (false)", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estado de la oferta actualizado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=4),
     *                 @OA\Property(property="title", type="string", example="Desarrollador Frontend"),
     *                 @OA\Property(property="active", type="boolean", example=true)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Datos inválidos",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="active",
     *                     type="array",
     *                     @OA\Items(type="string"),
     *                     example={"The active field is required."}
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al actualizar estado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al actualizar estado: Error message")
     *         )
     *     )
     * )
     */

    public function updateStatus(Request $request, $id)
    {
        try {
            $offer = Offer::findOrFail($id);

            $request->validate([
                'active' => 'required|boolean'
            ]);

            $offer->update(['active' => $request->active]);

            return response()->json([
                'success' => true,
                'data' => $offer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estado: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Delete(
     *     path="/offers/{id}",
     *     summary="Eliminar una oferta",
     *     description="Elimina permanentemente una oferta del sistema por su ID. Este endpoint está protegido y requiere permisos adecuados.",
     *     operationId="deleteOffer",
     *     tags={"Ofertas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la oferta a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=4)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Oferta eliminada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Oferta eliminada correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Oferta no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Offer] 999")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al eliminar oferta",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al eliminar oferta: Mensaje del error")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $offer = Offer::findOrFail($id);
            $offer->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Oferta eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar oferta: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/offers/{id}/applications",
     *     summary="Obtener aplicaciones de una oferta",
     *     description="Devuelve la lista de usuarios que se han postulado a una oferta específica, incluyendo el estado de la postulación y la fecha de creación.",
     *     operationId="getOfferApplications",
     *     tags={"Ofertas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID de la oferta",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de aplicaciones obtenida correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="Juan"),
     *                     @OA\Property(property="surname", type="string", example="Pérez"),
     *                     @OA\Property(
     *                         property="pivot",
     *                         type="object",
     *                         @OA\Property(property="status", type="string", example="pendiente"),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2024-11-01T12:34:56.000000Z")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Oferta no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Offer] 999")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al cargar aplicaciones",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al cargar aplicaciones: Mensaje del error")
     *         )
     *     )
     * )
     */
    public function getApplications($id)
    {
        try {
            $offer = Offer::with(['usersInterested' => function ($query) {
                $query->withPivot(['status', 'created_at']);
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $offer->usersInterested
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar aplicaciones: ' . $e->getMessage()
            ], 500);
        }
    }
}
