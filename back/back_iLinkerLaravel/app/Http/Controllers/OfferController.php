<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    public function show($id)
    {
        $offer = Offer::with('usersInterested')->findOrFail($id);
        return response()->json(
            [
                'status' => 'success',
                'offer' => $offer
            ]);
    }

    public function create(Request $request)
    {
        $rules = [
            'title' => 'required',
            'skills' => 'required',
            'description' => 'required',
            'location_type' => 'required',
            'address' => 'required',
            'city' => 'required',
            'postal_code' => 'required',
            'schedule_type' => 'required',
            'days_per_week' => 'required',
            'salary' => 'required',
        ];

        $messages = [
            'title.required' => 'El campo titulo es obligatorio',
            'skills.required' => 'El campo skills es obligatorio',
            'description.required' => 'El campo descripcion es obligatorio',
            'location_type.required' => 'El campo tipo de localizacion es obligatorio',
            'address.required' => 'El campo direccion es obligatorio',
            'city.required' => 'El campo ciudad es obligatorio',
            'postal_code.required' => 'El campo postal codigo es obligatorio',
            'schedule_type.required' => 'El campo schedule es obligatorio',
            'days_per_week.required' => 'El campo dias de la semana es obligatorio',
            'salary.required' => 'El campo salario es obligatorio',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Faltan campos obligatorios o tienen errores',
                'errors' => $validator->errors()
            ]);
        }

        try {
            $data = $validator->validated();

            $companyId = Company::where('user_id', Auth::id())->first()->id;

            $newOffer = new Offer();
            $newOffer->company_id = $companyId;
            $newOffer->title = $data['title'];
            $newOffer->skills = json_encode($data['skills']);
            $newOffer->description = $data['description'];
            $newOffer->location_type = $data['location_type'];
            $newOffer->address = $data['address'];
            $newOffer->schedule_type = $data['schedule_type'];
            $newOffer->city = $data['city'];
            $newOffer->days_per_week = $data['days_per_week'];
            $newOffer->postal_code = $data['postal_code'];
            $newOffer->salary = $data['salary'];
            $newOffer->inscribed = 0;
            $newOffer->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Oferta registrada correctamente',
                'data' => $newOffer,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function apply(Request $request){
        try{
            Log::info($request);

            return response()->json([
                'status' => 'success',
                'message' => 'Oferta registrada correctamente',
            ]);
        }catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }
}
