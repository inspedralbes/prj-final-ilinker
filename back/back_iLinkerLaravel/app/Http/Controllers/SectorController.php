<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    //
    /**
     * @OA\Get(
     *     path="/api/sectors",
     *     summary="Obté tots els sectors disponibles",
     *     description="Recupera la llista de tots els sectors registrats al sistema.",
     *     operationId="getAllSectors",
     *     tags={"Sectors"},
     *     @OA\Response(
     *         response=200,
     *         description="Llista de sectors obtinguda correctament",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Tecnologia"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T12:00:00Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T12:00:00Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getSectors()
    {
        $sectors = Sector::all();

        return response()->json([
            'status' => 'success',
            'data' => $sectors
        ]);
    }
}
