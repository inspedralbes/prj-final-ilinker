<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanySector;
use App\Models\CompanySkills;
use App\Models\User;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    private $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

//    public function update(Request $request){
//
//        /*
//        $check = $this->companyService->checkIFCompanyExists($validated);
//        if($check){
//            return response()->json(['status'=>'warning','message' => 'Company already exists']);
//        }*/
//
//        $company = $this->companyService->updateCompany($request);
//        return response()->json(['status'=>'success','company' => $company]);
//    }

    public function update(Request $request)
    {
        Log::info($request->all());

        $company = Company::findOrFail($request->id);

        $company->name = $request->name;
        $company->CIF = $request->CIF;
        $company->num_people = $request->num_people;
        $company->short_description = $request->short_description;
        $company->description = $request->description;
        $company->email = $request->email;
        $company->phone = $request->phone;
        $company->website = $request->website;
        $company->responsible_phone = $request->responsible_phone;
        $company->company_position = $request->company_position;
        $company->address = $request->address;
        $company->city = $request->city;
        $company->postal_code = $request->postal_code;
        $company->country = $request->country;

        if ($request->hasFile('logo')) {
            $fileName = "logo_{$company->id}." . $request->file('logo')->getClientOriginalExtension();
            $path = $request->file('logo')->move(storage_path('app/public/companies'), $fileName);
            $company->logo = "companies/{$fileName}"; // Ruta relativa para servirla correctamente
        }

        if ($request->hasFile('cover_photo')) {
            $fileName = "cover_photo_{$company->id}." . $request->file('cover_photo')->getClientOriginalExtension();
            $path = $request->file('cover_photo')->move(storage_path('app/public/companies'), $fileName);
            $company->cover_photo = "companies/{$fileName}"; // Ruta relativa para servirla correctamente
        }

        $company->save();

        $sectors = json_decode($request->input('sectors'), true); // Convertir a array
        $skills = json_decode($request->input('skills'), true);
        $offers = json_decode($request->input('offers'), true);

        // Guardar sectores
        foreach ($sectors as $sector) {
            $exists = CompanySector::where('company_id', $company->id)
                ->where('sector_id', $sector['id'])
                ->exists();
            if (!$exists) {
                CompanySector::create([
                    'company_id' => $company->id,
                    'sector_id' => $sector['id']
                ]);
            }
        }

        // Guardar skills
        foreach ($skills as $skill) {
            $exists = CompanySkills::where('company_id', $company->id)
                ->where('skill_id', $skill['id'])
                ->exists();
            if (!$exists) {
                CompanySkills::create([
                    'company_id' => $company->id,
                    'skill_id' => $skill['id']
                ]);
            }
        }

        $company = Company::with(['sectors', 'skills', 'offers'])->findOrFail($company->id);
        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'company' => $company
        ]);
    }


    public function getCompany($slug)
    {
        $company = Company::where('slug', $slug)->first();

        if (!$company) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Company not found'
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'company' => $company
        ]);
    }

    public function checkCompanyUser(Request $request)
    {
        $rules = [
            'id_user_loged' => 'required',
            'id_company' => 'required',
        ];

        $messages = [
            'id_user_loged.required' => 'El id del usuario es requerido',
            'id_company.required' => 'El id del company es requerido',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Faltan campos obligatorios o tienen errores',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $idUserLoged = $request->input('id_user_loged');
            $idCompany = $request->input('id_company');

            $companyToCheck = Company::with(['sectors', 'skills', 'offers'])->findOrFail($idCompany);

            if($companyToCheck->user_id === $idUserLoged){
                return response()->json([
                    'status'  => 'success',
                    'message' => 'El usuario es dueño de la compañia',
                    'admin' => true,
                    'company' => $companyToCheck
                ]);
            }else{
                return response()->json([
                    'status'  => 'success',
                    'message' => 'El usuario no es dueño de la compañia',
                    'admin' => false,
                    'company' => $companyToCheck
                ]);
            }

        }catch (\Exception $e){
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

}
