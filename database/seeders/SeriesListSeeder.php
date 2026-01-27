<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeriesListSeeder extends Seeder
{
    public function run()
    {
        DB::table('series')->insert([
            [
                'id' => 1,
                'name' => 'Pacific Series',
                'range_start' => 1000,
                'range_stop' => 2000,
                'created_at' => now(),
                'status' => 1,
                'type' => 0, // Pacific
                'online' => 1,
                'office_id' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Liberty Series',
                'range_start' => 3000,
                'range_stop' => 4000,
                'created_at' => now(),
                'status' => 1,
                'type' => 1, // Liberty
                'online' => 0,
                'office_id' => 1,
            ],
        ]);
    }
}
