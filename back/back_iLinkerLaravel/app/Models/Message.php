<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    //
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sender_id',
        'content',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    // Relación con el remitente del mensaje
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Relación polimórfica para poder asociar el mensaje a un chat directo o a una sala
    public function messageable()
    {
        return $this->morphTo();
    }

    // Relación con los archivos adjuntos del mensaje
    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }

    // Método para determinar si el mensaje es directo o de sala
    public function isDirectMessage()
    {
        return $this->messageable_type === DirectChat::class;
    }

    // Método para marcar el mensaje como leído
    public function markAsRead()
    {
        return $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }
}
