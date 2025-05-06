<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Publications extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'location',
        'has_media',
        'comments_enabled',
        'status',
    ];

    protected $casts = [
        'has_media' => 'boolean',
        'comments_enabled' => 'boolean',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

// Relación con el usuario que creó la publicación
public function user()
{
    return $this->belongsTo(User::class);
}

// Relación con los medios asociados a la publicación
public function media()
{
    return $this->hasMany(PublicationMedia::class);
}

// Relación con los comentarios de la publicación
public function comments()
{
    return $this->hasMany(PublicationComment::class);
}

// Relación con los likes de la publicación
public function likes()
{
    return $this->hasMany(PublicationLike::class);
}
}