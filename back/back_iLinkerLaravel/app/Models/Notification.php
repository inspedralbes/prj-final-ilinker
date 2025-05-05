<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, HasUuids;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'icon',
        'url',
        'read_at',
    ];

    /**
     * Los atributos que deben ser convertidos.
     *
     * @var array
     */
    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    /**
     * Relación con el usuario al que pertenece la notificación.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Ámbito para las notificaciones no leídas.
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Marcar la notificación como leída.
     */
    public function markAsRead()
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    /**
     * Marcar la notificación como no leída.
     */
    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    /**
     * Marcar todas las notificaciones de un usuario como leídas.
     *
     * @param int $userId
     * @return int Número de notificaciones marcadas como leídas
     */
    public static function markAllAsRead($userId)
    {
        return static::where('user_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    /**
     * Obtener todas las notificaciones de un usuario.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAllForUser($userId)
    {
        return static::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Obtener todas las notificaciones no leídas de un usuario.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUnreadForUser($userId)
    {
        return static::where('user_id', $userId)
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
