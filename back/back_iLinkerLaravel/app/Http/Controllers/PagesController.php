<?php

namespace App\Http\Controllers;

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
}
