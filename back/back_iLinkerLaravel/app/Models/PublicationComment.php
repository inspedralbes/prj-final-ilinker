<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicationComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'publication_id',
        'user_id',
        'content',
        'parent_comment_id'
    ];

    public function publication()
    {
        return $this->belongsTo(Publication::class, 'publication_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(PublicationComment::class, 'parent_comment_id');
    }

    public function replies()
    {
        return $this->hasMany(PublicationComment::class, 'parent_comment_id')
            ->with(['user:id,name,rol', 'replies' => function($query) {
                $query->with(['user' => fn($q) => $q->select('id', 'name', 'rol'),
                    'user.student' => fn($q) => $q->select('user_id','name','photo_pic','uuid'),
                    'user.company' => fn($q) => $q->select('user_id','name', 'logo','slug'),
                    'user.institutions' => fn($q) => $q->select('user_id','name','logo','slug'),
                    'replies.user.student' => fn($q) => $q->select('user_id','name','photo_pic','uuid'),
                    'replies.user.company' => fn($q) => $q->select('user_id','name','logo','slug'),
                    'replies.user.institutions' => fn($q) => $q->select('user_id','name','logo','slug'),]);
            }])
            ->orderBy('created_at', 'asc');
    }

//return $this->hasMany(PublicationComment::class, 'parent_comment_id')
//->with('user:id,name');
}
