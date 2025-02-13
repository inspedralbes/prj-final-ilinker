<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

            $companyToCheck = Company::findOrFail($idCompany);

            if($companyToCheck->user_id === $idUserLoged){
                return response()->json([
                    'status'  => 'success',
                    'message' => 'El usuario es dueño de la compañia',
                    'admin' => true
                ]);
            }else{
                return response()->json([
                    'status'  => 'success',
                    'message' => 'El usuario no es dueño de la compañia',
                    'admin' => false
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
