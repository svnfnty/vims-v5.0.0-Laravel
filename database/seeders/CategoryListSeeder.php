<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryListSeeder extends Seeder
{
    public function run()
    {
        DB::table('category_list')->insert([
            [
                'id' => 1,
                'name' => 'Category A',
                'description' => 'Description for Category A',
                'status' => 1,
                'delete_flag' => 0,
                'date_created' => now(),
                'date_updated' => now(),
                'office_id' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Category B',
                'description' => 'Description for Category B',
                'status' => 1,
                'delete_flag' => 0,
                'date_created' => now(),
                'date_updated' => now(),
                'office_id' => 1,
            ],
        ]);
    }
}
