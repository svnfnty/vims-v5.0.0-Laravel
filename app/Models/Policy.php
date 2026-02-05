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
        'name',
        'code',
        'description',
        'description1',
        'description2',
        'duration',
        'third_party_liability',
        'personal_accident',
        'tppd',
        'documentary_stamps',
        'value_added_tax',
        'local_gov_tax',
        'cost',
        'doc_path',
        'status',
        'date_created',
        'date_updated',
        'category_id',
        'office_id'
    ];

    public function insurances()
    {
        return $this->hasMany(Insurance::class, 'policy_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id'); // Explicitly defining the relationship
    }
}