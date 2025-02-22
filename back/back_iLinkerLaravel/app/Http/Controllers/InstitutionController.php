<?php

namespace App\Http\Controllers;

use App\Services\InstitutionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstitutionController extends Controller
{

    protected $institutionService;

    public function __construct(InstitutionService $institutionService)
    {
        $this->institutionService = $institutionService;
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:institutions,id', // Asegura que el ID exista en la tabla institutions
            'name' => 'required',
            'NIF' => 'nullable',
            'type' => 'required',
            'academic_sector' => 'nullable',
            'logo' => 'nullable',
            'phone' => 'required',
            'email' => 'required',
            'website' => 'nullable',
            'responsible_phone' => 'nullable',
            'institution_position' => 'nullable',
            'address' => 'required',
            'city' => 'nullable',
            'country' => 'nullable',
            'postal_code' => 'nullable',
        ]);

        DB::beginTransaction();

        try{

            $institution = $this->institutionService->updateInstitution($validated);

            if (!$institution) {
                DB::rollBack();
                return response()->json(['status' => 'error', 'message' => 'Institution was not updated']);
            }
            DB::commit();
            return response()->json(['status' => 'success', 'institution' => $institution]);

        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();
        try{

            $institution = $this->institutionService->deleteInstitution($validated);
            if (!$institution) {
                DB::rollback();
                return response()->json(['status' => 'error', 'message' => 'Institution was not deleted']);
            }
            DB::commit();
            return response()->json(['status' => 'success', 'institution' => $institution]);

        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
