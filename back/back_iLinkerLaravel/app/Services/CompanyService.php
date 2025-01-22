<?php

namespace App\Services;

use App\Models\Company;

class CompanyService
{
    public function ___construct()
    {

    }

    public function createCompany($data)
    {

        $company = new Company();

        $company->user_id = $data['id'];

        $company->name = null;
        $company->CIF = null;
        $company->num_people= null;
        $company->logo = null;
        $company->short_description = null;
        $company->description = null;
        $company->email = null;
        $company->phone = null;
        $company->website = null;

        $company->responsible_name = $data['name'];

        $company->responsible_phone = null;
        $company->responsible_email = $data['email'];

        $company->company_position = null;
        $company->address = null;
        $company->city = null;
        $company->postal_code = null;
        $company->country = null;

        $company->save();

        return $company;
    }

    public function updateCompany($data)
    {
        $company = Company::findOrFail($data['id']);

        $company->name = $data['name'];
        $company->CIF = $data['CIF'];
        $company->num_people= $data['num_people'];
        $company->logo = $data['logo'];
        $company->short_description = $data['short_description'];
        $company->description = $data['description'];
        $company->email = $data['email'];
        $company->phone = $data['phone'];
        $company->website = $data['website'];
        $company->responsible_phone = $data['responsible_phone'];
        $company->company_position = $data['company_position'];
        $company->address = $data['address'];
        $company->city = $data['city'];
        $company->postal_code = $data['postal_code'];
        $company->country = $data['country'];

        $company->save();

        return $company;
    }

    public function checkIFCompanyExists($companyData)
    {
        return Company::where('name', '=', $companyData['name'])->exists();

    }
}
