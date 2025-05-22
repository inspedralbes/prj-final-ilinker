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
