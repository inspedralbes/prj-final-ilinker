<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/reports",
     *     summary="Crear un reporte de usuario",
     *     description="Valida que el usuario reportado exista y que la razón esté presente. Luego crea un reporte con el usuario reportado, el usuario que reporta y la razón.",
     *     operationId="createUserReport",
     *     tags={"Reports"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"reported_user_id", "reason"},
     *             @OA\Property(property="reported_user_id", type="integer", example=15, description="ID del usuario que se reporta"),
     *             @OA\Property(property="reason", type="string", maxLength=1000, example="Contenido inapropiado", description="Razón del reporte")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Reporte enviado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Reporte enviado correctamente"),
     *             @OA\Property(
     *                 property="report",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=10),
     *                 @OA\Property(property="reported_user_id", type="integer", example=15),
     *                 @OA\Property(property="reported_by_id", type="integer", example=1),
     *                 @OA\Property(property="reason", type="string", example="Contenido inapropiado"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:34:56.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T12:34:56.000000Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="reported_user_id",
     *                     type="array",
     *                     @OA\Items(type="string", example="El id del usuario reportado es obligatorio.")
     *                 ),
     *                 @OA\Property(
     *                     property="reason",
     *                     type="array",
     *                     @OA\Items(type="string", example="La razón es obligatoria.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'reported_user_id' => 'required|exists:users,id',
            'reason' => 'required|string|max:1000',
        ]);

        $report = Report::create([
            'reported_user_id' => $request->reported_user_id,
            'reported_by_id' => auth()->id(),
            'reason' => $request->reason,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reporte enviado correctamente',
            'report' => $report
        ]);
    }
}
