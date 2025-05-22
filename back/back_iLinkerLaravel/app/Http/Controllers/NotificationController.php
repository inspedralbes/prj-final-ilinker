<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Obtener todas las notificaciones del usuario autenticado
     *
     * @return \Illuminate\Http\JsonResponse
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
     * Obtener solo las notificaciones no leídas del usuario autenticado
     *
     * @return \Illuminate\Http\JsonResponse
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
     * Marcar una notificación específica como leída
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\JsonResponse
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
     * Marcar todas las notificaciones del usuario como leídas
     *
     * @return \Illuminate\Http\JsonResponse
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
