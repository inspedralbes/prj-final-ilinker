<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfferUser extends Model
{
    //

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'offer_id', 'id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
