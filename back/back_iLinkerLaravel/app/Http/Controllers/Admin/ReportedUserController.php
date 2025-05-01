<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class ReportedUserController extends Controller
{
    public function index()
    {
        return Report::with(['reportedUser', 'reporter'])
            ->latest()
            ->get();
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Reporte eliminado correctamente']);
    }

public function deleteUser($userId)
{
    $user = User::findOrFail($userId);
    $user->forceDelete();

    // Opcional: Eliminar también todos sus reportes
    Report::where('reported_user_id', $userId)
           ->orWhere('reported_by_id', $userId)
           ->delete();

    return response()->json([
        'message' => 'Usuario eliminado permanentemente',
    ]);
}

    public function banUser($userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['active' => 0]); // Cambia a 0 para desactivar

        return response()->json([
            'message' => 'Usuario baneado correctamente',
            'user' => $user
        ]);
    }
}
