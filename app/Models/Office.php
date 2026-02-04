<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory;

    protected $table = 'office_list';

    protected $fillable = [
        'office_name',
        'office_address',
        'status',
        'delete_flag'
    ];

    protected $casts = [
        'status' => 'integer',
        'delete_flag' => 'integer'
    ];
}
