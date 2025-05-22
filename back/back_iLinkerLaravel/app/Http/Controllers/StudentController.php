<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Offer;
use App\Models\OfferUser;
use App\Models\Student;
use App\Models\User;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{

    protected $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }


    /**
     * @OA\Post(
     *     path="/api/student/update",
     *     summary="Actualiza la información de un estudiante",
     *     description="Actualiza datos del estudiante, habilidades, usuario y archivos opcionales llamando al servicio studentService.",
     *     operationId="updateStudent",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"student", "skills", "user"},
     *                 @OA\Property(
     *                     property="student",
     *                     type="object",
     *                     description="Datos del estudiante",
     *                     required={"id", "degree"},
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="degree", type="string", example="Ingeniería")
     *                 ),
     *                 @OA\Property(
     *                     property="skills",
     *                     type="array",
     *                     description="Lista de habilidades del estudiante",
     *                     @OA\Items(type="string"),
     *                     example={"PHP", "Laravel"}
     *                 ),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     description="Datos del usuario",
     *                     required={"name", "email"},
     *                     @OA\Property(property="name", type="string", example="Juan"),
     *                     @OA\Property(property="email", type="string", format="email", example="juan@example.com")
     *                 ),
     *                 @OA\Property(property="photo_pic", type="string", format="binary", description="Archivo de imagen para la foto del estudiante"),
     *                 @OA\Property(property="cover_photo", type="string", format="binary", description="Archivo de imagen para la foto de portada")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Datos actualizados correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="student", type="object", description="Datos actualizados del estudiante")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 additionalProperties={
     *                     "type": "array",
     *                     "items": {
     *                         "type": "string"
     *                     }
     *                 }
     *             )
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        Log::info("Recibiendo solicitud de actualización", $request->all());

        $studentData = json_decode($request->student, true);
        $skillsData = json_decode($request->skills, true);
        $userData = json_decode($request->user, true);

        if ($request->hasFile('photo_pic') || $request->hasFile('cover_photo')) {

            // Preparar los archivos para pasarlos al service
            $files = [];

            if ($request->hasFile('photo_pic')) {
                $files['photo_pic'] = $request->file('photo_pic');
            }

            if ($request->hasFile('cover_photo')) {
                $files['cover_photo'] = $request->file('cover_photo');
            }

            $student = $this->studentService->updateStudent($studentData, $skillsData, $userData, $files);
        } else {
            $student = $this->studentService->updateStudent($studentData, $skillsData, $userData);
        }

        return response()->json(['status' => 'success', 'student' => $student]);

    }


    /**
     * @OA\Get(
     *     path="/api/student/{uuid}",
     *     summary="Obtener información detallada de un estudiante por UUID",
     *     description="Recupera el estudiante junto con su información relacionada: usuario, educación (con institución), experiencia laboral, proyectos, habilidades, ofertas y número de seguidores.",
     *     operationId="getStudentByUuid",
     *     tags={"Students"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="UUID único del estudiante",
     *         @OA\Schema(type="string", example="xxxx-xxxx-xxxx-xxxx")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Información del estudiante obtenida correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="student",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="uuid", type="string", example="xxxx-xxxx-xxxx-xxxx"),
     *                 @OA\Property(property="user", type="object"),
     *                 @OA\Property(property="education", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="experience", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="projects", type="array", @OA\Items(type="object")),
     *                 @OA\Property(
     *                     property="skills",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Skill 1")
     *                     )
     *                 ),
     *                 @OA\Property(property="followers", type="integer", example=15)
     *             ),
     *             @OA\Property(
     *                 property="experience_grouped",
     *                 type="object",
     *                additionalProperties=@OA\AdditionalProperties(
     * @OA\Schema(
     * type="array",
     * @OA\Items(type="object")
     * )
     * )
     *             ),
     *             @OA\Property(
     *                 property="offerUser",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="offer", type="object")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Estudiante no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Student not found")
     *         )
     *     )
     * )
     */
    public function getStudent($uuid)
    {

        $student = Student::with(['user', 'education.institution', 'experience', 'projects', 'skills' => function ($query) {
            $query->select('skills.id', 'skills.name');
        }])->where('uuid', $uuid)->first();

        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found']);
        }

        $offer = OfferUser::with('offer')
            ->where('user_id', $student->user()->first()->id)
            ->get();

        $companyFollowers = User::findOrFail($student->user_id)
            ->followers->count();

        $student->followers = $companyFollowers;


        // Agrupar las experiencias por company_id
        $groupedExperience = $student->experience->groupBy('company_id');

        return response()->json([
            'status' => 'success',
            'student' => $student,
            'experience_grouped' => $groupedExperience,
            'offerUser' => $offer
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/student/education",
     *     summary="Obtiene la información educativa de un estudiante",
     *     description="Devuelve la información educativa del estudiante identificado por su UUID, incluyendo las instituciones relacionadas.",
     *     operationId="getStudentEducation",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"uuid"},
     *             @OA\Property(property="uuid", type="string", description="UUID único del estudiante", example="123e4567-e89b-12d3-a456-426614174000")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Información educativa del estudiante obtenida correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="education", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nombre del estudiante"),
     *                 @OA\Property(
     *                     property="education",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=10),
     *                         @OA\Property(property="degree", type="string", example="Título obtenido"),
     *                         @OA\Property(property="institution", type="object",
     *                             @OA\Property(property="id", type="integer", example=5),
     *                             @OA\Property(property="name", type="string", example="Nombre de la institución")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Estudiante no encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Student not found")
     *         )
     *     )
     * )
     */
    public function getEducationById(Request $request)
    {


        $student = Student::with(['education.institution'])->where('uuid', $request->uuid)->first();

        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found']);
        }

        return response()->json(['status' => 'success', 'education' => $student]);
    }


    /**
     * @OA\Get(
     *     path="/api/student/me",
     *     summary="Obtiene los datos del estudiante autenticado",
     *     description="Devuelve la información del estudiante autenticado, incluyendo su información educativa.",
     *     operationId="getAuthenticatedStudent",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\Response(
     *         response=200,
     *         description="Datos del estudiante obtenidos correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="student", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="user_id", type="integer", example=10),
     *                 @OA\Property(property="education", type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=5),
     *                         @OA\Property(property="degree", type="string", example="Título de ejemplo"),
     *                         @OA\Property(property="institution_id", type="integer", example=2)
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los datos del estudiante",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error detallado")
     *         )
     *     )
     * )
     */
    public function getOfferData()
    {
        try {
            $user = Auth::user();

            $student = Student::with('education')
                ->where('user_id', $user->id)
                ->first();

            return response()->json(['status' => 'success', 'student' => $student]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

}
