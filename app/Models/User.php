<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'username',
        'email',
        'password',
        'avatar',
        'activation_key',
        'expiration_date',
        'last_login',
        'type',
        'status',
        'permissions',
        'credit',
        'date_added',
        'date_updated',
        'credit_date',
        'credit_voucher_used',
        'last_credit_update',
        'office_id',
        'email_verified_at',
        'remember_token',
        // Subscription fields
        'subscription_type',
        'subscription_start_date',
        'subscription_end_date',
        'last_payment_date',
        'subscription_amount',
        'notification_sent',
        'notification_sent_at',
        // QR Code fields
        'gcash_qr_path',
        'maya_qr_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
