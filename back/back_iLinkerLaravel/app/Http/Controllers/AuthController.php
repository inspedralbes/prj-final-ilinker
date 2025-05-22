<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Institutions;
use App\Models\Notification;
use App\Models\Student;
use App\Services\CompanyService;
use App\Services\InstitutionService;
use App\Services\MailService;
use App\Services\StudentService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use function Laravel\Prompts\error;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;


use Google_Client;
use App\Models\User;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{


    protected $userService, $companyService, $institutionService, $studentService, $mailService;

    public function __construct(UserService $userService, CompanyService $companyService, InstitutionService $institutionService, StudentService $studentService, MailService $mailService)
    {
        $this->userService = $userService;
        $this->companyService = $companyService;
        $this->institutionService = $institutionService;
        $this->studentService = $studentService;
        $this->mailService = $mailService;
    }


    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Iniciar sessió d’un usuari",
     *     description="Endpoint per autenticar un usuari mitjançant email i contrasenya. Retorna un token d’autenticació, les dades de l’usuari, el seu rol associat i notificacions.",
     *     operationId="loginUser",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="joan@example.com", description="Correu electrònic registrat."),
     *             @OA\Property(property="password", type="string", example="secret123", description="Contrasenya de l’usuari.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuari autenticat correctament",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Credentials validated"),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJh..."),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Joan"),
     *                 @OA\Property(property="email", type="string", example="joan@example.com"),
     *                 @OA\Property(property="rol", type="string", example="student"),
     *                 @OA\Property(property="student", type="object", description="Dades del perfil de l'estudiant (si aplica)")
     *             ),
     *             @OA\Property(property="notifications", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Credencials incorrectes",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Invalid credentials")
     *         )
     *     )
     * )
     */


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $user->status = "online";
            $user->save();

            $token = $user->createToken('auth_token')->plainTextToken;

            if ($user->rol === "company") {
                $company = Company::where('user_id', $user->id)->first();
                $user->company = $company;
            }

            if ($user->rol === 'student') {
                $student = Student::where('user_id', $user->id)->first();
                $user->student = $student;
            }

            if ($user->rol === 'institutions') {
                $institution = Institutions::where('user_id', $user->id)->first();
                $user->institution = $institution;
            }

            $notifications = Notification::getAllForUser($user->id);

            return response()->json(['status' => 'success', 'message' => 'Credentials validated', 'token' => $token, 'user' => $user, 'notifications' => $notifications]);
        }

        return response()->json(['status' => 'error', 'message' => 'Invalid credentials']);
    }


    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Registrar un nou usuari (student, company o institution)",
     *     description="Endpoint per registrar un usuari nou i crear les entitats relacionades segons el rol especificat. Retorna informació de l'usuari, token d'autenticació i les dades associades (empresa, institució o estudiant).",
     *     operationId="registerUser",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "surname", "birthday", "email", "password", "rol"},
     *             @OA\Property(property="name", type="string", example="Joan", description="Nom de l'usuari."),
     *             @OA\Property(property="surname", type="string", example="Garcia", description="Cognom de l'usuari."),
     *             @OA\Property(property="birthday", type="string", format="date", example="2000-05-22", description="Data de naixement (format YYYY-MM-DD)."),
     *             @OA\Property(property="email", type="string", format="email", example="joan@example.com", description="Correu electrònic de l'usuari."),
     *             @OA\Property(property="password", type="string", example="secret123", description="Contrasenya de l'usuari."),
     *             @OA\Property(property="rol", type="string", example="student", enum={"student", "company", "institutions"}, description="Rol de l'usuari."),
     *             @OA\Property(
     *                 property="student",
     *                 type="object",
     *                 description="Informació addicional si el rol és student.",
     *                 @OA\Property(property="phone", type="string", example="600123123"),
     *                 @OA\Property(property="address", type="string", example="Carrer Major 1")
     *             ),
     *             @OA\Property(
     *                 property="company",
     *                 type="object",
     *                 description="Informació addicional si el rol és company.",
     *                 @OA\Property(property="name", type="string", example="Empresa S.L."),
     *                 @OA\Property(property="sector", type="string", example="Tecnologia")
     *             ),
     *             @OA\Property(
     *                 property="institution",
     *                 type="object",
     *                 description="Informació addicional si el rol és institutions.",
     *                 @OA\Property(property="name", type="string", example="Institut X"),
     *                 @OA\Property(property="location", type="string", example="Barcelona")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuari registrat correctament",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Joan"),
     *                 @OA\Property(property="surname", type="string", example="Garcia"),
     *                 @OA\Property(property="email", type="string", example="joan@example.com"),
     *                 @OA\Property(property="rol", type="string", example="student")
     *             ),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJh..."),
     *             @OA\Property(property="student", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="user_id", type="integer", example=1)
     *             ),
     *             @OA\Property(property="notifications", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="El campo name es obligatorio."),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="name", type="array", @OA\Items(type="string", example="El campo name es obligatorio."))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="L'usuari ja existeix",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="warning"),
     *             @OA\Property(property="message", type="string", example="El usuario ya existe en la base de datos.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error intern al crear l'entitat",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error al crear la empresa.")
     *         )
     *     )
     * )
     */


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
        Log::info("VALIDADO", ["VALI" => $validated]);

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
            Log::info("CREADO", ["User" => $user]);
            Log::info("ID ", ['Usuario ' => $user['user']->id]);

            $token = $user['token'];


            $body = View::make('welcomes.register', ['user' => $user['user']])->render();
            $this->mailService->enviarMail($user['user']->name, $user['user']->email, $body);

            if ($user['user']->rol === 'company') {
                $company = $this->companyService->createCompany($user['user'], $request->company);
                if (!$company) {
                    DB::rollBack();
                    throw new \Exception('Error al crear la empresa.');
                }
                DB::commit();

                $user['user']['company'] = $company;
                $notifications = Notification::getAllForUser($user['user']->id);

                return response()->json(['status' => 'success', 'user' => $user['user'], 'token' => $token, 'company' => $company, 'notifications' => $notifications]);
            } elseif ($user['user']->rol === 'institutions') {
                Log::info("Instituto", ['insti' => $request->institution]);
                $institution = $this->institutionService->createInstitution($user['user'], $request->institution);

                if (!$institution) {
                    DB::rollBack();
                    throw new \Exception('Error al crear la institución.');
                }
                DB::commit();

                $user['user']['institution'] = $institution;
                $notifications = Notification::getAllForUser($user['user']->id);

                return response()->json(['status' => 'success', 'user' => $user['user'], 'token' => $token, 'institution' => $institution, 'notifications' => $notifications]);
            } elseif ($user['user']->rol === 'student') {
                $student = $this->studentService->createStudent($user['user'], $request->student);

                if (!$student) {
                    DB::rollBack();
                    throw new \Exception('Error al crear el estudiante.');
                }
                DB::commit();

                $user['user']['student'] = $student;
                $notifications = Notification::getAllForUser($user['user']->id);

                return response()->json(['status' => 'success', 'user' => $user['user'], 'token' => $token, 'student' => $student, 'notifications' => $notifications]);
            } else {
                DB::rollBack();
                throw new \Exception('El rol no está especificado.');
            }

        } catch (\Exception $e) {
            // Si ocurre un error, deshacer los cambios en la BD
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Tancar sessió",
     *     description="Endpoint per finalitzar la sessió de l’usuari autenticat. Actualitza l’estat de l’usuari a 'offline' i invalida la sessió actual.",
     *     operationId="logoutUser",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Sessió tancada correctament",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Logged out")
     *         )
     *     )
     * )
     */


    public function logout()
    {
        $user = Auth::user();
        $user->status = "offline";
        $user->save();

        Auth::logout();
        return response()->json(['status' => 'success', 'message' => 'Logged out']);
    }

    /**
     * @OA\Get(
     *     path="/api/user",
     *     summary="Verifica si el usuario está autenticado y devuelve sus datos junto con notificaciones",
     *     description="Este endpoint requiere autenticación. Retorna la información del usuario autenticado y una lista de notificaciones relacionadas.",
     *     operationId="getAuthenticatedUser",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Usuario autenticado correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nombre de Usuario"),
     *                 @OA\Property(property="rol", type="string", example="company"),
     *                 @OA\Property(
     *                     property="company",
     *                     type="object",
     *                     description="Datos de la empresa asociada si el rol es 'company'"
     *                 ),
     *                 @OA\Property(property="student", type="string", nullable=true, example=null),
     *                 @OA\Property(property="institution", type="string", nullable=true, example=null)
     *             ),
     *             @OA\Property(
     *                 property="notifications",
     *                 type="array",
     *                 @OA\Items(type="object")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Usuario no autenticado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Usuario no autenticado.")
     *         )
     *     )
     * )
     */
    public function check()
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->rol === "company") {
                $company = Company::where('user_id', $user->id)->first();
                $user->company = $company;
            }

            if ($user->rol === 'student') {
                $student = Student::where('user_id', $user->id)->first();
                $user->student = $student;
            }

            if ($user->rol === 'institutions') {
                $institution = Institutions::where('user_id', $user->id)->first();
                $user->institution = $institution;
            }

            $notifications = Notification::getAllForUser($user->id);


            return response()->json([
                'status' => 'success',
                'user' => $user,
                'notifications' => $notifications
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario no autenticado.'
            ]);
        }
    }
}
