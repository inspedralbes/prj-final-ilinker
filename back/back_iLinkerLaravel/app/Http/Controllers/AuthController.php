<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Services\CompanyService;
use App\Services\InstitutionService;
use App\Services\StudentService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use function Laravel\Prompts\error;
use Illuminate\Support\Facades\DB;

use Google_Client;
use App\Models\User;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{


    protected $userService, $companyService, $institutionService, $studentService;

    public function __construct(UserService $userService, CompanyService $companyService, InstitutionService $institutionService, StudentService $studentService)
    {
        $this->userService = $userService;
        $this->companyService = $companyService;
        $this->institutionService = $institutionService;
        $this->studentService = $studentService;
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

            $company = Company::where('user_id', $user->id)->first();

            $user->company = $company;
            return response()->json(['status' => 'success', 'message' => 'Credentials validated', 'token' => $token, 'user' => $user]);
        }

        return response()->json(['status' => 'error', 'message' => 'Invalid credentials']);
    }

    public function register(Request $request)
    {
        Log::info($request);
        $validated = $request->validate([
            'name' => 'required',
            'surname' => 'required',
            'birthday' => 'required',
            'email' => 'required',
            'password' => 'required',
            'rol' => 'required',
        ]);
        Log::info($validated);

        // Verificar si el usuario ya existe
        $check = $this->userService->checkIfUserExists($validated);
        if ($check) {
            return response()->json(['status' => 'warning', "message" => "El usuario ya existe en la base de datos."]);
        }

        // Iniciar una transacción de BD
        DB::beginTransaction();

        try {
            // Crear el usuario
            $user = $this->userService->createUser($validated);
            $token = $user['token'];

            if ($user['user']->rol === 'company') {
                $company = $this->companyService->createCompany($user['user'], $request->company);
                if (!$company) {
                    throw new \Exception('Error al crear la empresa.');
                }
                DB::commit();

                $user['user']['company'] = $company;
                return response()->json(['status' => 'success', 'user' => $user['user'], 'token' => $token, 'company' => $company]);
            } elseif ($user['user']->rol === 'institutions') {
                $institution = $this->institutionService->createInstitution($user['user'], $request->institutions);
                if (!$institution) {
                    throw new \Exception('Error al crear la institución.');
                }
                DB::commit();
                return response()->json(['status' => 'success', 'user' => $user['user'], 'token' => $token, 'institution' => $institution]);
            } elseif ($user['user']->rol === 'student') {
                $student = $this->studentService->createStudent($user['user'], $request->student);
                if (!$student) {
                    throw new \Exception('Error al crear el estudiante.');
                }
                DB::commit();
                return response()->json(['status' => 'success', 'user' => $user['user'], 'token' => $token, 'student' => $student]);
            } else {
                throw new \Exception('El rol no está especificado.');
            }
        } catch (\Exception $e) {
            // Si ocurre un error, deshacer los cambios en la BD
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['status' => 'success', 'message' => 'Logged out']);
    }
}
