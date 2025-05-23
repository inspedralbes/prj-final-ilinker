<?php

namespace App\Http\Controllers;

use App\Services\StudentEducationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function Symfony\Component\Translation\t;

class StudentEducationController extends Controller
{
    protected $studentEducationService;

    public function __construct(StudentEducationService $studentEducationService)
    {
        $this->studentEducationService = $studentEducationService;
    }


    /**
     * @OA\Post(
     *     path="/api/education/create",
     *     summary="Crea un registro de educación para un estudiante",
     *     description="Valida los datos recibidos y utiliza una transacción para asegurar la integridad de la base de datos.",
     *     operationId="createStudentEducation",
     *     tags={"Educación"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_id", "start_date"},
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="courses_id", type="integer", nullable=true, example=5),
     *             @OA\Property(property="institution_id", type="integer", nullable=true, example=2),
     *             @OA\Property(property="institute", type="string", nullable=true, example="Universidad Nacional"),
     *             @OA\Property(property="degree", type="string", nullable=true, example="Ingeniería Informática"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2020-09-01"),
     *             @OA\Property(property="end_date", type="string", format="date", nullable=true, example="2024-06-30")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Registro de educación creado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="education", type="object",
     *                 @OA\Property(property="id", type="integer", example=12),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="degree", type="string", example="Ingeniería Informática"),
     *                 @OA\Property(property="start_date", type="string", example="2020-09-01"),
     *                 @OA\Property(property="end_date", type="string", example="2024-06-30")
     *             )
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
     *                 @OA\Property(property="start_date", type="array", @OA\Items(type="string", example="El campo start_date es obligatorio."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al crear el registro de educación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al crear la educacion del estudiante.")
     *         )
     *     )
     * )
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required',
            'courses_id' => 'nullable',
            'institution_id' => 'nullable',
            'institute' => 'nullable',
            'degree' => 'nullable',
            'start_date' => 'required',
            'end_date' => 'nullable',
        ]);

        DB::beginTransaction();

        try {

            $education = $this->studentEducationService->createStudentEducation($validated);

            if (!$education) {
                throw new \Exception('Error al crear la educacion del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'education' => $education]);

        } catch (\Exception $e) {
            // Si ocurre un error, deshacer los cambios en la BD
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }


    /**
     * @OA\Put(
     *     path="/api/education/update",
     *     summary="Actualiza un registro de educación para un estudiante",
     *     description="Valida los datos recibidos y utiliza una transacción para asegurar la integridad de la base de datos.",
     *     operationId="updateStudentEducation",
     *     tags={"Educación"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id", "start_date", "end_date"},
     *             @OA\Property(property="id", type="integer", example=12),
     *             @OA\Property(property="courses_id", type="integer", nullable=true, example=5),
     *             @OA\Property(property="institution_id", type="integer", nullable=true, example=2),
     *             @OA\Property(property="institute", type="string", nullable=true, example="Universidad Nacional"),
     *             @OA\Property(property="degree", type="string", nullable=true, example="Ingeniería Informática"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2020-09-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-06-30")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Registro de educación actualizado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="education", type="object",
     *                 @OA\Property(property="id", type="integer", example=12),
     *                 @OA\Property(property="student_id", type="integer", example=1),
     *                 @OA\Property(property="degree", type="string", example="Ingeniería Informática"),
     *                 @OA\Property(property="start_date", type="string", example="2020-09-01"),
     *                 @OA\Property(property="end_date", type="string", example="2024-06-30")
     *             )
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
     *                 @OA\Property(property="start_date", type="array", @OA\Items(type="string", example="El campo start_date es obligatorio.")),
     *                 @OA\Property(property="end_date", type="array", @OA\Items(type="string", example="El campo end_date es obligatorio."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al actualizar el registro de educación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al actualizar la educacion del estudiante.")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {

        $validated = $request->validate([
            'id' => 'required',
            'courses_id' => 'nullable',
            'institution_id' => 'nullable',
            'institute' => 'nullable',
            'degree' => 'nullable',
            'start_date' => 'required',
            'end_date' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $education = $this->studentEducationService->updateStudentEducation($validated);
            if (!$education) {
                throw new \Exception('Error al actualizar la educacion del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'education' => $education]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }


    /**
     * @OA\Delete(
     *     path="/api/education/delete",
     *     summary="Elimina un registro de educación para un estudiante",
     *     description="Valida el ID recibido y utiliza una transacción para asegurar la integridad de la base de datos durante el proceso de eliminación.",
     *     operationId="deleteStudentEducation",
     *     tags={"Educación"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=12)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Educación eliminada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Educacion eliminada")
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
     *                 @OA\Property(property="id", type="array", @OA\Items(type="string", example="El campo id es obligatorio."))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno al eliminar el registro de educación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al eliminar la educacion del estudiante.")
     *         )
     *     )
     * )
     */
    public function delete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $education = $this->studentEducationService->deleteStudentEducation($validated);
            if (!$education) {
                throw new \Exception('Error al eliminar la educacion del estudiante.');
            }
            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Educacion eliminada']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }
}
