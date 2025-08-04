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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('generic_name')->nullable();
            $table->string('strength')->nullable();
            $table->string('form'); // tablet, capsule, syrup, injection, etc.
            $table->foreignId('manufacturer_id')->constrained()->onDelete('cascade');
            $table->text('function')->nullable(); // what the medicine is for
            $table->text('usage_instructions')->nullable();
            $table->text('side_effects')->nullable();
            $table->string('prescription_required')->default('no'); // yes, no, controlled
            $table->decimal('general_price', 10, 2)->default(0); // general customer price
            $table->decimal('doctor_price', 10, 2)->default(0); // doctor/clinic price
            $table->decimal('prescription_price', 10, 2)->default(0); // prescription-based price
            $table->integer('units_per_strip')->default(1);
            $table->integer('strips_per_box')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['name', 'strength']);
            $table->index('generic_name');
            $table->index('manufacturer_id');
            $table->index('form');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};