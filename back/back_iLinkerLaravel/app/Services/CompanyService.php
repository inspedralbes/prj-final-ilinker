<?php

namespace App\Services;

use App\Models\Company;
use App\Models\CompanySector;
use App\Models\CompanySkills;
use Illuminate\Support\Facades\Log;

class CompanyService
{
    public function ___construct()
    {

    }

    public function createCompany($data, $dataCompany)
    {
        $company = new Company();

        $company->user_id = $data['id'];

        $company->name = $dataCompany['name']  ?? null;
        $company->slug = generateSlug($dataCompany['name']);
        $company->CIF = $dataCompany['CIF']  ?? null;
        $company->num_people= $dataCompany['num_people'] ?? null;
        $company->logo = $dataCompany['logo']  ?? null;
        $company->short_description = $dataCompany['short_description'];
        $company->description = $dataCompany['description'] ?? null;
        $company->email = $dataCompany['email'] ?? null;
        $company->phone = $dataCompany['phone']  ?? null;
        $company->website = $dataCompany['website'] ?? null;

        $company->responsible_name = $data['name']  ?? null;

        $company->responsible_phone = $dataCompany['responsible_phone']  ?? null;
        $company->responsible_email = $data['email']  ?? null;

        $company->company_position = $dataCompany['company_position']  ?? null;
        $company->address = $dataCompany['address']  ?? null;
        $company->city = $dataCompany['city']  ?? null;
        $company->postal_code = $dataCompany['postal_code']  ?? null;
        $company->country = $dataCompany['country']  ?? null;

        $company->save();

        return $company;
    }

    public function updateCompany($data)
    {
        Log::info($data);
        $company = Company::findOrFail($data['id']);

        $company->name = $data['name'];
        $company->CIF = $data['CIF'];
        $company->num_people= $data['num_people'];
        if ($data->hasFile('logo')) {
            $fileName = "logo_{$company->id}." . $data->file('logo')->getClientOriginalExtension();
            $path = $data->file('logo')->storeAs("public/companies", $fileName);
            $company->logo = "storage/companies/{$fileName}";
        }

        if ($data->hasFile('cover_photo')) {
            $fileName = "cover_photo_{$company->id}." . $data->file('cover_photo')->getClientOriginalExtension();
            $path = $data->file('cover_photo')->storeAs("public/companies", $fileName);
            $company->cover_photo = "storage/companies/{$fileName}";
        }
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

        $sectors = $data['sectors'];
        $skills = $data['skills'];

        foreach ($sectors as $sector) {
            $checkIfHasSector = CompanySector::where('company_id', $company->id)->where('sector_id', $sector['id'])->first();
            if(!$checkIfHasSector){
                $newCompanySector = new CompanySector();
                $newCompanySector->company_id = $company->id;
                $newCompanySector->sector_id = $sector['id'];
                $newCompanySector->save();
            }
        }
        foreach ($skills as $skil) {
        $checkIfHasSkill = CompanySkills::where('company_id', $company->id)->where('skill_id', $skil['id'])->first();
            if(!$checkIfHasSkill){
                $newCompanySkill = new CompanySkills();
                $newCompanySkill->company_id = $company->id;
                $newCompanySkill->skill_id = $skil['id'];
                $newCompanySkill->save();
            }
        }

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

    public function allCompanys()
    {
        $companies = Company::all();

        return $companies;
    }

    public function checkIFCompanyExists($companyData)
    {
        return Company::where('name', '=', $companyData['name'])->exists();

    }
}
