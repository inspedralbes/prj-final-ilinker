<?php

namespace Database\Seeders;

use App\Models\OfferUser;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OfferUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/offers_user.json';
        if (file_exists($ruta_json)) {
            $offers = json_decode(file_get_contents($ruta_json), true);
            foreach ($offers as $offer) {
                OfferUser::create([
                    'offer_id' => $offer['offer_id'],
                    'user_id' => $offer['user_id'],
                    'cover_letter_attachment' => $offer['cover_letter_attachment'],
                    'cv_attachment' => $offer['cv_attachment'],
                    'availability' => $offer['availability'],
                    'status' => $offer['status'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
