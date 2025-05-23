<?php

namespace Database\Seeders;

use App\Models\Report;
use Illuminate\Database\Seeder;

class RepotrsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = resource_path('./resources/json/reports.json');
        if (file_exists($ruta_json)) {
            $json = file_get_contents($ruta_json);
            $reports = json_decode($json, true);
            foreach ($reports as $report) {
                Report::create([
                    'id' => $report['id'],
                    'reported_user_id' => $report['reported_user_id'],
                    'reporter_user_id' => $report['reporter_user_id'],
                    'reason' => $report['reason'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
