<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Walkin extends Model
{
    use HasFactory;

    protected $table = 'walkin_list';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'contact',
        'email',
        'address',
        'vehicle_type',
        'plate_number',
        'engine_number',
        'chassis_number',
        'make',
        'model',
        'color',
        'year',
        'service_type',
        'amount',
        'payment_status',
        'status',
        'remarks',
        'date_created',
        'date_updated'
    ];

    protected $casts = [
        'date_created' => 'datetime',
        'date_updated' => 'datetime'
    ];
}