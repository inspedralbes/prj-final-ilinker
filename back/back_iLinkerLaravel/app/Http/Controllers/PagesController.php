<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Sector;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PagesController extends Controller
{
    //
    /**
     * @OA\Get(
     *     path="/api/register/data",
     *     summary="Obtiene los sectores y países para la página de registro",
     *     description="Obtiene sectores desde la base de datos y países desde una API externa. Si la petición a la API externa falla, se devuelve un array vacío de países.",
     *     operationId="getSectorsAndCountries",
     *     tags={"Registro"},
     *     @OA\Response(
     *         response=200,
     *         description="Datos cargados correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="sectors",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Tecnología")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="countries",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(
     *                         property="name",
     *                         type="object",
     *                         @OA\Property(property="common", type="string", example="Spain"),
     *                         @OA\Property(property="official", type="string", example="Kingdom of Spain")
     *                     ),
     *                     @OA\Property(property="cca2", type="string", example="ES"),
     *                     @OA\Property(property="region", type="string", example="Europe")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los datos",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occurred while fetching data"),
     *             @OA\Property(property="error", type="string", example="Detalles del error")
     *         )
     *     )
     * )
     */
    public function registerPage()
    {
        try {
            // Obtener habilidades desde la base de datos
            $sectors = Sector::all('id', 'name');

            // Obtener países desde la API externa
            $response = Http::get('https://restcountries.com/v3.1/all');

            // Verificar si la solicitud fue exitosa
            if ($response->successful()) {
                $countries = $response->json();
            } else {
                $countries = []; // En caso de error, se devuelve un array vacío
            }

            return response()->json([
                'status' => 'success',
                'sectors' => $sectors,
                'countries' => $countries
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching data',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/ofertas/ultimas",
     *     summary="Obtiene las últimas ofertas de prácticas activas paginadas",
     *     description="Devuelve una paginación de 5 ofertas activas más recientes, incluyendo la empresa relacionada y los usuarios interesados.",
     *     operationId="getLatestInternshipOffers",
     *     tags={"Ofertas"},
     *     @OA\Response(
     *         response=200,
     *         description="Ofertas obtenidas correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se han enviado las ofertas correctamente"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=123),
     *                         @OA\Property(property="title", type="string", example="Práctica en Desarrollo Web"),
     *                         @OA\Property(
     *                             property="company",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=10),
     *                             @OA\Property(property="name", type="string", example="Empresa XYZ")
     *                         ),
     *                         @OA\Property(
     *                             property="users_interested",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=1),
     *                                 @OA\Property(property="name", type="string", example="Usuario 1")
     *                             )
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(property="first_page_url", type="string", example="https://example.com/api/ofertas/ultimas?page=1"),
     *                 @OA\Property(property="last_page", type="integer", example=3),
     *                 @OA\Property(property="last_page_url", type="string", example="https://example.com/api/ofertas/ultimas?page=3"),
     *                 @OA\Property(property="next_page_url", type="string", example="https://example.com/api/ofertas/ultimas?page=2"),
     *                 @OA\Property(property="prev_page_url", type="string", nullable=true, example=null),
     *                 @OA\Property(property="per_page", type="integer", example=5),
     *                 @OA\Property(property="total", type="integer", example=15)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener los datos",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occurred while fetching data"),
     *             @OA\Property(property="error", type="string", example="Detalles del error")
     *         )
     *     )
     * )
     */
    public function searchPractices()
    {
        try {
            $latestOffers = Offer::with(['company', 'usersInterested'])
                ->where('active', 1)
                ->latest()
                ->paginate(5);

            return response()->json([
                'status' => 'success',
                'message' => 'Se han enviado las ofertas correctamente',
                'data' => $latestOffers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching data',
                'error' => $e->getMessage()
            ]);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/ofertas/buscar",
     *     summary="Busca ofertas de prácticas filtradas por varios criterios",
     *     description="Filtra ofertas de prácticas por texto libre, ubicación, tipo de jornada, modalidad de ubicación y fecha de creación.",
     *     operationId="searchInternshipOffers",
     *     tags={"Ofertas"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="searchQuery", type="string", example="Desarrollo Web"),
     *             @OA\Property(
     *                 property="locationQuery",
     *                 type="object",
     *                 @OA\Property(property="lat", type="number", format="float", example=41.3851),
     *                 @OA\Property(property="lng", type="number", format="float", example=2.1734)
     *             ),
     *             @OA\Property(property="scheduleTypeQuery", type="string", example="Tiempo completo"),
     *             @OA\Property(property="locationTypeQuery", type="string", example="remoto"),
     *             @OA\Property(property="dateQuery", type="string", enum={"24", "week", "month", "any"}, example="week")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Ofertas filtradas correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Ofertas filtradas correctamente"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=123),
     *                         @OA\Property(property="title", type="string", example="Práctica en Desarrollo Web"),
     *                         @OA\Property(
     *                             property="company",
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=10),
     *                             @OA\Property(property="name", type="string", example="Empresa XYZ")
     *                         ),
     *                         @OA\Property(
     *                             property="users_interested",
     *                             type="array",
     *                             @OA\Items(
     *                                 @OA\Property(property="id", type="integer", example=1),
     *                                 @OA\Property(property="name", type="string", example="Usuario 1")
     *                             )
     *                         )
     *                     )
     *                 ),
     *                 @OA\Property(property="first_page_url", type="string", example="https://example.com/api/ofertas/buscar?page=1"),
     *                 @OA\Property(property="last_page", type="integer", example=3),
     *                 @OA\Property(property="last_page_url", type="string", example="https://example.com/api/ofertas/buscar?page=3"),
     *                 @OA\Property(property="next_page_url", type="string", example="https://example.com/api/ofertas/buscar?page=2"),
     *                 @OA\Property(property="prev_page_url", type="string", nullable=true, example=null),
     *                 @OA\Property(property="per_page", type="integer", example=5),
     *                 @OA\Property(property="total", type="integer", example=15)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener las ofertas",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Error fetching data"),
     *             @OA\Property(property="error", type="string", example="Mensaje detallado del error")
     *         )
     *     )
     * )
     */
    public function searchPracticeFiltered(Request $request)
    {
        try {
            $query = Offer::with(['company', 'usersInterested'])
                ->where('active', 1);

            // 1) Texto libre
            if ($search = $request->input('searchQuery')) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('skills', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // 2) Ubicación (si lat/lng válidos)
            $loc = $request->input('locationQuery', []);
            if (!empty($loc['lat']) && !empty($loc['lng'])) {
                $delta = 0.1;
                $query->whereBetween('lat', [$loc['lat'] - $delta, $loc['lat'] + $delta])
                    ->whereBetween('lng', [$loc['lng'] - $delta, $loc['lng'] + $delta]);
            }

            // 3) Tipo de jornada
            if ($schedule = $request->input('scheduleTypeQuery')) {
                $query->where('schedule_type', $schedule);
            }

            // 4) Modalidad
            if ($locType = $request->input('locationTypeQuery')) {
                $query->where('location_type', $locType);
            }

            // 5) Fecha según dropdown: "24", "week", "month", "any"
            if ($date = $request->input('dateQuery')) {
                switch ($date) {
                    case '24':
                        // últimas 24 horas
                        $query->where('created_at', '>=', now()->subDay());
                        break;
                    case 'week':
                        // última semana
                        $query->where('created_at', '>=', now()->subWeek());
                        break;
                    case 'month':
                        // último mes
                        $query->where('created_at', '>=', now()->subMonth());
                        break;
                    case 'any':
                    default:
                        // sin filtro de fecha
                        break;
                }
            }

            // Paginación de 5 en 5
            $offers = $query->latest()->paginate(5);

            return response()->json([
                'status' => 'success',
                'message' => 'Ofertas filtradas correctamente',
                'data' => $offers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching data',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/api/empresa/perfil/opcions",
     *     summary="Obtiene información de sectores y habilidades para el perfil de empresa",
     *     description="Devuelve todos los sectores y habilidades disponibles para configurar el perfil de una empresa.",
     *     operationId="getCompanyProfileOptions",
     *     tags={"Empresa"},
     *     @OA\Response(
     *         response=200,
     *         description="Datos obtenidos correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Se han enviado las ofertas correctamente"),
     *             @OA\Property(
     *                 property="sectors",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Tecnología")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="skills",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="JavaScript")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error al obtener datos",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="An error occurred while fetching data"),
     *             @OA\Property(property="error", type="string", example="Missatge detallat de l'error")
     *         )
     *     )
     * )
     */
    public function profileCompany()
    {
        try {
            $sectors = Sector::all('id', 'name');
            $skills = Skill::all('id', 'name');

            return response()->json([
                'status' => 'success',
                'message' => 'Se han enviado las ofertas correctamente',
                'sectors' => $sectors,
                'skills' => $skills
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching data',
                'error' => $e->getMessage()
            ]);
        }
    }
}
