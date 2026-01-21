<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    use HasFactory;

    // Specify the table name
    protected $table = 'insurance_list';

    // Specify the primary key
    protected $primaryKey = 'id';

    // Allow mass assignment for the following fields
    protected $fillable = [
        'client_id', 'policy_id', 'code', 'document_path', 'registration_no', 
        'chassis_no', 'engine_no', 'vehicle_model', 'vehicle_color', 
        'registration_date', 'expiration_date', 'cost', 'new', 'make', 
        'or_no', 'coc_no', 'policy_no', 'mvfile_no', 'auth_no', 
        'auth_renewal', 'status', 'remarks', 'date_created', 'date_updated', 
        'image', 'policy_status', 'policy_daterelease', 'official_datereleased', 
        'payment', 'rsu', 'office_id'
    ];

    // Disable timestamps if the table doesn't have `created_at` and `updated_at`
    public $timestamps = false;

    // Define the relationship with the Client model
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'id'); // Ensure correct foreign key and local key
    }

    public function policies()
    {
        return $this->hasMany(Policy::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
