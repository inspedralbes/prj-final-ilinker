<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_private',
        'created_by',
    ];

    // Relación con el usuario que creó la sala
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relación con los usuarios que pertenecen a la sala
    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_room_user')
            ->withPivot('role', 'last_read_at')
            ->withTimestamps();
    }

    // Relación con los mensajes de la sala (polimórfica)
    public function messages()
    {
        return $this->morphMany(Message::class, 'messageable')->orderBy('created_at');
    }

    // Método para verificar si un usuario es miembro de la sala
    public function isMember($userId)
    {
        return $this->users()->where('users.id', $userId)->exists();
    }

    // Método para verificar si un usuario es administrador de la sala
    public function isAdmin($userId)
    {
        return $this->users()->where('users.id', $userId)
            ->wherePivot('role', 'admin')
            ->exists();
    }
}
