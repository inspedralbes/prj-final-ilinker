<?php

namespace App\Http\Controllers;

use App\Services\StudentEducationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function Symfony\Component\Translation\t;

class StudentEducationController extends Controller
{
    protected $studentEducationService;

    public function __construct(StudentEducationService $studentEducationService)
    {
        $this->studentEducationService = $studentEducationService;
    }


    public function create(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required',
            'courses_id' => 'nullable',
            'institution_id' => 'nullable',
            'institute' => 'nullable',
            'degree' => 'nullable',
            'start_date' => 'required',
            'end_date' => 'nullable',
        ]);

        DB::beginTransaction();

        try{

            $education = $this->studentEducationService->createStudentEducation($validated);

            if (!$education) {
                throw new \Exception('Error al crear la educacion del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'education' => $education]);

        }catch (\Exception $e){
            // Si ocurre un error, deshacer los cambios en la BD
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }

    public function update(Request $request){

        $validated = $request->validate([
            'id' => 'required',
            'courses_id' => 'nullable',
            'institution_id' => 'nullable',
            'institute' => 'nullable',
            'degree' => 'nullable',
            'start_date' => 'required',
            'end_date' => 'required',
        ]);

        DB::beginTransaction();

        try{
            $education = $this->studentEducationService->updateStudentEducation($validated);
            if (!$education) {
                throw new \Exception('Error al actualizar la educacion del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'education' => $education]);

        }catch (\Exception $e){
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function delete(Request $request){
        $validated = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();
        try{
            $education = $this->studentEducationService->deleteStudentEducation($validated);
            if (!$education) {
                throw new \Exception('Error al eliminar la educacion del estudiante.');
            }
            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Educacion eliminada']);

        }catch (\Exception $e){
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }
}
