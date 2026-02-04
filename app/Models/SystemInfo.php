<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemInfo extends Model
{
    use HasFactory;

    protected $table = 'system_info';

    protected $fillable = ['meta_field', 'meta_value'];

    public $timestamps = false; // Assuming no timestamps in the table
}
