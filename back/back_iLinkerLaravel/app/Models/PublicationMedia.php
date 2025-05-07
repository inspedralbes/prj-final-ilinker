<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicationMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'publication_id',
        'file_path',
        'media_type',
        'display_order',
    ];

    // Relación con la publicación a la que pertenece este medio
    public function publication()
    {
        return $this->belongsTo(Publication::class, 'publication_id', 'id');
    }
}
