<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $table = 'application_list';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'client_id',
        'insurance_id',
        'vehicle_type',
        'plate_number',
        'engine_number',
        'chassis_number',
        'model',
        'make',
        'color',
        'year',
        'status',
        'remarks',
        'date_created',
        'date_updated'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function insurance()
    {
        return $this->belongsTo(Insurance::class);
    }
}