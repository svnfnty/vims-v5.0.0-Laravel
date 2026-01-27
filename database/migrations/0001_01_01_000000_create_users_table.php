<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname', 250);
            $table->text('middlename')->nullable();
            $table->string('lastname', 250);
            $table->text('username');
            $table->string('email')->unique();
            $table->text('password');
            $table->text('avatar')->nullable();
            $table->string('activation_key', 255)->nullable();
            $table->date('expiration_date')->nullable();
            $table->integer('last_login')->nullable();
            $table->tinyInteger('type')->default(0);
            $table->integer('status')->default(0)->comment('0=not verified, 1 = verified');
            $table->integer('permissions')->default(0)->comment('0- no access,1= can modify, 2= can print');
            $table->integer('credit')->nullable();
            $table->datetime('date_added')->useCurrent();
            $table->datetime('date_updated')->nullable();
            $table->datetime('credit_date')->nullable();
            $table->string('credit_voucher_used', 255)->nullable();
            $table->date('last_credit_update')->nullable();
            $table->integer('office_id');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
