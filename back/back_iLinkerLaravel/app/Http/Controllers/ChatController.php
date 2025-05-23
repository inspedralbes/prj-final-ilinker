<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\Company;
use App\Models\DirectChat;
use App\Models\Institutions;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


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

    /**
     * @OA\Get(
     *     path="/api/direct-chats",
     *     summary="Obtiene todos los chats directos del usuario autenticado",
     *     description="Devuelve todos los chats directos en los que el usuario autenticado participa, incluyendo información del otro usuario, cantidad de mensajes no leídos, último mensaje, y estados de guardado y favorito.",
     *     operationId="getDirectChats",
     *     tags={"Chats"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de chats directos obtenida correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="direct_chats",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=2),
     *                         @OA\Property(property="name", type="string", example="Nombre del otro usuario")
     *                     ),
     *                     @OA\Property(property="unread_count", type="integer", example=3),
     *                     @OA\Property(
     *                         property="last_message",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=45),
     *                         @OA\Property(property="content", type="string", example="Último mensaje enviado"),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T12:34:56Z")
     *                     ),
     *                     @OA\Property(property="isBookedMarked", type="boolean", example=true),
     *                     @OA\Property(property="isSaved", type="boolean", example=false),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T12:34:56Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
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

            $lastMessage = $chat
                ->messages()
                ->latest()          // alias de orderBy('created_at','desc')
                ->reorder('created_at', 'desc')  // fuerza que sólo quede este ORDER BY
                ->first();

            if ($user->id === $chat->user_one_id) {
                $isSaved = $chat->is_saved_user_one;
                $isBookedMarked = $chat->is_bookmarked_user_one;
            } else {
                $isSaved = $chat->is_saved_user_two;
                $isBookedMarked = $chat->is_bookmarked_user_two;
            }

            $formattedChats[] = [
                'id' => $chat->id,
                'user' => $otherUser,
                'unread_count' => $unreadCount,
                'last_message' => $lastMessage,
                'isBookedMarked' => $isBookedMarked,
                'isSaved' => $isSaved,
                'updated_at' => $chat->updated_at
            ];
        }

        // Ordenar por el último mensaje
        usort($formattedChats, function ($a, $b) {
            return $b['updated_at'] <=> $a['updated_at'];
        });

        return response()->json([
            'status' => 'success',
            'direct_chats' => $formattedChats
        ]);
    }


    // Obtener o crear un chat directo con otro usuario

    /**
     * @OA\Get(
     *     path="/api/direct-chats/{userId}",
     *     summary="Obtiene o crea un chat directo con otro usuario",
     *     description="Obtiene un chat directo entre el usuario autenticado y otro usuario. Si no existe, lo crea. Carga relaciones según el rol del otro usuario e incluye los últimos 50 mensajes, marcando como leídos los mensajes no leídos.",
     *     operationId="getOrCreateDirectChat",
     *     tags={"Chats"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="ID del otro usuario con el que se desea iniciar o recuperar el chat directo",
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Chat directo recuperado o creado con éxito",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="direct_chat",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=123),
     *                 @OA\Property(property="user_one_id", type="integer", example=1),
     *                 @OA\Property(property="user_two_id", type="integer", example=2),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=2),
     *                     @OA\Property(property="rol", type="string", example="student"),
     *                     @OA\Property(
     *                         property="student",
     *                         type="object",
     *                         description="Datos del estudiante (si el usuario es estudiante)"
     *                     ),
     *                     @OA\Property(
     *                         property="company",
     *                         type="object",
     *                         description="Datos de la empresa (si el usuario es empresa)"
     *                     ),
     *                     @OA\Property(
     *                         property="institution",
     *                         type="object",
     *                         description="Datos de la institución (si el usuario autenticado es institución)"
     *                     )
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="messages",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=1),
     *                 @OA\Property(property="per_page", type="integer", example=50),
     *                 @OA\Property(property="total", type="integer", example=1),
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=456),
     *                         @OA\Property(property="content", type="string", example="Mensaje de ejemplo"),
     *                         @OA\Property(
     *                             property="sender",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="name", type="string", example="Usuario remitente")
     *                         ),
     *                         @OA\Property(
     *                             property="attachments",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object"
     *                             )
     *                         ),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-22T13:45:00Z")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getOrCreateDirectChat($userId)
    {
        $user = Auth::user();
        $otherUser = User::findOrFail($userId);

        if ($otherUser->rol === "company") {
            $company = Company::where('user_id', $otherUser->id)->first();
            $otherUser->company = $company;
        }

        if ($otherUser->rol === 'student') {
            $student = Student::where('user_id', $otherUser->id)->first();
            $otherUser->student = $student;
        }

        if ($user->rol === 'institutions') {
            $institution = Institutions::where('user_id', $otherUser->id)->first();
            $otherUser->institution = $institution;
        }


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

        $directChat->user = $otherUser;

        return response()->json([
            'status' => 'success',
            'direct_chat' => $directChat,
            'messages' => $messages
        ]);
    }

    // Enviar un mensaje directo a otro usuario

    /**
     * @OA\Post(
     *     path="/api/direct-chats/send-message",
     *     summary="Envía un mensaje directo a uno o más usuarios",
     *     description="Crea o recupera un chat directo por cada destinatario, envía el mensaje, actualiza los chats del usuario autenticado, y genera notificaciones.",
     *     operationId="sendDirectMessage",
     *     tags={"Chats"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content", "user_ids"},
     *             @OA\Property(property="content", type="string", example="Hola, ¿cómo estás?"),
     *             @OA\Property(
     *                 property="user_ids",
     *                 type="array",
     *                 @OA\Items(type="integer", example=34)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Mensaje enviado y chats actualizados correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="direct_chats",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=12),
     *                     @OA\Property(property="user", type="object", @OA\Property(property="id", type="integer", example=34), @OA\Property(property="name", type="string", example="Juan Pérez")),
     *                     @OA\Property(property="unread_count", type="integer", example=2),
     *                     @OA\Property(property="last_message", type="object", @OA\Property(property="id", type="integer", example=55), @OA\Property(property="content", type="string", example="Hola!"), @OA\Property(property="sender_id", type="integer", example=1)),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-05-22T10:00:00Z")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="dataChat",
     *                 type="object",
     *                 @OA\Property(property="status", type="string", example="success"),
     *                 @OA\Property(property="chat_id", type="integer", example=12),
     *                 @OA\Property(property="recipient_id", type="integer", example=34),
     *                 @OA\Property(
     *                     property="message",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=55),
     *                     @OA\Property(property="content", type="string", example="Hola!"),
     *                     @OA\Property(property="sender_id", type="integer", example=1)
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="content", type="array", @OA\Items(type="string", example="El contenido es obligatorio.")),
     *                 @OA\Property(property="user_ids", type="array", @OA\Items(type="string", example="Debes indicar al menos un destinatario."))
     *             )
     *         )
     *     )
     * )
     */
    public function sendDirectMessage(Request $request)
    {
        // 1) Definir reglas y mensajes
        $rules = [
            'content' => 'required|string',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'integer|distinct|exists:users,id',
        ];

        $messages = [
            'content.required' => 'El contenido es obligatorio.',
            'user_ids.required' => 'Debes indicar al menos un destinatario.',
            'user_ids.array' => 'Los destinatarios deben enviarse como array.',
            'user_ids.min' => 'Debes indicar al menos un destinatario.',
            'user_ids.*.integer' => 'Cada destinatario debe ser un ID numérico.',
            'user_ids.*.distinct' => 'No pueden repetirse destinatarios.',
            'user_ids.*.exists' => 'El usuario :input no existe.',
        ];

        // 2) Crear validador
        $validator = Validator::make($request->all(), $rules, $messages);

        // 3) Si falla, devolver JSON con errores
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // 4) Validación exitosa: recuperamos los datos validados
        $validated = $validator->validated();
        $content = $validated['content'];
        $recipientIds = $validated['user_ids'];

        $me = Auth::user();
        $sent = [];

        foreach ($recipientIds as $otherId) {
            // 2) Obtener o crear chat directo
            $directChat = $me->getDirectChatWith($otherId)
                ?: DirectChat::create([
                    'user_one_id' => min($me->id, $otherId),
                    'user_two_id' => max($me->id, $otherId),
                ]);

            // 3) Crear y guardar el mensaje
            $message = new Message([
                'sender_id' => $me->id,
                'content' => $content,
            ]);
            $directChat->messages()->save($message);

            // 4) Actualizar timestamp del chat
            $directChat->touch();

            // 5) Cargar relacion 'sender' para incluir datos en la respuesta
            $message->load('sender');


            $sent[] = [
                'recipient_id' => $otherId,
                'chat_id' => $directChat->id,
                'message' => $message,
            ];
        }

        // 6) Recoger direct chats

        // Obtener todos los chats directos donde el usuario es participante
        $directChats = DirectChat::where('user_one_id', $me->id)
            ->orWhere('user_two_id', $me->id)
            ->get();

        $formattedChats = [];

        foreach ($directChats as $chat) {
            $otherUser = $chat->getOtherUser($me->id);
            $unreadCount = $chat->unreadMessagesCount($me->id);

            $lastMessage = $chat
                ->messages()
                ->latest()          // alias de orderBy('created_at','desc')
                ->reorder('created_at', 'desc')  // fuerza que sólo quede este ORDER BY
                ->first();

            $formattedChats[] = [
                'id' => $chat->id,
                'user' => $otherUser,
                'unread_count' => $unreadCount,
                'last_message' => $lastMessage,
                'updated_at' => $chat->updated_at
            ];

            // 7) Crear notificacion de nuevo mensaje
            $newNotification = new Notification();
            $newNotification->user_id = $otherUser->id;
            $newNotification->type = "new_message";
            $newNotification->title = "Haz recibido un nuevo mensaje";
            $newNotification->message = $content;
            $newNotification->icon = "MessageCircle";
            $newNotification->save();
        }

        // Ordenar por el último mensaje
        usort($formattedChats, function ($a, $b) {
            return $b['updated_at'] <=> $a['updated_at'];
        });

        // Si solo hay un destinatario, devolvemos directamente el mensaje para actualización en tiempo real
        $dataChat = null;
        if (count($sent) === 1) {
            $dataChat = [
                'status' => 'success',
                'chat_id' => $sent[0]['chat_id'],
                'recipient_id' => $sent[0]['recipient_id'],
                'message' => $sent[0]['message'],
            ];
        }


        return response()->json([
            'status' => 'success',
            'direct_chats' => $formattedChats,
            'dataChat' => $dataChat,
        ]);

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


    /**
     * @OA\Get(
     *     path="/api/direct-chats/suggested-contacts",
     *     summary="Obtiene usuarios sugeridos y más contactos para iniciar chats directos",
     *     description="Devuelve usuarios sugeridos basados en habilidades compartidas con el usuario autenticado y una lista adicional de contactos excluyendo a los sugeridos y al propio usuario.",
     *     operationId="getSuggestedDirectChatContacts",
     *     tags={"Chats"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Usuarios sugeridos y más contactos obtenidos correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="suggested_all",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=5),
     *                     @OA\Property(property="uuid", type="string", example="uuid-ejemplo"),
     *                     @OA\Property(property="slug", type="string", example="slug-ejemplo"),
     *                     @OA\Property(property="user_id", type="integer", example=10),
     *                     @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                     @OA\Property(
     *                         property="skills",
     *                         type="array",
     *                         @OA\Items(type="string", example="PHP")
     *                     ),
     *                     @OA\Property(property="avatar", type="string", example="https://url-a-avatar.com/imagen.jpg"),
     *                     @OA\Property(property="type", type="string", example="student")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="more_contacts",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=7),
     *                     @OA\Property(property="uuid", type="string", example="uuid-otro-ejemplo"),
     *                     @OA\Property(property="slug", type="string", example="slug-otro-ejemplo"),
     *                     @OA\Property(property="user_id", type="integer", example=20),
     *                     @OA\Property(property="name", type="string", example="Empresa XYZ"),
     *                     @OA\Property(
     *                         property="skills",
     *                         type="array",
     *                         @OA\Items(type="string", example="React")
     *                     ),
     *                     @OA\Property(property="avatar", type="string", example="https://url-a-avatar.com/logo.png"),
     *                     @OA\Property(property="type", type="string", example="company")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error")
     *         )
     *     )
     * )
     */
    public function suggestedDirectChat()
    {
        try {
            $me = Auth::user();

            // 1) IDs de mis skills según mi rol
            if ($me->rol === 'company') {
                $model = Company::with('skills');
                $identifier = 'user_id';
            } else {
                $model = Student::with('skills');
                $identifier = 'user_id';
            }

            $mine = $model->where($identifier, $me->id)->firstOrFail();
            $mySkillIds = $mine->skills->pluck('id')->toArray();

            // Closure genérico para formatear Student o Company
            $formatter = fn($item, string $type) => [
                'id' => $item->id,
                'uuid' => $item->uuid ?? null,
                'slug' => $item->slug ?? null,
                'user_id' => $item->user_id,
                'name' => $item->name,
                'skills' => $item->skills->pluck('name')->toArray(),
                'avatar' => $item->photo_pic ?? $item->logo,
                'type' => $type,
            ];

            // 2) Usuarios sugeridos que compartan al menos un skill Y estén activos
            $studentsQuery = Student::with('skills')
                ->where('user_id', '!=', $me->id)
                ->whereHas('skills', fn($q) => $q->whereIn('skills.id', $mySkillIds))
                ->whereHas('user', fn($q) => $q->where('active', 1));

            $companiesQuery = Company::with('skills')
                ->where('user_id', '!=', $me->id)
                ->whereHas('skills', fn($q) => $q->whereIn('skills.id', $mySkillIds))
                ->whereHas('user', fn($q) => $q->where('active', 1));

            $suggestedStudents = $studentsQuery->get()->map(fn($s) => $formatter($s, 'student'));
            $suggestedCompanies = $companiesQuery->get()->map(fn($c) => $formatter($c, 'company'));
            $suggestedAll = $suggestedStudents->merge($suggestedCompanies)->values();

            // 3) “Más contactos”: todos los demás excluyendo los ya sugeridos y que estén activos
            $excludedUserIds = array_merge(
                [$me->id],
                $suggestedAll->pluck('user_id')->toArray()
            );

            $moreStudents = Student::with('skills')
                ->whereHas('user', fn($q) => $q->where('active', 1))
                ->whereNotIn('user_id', $excludedUserIds)
                ->get()
                ->map(fn($s) => $formatter($s, 'student'));

            $moreCompanies = Company::with('skills')
                ->whereHas('user', fn($q) => $q->where('active', 1))
                ->whereNotIn('user_id', $excludedUserIds)
                ->get()
                ->map(fn($c) => $formatter($c, 'company'));

            $moreContacts = $moreStudents->merge($moreCompanies)->values();

            return response()->json([
                'status' => 'success',
                'suggested_all' => $suggestedAll,
                'more_contacts' => $moreContacts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/direct-chats/{directChatId}/toggle-bookmark",
     *     summary="Marca o desmarca un chat directo como favorito (bookmarked)",
     *     description="Invierte el estado del bookmark para el usuario autenticado en el chat especificado.",
     *     operationId="toggleBookmarkDirectChat",
     *     tags={"Chats"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="directChatId",
     *         in="path",
     *         required=true,
     *         description="ID del chat directo a marcar o desmarcar",
     *         @OA\Schema(type="integer", example=15)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Chat actualizado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="direct_chat",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=15),
     *                 @OA\Property(property="user_one_id", type="integer", example=3),
     *                 @OA\Property(property="user_two_id", type="integer", example=7),
     *                 @OA\Property(property="is_bookmarked_user_one", type="boolean", example=true),
     *                 @OA\Property(property="is_bookmarked_user_two", type="boolean", example=false)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Chat no encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No se encontró el chat directo con el ID proporcionado.")
     *         )
     *     )
     * )
     */
    public function bookMarkDirectChat($directChatId)
    {
        $user = Auth::user();

        $directChat = DirectChat::findOrFail($directChatId);
        if ($user->id === $directChat->user_one_id) {
            $directChat->is_bookmarked_user_one = !$directChat->is_bookmarked_user_one;
            $directChat->save();
        } else {
            $directChat->is_bookmarked_user_two = !$directChat->is_bookmarked_user_two;
            $directChat->save();
        }

        return response()->json([
            'status' => 'success',
            'direct_chat' => $directChat,
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/direct-chats/{directChatId}/toggle-save",
     *     summary="Marca o desmarca un chat directo como guardado",
     *     description="Invierte el estado de guardado (saved) del chat directo para el usuario autenticado.",
     *     operationId="toggleSaveDirectChat",
     *     tags={"Chats"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="directChatId",
     *         in="path",
     *         required=true,
     *         description="ID del chat directo que se desea marcar o desmarcar como guardado",
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Chat actualizado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="direct_chat",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=12),
     *                 @OA\Property(property="user_one_id", type="integer", example=5),
     *                 @OA\Property(property="user_two_id", type="integer", example=8),
     *                 @OA\Property(property="is_saved_user_one", type="boolean", example=true),
     *                 @OA\Property(property="is_saved_user_two", type="boolean", example=false)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Chat no encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No se encontró el chat directo con el ID especificado.")
     *         )
     *     )
     * )
     */
    public function savedDirectChat($directChatId)
    {
        $user = Auth::user();

        $directChat = DirectChat::findOrFail($directChatId);
        if ($user->id === $directChat->user_one_id) {
            $directChat->is_saved_user_one = !$directChat->is_saved_user_one;
            $directChat->save();
        } else {
            $directChat->is_saved_user_two = !$directChat->is_saved_user_two;
            $directChat->save();
        }


        return response()->json([
            'status' => 'success',
            'direct_chat' => $directChat,
        ]);
    }
}
