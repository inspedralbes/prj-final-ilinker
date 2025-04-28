<?php

namespace Database\Seeders;

use App\Models\Offer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/offers.json';
        if (file_exists($ruta_json)) {
            $offers = json_decode(file_get_contents($ruta_json), true);
            foreach ($offers as $offer) {
                Offer::create([
                    'uuid' => $offer['uuid'],
                    'company_id' => $offer['company_id'],
                    'title' => $offer['title'],
                    'skills' => json_encode($offer['skills']),
                    'description' => $offer['description'],
                    'address' => $offer['address'],
                    'city' => $offer['city'],
                    'postal_code' => $offer['postal_code'],
                    'salary' => $offer['salary'],
                    'active' => $offer['active'],
                    'inscribed'=> $offer['inscribed'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
