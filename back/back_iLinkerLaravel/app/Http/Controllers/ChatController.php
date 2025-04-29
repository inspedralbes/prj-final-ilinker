<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\DirectChat;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // Obtener todas las salas de chat disponibles para el usuario
    public function getChatRooms()
    {
        $user = Auth::user();
        $chatRooms = $user->chatRooms()->with('creator')->get();

        return response()->json([
            'chat_rooms' => $chatRooms
        ]);
    }

    // Crear una nueva sala de chat
    public function createChatRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_private' => 'boolean',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $user = Auth::user();

        $chatRoom = ChatRoom::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_private' => $request->is_private ?? false,
            'created_by' => $user->id
        ]);

        // Agregar al creador como administrador
        $chatRoom->users()->attach($user->id, ['role' => 'admin']);

        // Agregar otros usuarios si se especificaron
        if ($request->has('user_ids')) {
            foreach ($request->user_ids as $userId) {
                if ($userId != $user->id) {
                    $chatRoom->users()->attach($userId, ['role' => 'member']);
                }
            }
        }

        return response()->json([
            'message' => 'Chat room created successfully',
            'chat_room' => $chatRoom->load('creator', 'users')
        ], 201);
    }

    // Obtener detalles de una sala específica con sus mensajes
    public function getChatRoomDetails($id)
    {
        $user = Auth::user();
        $chatRoom = ChatRoom::with(['creator', 'users'])->findOrFail($id);

        // Verificar si el usuario pertenece a esta sala
        if (!$chatRoom->isMember($user->id)) {
            return response()->json([
                'message' => 'You are not a member of this chat room'
            ], 403);
        }

        // Obtener mensajes de la sala
        $messages = $chatRoom->messages()
            ->with(['sender', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        // Actualizar la marca de última lectura
        $chatRoom->users()->updateExistingPivot($user->id, [
            'last_read_at' => now()
        ]);

        return response()->json([
            'chat_room' => $chatRoom,
            'messages' => $messages
        ]);
    }

    // Enviar un mensaje a una sala de chat
    public function sendMessageToChatRoom(Request $request, $roomId)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        $user = Auth::user();
        $chatRoom = ChatRoom::findOrFail($roomId);

        // Verificar si el usuario pertenece a esta sala
        if (!$chatRoom->isMember($user->id)) {
            return response()->json([
                'message' => 'You are not a member of this chat room'
            ], 403);
        }

        // Crear el mensaje
        $message = new Message([
            'sender_id' => $user->id,
            'content' => $request->content,
        ]);

        $chatRoom->messages()->save($message);

        // Cargar relaciones
        $message->load('sender');

        // Aquí se podría implementar la emisión a través de websockets
        // event(new NewMessageEvent($chatRoom, $message));

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }

    // Obtener todos los chats directos del usuario
    public function getDirectChats()
    {
        $user = Auth::user();

        // Obtener todos los chats directos donde el usuario es participante
        $directChats = DirectChat::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->get();

        $formattedChats = [];

        foreach ($directChats as $chat) {
            $otherUser = $chat->getOtherUser($user->id);
            $unreadCount = $chat->unreadMessagesCount($user->id);

            $lastMessage = $chat->messages()
                ->orderBy('created_at', 'desc')
                ->first();

            $formattedChats[] = [
                'id' => $chat->id,
                'user' => $otherUser,
                'unread_count' => $unreadCount,
                'last_message' => $lastMessage,
                'updated_at' => $chat->updated_at
            ];
        }

        // Ordenar por el último mensaje
        usort($formattedChats, function ($a, $b) {
            return $b['updated_at'] <=> $a['updated_at'];
        });

        return response()->json([
            'direct_chats' => $formattedChats
        ]);
    }

    // Obtener o crear un chat directo con otro usuario
    public function getOrCreateDirectChat($userId)
    {
        $user = Auth::user();
        $otherUser = User::findOrFail($userId);

        // Verificar si ya existe un chat directo entre estos usuarios
        $directChat = $user->getDirectChatWith($userId);

        // Si no existe, crear uno nuevo
        if (!$directChat) {
            $directChat = DirectChat::create([
                'user_one_id' => $user->id,
                'user_two_id' => $otherUser->id
            ]);
        }

        // Obtener mensajes
        $messages = $directChat->messages()
            ->with(['sender', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        // Marcar mensajes como leídos
        $directChat->markAsReadByUser($user->id);

        return response()->json([
            'direct_chat' => [
                'id' => $directChat->id,
                'user' => $otherUser,
            ],
            'messages' => $messages
        ]);
    }

    // Enviar un mensaje directo a otro usuario
    public function sendDirectMessage(Request $request, $userId)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        $user = Auth::user();
        $otherUser = User::findOrFail($userId);

        // Obtener o crear chat directo
        $directChat = $user->getDirectChatWith($userId);

        if (!$directChat) {
            $directChat = DirectChat::create([
                'user_one_id' => $user->id,
                'user_two_id' => $otherUser->id
            ]);
        }

        // Crear mensaje
        $message = new Message([
            'sender_id' => $user->id,
            'content' => $request->content,
        ]);

        $directChat->messages()->save($message);

        // Actualizar fecha del chat
        $directChat->touch();

        // Cargar el remitente
        $message->load('sender');

        // Aquí se podría implementar la emisión a través de websockets
        // event(new NewDirectMessageEvent($directChat, $message));

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }

    // Marcar un chat directo como leído
    public function markDirectChatAsRead($chatId)
    {
        $user = Auth::user();
        $directChat = DirectChat::findOrFail($chatId);

        // Verificar que el usuario es parte de este chat
        if ($directChat->user_one_id != $user->id && $directChat->user_two_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized action'
            ], 403);
        }

        $directChat->markAsReadByUser($user->id);

        return response()->json([
            'message' => 'Chat marked as read'
        ]);
    }
}
