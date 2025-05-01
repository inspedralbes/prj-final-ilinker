<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectChat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'user_one_last_read',
        'user_two_last_read',
    ];

    protected $casts = [
        'user_one_last_read' => 'datetime',
        'user_two_last_read' => 'datetime',
    ];

    // Relación con el primer usuario
    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    // Relación con el segundo usuario
    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    // Relación con los mensajes del chat directo (polimórfica)
    public function messages()
    {
        return $this->morphMany(Message::class, 'messageable')->orderBy('created_at');
    }

    // Método para obtener el otro usuario en la conversación
    public function getOtherUser($userId)
    {
        return $userId == $this->user_one_id ? $this->userTwo : $this->userOne;
    }

    // Método para marcar los mensajes como leídos por un usuario
    public function markAsReadByUser($userId)
    {
        $now = now();

        if ($userId == $this->user_one_id) {
            $this->update(['user_one_last_read' => $now]);
        } else if ($userId == $this->user_two_id) {
            $this->update(['user_two_last_read' => $now]);
        }

        // Actualizar los mensajes no leídos enviados por el otro usuario
        $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => $now
            ]);
    }

    // Método para contar mensajes no leídos por un usuario
    public function unreadMessagesCount($userId)
    {
        $lastRead = $userId == $this->user_one_id ?
            $this->user_one_last_read :
            $this->user_two_last_read;

        $query = $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false);

        if ($lastRead) {
            $query->where('created_at', '>', $lastRead);
        }

        return $query->count();
    }
}
