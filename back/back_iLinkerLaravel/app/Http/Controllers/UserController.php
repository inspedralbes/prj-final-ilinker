<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\CompanyService;
use App\Services\InstitutionService;
use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{

    protected $userService, $companyService, $institutionService;

    public function __construct(UserService $userService, CompanyService $companyService, InstitutionService $institutionService)
    {
        $this->userService = $userService;
        $this->companyService = $companyService;
        $this->institutionService = $institutionService;
    }

    public function create(Request $request){

        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
            'rol' => 'required',
        ]);

        $check = $this->userService->checkIFUserExists($validated);
        if($check){
            return response()->json(['status'=>'warning', "message" => "El usuario ya existe en la base de datos."]);
        }

        $user = $this->userService->createUser($validated);
        $token = $user['token'];


        if($user['user']->rol === 'company')
        {
            $company = $this->companyService->createCompany($user['user']);
            return response()->json(['status'=>'success', 'user'=> $user['user'], 'token' => $token, 'company'=>$company ]);
        }
        elseif ($user['user']->rol === 'institutions') {

            $institution = $this->institutionService->createInstitution($user['user']);
            return response()->json(['status'=>'success', 'user'=> $user['user'], 'token' => $token, 'institution'=>$institution]);

        }

        return response()->json(['status'=>'success', 'user'=> $user['user'], 'token' => $token]);

    }
}
