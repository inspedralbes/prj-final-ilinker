<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/notifications",
     *     summary="Obtener todas las notificaciones del usuario autenticado",
     *     description="Devuelve un listado de notificaciones junto con la cantidad de notificaciones no leídas.",
     *     operationId="getUserNotifications",
     *     tags={"Notificaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de notificaciones y conteo de no leídas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="notifications",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="string", example="1"),
     *                         @OA\Property(property="type", type="string", example="App\\Notifications\\SomeNotification"),
     *                         @OA\Property(property="data", type="object"),
     *                         @OA\Property(property="read_at", type="string", nullable=true, example=null),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T10:00:00Z")
     *                     )
     *                 ),
     *                 @OA\Property(property="unread_count", type="integer", example=3)
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $notifications = Notification::getAllForUser(auth()->id());

        return response()->json([
            'success' => true,
            'data' => [
                'notifications' => $notifications,
                'unread_count' => $notifications->whereNull('read_at')->count()
            ]
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/notifications/unread",
     *     summary="Obtener notificaciones no leídas del usuario autenticado",
     *     description="Devuelve un listado de notificaciones que aún no han sido leídas junto con la cantidad total de estas.",
     *     operationId="getUnreadNotifications",
     *     tags={"Notificaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de notificaciones no leídas y su conteo",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="notifications",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="string", example="5"),
     *                         @OA\Property(property="type", type="string", example="App\\Notifications\\SomeNotification"),
     *                         @OA\Property(property="data", type="object"),
     *                         @OA\Property(property="read_at", type="string", nullable=true, example=null),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:00:00Z")
     *                     )
     *                 ),
     *                 @OA\Property(property="unread_count", type="integer", example=5)
     *             )
     *         )
     *     )
     * )
     */
    public function unread()
    {
        $notifications = Notification::getUnreadForUser(auth()->id());

        return response()->json([
            'success' => true,
            'data' => [
                'notifications' => $notifications,
                'unread_count' => $notifications->count()
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/notifications/{notification}/read",
     *     summary="Marcar una notificación como leída",
     *     description="Marca como leída una notificación específica siempre que pertenezca al usuario autenticado.",
     *     operationId="markNotificationAsRead",
     *     tags={"Notificaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Parameter(
     *         name="notification",
     *         in="path",
     *         required=true,
     *         description="El ID de la notificación a marcar como leída",
     *         @OA\Schema(type="string", example="5")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Notificación marcada como leída",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Notificación marcada como leída")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=403,
     *         description="No autorizado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="No autorizado")
     *         )
     *     )
     * )
     */
    public function markAsRead(Notification $notification)
    {
        // Verificar que la notificación pertenezca al usuario actual
        if ($notification->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado'
            ], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída'
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/notifications/mark-all-as-read",
     *     summary="Marcar todas las notificaciones como leídas",
     *     description="Marca como leídas todas las notificaciones pendientes del usuario autenticado.",
     *     operationId="markAllNotificationsAsRead",
     *     tags={"Notificaciones"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Notificaciones marcadas como leídas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="5 notificaciones marcadas como leídas")
     *         )
     *     )
     * )
     */
    public function markAllAsRead()
    {
        $count = Notification::markAllAsRead(auth()->id());

        return response()->json([
            'success' => true,
            'message' => $count . ' notificaciones marcadas como leídas'
        ]);
    }
}
