<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Policy extends Model
{
    use HasFactory;

    protected $table = 'policy_list';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'code',
        'name',
        'description',
        'status',
        'date_created',
        'date_updated',
        'category_id' // Added category_id to fillable
    ];

    public function insurances()
    {
        return $this->hasMany(Insurance::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id'); // Explicitly defining the relationship
    }
}