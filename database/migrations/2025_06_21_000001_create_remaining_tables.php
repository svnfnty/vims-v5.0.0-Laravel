<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create category_list first since it's referenced by policy_list
        if (!Schema::hasTable('category_list')) {
            Schema::create('category_list', function (Blueprint $table) {
                $table->integer('id')->autoIncrement(); // Match the MySQL schema type
                $table->text('name');
                $table->text('description');
                $table->tinyInteger('status')->default(1);
                $table->tinyInteger('delete_flag')->default(0);
                $table->datetime('date_created')->useCurrent();
                $table->datetime('date_updated')->nullable();
                $table->integer('office_id');
            });
        }

        if (!Schema::hasTable('policy_list')) {
            Schema::create('policy_list', function (Blueprint $table) {
                $table->integer('id')->autoIncrement(); // Match the MySQL schema type
                $table->integer('category_id'); // Match the referenced column type
                $table->string('code', 100);
                $table->text('name');
                $table->text('description');
                $table->text('description1');
                $table->string('description2', 255);
                $table->float('duration')->default(0);
                $table->string('third_party_liability', 15);
                $table->string('personal_accident', 10)->nullable();
                $table->string('tppd', 10)->default('0');
                $table->string('documentary_stamps', 10);
                $table->string('value_added_tax', 10);
                $table->string('local_gov_tax', 10);
                $table->float('cost')->default(0);
                $table->text('doc_path')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->tinyInteger('delete_flag')->default(0);
                $table->datetime('date_created')->useCurrent();
                $table->datetime('date_updated')->nullable();
                $table->integer('office_id');

                $table->foreign('category_id')
                    ->references('id')
                    ->on('category_list')
                    ->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('client_list')) {
            Schema::create('client_list', function (Blueprint $table) {
                $table->integer('id')->autoIncrement(); // Match the MySQL schema type
                $table->string('code', 100);
                $table->text('firstname');
                $table->text('middlename')->nullable();
                $table->text('lastname');
                $table->string('markup', 100)->default('LIBERTY');
                $table->date('dob')->nullable();
                $table->text('contact')->nullable();
                $table->text('email')->nullable();
                $table->text('address');
                $table->text('image_path')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->tinyInteger('delete_flag')->default(0);
                $table->datetime('date_created')->useCurrent();
                $table->datetime('date_updated')->nullable();
                $table->integer('office_id');
            });
        }

        if (!Schema::hasTable('contract_signatures')) {
            Schema::create('contract_signatures', function (Blueprint $table) {
                $table->id();
                $table->integer('user_id');
                $table->text('signature_data');
                $table->string('signature_dataname', 255);
                $table->datetime('signed_at');
            });
        }

        if (!Schema::hasTable('insurance_list')) {
            Schema::create('insurance_list', function (Blueprint $table) {
                $table->integer('id')->autoIncrement(); // Match the MySQL schema type
                $table->integer('client_id');
                $table->integer('policy_id');
                $table->string('code', 100);
                $table->string('document_path', 255)->nullable();
                $table->text('registration_no');
                $table->text('chassis_no');
                $table->string('engine_no', 255);
                $table->text('vehicle_model');
                $table->string('vehicle_color', 255);
                $table->date('registration_date');
                $table->date('expiration_date');
                $table->float('cost')->default(0);
                $table->string('new', 10)->default('0');
                $table->string('make', 255);
                $table->string('or_no', 255);
                $table->integer('coc_no');
                $table->integer('policy_no');
                $table->string('mvfile_no', 255);
                $table->string('auth_no', 255);
                $table->string('auth_renewal', 19);
                $table->tinyInteger('status')->default(1);
                $table->datetime('date_created')->useCurrent();
                $table->datetime('date_updated')->nullable();
                $table->string('image', 255)->nullable();
                $table->integer('policy_status')->default(0);
                $table->datetime('policy_daterelease')->nullable();
                $table->date('official_datereleased')->nullable();
                $table->integer('payment')->default(1);
                $table->integer('rsu')->nullable();
                $table->string('remarks', 255)->nullable();
                $table->integer('office_id');

                $table->foreign('client_id')
                    ->references('id')
                    ->on('client_list')
                    ->onDelete('cascade');
                $table->foreign('policy_id')
                    ->references('id')
                    ->on('policy_list')
                    ->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('activity_log')) {
            Schema::create('activity_log', function (Blueprint $table) {
                $table->integer('id')->autoIncrement();
                $table->string('activity', 255)->nullable();
                $table->string('session', 255);
                $table->timestamp('created_at')->useCurrent();
                $table->integer('office_id');
            });
        }

        if (!Schema::hasTable('chat_history')) {
            Schema::create('chat_history', function (Blueprint $table) {
                $table->id();
                $table->integer('user_id')->nullable();
                $table->text('message')->nullable();
                $table->text('response');
                $table->timestamp('timestamp')->useCurrent();
            });
        }

        if (!Schema::hasTable('licenses')) {
            Schema::create('licenses', function (Blueprint $table) {
                $table->id();
                $table->integer('userid');
                $table->string('username', 255);
                $table->string('email', 255);
                $table->string('action_type', 100);
                $table->string('user_type', 100)->nullable();
                $table->integer('status')->default(0);
                $table->string('ref_id', 255);
                $table->string('gen', 255);
            });
        }

        if (!Schema::hasTable('maintenance_mode')) {
            Schema::create('maintenance_mode', function (Blueprint $table) {
                $table->id();
                $table->string('activity', 255);
                $table->integer('status');
            });
        }

        if (!Schema::hasTable('markup_history')) {
            Schema::create('markup_history', function (Blueprint $table) {
                $table->id();
                $table->integer('client_id')->nullable();
                $table->string('markup', 255)->nullable();
                $table->timestamp('date_created')->useCurrent();
                $table->integer('office_id');
            });
        }

        if (!Schema::hasTable('notifications')) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->id();
                $table->string('title', 255)->nullable();
                $table->text('message')->nullable();
                $table->timestamp('date')->useCurrent();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->string('type', 50)->default('primary');
            });
        }

        if (!Schema::hasTable('series')) {
            Schema::create('series', function (Blueprint $table) {
                $table->id();
                $table->string('name', 255);
                $table->integer('range_start');
                $table->integer('range_stop');
                $table->date('created_at');
                $table->integer('status')->default(1);
                $table->integer('type')->comment('0=pacific,1=liberty');
                $table->integer('online')->default(0);
                $table->integer('office_id');
            });
        }

        if (!Schema::hasTable('system_info')) {
            Schema::create('system_info', function (Blueprint $table) {
                $table->id();
                $table->text('meta_field')->nullable();
                $table->text('meta_value')->nullable();
            });
        }

        if (!Schema::hasTable('total_revenue')) {
            Schema::create('total_revenue', function (Blueprint $table) {
                $table->id();
                $table->decimal('revenue', 10, 0);
                $table->date('stored_at')->nullable();
            });
        }

        if (!Schema::hasTable('transfers')) {
            Schema::create('transfers', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('sender_id');
                $table->unsignedBigInteger('recipient_id');
                $table->decimal('amount', 10, 2);
                $table->enum('status', ['pending', 'accepted', 'declined'])->default('pending');
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (!Schema::hasTable('vouchers')) {
            Schema::create('vouchers', function (Blueprint $table) {
                $table->id();
                $table->string('code', 32)->unique();
                $table->integer('credit_value')->comment('Amount of credits this voucher provides');
                $table->tinyInteger('is_used')->default(0)->comment('0=unused, 1=used');
                $table->datetime('created_at')->useCurrent();
                $table->datetime('expiry_date')->comment('Voucher expiration date');
                $table->datetime('used_at')->nullable()->comment('When voucher was redeemed');
                $table->integer('used_by')->nullable()->comment('User ID who redeemed this voucher');
                $table->integer('created_by')->nullable()->comment('Admin/user ID who created this voucher');
                $table->enum('voucher_type', ['promotional', 'compensation', 'trial', 'other'])->default('promotional');
                $table->string('description', 255)->nullable();
            });
        }

        if (!Schema::hasTable('walkin_list')) {
            Schema::create('walkin_list', function (Blueprint $table) {
                $table->id();
                $table->string('email', 255);
                $table->integer('accountID');
                $table->string('name', 50);
                $table->string('color', 50);
                $table->integer('status')->default(1);
                $table->string('description', 5000)->nullable();
                $table->integer('office_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('walkin_list');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('transfers');
        Schema::dropIfExists('total_revenue');
        Schema::dropIfExists('system_info');
        Schema::dropIfExists('series');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('markup_history');
        Schema::dropIfExists('maintenance_mode');
        Schema::dropIfExists('licenses');
        Schema::dropIfExists('ip_addresses');
        Schema::dropIfExists('insurance_list');
        Schema::dropIfExists('policy_list');
        Schema::dropIfExists('contract_signatures');
        Schema::dropIfExists('client_list');
        Schema::dropIfExists('chat_history');
        Schema::dropIfExists('category_list');
        Schema::dropIfExists('activity_log');
    }
};