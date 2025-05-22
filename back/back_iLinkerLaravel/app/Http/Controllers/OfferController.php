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
use mysql_xdevapi\Exception;

class OfferController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/offers/{id}",
     *     summary="Mostra una oferta amb la seva informació relacionada",
     *     description="Recupera una oferta específica per ID, incloent la seva empresa i usuaris interessats amb les seves dades.",
     *     operationId="showOffer",
     *     tags={"Offers"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'oferta",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Oferta trobada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="offer",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="title", type="string", example="Desenvolupador PHP"),
     *                 @OA\Property(property="description", type="string", example="Oferta de treball..."),
     *                 @OA\Property(
     *                     property="company",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=5),
     *                     @OA\Property(property="name", type="string", example="Empresa XYZ")
     *                 ),
     *                 @OA\Property(
     *                     property="usersInterested",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=10),
     *                         @OA\Property(
     *                             property="student",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=20),
     *                             @OA\Property(property="name", type="string", example="Joan"),
     *                             @OA\Property(property="skills", type="array", @OA\Items(type="object")),
     *                             @OA\Property(property="education", type="array", @OA\Items(type="object"))
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Oferta no trobada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="No query results for model [App\\Models\\Offer] 999"
     *             )
     *         )
     *     )
     * )
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException Si no es troba l'oferta.
     */
    public function show($id)
    {
        $offer = Offer::with('usersInterested', 'company', 'usersInterested.student', 'usersInterested.student.skills', 'usersInterested.student.education')->findOrFail($id);
        return response()->json(
            [
                'status' => 'success',
                'offer' => $offer
            ]);
    }


    /**
     * @OA\Post(
     *     path="/api/offers",
     *     summary="Crea una nova oferta laboral",
     *     description="Valida els camps obligatoris i crea una oferta laboral associada a la companyia de l'usuari autenticat.",
     *     operationId="createOffer",
     *     tags={"Offers"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "skills", "description", "location_type", "address", "lat", "lng", "city", "postal_code", "schedule_type", "days_per_week", "salary", "vacancies"},
     *             @OA\Property(property="title", type="string", example="Desenvolupador PHP"),
     *             @OA\Property(property="skills", type="array", @OA\Items(type="string"), example={"PHP", "Laravel", "MySQL"}),
     *             @OA\Property(property="description", type="string", example="Descripció de l'oferta..."),
     *             @OA\Property(property="location_type", type="string", example="remote"),
     *             @OA\Property(property="address", type="string", example="Carrer Falsa 123"),
     *             @OA\Property(property="lat", type="number", format="float", example=41.3879),
     *             @OA\Property(property="lng", type="number", format="float", example=2.16992),
     *             @OA\Property(property="city", type="string", example="Barcelona"),
     *             @OA\Property(property="postal_code", type="string", example="08001"),
     *             @OA\Property(property="schedule_type", type="string", example="full-time"),
     *             @OA\Property(property="days_per_week", type="integer", example=5),
     *             @OA\Property(property="salary", type="string", example="2000€"),
     *             @OA\Property(property="vacancies", type="integer", example=2)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Oferta creada correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Oferta registrada correctamente"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="uuid", type="string", example="a1b2c3d4..."),
     *                 @OA\Property(property="company_id", type="integer", example=10),
     *                 @OA\Property(property="title", type="string", example="Desenvolupador PHP"),
     *                 @OA\Property(property="skills", type="array", @OA\Items(type="string"), example={"PHP", "Laravel"}),
     *                 @OA\Property(property="description", type="string", example="..."),
     *                 @OA\Property(property="location_type", type="string", example="remote"),
     *                 @OA\Property(property="address", type="string", example="Carrer Falsa 123"),
     *                 @OA\Property(property="lat", type="number", format="float", example=41.3879),
     *                 @OA\Property(property="lng", type="number", format="float", example=2.16992),
     *                 @OA\Property(property="city", type="string", example="Barcelona"),
     *                 @OA\Property(property="postal_code", type="string", example="08001"),
     *                 @OA\Property(property="schedule_type", type="string", example="full-time"),
     *                 @OA\Property(property="days_per_week", type="integer", example=5),
     *                 @OA\Property(property="salary", type="string", example="2000€"),
     *                 @OA\Property(property="vacancies", type="integer", example=2),
     *                 @OA\Property(property="created_at", type="string", example="2025-05-22T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", example="2025-05-22T10:00:00Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Faltan campos obligatorios o tienen errores"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="title", type="array", @OA\Items(type="string", example="El campo titulo es obligatorio"))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error del servidor")
     *         )
     *     )
     * )
     */
    public function create(Request $request)
    {
        $rules = [
            'title' => 'required',
            'skills' => 'required',
            'description' => 'required',
            'location_type' => 'required',
            'address' => 'required',
            'lat' => 'required',
            'lng' => 'required',
            'city' => 'required',
            'postal_code' => 'required',
            'schedule_type' => 'required',
            'days_per_week' => 'required',
            'salary' => 'required',
            'vacancies' => 'required',
        ];

        $messages = [
            'title.required' => 'El campo titulo es obligatorio',
            'skills.required' => 'El campo skills es obligatorio',
            'description.required' => 'El campo descripcion es obligatorio',
            'location_type.required' => 'El campo tipo de localizacion es obligatorio',
            'address.required' => 'El campo direccion es obligatorio',
            'lat.required' => 'El campo latitud es obligatorio',
            'lng.required' => 'El campo longitud es obligatorio',
            'city.required' => 'El campo ciudad es obligatorio',
            'postal_code.required' => 'El campo postal codigo es obligatorio',
            'schedule_type.required' => 'El campo schedule es obligatorio',
            'days_per_week.required' => 'El campo dias de la semana es obligatorio',
            'salary.required' => 'El campo salario es obligatorio',
            'vacancies.required' => 'El campo vacancies es obligatorio',
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
            $newOffer->lat = $data['lat'];
            $newOffer->lng = $data['lng'];
            $newOffer->schedule_type = $data['schedule_type'];
            $newOffer->city = $data['city'];
            $newOffer->days_per_week = $data['days_per_week'];
            $newOffer->postal_code = $data['postal_code'];
            $newOffer->salary = $data['salary'];
            $newOffer->vacancies = $data['vacancies'];
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


    /**
     * @OA\Post(
     *     path="/api/apply-offer",
     *     summary="Aplicar-se a una oferta de treball",
     *     description="Permet a un usuari aplicar-se a una oferta laboral, amb possibilitat d’adjuntar CV i carta de presentació.",
     *     operationId="applyToOffer",
     *     tags={"Offers"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"offer_id", "user_id"},
     *                 @OA\Property(property="offer_id", type="integer", example=5),
     *                 @OA\Property(property="user_id", type="integer", example=23),
     *                 @OA\Property(property="availability", type="string", example="Immediatament disponible"),
     *                 @OA\Property(property="cv_attachment", type="string", format="binary"),
     *                 @OA\Property(property="cover_letter_attachment", type="string", format="binary")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Aplicació registrada correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Oferta registrada correctamente")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Faltan campos obligatorios o tienen errores"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="offer_id", type="array", @OA\Items(type="string", example="El campo oferta es obligatorio")),
     *                 @OA\Property(property="user_id", type="array", @OA\Items(type="string", example="El campo usuario es obligatorio"))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error del servidor")
     *         )
     *     )
     * )
     */
    public function apply(Request $request)
    {
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

        try {
            Log::info($request);
            $user = Auth::user();
            $student = Student::where('user_id', $request->input('user_id'))->first();
            $offer = Offer::where('id', $request->input('offer_id'))->first();

            Log::info($offer);
            $offerApplyUser = new OfferUser();
            $offerApplyUser->offer_id = $request->get('offer_id');
            $offerApplyUser->user_id = $request->get('user_id');


            $folder = "offers/{$offer->uuid}";
            $disk = Storage::disk('public');

            // Solo crea la carpeta si no existe
            if (!$disk->exists($folder)) {
                $disk->makeDirectory($folder, 0755, true);
            }

            if ($request->hasFile('cv_attachment')) {
                $file = $request->file('cv_attachment');
                $ext = $file->getClientOriginalExtension();
                $fileName = "cv_{$student->uuid}.{$ext}";
                $filePath = $file->storeAs($folder, $fileName, 'public');
                $offerApplyUser->cv_attachment = $filePath;
            }

            if ($request->hasFile('cover_letter_attachment')) {
                $file = $request->file('cover_letter_attachment');
                $ext = $file->getClientOriginalExtension();
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
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }


    /**
     * @OA\Put(
     *     path="/api/offers/update-candidature-status",
     *     summary="Actualitza l'estat de la candidatura d'un usuari",
     *     description="Actualitza l'estat de la candidatura d'un usuari a una oferta. Si l'estat és 'accept', es verifica si s'ha arribat al nombre màxim de vacants i s'actualitzen les candidatures pendents i l'estat de l'oferta.",
     *     operationId="updateCandidatureStatus",
     *     tags={"Offers"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"offer_id", "user_id", "status"},
     *             @OA\Property(property="offer_id", type="integer", example=10),
     *             @OA\Property(property="user_id", type="integer", example=25),
     *             @OA\Property(property="status", type="string", example="accept")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Estat de la candidatura actualitzat correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Oferta actualizada correctamente"),
     *             @OA\Property(property="offer", type="object", description="Dades detallades de l'oferta actualitzada amb relacions carregades")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Faltan campos obligatorios o tienen errores"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="offer_id", type="array", @OA\Items(type="string", example="El campo oferta es obligatorio")),
     *                 @OA\Property(property="user_id", type="array", @OA\Items(type="string", example="El campo usuario es obligatorio")),
     *                 @OA\Property(property="status", type="array", @OA\Items(type="string", example="El campo status es obligatorio"))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error del servidor")
     *         )
     *     )
     * )
     */
    public function applyUpdateStatus(Request $request)
    {
        $rules = [
            'offer_id' => 'required',
            'user_id' => 'required',
            'status' => 'required'
        ];

        $messages = [
            'offer_id.required' => 'El campo oferta es obligatorio',
            'user_id.required' => 'El campo usuario es obligatorio',
            'status.required' => 'El campo status es obligatorio',
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
            Log::info($request);
            $userUpdatedStatus = OfferUser::where('offer_id', $request->offer_id)
                ->where('user_id', $request->user_id)
                ->first();

            $userUpdatedStatus->status = $request->status;
            $userUpdatedStatus->save();

            $offer = $userUpdatedStatus
                ->offer
                ->load([
                    'usersInterested',
                    'usersAccepted',
                    'usersPending',
                    'company',
                    'usersInterested.student',
                    'usersInterested.student.skills',
                    'usersInterested.student.education',
                ]);

            if ($request->status === 'accept') {
                Log::info("han aceptado al aplicante");
                $accepted = $offer->usersAccepted;
                Log::info($accepted);
                Log::info("Accepted count:", ['count' => $accepted->count()]);
                if ($offer->vacancies <= $accepted->count()) {
                    Log::info("HA LLEGADO AL LIMITE DE ACEPTADOS PARA LA OFERTA");
                    $offerData = Offer::where('id', $offer->id)->first();
                    //si la oferta esta en -1 de active significa que llego al maximo de aceptados.
                    $offerData->active = -1;
                    $offerData->save();

                    foreach ($offer->usersPending as $userPendig) {
                        Log::info($userPendig);
                        $offerUserPending = OfferUser::where('offer_id', $offer->id)
                            ->where('user_id', $userPendig->id)
                            ->first();
                        Log::info($offerUserPending);
                        $offerUserPending->status = "rejected";
                        $offerUserPending->save();
                    }
                }
            }

            $offer = $userUpdatedStatus
                ->offer
                ->load([
                    'usersInterested',
                    'usersAccepted',
                    'usersPending',
                    'company',
                    'usersInterested.student',
                    'usersInterested.student.skills',
                    'usersInterested.student.education',
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Oferta actualizada correctamente',
                'offer' => $offer,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/offers/{offer_id}/has-applied",
     *     summary="Comprova si l'usuari autenticat ja ha aplicat a una oferta",
     *     description="Retorna si l'usuari autenticat ja ha aplicat a una oferta específica identificada per offer_id.",
     *     operationId="checkUserHasAppliedToOffer",
     *     tags={"Offers"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *
     *     @OA\Parameter(
     *         name="offer_id",
     *         in="path",
     *         required=true,
     *         description="ID de l'oferta a comprovar",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Resposta d'èxit amb el resultat del checkeo",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se ha procesado el checkeo correctamente"),
     *             @OA\Property(property="userHasApplied", type="boolean", example=true)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Oferta no trobada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Offer] 999")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Error intern del servidor",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error del servidor")
     *         )
     *     )
     * )
     */
    public function applyCheck($offer_id)
    {
        try {
            $me = Auth::user();

            $offer = Offer::findOrFail($offer_id);

            $userHasApplied = $offer->hasUserApplied($me->id);

            return response()->json([
                'status' => 'success',
                'message' => 'Se ha procesado el checkeo correctamente',
                'userHasApplied' => $userHasApplied,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }
}
