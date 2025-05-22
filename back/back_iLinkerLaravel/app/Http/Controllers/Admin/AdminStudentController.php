<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStudentController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/estudiantes",
     *     summary="Listar estudiantes",
     *     description="Este endpoint devuelve una lista paginada de estudiantes, incluyendo su información relacionada como usuario, formación académica y habilidades.",
     *     operationId="listStudents",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Página de resultados para la paginación",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Lista de estudiantes obtenida correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=5),
     *                         @OA\Property(
     *                             property="user",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=12),
     *                             @OA\Property(property="name", type="string", example="Carlos Gómez")
     *                         ),
     *                         @OA\Property(property="education", type="array", @OA\Items(type="string"), example={}),
     *                         @OA\Property(property="skills", type="array", @OA\Items(type="string"), example={}),
     *                         @OA\Property(property="created_at", type="string", format="date-time", example="2024-12-01T12:34:56.000000Z")
     *                     )
     *                 ),
     *                 @OA\Property(property="total", type="integer", example=25),
     *                 @OA\Property(property="last_page", type="integer", example=3)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error al cargar estudiantes",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al cargar estudiantes: error_message")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $students = Student::with(['user', 'education', 'skills'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $students
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar estudiantes: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/estudiantes/{id}",
     *     summary="Obtener detalles de un estudiante",
     *     description="Este endpoint permite a un administrador obtener la información completa de un estudiante por su ID, incluyendo usuario relacionado, formación, experiencia, habilidades y proyectos.",
     *     operationId="getStudentDetails",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del estudiante a consultar",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Detalles del estudiante obtenidos correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=7),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=21),
     *                     @OA\Property(property="name", type="string", example="Laura Pérez")
     *                 ),
     *                 @OA\Property(property="education", type="array", @OA\Items(type="string"), example={}),
     *                 @OA\Property(property="experience", type="array", @OA\Items(type="string"), example={}),
     *                 @OA\Property(property="skills", type="array", @OA\Items(type="string"), example={}),
     *                 @OA\Property(property="projects", type="array", @OA\Items(type="string"), example={}),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-01-12T10:45:00.000000Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Estudiante no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Estudiante no encontrado")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $student = Student::with(['user', 'education', 'experience', 'skills', 'projects'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $student
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Estudiante no encontrado'
            ], 404);
        }
    }


    /**
     * @OA\Put(
     *     path="/api/estudiantes/{id}",
     *     summary="Actualizar información de un estudiante",
     *     description="Este endpoint permite a un administrador actualizar tanto los datos del estudiante como del usuario asociado.",
     *     operationId="updateStudentAdmin",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del estudiante a actualizar",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Laura"),
     *             @OA\Property(property="surname", type="string", example="Pérez"),
     *             @OA\Property(property="type_document", type="string", example="DNI"),
     *             @OA\Property(property="id_document", type="string", example="12345678A"),
     *             @OA\Property(property="nationality", type="string", example="Española"),
     *             @OA\Property(property="birthday", type="string", format="date", example="2001-05-22"),
     *             @OA\Property(property="gender", type="string", example="Femenino"),
     *             @OA\Property(property="phone", type="string", example="612345678"),
     *             @OA\Property(property="address", type="string", example="Calle Mayor 123"),
     *             @OA\Property(property="city", type="string", example="Madrid"),
     *             @OA\Property(property="country", type="string", example="España"),
     *             @OA\Property(property="postal_code", type="string", example="28001"),
     *             @OA\Property(
     *                 property="languages",
     *                 type="array",
     *                 @OA\Items(type="string"),
     *                 example={"Español", "Inglés"}
     *             ),
     *             @OA\Property(property="active", type="boolean", example=true),
     *             @OA\Property(property="email", type="string", format="email", example="laura.perez@email.com")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Estudiante actualizado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=7),
     *                 @OA\Property(property="name", type="string", example="Laura"),
     *                 @OA\Property(property="surname", type="string", example="Pérez"),
     *                 @OA\Property(property="languages", type="array", @OA\Items(type="string"), example={"Español", "Inglés"}),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=21),
     *                     @OA\Property(property="email", type="string", example="laura.perez@email.com"),
     *                     @OA\Property(property="active", type="boolean", example=true)
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error al actualizar estudiante",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al actualizar estudiante: Detalle del error")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $student = Student::with('user')->findOrFail($id);

            // Campos permitidos para students
            $studentFields = [
                'name',
                'surname',
                'type_document',
                'id_document',
                'nationality',
                'birthday',
                'gender',
                'phone',
                'address',
                'city',
                'country',
                'postal_code',
                'languages'
            ];

            // Campos permitidos para users
            $userFields = ['active', 'email']; // Añade otros campos de usuario si es necesario

            // Actualizar datos del estudiante
            $studentData = $request->only($studentFields);
            if (isset($studentData['languages'])) {
                $studentData['languages'] = json_encode($studentData['languages']);
            }
            $student->update($studentData);

            // Actualizar datos del usuario asociado
            if ($request->hasAny($userFields)) {
                $userData = $request->only($userFields);
                $student->user->update($userData);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $student->fresh(['user'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estudiante: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Delete(
     *     path="/api/estudiantes/{id}",
     *     summary="Eliminar un estudiante",
     *     description="Este endpoint permite a un administrador eliminar un estudiante junto con su información relacionada, como educación, experiencia, habilidades y proyectos. También elimina el usuario asociado.",
     *     operationId="deleteStudent",
     *     tags={"Estudiantes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del estudiante a eliminar",
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Estudiante eliminado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Estudiante eliminado correctamente")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error al eliminar estudiante",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error al eliminar estudiante: Detalle del error")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $student = Student::findOrFail($id);
            $user = User::find($student->user_id);

            // Eliminar relaciones
            $student->education()->delete();
            $student->experience()->delete();
            $student->skills()->detach();
            $student->projects()->delete();

            // Eliminar estudiante
            $student->delete();

            // Opcional: eliminar usuario
            $user->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Estudiante eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar estudiante: ' . $e->getMessage()
            ], 500);
        }
    }
}
