<?php

namespace App\Http\Controllers;

use App\Services\ExperienceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExperienceController extends Controller
{
    protected $experienceService;
    public function __construct(ExperienceService $experienceService)
    {
        $this->experienceService = $experienceService;
    }

    public function create(Request $request)
    {

        $validate = $request->validate([
            'student_id' => 'required',
            'company_id' => 'nullable',
            'company_name' => 'nullable',
            'department' => 'required',
            'employee_type' => 'required',
            'company_address' => 'nullable',
            'location_type' => 'required',
            'start_date' => 'required',
            'end_date' => 'nullable',
        ]);

        DB::beginTransaction();

        try{

            $experience = $this->experienceService->createExperience($validate);

            if (!$experience) {
                throw new \Exception('Error al crear la experiencia del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'experience' => $experience]);

        }catch (\Exception $e){
            DB::rollBack();
            return response()->json(['status' => 'error','message' => $e->getMessage()], 500);
        }

    }

    public function update(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
            'company_id' => 'nullable',
            'company_name' => 'nullable',
            'department' => 'required',
            'employee_type' => 'required',
            'company_address' => 'nullable',
            'location_type' => 'required',
            'start_date' => 'required',
            'end_date' => 'nullable',
        ]);

        DB::beginTransaction();

        try{

            $experience = $this->experienceService->updateExperience($validate);

            if (!$experience) {
                throw new \Exception('Error al actualizar la experiencia del estudiante.');
            }
            DB::commit();
            return response()->json(['status' => 'success', 'experience' => $experience]);

        }catch (\Exception $e){
            DB::rollBack();
            return response()->json(['status' => 'error','message' => $e->getMessage()], 500);
        }
    }

    public function delete(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();

        try{
            $experience = $this->experienceService->deleteExperience($validate);
            if (!$experience) {
                throw new \Exception('Error al eliminar la experiencia del estudiante.');
            }
            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Experiencia Eliminada']);
        }catch (\Exception $e){
            DB::rollBack();
            return response()->json(['status' => 'error','message' => $e->getMessage()], 500);
        }
    }
}
