<?php

namespace Database\Seeders;

use App\Models\Sector;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = '../resources/json/sectors.json';
        if (file_exists($ruta_json)) {
            $json = file_get_contents($ruta_json);
            $sectors = json_decode($json, true);
            foreach ($sectors as $sector) {
                Sector::create([
                    'name' => $sector['name'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
