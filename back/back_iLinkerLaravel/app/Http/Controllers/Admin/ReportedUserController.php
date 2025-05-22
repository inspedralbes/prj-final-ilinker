<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class ReportedUserController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/reports",
     *     summary="Obtener todos los reportes",
     *     description="Este endpoint devuelve una lista de todos los reportes realizados en el sistema, incluyendo información sobre el usuario reportado y el reportante.",
     *     operationId="getAllReports",
     *     tags={"Reportes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de reportes",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="reason", type="string", example="Contenido ofensivo"),
     *                 @OA\Property(
     *                     property="reported_user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=5),
     *                     @OA\Property(property="name", type="string", example="Usuario Reportado")
     *                 ),
     *                 @OA\Property(
     *                     property="reporter",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=2),
     *                     @OA\Property(property="name", type="string", example="Usuario Reportante")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-05-01T12:00:00.000000Z")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Report::with(['reportedUser', 'reporter'])
            ->latest()
            ->get();
    }


    /**
     * @OA\Delete(
     *     path="/api/reports/{id}",
     *     summary="Eliminar un reporte",
     *     description="Este endpoint elimina un reporte específico por su ID.",
     *     operationId="deleteReport",
     *     tags={"Reportes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="El ID del reporte a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reporte eliminado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Reporte eliminado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontró el reporte",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No se encontró el reporte")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Reporte eliminado correctamente']);
    }


    /**
     * @OA\Delete(
     *     path="/api/users/{userId}",
     *     summary="Eliminar permanentemente un usuario",
     *     description="Este endpoint elimina un usuario de forma permanente, incluyendo opcionalmente sus reportes asociados.",
     *     operationId="deleteUserPermanently",
     *     tags={"Usuarios"},
     *    security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="El ID del usuario que se desea eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario eliminado permanentemente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Usuario eliminado permanentemente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontró el usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No se encontró el usuario")
     *         )
     *     )
     * )
     */
    public function deleteUser($userId)
    {
        $user = User::findOrFail($userId);
        $user->forceDelete();

        // Opcional: Eliminar también todos sus reportes
        Report::where('reported_user_id', $userId)
            ->orWhere('reported_by_id', $userId)
            ->delete();

        return response()->json([
            'message' => 'Usuario eliminado permanentemente',
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/users/{userId}/ban",
     *     summary="Banear un usuario (desactivarlo)",
     *     description="Este endpoint permite desactivar un usuario (banearlo) estableciendo su estado como inactivo.",
     *     operationId="banUser",
     *     tags={"Usuarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="El ID del usuario que se desea banear",
     *         required=true,
     *         @OA\Schema(type="integer", example=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario baneado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Usuario baneado correctamente"),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=15),
     *                 @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                 @OA\Property(property="email", type="string", example="juan@example.com"),
     *                 @OA\Property(property="active", type="integer", example=0)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontró el usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No se encontró el usuario")
     *         )
     *     )
     * )
     */
    public function banUser($userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['active' => 0]); // Cambia a 0 para desactivar

        return response()->json([
            'message' => 'Usuario baneado correctamente',
            'user' => $user
        ]);
    }
}
