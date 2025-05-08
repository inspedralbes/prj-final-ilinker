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
        $student = Student::findOrFail($id);

        // Validación más estricta
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'surname' => 'sometimes|string|max:255',
            'type_document' => 'sometimes|string|in:DNI,NIE,PASAPORTE',
            'id_document' => 'sometimes|string|max:20|unique:students,id_document,'.$id,
            'nationality' => 'sometimes|string|max:100',
            'birthday' => 'sometimes|date|before_or_equal:today',
            'gender' => 'sometimes|string|in:Masculino,Femenino,No decir',
            'phone' => 'sometimes|numeric|digits_between:9,15',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'country' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:20',
            'languages' => 'nullable|sometimes|array',
            'languages.*' => 'nullable|string|max:50',
            'active' => 'sometimes|boolean'
        ]);

        // Convertir languages a JSON si es un array
        if (isset($validated['languages'])) {
            $validated['languages'] = json_encode($validated['languages']);
        }

        $student->update($validated);

        // Actualizar email si viene en la petición
        if ($request->has('email')) {
            $user = $student->user;
            if ($user) {
                $request->validate([
                    'email' => 'required|email|unique:users,email,'.$user->id
                ]);
                $user->update(['email' => $request->email]);
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'data' => $student->fresh(['user', 'education'])
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Error de validación',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Error al actualizar estudiante: ' . $e->getMessage(),
            'trace' => config('app.debug') ? $e->getTrace() : null
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
            // $user->delete();

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
