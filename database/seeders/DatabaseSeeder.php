<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        // \App\Models\Post::factory(50)->create();
        // \App\Models\Comment::factory(200)->create();
        $this->call(UsersTableSeeder::class);
        $this->call(CategoryListSeeder::class);
        $this->call(PolicyListSeeder::class);
        $this->call(ClientListSeeder::class);
        $this->call(InsuranceListSeeder::class);
        
       
    }
}