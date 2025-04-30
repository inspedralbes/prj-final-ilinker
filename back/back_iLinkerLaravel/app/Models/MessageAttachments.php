<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageAttachments extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'message_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];

    // Relación con el mensaje al que pertenece el adjunto
    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
