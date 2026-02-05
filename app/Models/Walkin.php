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
        'email',
        'accountID',
        'name',
        'color',
        'status',
        'description',
        'office_id', 
        'payment_status',
        'delete_flag'
    ];

    protected $casts = [
        'date_created' => 'datetime',
        'date_updated' => 'datetime'
    ];

    /**
     * Get the office that owns the walkin.
     */
    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }
}
