<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    /** @use HasFactory<\Database\Factories\OfferFactory> */
    use HasFactory;



    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    // En tu modelo Offer:
    public function usersInterested()
    {
        return $this
            ->belongsToMany(User::class, 'offer_users', 'offer_id', 'user_id')
            ->withPivot(['status', 'cv_attachment', 'cover_letter_attachment', 'availability'])       // <-- aquí le indicas que traiga el campo status
            ->withTimestamps();         // opcional, si tu pivot tiene created_at/updated_at
    }

    public function usersAccepted()
    {
        return $this
            ->belongsToMany(User::class, 'offer_users', 'offer_id', 'user_id')
            ->withPivot(['status', 'cv_attachment', 'cover_letter_attachment', 'availability'])
            ->wherePivot('status', 'accept')
            ->withTimestamps();
    }

    public function usersDeclined()
    {
        return $this
            ->belongsToMany(User::class, 'offer_users', 'offer_id', 'user_id')
            ->withPivot(['status', 'cv_attachment', 'cover_letter_attachment', 'availability'])
            ->wherePivot('status', 'rejected')
            ->withTimestamps();
    }

    public function usersPending()
    {
        return $this
            ->belongsToMany(User::class, 'offer_users', 'offer_id', 'user_id')
            ->withPivot(['status', 'cv_attachment', 'cover_letter_attachment', 'availability'])
            ->wherePivot('status', 'pending')
            ->withTimestamps();
    }

    /**
     * Verifica si un usuario ya ha optado a esta oferta.
     *
     * @param  int  $userId
     * @return bool
     */
    public function hasUserApplied(int $userId): bool
    {
        return $this->usersInterested()
            ->where('offer_users.user_id', $userId)
            ->exists();
    }

    /**
     * Obtener el estado de aplicación de un usuario en esta oferta.
     * Retorna null si no ha aplicado, o la cadena de estado: 'pending', 'accept', 'rejected'.
     *
     * @param  int  $userId
     * @return string|null
     */
    public function getUserApplicationStatus(int $userId): ?string
    {
        $relation = $this->usersInterested()
            ->where('offer_users.user_id', $userId)
            ->first();

        return $relation ? $relation->pivot->status : null;
    }
}
