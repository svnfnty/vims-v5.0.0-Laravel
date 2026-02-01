<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    // Specify the correct table name
    protected $table = 'client_list';

    // Specify the primary key
    protected $primaryKey = 'id';

    // Allow mass assignment for the following fields
    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'email',
        'address',
        'contact',
        'dob',
        'markup',
        'status',
        'delete_flag',
        'date_created',
        'date_updated',
        'image_path',
        'office_id',
        'code'
    ];

    // Disable timestamps if the table doesn't have `created_at` and `updated_at`
    public $timestamps = false;

    // Define the relationship with Insurance model
    public function insurances()
    {
        return $this->hasMany(Insurance::class, 'client_id', 'id');
    }
}
