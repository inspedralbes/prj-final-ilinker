<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'visibility',
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

    protected $appends = ['is_liked', 'user_details'];

    // Relaciรณn con el usuario que creรณ la publicaciรณn
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relaciรณn con los medios asociados a la publicaciรณn
    public function media()
    {
        return $this->hasMany(PublicationMedia::class, 'publication_id', 'id');
    }

    // Relación con los comentarios de la publicación
    public function comments()
    {
        return $this->hasMany(PublicationComment::class)
            ->whereNull('parent_comment_id')
            ->with([
                'user:id,name,rol',
                'user.student:id,user_id,name,photo_pic,uuid',
                'user.company:id,user_id,name,logo,slug',
                'user.institutions:id,user_id,name,logo,slug',
                'replies.user.student:id,user_id,name,photo_pic,uuid',
                'replies.user.company:id,user_id,name,logo,slug',
                'replies.user.institutions:id,user_id,name,logo,slug',
            ])
            ->orderBy('created_at', 'desc');
    }

    // Relaciรณn con los likes de la publicaciรณn
    public function likes()
    {
        return $this->hasMany(PublicationLike::class);
    }

    // Verifica si el usuario actual ha dado like a la publicaciรณn
    public function getIsLikedAttribute()
    {
        if (!Auth::check()) {
            return false;
        }
        return $this->likes()->where('user_id', Auth::id())->exists();
    }

    // Obtiene los detalles del usuario que creรณ la publicaciรณn
    public function getUserDetailsAttribute()
    {
        return $this->user()->with(['student', 'company', 'institutions'])->select('id', 'name', 'rol')->first();
    }

    // Obtiene los comentarios principales (sin padre)
    public function parentComments()
    {
        return $this->comments()->whereNull('parent_comment_id');
    }

    // Scope para publicaciones pรบblicas
    public function scopePublic($query)
    {
        return $query->where('visibility', 'public');
    }

    // Scope para publicaciones publicadas
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    // relacion con guardar publicaciones
    public function savedPublications()
    {
        return $this->hasMany(PublicationSaved::class);
    }

    // Relación con las publicaciones compartidas
    public function sharedPublications()
    {
        return $this->hasMany(SharedPublication::class, 'original_publication_id');
    }

    // Verificar si la publicación ha sido compartida por el usuario actual
    public function getIsSharedAttribute()
    {
        if (!Auth::check()) {
            return false;
        }
        return $this->sharedPublications()->where('user_id', Auth::id())->exists();
    }
}
