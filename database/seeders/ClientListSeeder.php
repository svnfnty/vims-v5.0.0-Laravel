<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientListSeeder extends Seeder
{
    public function run()
    {
        DB::table('client_list')->insert([
            [
                'id' => 1,
                'code' => 'CL001',
                'firstname' => 'John',
                'middlename' => 'A.',
                'lastname' => 'Doe',
                'markup' => 'Standard',
                'dob' => '1990-01-01',
                'contact' => '1234567890',
                'email' => 'john.doe@example.com',
                'address' => '123 Main St, Cityville',
                'image_path' => 'images/john_doe.jpg',
                'status' => 1, // Changed from 'Active' to 1
                'delete_flag' => 0,
                'date_created' => now(),
                'date_updated' => now(),
                'office_id' => 1,
            ],
            [
                'id' => 2,
                'code' => 'CL002',
                'firstname' => 'Jane',
                'middlename' => 'B.',
                'lastname' => 'Smith',
                'markup' => 'Premium',
                'dob' => '1985-05-15',
                'contact' => '0987654321',
                'email' => 'jane.smith@example.com',
                'address' => '456 Elm St, Townsville',
                'image_path' => 'images/jane_smith.jpg',
                'status' => 0, // Changed from 'Inactive' to 0
                'delete_flag' => 0,
                'date_created' => now(),
                'date_updated' => now(),
                'office_id' => 2,
            ],
        ]);
    }
}
