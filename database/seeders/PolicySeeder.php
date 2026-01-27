<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PolicySeeder extends Seeder
{
    public function run()
    {
        DB::table('policy_list')->insert([
            [
                'category_id' => 1,
                'code' => 'POL001',
                'name' => 'Comprehensive Policy',
                'description' => 'Covers all risks',
                'description1' => 'Additional details 1',
                'description2' => 'Additional details 2',
                'duration' => 12,
                'third_party_liability' => 500000,
                'personal_accident' => 100000,
                'tppd' => 300000,
                'documentary_stamps' => 500,
                'value_added_tax' => 1200,
                'local_gov_tax' => 300,
                'cost' => 15000,
                'doc_path' => 'documents/policy_001.pdf',
                'status' => 1,
                'delete_flag' => 0,
                'date_created' => now(),
                'date_updated' => now(),
                'office_id' => 1,
            ],
            [
                'category_id' => 2,
                'code' => 'POL002',
                'name' => 'Third Party Policy',
                'description' => 'Covers third-party damages',
                'description1' => 'Additional details 1',
                'description2' => 'Additional details 2',
                'duration' => 6,
                'third_party_liability' => 300000,
                'personal_accident' => 50000,
                'tppd' => 200000,
                'documentary_stamps' => 300,
                'value_added_tax' => 800,
                'local_gov_tax' => 200,
                'cost' => 8000,
                'doc_path' => 'documents/policy_002.pdf',
                'status' => 1,
                'delete_flag' => 0,
                'date_created' => now(),
                'date_updated' => now(),
                'office_id' => 2,
            ],
        ]);
    }
}