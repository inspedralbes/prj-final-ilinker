<?php

namespace App\Http\Controllers;

use App\Models\BlockedUser;
use App\Models\HelpUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class HelpUserController extends Controller
{
    //
    public function sendHelp(Request $request){
        $rules = [
          'subject' => 'required',
          'message' => 'required',
        ];

        $messages = [
            'subject.required' => 'El campo subject es obligatorio.',
            'message.required' => 'El campo message es obligatorio.',
        ];

        $validate = Validator::make($request->all(), $rules, $messages);

        if($validate->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $validate->errors()
            ]);
        }

        try{
            $help = new HelpUser();
            $help->user_id = Auth::user()->id;
            $help->subject = $request->input('subject');
            $help->message = $request->input('message');
            $help->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Se envio la insidencia correctamente.'
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getMyBlockedUsers(){
        $me = Auth::user();
        $blockedUser = BlockedUser::with(['user', 'blockedUser', 'user.student', 'user.company', 'user.institutions', 'blockedUser.student', 'blockedUser.company', 'blockedUser.institutions'])
            ->where('user_id', $me->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Se han encontrado los usuarios bloqueados.',
            'blockedUser' => $blockedUser
        ]);
    }
}
