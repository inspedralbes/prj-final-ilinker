<?php

namespace App\Services;

use App\Models\Institutions;

class InstitutionService
{
    public function ___construct()
    {

    }

    public function createInstitution($data)
    {
        $institution = new Institutions();
        $institution->user_id = $data['id'];

        $institution->name = null;
        $institution->NIF = null;
        $institution->type = null;
        $institution->academic_sector = null;
        $institution->logo = null;
        $institution->phone = null;
        $institution->email = null;
        $institution->website = null;
        $institution->responsible_name = $data['name'];
        $institution->responsible_phone = null;
        $institution->responsible_email = $data['email'];
        $institution->institution_position = null;
        $institution->address = null;
        $institution->city = null;
        $institution->country = null;
        $institution->postal_code = null;

        $institution->save();

        return $institution;

    }
}
