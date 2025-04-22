<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class OfferController extends Controller
{
    public function create(Request $request)
    {
        $rules = [
            'title'       => 'required',
            'description' => 'required',
            'address'     => 'required',
            'city'        => 'required',
            'postal_code' => 'required',
            'salary'      => 'required',
        ];

        $messages = [
            'title.required'       => 'El campo titulo es obligatorio',
            'description.required' => 'El campo descripcion es obligatorio',
            'address.required'     => 'El campo direccion es obligatorio',
            'city.required'        => 'El campo ciudad es obligatorio',
            'postal_code.required' => 'El campo postal codigo es obligatorio',
            'salary.required'      => 'El campo salario es obligatorio',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Faltan campos obligatorios o tienen errores',
                'errors'  => $validator->errors()
            ]);
        }

        try {
            $data = $validator->validated();

            $companyId = Company::where('user_id', Auth::id())->first()->id;

            $newOffer = new Offer();
            $newOffer->company_id  = $companyId;
            $newOffer->title       = $data['title'];
            $newOffer->description = $data['description'];
            $newOffer->address     = $data['address'];
            $newOffer->city        = $data['city'];
            $newOffer->postal_code = $data['postal_code'];
            $newOffer->salary      = $data['salary'];
            $newOffer->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Oferta registrada correctamente',
                'data'   => $newOffer,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status'  => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }
}
