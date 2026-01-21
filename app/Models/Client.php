<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    // Specify the table name
    protected $table = 'client_list';

    // Specify the primary key
    protected $primaryKey = 'id';

    // Allow mass assignment for the following fields
    protected $fillable = [
        'code',
        'name',
        'contact',
        'email',
        'address',
        'status'
    ];

    // Disable timestamps if the table doesn't have `created_at` and `updated_at`
    public $timestamps = false;

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function insurances()
    {
        return $this->hasMany(Insurance::class);
    }
}
