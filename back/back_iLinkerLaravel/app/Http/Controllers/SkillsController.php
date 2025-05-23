<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillsController extends Controller
{
    //

    /**
     * @OA\Get(
     *     path="/api/skills",
     *     summary="Obtiene todas las habilidades disponibles",
     *     description="Recupera una lista de todas las habilidades registradas en el sistema.",
     *     operationId="getAllSkills",
     *     tags={"Skills"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de habilidades obtenida exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="JavaScript")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al recuperar las habilidades",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error retrieving skills."),
     *             @OA\Property(property="error", type="string", example="Detalle del error")
     *         )
     *     )
     * )
     */
    public function getSkills()
    {
        try {
            $skills = Skill::all("id", "name");

            return response()->json([
                'status' => 'success',
                'data' => $skills
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving skills.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
