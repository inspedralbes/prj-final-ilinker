<?php

namespace App\Http\Controllers;

use App\Services\CompanyService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    private $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function update(Request $request){
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:companies,email', // Agregar validación para email único en la tabla companies
            'phone' => 'required',
            'address' => 'required',
            'CIF' => 'nullable|unique:companies,CIF', // Validación para CIF único si es necesario
            'num_people' => 'nullable|integer',
            'logo' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'website' => 'nullable|url',
            'responsible_phone' => 'nullable|string',
            'company_position' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'country' => 'nullable|string',
        ]);
        /*
        $check = $this->companyService->checkIFCompanyExists($validated);
        if($check){
            return response()->json(['status'=>'warning','message' => 'Company already exists']);
        }*/

        $company = $this->companyService->updateCompany($validated);
        return response()->json(['status'=>'success','company' => $company]);
    }

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        $company = $this->companyService->deleteCompany($validated['id']);

        return response()->json(['status'=>'success','company' => $company]);
    }
}
