<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HelpUser;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;


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

    public function getAdminQuestions(){
        $helps = HelpUser::with(['user', 'user.student', 'user.company', 'user.institutions'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $helps
        ]);
    }

    public function responseQuestion(Request $request)
    {
        $rules = [
            'answer' => 'required',
            'question_id' => 'required',
        ];

        $messages = [
            'answer.required' => 'La respuesta es obligatoria',
            'question_id.required' => 'El campo pregunta es obligatorio',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'data' => $validator->errors()
            ]);
        }

        try{
            // Enviar respuesta
            $helpUser = HelpUser::where('id', $request->get('question_id'))->first();
            $helpUser->status = 'answered';
            $helpUser->save();


            return response()->json([
                'status' => 'success',
                'data' => $helpUser
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage()
            ]);
        }
    }
}
