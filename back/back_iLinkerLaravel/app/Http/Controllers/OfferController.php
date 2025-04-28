<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Offer;
use App\Models\OfferUser;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    public function show($id)
    {
        $offer = Offer::with('usersInterested', 'company', 'usersInterested.student', 'usersInterested.student.skills', 'usersInterested.student.education')->findOrFail($id);
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
            $newOffer->uuid = uuid_create();
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
        $rules = [
            'offer_id' => 'required',
            'user_id' => 'required'
        ];

        $messages = [
            'offer_id.required' => 'El campo oferta es obligatorio',
            'user_id.required' => 'El campo usuario es obligatorio',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Faltan campos obligatorios o tienen errores',
                'errors' => $validator->errors()
            ]);
        }

        try{
            Log::info($request);
            $user = Auth::user();
            $student = Student::where('user_id', $request->input('user_id'))->first();
            $offer = Offer::where('id', $request->input('offer_id'))->first();

            Log::info($offer);
            $offerApplyUser = new OfferUser();
            $offerApplyUser->offer_id = $request->get('offer_id');
            $offerApplyUser->user_id = $request->get('user_id');


            $folder = "offers/{$offer->uuid}";
            $disk   = Storage::disk('public');

            // Solo crea la carpeta si no existe
            if (! $disk->exists($folder)) {
                $disk->makeDirectory($folder, 0755, true);
            }

            if ($request->hasFile('cv_attachment')) {
                $file     = $request->file('cv_attachment');
                $ext      = $file->getClientOriginalExtension();
                $fileName = "cv_{$student->uuid}.{$ext}";
                $filePath = $file->storeAs($folder, $fileName, 'public');
                $offerApplyUser->cv_attachment = $filePath;
            }

            if ($request->hasFile('cover_letter_attachment')) {
                $file     = $request->file('cover_letter_attachment');
                $ext      = $file->getClientOriginalExtension();
                $fileName = "cover_letter_{$student->uuid}.{$ext}";
                $filePath = $file->storeAs($folder, $fileName, 'public');
                $offerApplyUser->cover_letter_attachment = $filePath;
            }

            $offerApplyUser->availability = $request->get('availability');

            $offerApplyUser->save();

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
