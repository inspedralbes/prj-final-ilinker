<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminCompanyController extends Controller
{


    /**
     * @OA\Get(
     *     path="/api/empresas",
     *     summary="Obtener listado de empresas",
     *     description="Retorna un listado paginado de empresas, incluyendo su usuario asociado, sectores y número de ofertas publicadas.",
     *     operationId="getEmpresas",
     *     tags={"ADMIN"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Número de página para la paginación.",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Listado paginado de empresas",
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
     *                         @OA\Property(property="name", type="string", example="Tech Corp"),
     *                         @OA\Property(
     *                             property="user",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=10),
     *                             @OA\Property(property="name", type="string", example="Carlos Sánchez"),
     *                             @OA\Property(property="email", type="string", format="email", example="carlos@techcorp.com"),
     *                         ),
     *                         @OA\Property(
     *                             property="sectors",
     *                             type="array",
     *                             @OA\Items(
     *                                 @OA\Property(property="id", type="integer", example=2),
     *                                 @OA\Property(property="name", type="string", example="Tecnología"),
     *                             )
     *                         ),
     *                         @OA\Property(property="offers_count", type="integer", example=5),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2024-06-01T12:00:00Z"),
     *                     )
     *                 ),
     *                 @OA\Property(property="last_page", type="integer", example=3),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=25),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error interno del servidor: Error message"),
     *         ),
     *     )
     * )
     */
    public function index()
    {
        try {
            $companies = Company::with(['user', 'sectors'])
                ->withCount('offers')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $companies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/empresas/{id}",
     *     summary="Mostrar detalles de una empresa",
     *     description="Obtiene los detalles de una empresa específica por su ID. Incluye relaciones con el usuario asociado, sectores y ofertas.",
     *     operationId="getEmpresaById",
     *     tags={"ADMIN"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la empresa",
     *         required=true,
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la empresa obtenidos correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=5),
     *                 @OA\Property(property="name", type="string", example="Empresa Ejemplo"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="María García"),
     *                     @OA\Property(property="email", type="string", format="email", example="maria@empresa.com")
     *                 ),
     *                 @OA\Property(
     *                     property="sectors",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Educación")
     *                     )
     *                 ),
     *                 @OA\Property(
     *                     property="offers",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=21),
     *                         @OA\Property(property="title", type="string", example="Oferta de trabajo"),
     *                         @OA\Property(property="description", type="string", example="Descripción de la oferta..."),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-10T10:00:00Z")
     *                     )
     *                 ),
     *                 @OA\Property(property="offers_count", type="integer", example=1),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15T08:00:00Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Empresa no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Empresa no encontrada")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $company = Company::with(['user', 'sectors', 'offers'])
                ->withCount('offers')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Empresa no encontrada'
            ], 404);
        }
    }


    /**
     * @OA\Put(
     *     path="/api/empresas/{id}",
     *     summary="Actualizar una empresa (solo admin)",
     *     description="Permite a un usuario con rol de administrador actualizar los datos de una empresa existente. Los campos son opcionales y solo se actualizarán si se incluyen en la solicitud.",
     *     operationId="updateEmpresa",
     *     tags={"ADMIN"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la empresa",
     *         required=true,
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string", example="Tech Solutions"),
     *             @OA\Property(property="CIF", type="string", maxLength=9, minLength=9, example="B12345678"),
     *             @OA\Property(property="email", type="string", format="email", example="info@techsolutions.com"),
     *             @OA\Property(property="phone", type="string", pattern="^\d+$", example="123456789"),
     *             @OA\Property(property="website", type="string", format="url", example="https://www.techsolutions.com"),
     *             @OA\Property(property="active", type="boolean", example=true),
     *             @OA\Property(property="responsible_name", type="string", example="Laura Pérez"),
     *             @OA\Property(property="responsible_email", type="string", format="email", example="laura@techsolutions.com"),
     *             @OA\Property(property="responsible_phone", type="string", pattern="^\d+$", example="987654321"),
     *             @OA\Property(property="address", type="string", example="Calle Falsa 123"),
     *             @OA\Property(property="city", type="string", example="Madrid"),
     *             @OA\Property(property="postal_code", type="string", pattern="^\d+$", example="28080"),
     *             @OA\Property(property="country", type="string", example="España"),
     *             @OA\Property(property="short_description", type="string", example="Empresa líder en soluciones tecnológicas."),
     *             @OA\Property(property="description", type="string", example="Ofrecemos servicios en el sector IT desde 2001."),
     *             @OA\Property(property="num_people", type="integer", example=45)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Empresa actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=12),
     *                 @OA\Property(property="name", type="string", example="Tech Solutions"),
     *                 @OA\Property(property="CIF", type="string", example="B12345678"),
     *                 @OA\Property(property="email", type="string", format="email", example="info@techsolutions.com"),
     *                 @OA\Property(property="sectors", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Datos inválidos",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="CIF",
     *                     type="array",
     *                     @OA\Items(type="string", example="The CIF has already been taken.")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al actualizar la empresa",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al actualizar la empresa: error_message")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $company = Company::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'CIF' => 'sometimes|string|max:9|unique:companies,CIF,' . $id,
                'email' => 'sometimes|email|unique:companies,email,' . $id,
                'phone' => 'sometimes|numeric|nullable',
                'website' => 'sometimes|url|nullable',
                'active' => 'sometimes|boolean',
                'responsible_name' => 'sometimes|string|max:255|nullable',
                'responsible_email' => 'sometimes|email|nullable',
                'responsible_phone' => 'sometimes|numeric|nullable',
                'address' => 'sometimes|string|max:255|nullable',
                'city' => 'sometimes|string|max:255|nullable',
                'postal_code' => 'sometimes|numeric|nullable',
                'country' => 'sometimes|string|max:255|nullable',
                'short_description' => 'sometimes|string|nullable',
                'description' => 'sometimes|string|nullable',
                'num_people' => 'sometimes|integer|nullable',
            ]);

            $company->update($validated);

            return response()->json([
                'success' => true,
                'data' => $company->load(['user', 'sectors'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la empresa: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Delete(
     *     path="/api/empresas/{id}",
     *     summary="Eliminar una empresa y sus ofertas",
     *     description="Elimina una empresa específica junto con todas las ofertas asociadas a ella.",
     *     operationId="deleteEmpresa",
     *     tags={"ADMIN"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la empresa a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Empresa y ofertas eliminadas correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Empresa y sus ofertas eliminadas correctamente")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Empresa no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="No se encontró la empresa")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al eliminar la empresa",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al eliminar la empresa: error_message")
     *         )
     *     )
     * )
     */

    public function destroy($id)
    {
        try {
            $company = Company::findOrFail($id);

            // Eliminar las ofertas asociadas
            $company->offers()->delete();

            $company->delete();

            return response()->json([
                'success' => true,
                'message' => 'Empresa y sus ofertas eliminadas correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la empresa: ' . $e->getMessage()
            ], 500);
        }
    }
}
