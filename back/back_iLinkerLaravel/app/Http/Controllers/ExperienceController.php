<?php

namespace App\Http\Controllers;

use App\Services\ExperienceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExperienceController extends Controller
{
    protected $experienceService;

    public function __construct(ExperienceService $experienceService)
    {
        $this->experienceService = $experienceService;
    }


    /**
     * @OA\Post(
     *     path="/api/experience/create",
     *     summary="Crea un nuevo registro de experiencia laboral para un estudiante",
     *     description="Valida los datos de entrada y utiliza una transacción para asegurar la integridad de la base de datos durante la creación.",
     *     operationId="createStudentExperience",
     *     tags={"Experiencia"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_id", "department", "employee_type", "location_type", "start_date"},
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="company_id", type="integer", nullable=true, example=5),
     *             @OA\Property(property="company_name", type="string", nullable=true, example="TechCorp S.A."),
     *             @OA\Property(property="department", type="string", example="Desarrollo"),
     *             @OA\Property(property="employee_type", type="string", example="Tiempo completo"),
     *             @OA\Property(property="company_address", type="string", nullable=true, example="Calle Falsa 123"),
     *             @OA\Property(property="location_type", type="string", example="Remoto"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2022-01-10"),
     *             @OA\Property(property="end_date", type="string", format="date", nullable=true, example="2023-01-10")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia creada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="experience", type="object", description="Datos del registro creado")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Errores de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="student_id", type="array", @OA\Items(type="string", example="El campo student_id es obligatorio.")),
     *                 @OA\Property(property="department", type="array", @OA\Items(type="string", example="El campo department es obligatorio.")),
     *                 @OA\Property(property="employee_type", type="array", @OA\Items(type="string", example="El campo employee_type es obligatorio.")),
     *                 @OA\Property(property="location_type", type="array", @OA\Items(type="string", example="El campo location_type es obligatorio.")),
     *                 @OA\Property(property="start_date", type="array", @OA\Items(type="string", example="El campo start_date es obligatorio."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al crear la experiencia",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al crear la experiencia del estudiante.")
     *         )
     *     )
     * )
     */
    public function create(Request $request)
    {

        $validate = $request->validate([
            'student_id' => 'required',
            'company_id' => 'nullable',
            'company_name' => 'nullable',
            'department' => 'required',
            'employee_type' => 'required',
            'company_address' => 'nullable',
            'location_type' => 'required',
            'start_date' => 'required',
            'end_date' => 'nullable',
        ]);

        DB::beginTransaction();

        try {

            $experience = $this->experienceService->createExperience($validate);

            if (!$experience) {
                throw new \Exception('Error al crear la experiencia del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'experience' => $experience]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }

    }


    /**
     * @OA\Put(
     *     path="/api/experience/update",
     *     summary="Actualiza un registro existente de experiencia laboral para un estudiante",
     *     description="Valida los datos recibidos y usa una transacción para mantener la integridad durante la actualización.",
     *     operationId="updateStudentExperience",
     *     tags={"Experiencia"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id", "department", "employee_type", "location_type", "start_date"},
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="company_id", type="integer", nullable=true, example=5),
     *             @OA\Property(property="company_name", type="string", nullable=true, example="TechCorp S.A."),
     *             @OA\Property(property="department", type="string", example="Desarrollo"),
     *             @OA\Property(property="employee_type", type="string", example="Tiempo completo"),
     *             @OA\Property(property="company_address", type="string", nullable=true, example="Calle Falsa 123"),
     *             @OA\Property(property="location_type", type="string", example="Presencial"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2022-01-10"),
     *             @OA\Property(property="end_date", type="string", format="date", nullable=true, example="2023-01-10")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia actualizada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="experience", type="object", description="Datos actualizados del registro de experiencia")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Errores de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="id", type="array", @OA\Items(type="string", example="El campo id es obligatorio.")),
     *                 @OA\Property(property="department", type="array", @OA\Items(type="string", example="El campo department es obligatorio.")),
     *                 @OA\Property(property="employee_type", type="array", @OA\Items(type="string", example="El campo employee_type es obligatorio.")),
     *                 @OA\Property(property="location_type", type="array", @OA\Items(type="string", example="El campo location_type es obligatorio.")),
     *                 @OA\Property(property="start_date", type="array", @OA\Items(type="string", example="El campo start_date es obligatorio."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al actualizar la experiencia",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al actualizar la experiencia del estudiante.")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
            'company_id' => 'nullable',
            'company_name' => 'nullable',
            'department' => 'required',
            'employee_type' => 'required',
            'company_address' => 'nullable',
            'location_type' => 'required',
            'start_date' => 'required',
            'end_date' => 'nullable',
        ]);

        DB::beginTransaction();

        try {

            $experience = $this->experienceService->updateExperience($validate);

            if (!$experience) {
                throw new \Exception('Error al actualizar la experiencia del estudiante.');
            }
            DB::commit();
            return response()->json(['status' => 'success', 'experience' => $experience]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/experience/delete",
     *     summary="Elimina un registre d'experiència laboral d'un estudiant",
     *     description="Valida que es passi l'ID i utilitza una transacció per assegurar la integritat durant l'eliminació.",
     *     operationId="deleteStudentExperience",
     *     tags={"Experiencia"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Experiencia eliminada correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Experiencia Eliminada")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="id", type="array", @OA\Items(type="string", example="El campo id es obligatorio."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern al eliminar la experiència",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al eliminar la experiencia del estudiante.")
     *         )
     *     )
     * )
     */
    public function delete(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $experience = $this->experienceService->deleteExperience($validate);
            if (!$experience) {
                throw new \Exception('Error al eliminar la experiencia del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Experiencia Eliminada']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
