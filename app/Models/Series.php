<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Series extends Model
{
    use HasFactory;

    protected $table = 'series'; // Ensure this matches the database table name
    protected $fillable = ['name', 'range_start', 'range_stop', 'created_at', 'status', 'type', 'online', 'office_id'];
}
