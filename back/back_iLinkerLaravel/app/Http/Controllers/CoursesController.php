<?php

namespace App\Http\Controllers;

use App\Services\CoursesService;
use Illuminate\Http\Request;

class CoursesController extends Controller
{
    protected $coursesService;

    public function __construct(CoursesService $coursesService)
    {
        $this->coursesService = $coursesService;
    }


    /**
     * @OA\Get(
     *     path="/api/courses",
     *     summary="Obté la llista de cursos disponibles",
     *     description="Retorna totes les dades dels cursos disponibles al sistema.",
     *     operationId="getCourses",
     *     tags={"Courses"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Cursos obtinguts correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="courses",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Curso 1")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error")
     *         )
     *     )
     * )
     */
    public function getCourses()
    {
        try {
            $courses = $this->coursesService->getCourses();

            return response()->json(['status' => 'success', 'courses' => $courses]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
