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
            ->with('user:id,name')
            ->orderBy('created_at', 'asc');
    }
}
