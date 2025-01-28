<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Institutions;

class InstitutionService
{
    public function ___construct()
    {

    }

    public function createInstitution($data, $institutions)
    {
        $institution = new Institutions();

        $institution->user_id = $data['id'];
        $institution->name = $institutions['name'];
        $institution->NIF = $institutions['NIF'];
        $institution->type = $institutions['type'];
        $institution->academic_sector = $institutions['academic_sector'];
        $institution->logo = $institutions['logo'];
        $institution->phone = $institutions['phone'];
        $institution->email = $institutions['email'];
        $institution->website = $institutions['website'];
        $institution->responsible_name = $data['name'];
        $institution->responsible_phone = $institutions['responsible_phone'];
        $institution->responsible_email = $data['email'];
        $institution->institution_position = $institutions['institution_position'];
        $institution->address = $institutions['address'];
        $institution->city = $institutions['city'];
        $institution->country = $institutions['country'];
        $institution->postal_code = $institutions['postal_code'];

        $institution->save();

        return $institution;

    }

    public function updateInstitution($institution, $data)
    {
        $institution = Institutions::findOrFail($data['id']);
        $institution->name = $institution['name'];
        $institution->NIF = $institution['NIF'];
        $institution->type = $institution['type'];
        $institution->academic_sector = $institution['academic_sector'];
        $institution->logo = $institution['logo'];
        $institution->phone = $institution['phone'];
        $institution->email = $institution['email'];
        $institution->website = $institution['website'];
        $institution->responsible_phone = $institution['responsible_phone'];
        $institution->institution_position = $institution['institution_position'];
        $institution->address = $institution['address'];
        $institution->city = $institution['city'];
        $institution->country = $institution['country'];
        $institution->postal_code = $institution['postal_code'];

        $institution->save();

        return $institution;
    }

    public function deleteInstitution($id)
    {
        $institution = Institutions::findOrFail($id);
        $institution->delete();

        return $institution;
    }

    public function getInstitution($id)
    {
        $institution = Institutions::findOrFail($id);
        return $institution;
    }

    public function checkIFInstitutionExists($data)
    {
        return Institutions::where('name', '=', $data['name'])->exists();

    }
}
