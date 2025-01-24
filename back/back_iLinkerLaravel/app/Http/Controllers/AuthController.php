<?php

namespace App\Http\Controllers;

use App\Services\CompanyService;
use App\Services\InstitutionService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{


    protected $userService, $companyService, $institutionService;

    public function __construct(UserService $userService, CompanyService $companyService, InstitutionService $institutionService)
    {
        $this->userService = $userService;
        $this->companyService = $companyService;
        $this->institutionService = $institutionService;
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['status' => 'success', 'message' => 'Credentials validated', 'token' => $token, 'user' => $user]);
        }

        return response()->json(['status' => 'error', 'message' => 'Invalid credentials']);

    }

    public function register(Request $request){

        $validated = $request->validate([
            'name' => 'required',
            'surname' => 'required',
            'birthday' => 'required',
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
            $company = $this->companyService->createCompany($user['user'], $request->company );
            return response()->json(['status'=>'success', 'user'=> $user['user'], 'token' => $token, 'company'=>$company ]);
        }
        elseif ($user['user']->rol === 'institutions')
        {
            $institution = $this->institutionService->createInstitution($user['user'], $request->institutions);
            return response()->json(['status'=>'success', 'user'=> $user['user'], 'token' => $token, 'institution'=>$institution]);
        }

        return response()->json(['status'=>'success', 'user'=> $user['user'], 'token' => $token]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['status' => 'success', 'message' => 'Logged out']);

    }
}
