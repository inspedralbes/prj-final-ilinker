<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportedUserController extends Controller
{
    public function index()
    {
        $reportedUsers = Report::with(['reportedUser', 'reporter'])
            ->latest()
            ->get();

        return view('admin.reported-users.index', compact('reportedUsers'));
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();

        return redirect()->back()->with('success', 'Reporte eliminado correctamente.');
    }
}

