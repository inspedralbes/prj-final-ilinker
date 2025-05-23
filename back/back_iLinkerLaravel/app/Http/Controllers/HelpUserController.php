<?php

namespace App\Http\Controllers;

use App\Models\BlockedUser;
use App\Models\HelpUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class HelpUserController extends Controller
{
    //

    /**
     * @OA\Post(
     *     path="/api/support",
     *     summary="Enviar incidencia o solicitud de ayuda",
     *     description="Este endpoint permite a un usuario autenticado enviar una solicitud de ayuda o reportar una incidencia. Se requiere un asunto y un mensaje describiendo la situación.",
     *     operationId="sendSupportRequest",
     *     tags={"Ayuda"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"subject", "message"},
     *             @OA\Property(property="subject", type="string", example="Problema con la publicación"),
     *             @OA\Property(property="message", type="string", example="No puedo subir imágenes en la sección de publicaciones.")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Incidencia enviada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se envio la insidencia correctamente.")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(
     *                 property="message",
     *                 type="object",
     *                 @OA\Property(
     *                     property="subject",
     *                     type="array",
     *                     @OA\Items(type="string", example="El campo subject es obligatorio.")
     *                 ),
     *                 @OA\Property(
     *                     property="message",
     *                     type="array",
     *                     @OA\Items(type="string", example="El campo message es obligatorio.")
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error interno")
     *         )
     *     )
     * )
     */
    public function sendHelp(Request $request)
    {
        $rules = [
            'subject' => 'required',
            'message' => 'required',
        ];

        $messages = [
            'subject.required' => 'El campo subject es obligatorio.',
            'message.required' => 'El campo message es obligatorio.',
        ];

        $validate = Validator::make($request->all(), $rules, $messages);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validate->errors()
            ]);
        }

        try {
            $help = new HelpUser();
            $help->user_id = Auth::user()->id;
            $help->subject = $request->input('subject');
            $help->message = $request->input('message');
            $help->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Se envio la insidencia correctamente.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/blocked-users",
     *     summary="Obtener mis usuarios bloqueados",
     *     description="Este endpoint devuelve una lista de los usuarios que el usuario autenticado ha bloqueado.",
     *     operationId="getBlockedUsers",
     *     tags={"Usuarios"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Usuarios bloqueados encontrados",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se han encontrado los usuarios bloqueados."),
     *             @OA\Property(
     *                 property="blockedUser",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="user_id", type="integer", example=5),
     *                     @OA\Property(property="blocked_user_id", type="integer", example=7),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=5),
     *                         @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                         @OA\Property(
     *                             property="student",
     *                             type="object",
     *                             @OA\Property(property="user_id", type="integer", example=5),
     *                             @OA\Property(property="name", type="string", example="Juan"),
     *                             @OA\Property(property="photo_pic", type="string", example="url")
     *                         ),
     *                         @OA\Property(property="company", type="string", nullable=true, example=null),
     *                         @OA\Property(property="institutions", type="string", nullable=true, example=null)
     *                     ),
     *                     @OA\Property(
     *                         property="blocked_user",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=7),
     *                         @OA\Property(property="name", type="string", example="Pedro Gómez"),
     *                         @OA\Property(property="student", type="string", nullable=true, example=null),
     *                         @OA\Property(
     *                             property="company",
     *                             type="object",
     *                             @OA\Property(property="user_id", type="integer", example=7),
     *                             @OA\Property(property="name", type="string", example="Empresa XYZ"),
     *                             @OA\Property(property="logo", type="string", example="url")
     *                         ),
     *                         @OA\Property(property="institutions", type="string", nullable=true, example=null)
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function getMyBlockedUsers()
    {
        $me = Auth::user();
        $blockedUser = BlockedUser::with(['user', 'blockedUser', 'user.student', 'user.company', 'user.institutions', 'blockedUser.student', 'blockedUser.company', 'blockedUser.institutions'])
            ->where('user_id', $me->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Se han encontrado los usuarios bloqueados.',
            'blockedUser' => $blockedUser
        ]);
    }
}
