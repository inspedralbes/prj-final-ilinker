<?php

namespace Database\Seeders;

use App\Models\Institutions;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // Importamos Str para generar el slug

class InstitutionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/institutions.json';
        if (file_exists($ruta_json)) {
            $json = file_get_contents($ruta_json);
            $institutions = json_decode($json, true);
            
            foreach ($institutions as $institution) {
                Institutions::create([
                    'user_id'            => $institution['user_id'] ?? null,
                    'name'               => $institution['name'] ?? null,
                    'slug'               => isset($institution['slug']) && !empty($institution['slug'])
                                              ? $institution['slug']
                                              : Str::slug($institution['name'], '_'),
                    'custom_url'         => $institution['custom_url'] ?? null,
                    'slogan'             => $institution['slogan'] ?? null,
                    'about'              => $institution['about'] ?? null,
                    'NIF'                => $institution['NIF'] ?? null,
                    'type'               => $institution['type'] ?? null,
                    'academic_sector'    => $institution['academic_sector'] ?? null,
                    'logo'               => $institution['logo'] ?? null,
                    'phone'              => $institution['phone'] ?? null,
                    'email'              => $institution['email'] ?? null,
                    'website'            => $institution['website'] ?? null,
                    'responsible_name'   => $institution['responsible_name'] ?? null,
                    'responsible_phone'  => $institution['responsible_phone'] ?? null,
                    'responsible_email'  => $institution['responsible_email'] ?? null,
                    'institution_position'=> $institution['institution_position'] ?? null,
                    'address'            => $institution['address'] ?? null,
                    'city'               => $institution['city'] ?? null,
                    'country'            => $institution['country'] ?? null,
                    'postal_code'        => $institution['postal_code'] ?? null,
                    'location'           => $institution['location'] ?? null,
                    'size'               => $institution['size'] ?? null,
                    'sector'             => $institution['sector'] ?? null,
                    'founded_year'       => $institution['founded_year'] ?? null,
                    'languages'          => $institution['languages'] ?? null,
                    'cover'              => $institution['cover'] ?? null,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        }
    }
}
