<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'reported_user_id' => 'required|exists:users,id',
            'reason' => 'required|string|max:1000',
        ]);

        $report = Report::create([
            'reported_user_id' => $request->reported_user_id,
            'reported_by_id' => auth()->id(),
            'reason' => $request->reason,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reporte enviado correctamente',
            'report' => $report
        ]);
    }
}
