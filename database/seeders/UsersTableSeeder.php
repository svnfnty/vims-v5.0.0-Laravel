<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'id' => 1,
                'firstname' => 'Admin',
                'middlename' => 'Super',
                'lastname' => 'User',
                'username' => 'adminuser',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'avatar' => null,
                'activation_key' => null,
                'expiration_date' => null,
                'last_login' => null,
                'type' => 1, // Changed from 'admin' to 1
                'status' => 1,
                'permissions' => 1,
                'credit' => 0,
                'date_added' => now(),
                'date_updated' => now(),
                'credit_date' => null,
                'credit_voucher_used' => null,
                'last_credit_update' => null,
                'office_id' => 1,
                'email_verified_at' => now(),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'firstname' => 'Sample',
                'middlename' => 'Test',
                'lastname' => 'User',
                'username' => 'sampleuser',
                'email' => 'user@example.com',
                'password' => Hash::make('password'),
                'avatar' => null,
                'activation_key' => null,
                'expiration_date' => null,
                'last_login' => null,
                'type' => 2, // Changed from 'user' to 2
                'status' => 1,
                'permissions' => 2,
                'credit' => 0,
                'date_added' => now(),
                'date_updated' => now(),
                'credit_date' => null,
                'credit_voucher_used' => null,
                'last_credit_update' => null,
                'office_id' => 1,
                'email_verified_at' => now(),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
