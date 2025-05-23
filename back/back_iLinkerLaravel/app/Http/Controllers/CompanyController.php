<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanySector;
use App\Models\CompanySkills;
use App\Models\User;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    private $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

//    public function update(Request $request){
//
//        /*
//        $check = $this->companyService->checkIFCompanyExists($validated);
//        if($check){
//            return response()->json(['status'=>'warning','message' => 'Company already exists']);
//        }*/
//
//        $company = $this->companyService->updateCompany($request);
//        return response()->json(['status'=>'success','company' => $company]);
//    }


    /**
     * @OA\Post(
     *     path="/api/company/update",
     *     summary="Actualiza la información de una empresa",
     *     description="Actualiza los datos de una empresa, incluyendo el logo, la portada, sectores, habilidades y ofertas relacionadas.",
     *     operationId="updateCompany",
     *     tags={"Empresas"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"id"},
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nombre Empresa"),
     *                 @OA\Property(property="description", type="string", example="Descripción de la empresa"),
     *                 @OA\Property(property="logo", type="file", description="Logo de la empresa (opcional)"),
     *                 @OA\Property(property="cover_photo", type="file", description="Foto de portada de la empresa (opcional)"),
     *                 @OA\Property(
     *                     property="sectors",
     *                     type="string",
     *                     example="[{'id':1,'name':'Tecnología'}]",
     *                     description="JSON string con sectores"
     *                 ),
     *                 @OA\Property(
     *                     property="skills",
     *                     type="string",
     *                     example="[{'id':2,'name':'Desarrollo Web'}]",
     *                     description="JSON string con habilidades"
     *                 ),
     *                 @OA\Property(
     *                     property="offers",
     *                     type="string",
     *                     example="[{'id':5,'title':'Oferta de empleo'}]",
     *                     description="JSON string con ofertas"
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Empresa actualizada correctamente",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Empresa actualizada correctamente"),
     *             @OA\Property(property="company", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Nombre Empresa"),
     *                 @OA\Property(property="logo", type="string", example="companies/logo_1.jpg"),
     *                 @OA\Property(property="cover_photo", type="string", example="companies/cover_photo_1.jpg"),
     *                 @OA\Property(property="sectors", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="skills", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="offers", type="array", @OA\Items(type="object")),
     *                 @OA\Property(property="followers", type="integer", example=42)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="No se encontró la empresa",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No se encontró la empresa")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        Log::info($request->all());

        $company = Company::findOrFail($request->id);
        $data = $request->except('id');

        if ($request->hasFile('logo')) {
            $fileName = "logo_{$company->id}." . $request->file('logo')->getClientOriginalExtension();
            $path = $request->file('logo')->move(storage_path('app/public/companies'), $fileName);
            $data['logo'] = "companies/{$fileName}"; // Ruta relativa para servirla correctamente
        }

        if ($request->hasFile('cover_photo')) {
            $fileName = "cover_photo_{$company->id}." . $request->file('cover_photo')->getClientOriginalExtension();
            $path = $request->file('cover_photo')->move(storage_path('app/public/companies'), $fileName);
            $data['cover_photo'] = "companies/{$fileName}"; // Ruta relativa para servirla correctamente
        }

        $company->update($data);

        $sectors = json_decode($data['sectors'] ?? '[]', true) ?: [];
        $skills = json_decode($data['skills'] ?? '[]', true) ?: [];
        $offers = json_decode($data['offers'] ?? '[]', true) ?: [];

        // Guardar sectores
        foreach ($sectors as $sector) {
            $exists = CompanySector::where('company_id', $company->id)
                ->where('sector_id', $sector['id'])
                ->exists();
            if (!$exists) {
                CompanySector::create([
                    'company_id' => $company->id,
                    'sector_id' => $sector['id']
                ]);
            }
        }

        // Guardar skills
        foreach ($skills as $skill) {
            $exists = CompanySkills::where('company_id', $company->id)
                ->where('skill_id', $skill['id'])
                ->exists();
            if (!$exists) {
                CompanySkills::create([
                    'company_id' => $company->id,
                    'skill_id' => $skill['id']
                ]);
            }
        }

        $company = Company::with(['sectors', 'skills', 'offers', 'offers.company', 'offers.usersInterested'])->findOrFail($company->id);

        $companyFollowers = User::findOrFail($company->user_id)
            ->followers->count();

        $company->followers = $companyFollowers;
        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'company' => $company
        ]);
    }


    /**
     * @OA\Get(
     *     path="/api/companies/{slug}",
     *     summary="Obtener información de una empresa por su slug",
     *     description="Recupera los datos de una empresa usando el identificador único 'slug'.",
     *     operationId="getCompanyBySlug",
     *     tags={"Companies"},
     *     @OA\Parameter(
     *         name="slug",
     *         in="path",
     *         required=true,
     *         description="Slug único que identifica a la empresa",
     *         @OA\Schema(type="string", example="empresa-ejemplo")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Empresa encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="company",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Empresa Ejemplo"),
     *                 @OA\Property(property="slug", type="string", example="empresa-ejemplo")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Empresa no encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Company not found")
     *         )
     *     )
     * )
     */

    public function getCompany($slug)
    {
        $company = Company::where('slug', $slug)->first();

        if (!$company) {
            return response()->json([
                'status' => 'error',
                'message' => 'Company not found'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'company' => $company
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/companies",
     *     summary="Obtener todas las empresas registradas",
     *     description="Intenta recuperar todas las compañías mediante el servicio companyService.",
     *     operationId="getAllCompanies",
     *     tags={"Companies"},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de empresas recuperado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="companies",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Empresa 1"),
     *                     @OA\Property(property="slug", type="string", example="empresa-1"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-05-01T12:00:00Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-05-10T12:00:00Z")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron empresas",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Company not found 222")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno del servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Mensaje de error del servidor")
     *         )
     *     )
     * )
     */
    public function allCompanies()
    {
        try {
            $companies = $this->companyService->allCompanys();

            if (!$companies) {
                return response()->json(['status' => 'error', 'message' => 'Company not found 222']);
            }

            return response()->json(['status' => 'success', 'companies' => $companies]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }



    /**
     * @OA\Post(
     *     path="/api/company/is-owner",
     *     summary="Verifica si un usuario es dueño de una compañía",
     *     description="Valida si el usuario logueado es el dueño de la compañía indicada por ID.",
     *     operationId="checkCompanyOwnership",
     *     tags={"Companies"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id_company"},
     *             @OA\Property(property="id_company", type="integer", example=1, description="ID de la compañía a verificar"),
     *             @OA\Property(property="id_user_loged", type="integer", example=5, description="ID del usuario logueado (opcional)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario es dueño o no de la compañía",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="El usuario es dueño de la compañia"),
     *             @OA\Property(property="admin", type="boolean", example=true),
     *             @OA\Property(
     *                 property="company",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Empresa Ejemplo"),
     *                 @OA\Property(property="sectors", type="array", @OA\Items(type="string")),
     *                 @OA\Property(property="skills", type="array", @OA\Items(type="string")),
     *                 @OA\Property(property="offers", type="array", @OA\Items(type="string")),
     *                 @OA\Property(property="followers", type="integer", example=10)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Faltan campos obligatorios o tienen errores",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Faltan campos obligatorios o tienen errores"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="id_company",
     *                     type="array",
     *                     @OA\Items(type="string", example="El id del company es requerido")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error interno",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error message")
     *         )
     *     )
     * )
     */
    public function checkCompanyUser(Request $request)
    {
        $rules = [
            'id_company' => 'required',
        ];

        $messages = [
            'id_company.required' => 'El id del company es requerido',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Faltan campos obligatorios o tienen errores',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $idUserLoged = $request->input('id_user_loged');

            $idCompany = $request->input('id_company');

            $companyToCheck = Company::with(['sectors', 'skills', 'offers', 'offers.company', 'offers.usersInterested'])->findOrFail($idCompany);

            $companyFollowers = User::findOrFail($companyToCheck->user_id)
                ->followers->count();

            $companyToCheck->followers = $companyFollowers;

            if ($idUserLoged === null) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'El usuario no es dueño de la compañia',
                    'admin' => false,
                    'company' => $companyToCheck
                ]);
            }

            if ($companyToCheck->user_id === $idUserLoged) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'El usuario es dueño de la compañia',
                    'admin' => true,
                    'company' => $companyToCheck
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'El usuario no es dueño de la compañia',
                'admin' => false,
                'company' => $companyToCheck
            ]);


        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

}
