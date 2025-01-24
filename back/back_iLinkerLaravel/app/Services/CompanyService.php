<?php

namespace App\Services;

use App\Models\Company;

class CompanyService
{
    public function ___construct()
    {

    }

    public function createCompany($data, $dataCompany)
    {
        $company = new Company();

        $company->user_id = $data['id'];

        $company->name = $dataCompany['name'];
        $company->CIF = $dataCompany['CIF'];
        $company->num_people= $dataCompany['num_people'];
        $company->logo = $dataCompany['logo'];
        $company->short_description = $dataCompany['short_description'];
        $company->description = $dataCompany['description'];
        $company->email = $dataCompany['email'];
        $company->phone = $dataCompany['phone'];
        $company->website = $dataCompany['website'];

        $company->responsible_name = $data['name'];

        $company->responsible_phone = $dataCompany['responsible_phone'];
        $company->responsible_email = $data['email'];

        $company->company_position = $dataCompany['company_position'];
        $company->address = $dataCompany['address'];
        $company->city = $dataCompany['city'];
        $company->postal_code = $dataCompany['postal_code'];
        $company->country = $dataCompany['country'];

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

    public function deleteCompany($id)
    {
        $company = Company::findOrFail($id);
        $company->delete();

        return $company;
    }

    public function getCompany($id)
    {
        $company = Company::findOrFail($id);
        return $company;
    }

    public function checkIFCompanyExists($companyData)
    {
        return Company::where('name', '=', $companyData['name'])->exists();

    }
}
