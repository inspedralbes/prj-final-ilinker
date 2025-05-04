<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicationsComment extends Model
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
        return $this->belongsTo(Publications::class, 'publication_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(PublicationsComment::class, 'parent_comment_id');
    }

    public function replies()
    {
        return $this->hasMany(PublicationsComment::class, 'parent_comment_id');
    }
}
