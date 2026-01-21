<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LtoTransaction extends Model
{
    use HasFactory;

    protected $table = 'lto_transactions';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'client_id',
        'transaction_type',
        'vehicle_type',
        'plate_number',
        'engine_number',
        'chassis_number',
        'make',
        'series',
        'body_type',
        'year_model',
        'gross_weight',
        'net_capacity',
        'fuel',
        'file_type',
        'amount',
        'or_number',
        'cr_number',
        'plate_release',
        'sticker_number',
        'remarks',
        'status',
        'date_created',
        'date_updated'
    ];

    protected $casts = [
        'date_created' => 'datetime',
        'date_updated' => 'datetime',
        'plate_release' => 'datetime'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}