<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStudentController extends Controller
{
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
