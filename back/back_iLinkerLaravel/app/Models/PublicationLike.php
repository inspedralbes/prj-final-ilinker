<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicationLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'publication_id',
        'user_id'
    ];

    public function publication()
    {
        return $this->belongsTo(Publications::class, 'publication_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
