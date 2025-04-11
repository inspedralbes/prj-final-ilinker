<?php

namespace App\Http\Controllers;

use App\Services\InstitutionService;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{

    protected InstitutionService $institutionService;
    public function __construct(InstitutionService $institutionService){
        $this->institutionService = $institutionService;
    }

    public function getInstitutions(){
        try {
            $institutions = $this->institutionService->getInstitutions();

            return response()->json(['success' => 'success', 'institutions' => $institutions]);
        }catch (\Exception $exception){
            return response()->json(['status' => 'error', 'message' => $exception->getMessage()]);
        }
    }
}
