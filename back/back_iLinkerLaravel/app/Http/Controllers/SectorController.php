<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    //
    public function getSectors()
    {
        $sectors = Sector::all();

        return response()->json([
            'status' => 'success',
            'data' => $sectors
        ]);
    }
}
