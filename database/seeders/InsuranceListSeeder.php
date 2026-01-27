<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceListSeeder extends Seeder
{
    public function run()
    {
        DB::table('insurance_list')->insert([
            [
                'client_id' => 1, 
                'policy_id' => 1, 
                'code' => 'INS001',
                'document_path' => 'documents/policy_001.pdf',
                'registration_no' => 'ABC123',
                'chassis_no' => 'CH123456789',
                'engine_no' => 'EN987654321',
                'vehicle_model' => 'Toyota Corolla',
                'vehicle_color' => 'White',
                'registration_date' => '2025-01-01',
                'expiration_date' => '2026-01-01',
                'cost' => 15000.00,
                'new' => '1', // Changed from integer 1 to string '1'
                'make' => 'Toyota',
                'or_no' => 'OR12345',
                'coc_no' => 1, // Changed from 'COC12345' to 1
                'policy_no' => 12345, // Changed from 'POL12345' to 12345
                'mvfile_no' => 'MV12345',
                'auth_no' => 1, // Connected to category_list table (id = 1)
                'auth_renewal' => '0', // Changed from integer 0 to string '0'
                'status' => 1, // Active
                'date_created' => now(),
                'date_updated' => now(),
                'image' => 'images/insurance_001.jpg',
                'policy_status' => 1, // Released
                'policy_daterelease' => '2025-01-02',
                'official_datereleased' => '2025-01-03',
                'payment' => 1, // Changed from 'Paid' to 1
                'rsu' => 12345, // Changed from 'RSU12345' to 12345
                'remarks' => 'No issues',
                'office_id' => 1,
            ],
            [
                'client_id' => 2, // Connected to client_list table (id = 2)
                'policy_id' => 2, // Connected to policy_list table (id = 2)
                'code' => 'INS002',
                'document_path' => 'documents/policy_002.pdf',
                'registration_no' => 'XYZ456',
                'chassis_no' => 'CH987654321',
                'engine_no' => 'EN123456789',
                'vehicle_model' => 'Honda Civic',
                'vehicle_color' => 'Black',
                'registration_date' => '2025-02-01',
                'expiration_date' => '2026-02-01',
                'cost' => 18000.00,
                'new' => '0', // Changed from integer 0 to string '0'
                'make' => 'Honda',
                'or_no' => 'OR67890',
                'coc_no' => 67890, // Changed from 'COC67890' to 67890
                'policy_no' => 67890, // Changed from 'POL67890' to 67890
                'mvfile_no' => 'MV67890',
                'auth_no' => 2, // Connected to category_list table (id = 2)
                'auth_renewal' => '1', // Changed from integer 1 to string '1'
                'status' => 0, // Inactive
                'date_created' => now(),
                'date_updated' => now(),
                'image' => 'images/insurance_002.jpg',
                'policy_status' => 0, // Pending
                'policy_daterelease' => null,
                'official_datereleased' => null,
                'payment' => 0, // Changed from 'Unpaid' to 0
                'rsu' => 67890, // Changed from 'RSU67890' to 67890
                'remarks' => 'Pending renewal',
                'office_id' => 2,
            ],
        ]);
    }
}
