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
        $institution->NIF = $institutions['cif_nif'];
        $institution->slug = generateSlug($institutions['name'] ?? null);
        $institution->type = $institutions['type'];
        $institution->academic_sector = $institutions['academic_sector'] ?? null;
        $institution->logo = $institutions['logo'] ?? null;
        $institution->phone = $institutions['phone'];
        $institution->email = $institutions['email'];
        $institution->website = $institutions['website'] ?? null;
        $institution->responsible_name = $data['name'];
        $institution->responsible_phone = $institutions['responsible_phone'] ?? null;
        $institution->responsible_email = $data['email'];
        $institution->institution_position = $institutions['institution_position'] ?? null;
        $institution->address = $institutions['address'];
        $institution->city = $institutions['city'] ?? null;
        $institution->country = $institutions['country'] ?? null;
        $institution->postal_code = $institutions['postal_code'] ?? null;

        $institution->save();

        return $institution;

    }

    public function updateInstitution($institution, $data)
    {
        $institutions = Institutions::findOrFail($data['id']);

        $institutions->name = $institution['name'];
        $institutions->NIF = $institution['NIF'];
        $institutions->type = $institution['type'];
        $institutions->academic_sector = $institution['academic_sector'];
        $institutions->logo = $institution['logo'];
        $institutions->phone = $institution['phone'];
        $institutions->email = $institution['email'];
        $institutions->website = $institution['website'];
        $institutions->responsible_phone = $institution['responsible_phone'];
        $institutions->institution_position = $institution['institution_position'];
        $institutions->address = $institution['address'];
        $institutions->city = $institution['city'];
        $institutions->country = $institution['country'];
        $institutions->postal_code = $institution['postal_code'];

        $institutions->save();

        return $institutions;
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

    public function getInstitutions()
    {
        $institutions = Institutions::all()->map(function ($institution) {
            return [
                'id' => $institution->id,
                'name' => $institution->name,
                'logo' => $institution->logo,
            ];
        });

        return $institutions;
    }

    public function checkIFInstitutionExists($data)
    {
        return Institutions::where('name', '=', $data['name'])->exists();

    }
}
