<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CambiarContraseña extends Model
{

    // protected $table = 'cambiar_contrasenas';
    protected $fillable = [
        'email',
        'code',
        'expires_at',
    ];

    protected $dates = [
        'expires_at',
    ];
}
