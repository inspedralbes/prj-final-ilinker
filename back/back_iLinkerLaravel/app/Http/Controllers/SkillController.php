<?php

namespace App\Http\Controllers;

use App\Services\SkillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SkillController extends Controller
{
    protected $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }


    /**
     * @OA\Post(
     *     path="/api/skills",
     *     summary="Crea una nova skill",
     *     description="Crea un nou registre de skill (habilitat) proporcionant el seu nom.",
     *     operationId="createSkill",
     *     tags={"Skills"},
     *    security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Nom de la skill a crear",
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="PHP")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Skill creada correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="skill",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="PHP"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T10:00:00Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Dades no vàlides",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="name",
     *                     type="array",
     *                     @OA\Items(type="string", example="The name field is required.")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al crear una skill")
     *         )
     *     )
     * )
     *
     * @throws \Illuminate\Validation\ValidationException Si no es passa el nom o no és vàlid.
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $skill = $this->skillService->createSkill($validated);

            if (!$skill) {
                throw new \Exception('Error al crear una skill');
            }

            DB::commit();
            return response()->json(['status' => 'success', 'skill' => $skill]);


        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }


    /**
     * @OA\Post(
     *     path="/api/skills/assign",
     *     summary="Assigna una skill a un estudiant",
     *     description="Assigna una skill ja existent a un estudiant específic.",
     *     operationId="assignSkillToStudent",
     *     tags={"Skills"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Identificadors de l'estudiant i de la skill a assignar",
     *         @OA\JsonContent(
     *             required={"student_id", "skills_id"},
     *             @OA\Property(property="student_id", type="integer", example=123),
     *             @OA\Property(property="skills_id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Skill assignada correctament a l'estudiant",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="skill",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="PHP"),
     *                 @OA\Property(property="assigned_to_student_id", type="integer", example=123),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T10:00:00Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Dades no vàlides",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="student_id",
     *                     type="array",
     *                     @OA\Items(type="string", example="The student id field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="skills_id",
     *                     type="array",
     *                     @OA\Items(type="string", example="The skills id field is required.")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al crear una skill")
     *         )
     *     )
     * )
     *
     * @throws \Illuminate\Validation\ValidationException Si la validació falla.
     */
    public function assignment(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required',
            'skills_id' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $skill = $this->skillService->assignStudent($validated);
            if (!$skill) {
                throw new \Exception('Error al crear una skill');
            }
            DB::commit();
            return response()->json(['status' => 'success', 'skill' => $skill]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $skills = $this->skillService->deleteSkill($validated['id']);
            if (!$skills) {
                throw new \Exception('Error al eliminar una skill');
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Skill eliminada correctamente', 'skills' => $skills]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function getAll()
    {
        try {
            $skills = $this->skillService->getAllSkills();
            return response()->json(['status' => 'success', 'skills' => $skills]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
