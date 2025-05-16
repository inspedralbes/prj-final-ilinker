<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedPublication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'original_publication_id',
        'content'
    ];

    /**
     * Obtiene el usuario que compartió la publicación
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtiene la publicación original que fue compartida
     */
    public function originalPublication()
    {
        return $this->belongsTo(Publication::class, 'original_publication_id');
    }

    protected $with = ['user', 'originalPublication'];
} 