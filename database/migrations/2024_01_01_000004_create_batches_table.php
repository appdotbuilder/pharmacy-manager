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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_number');
            $table->foreignId('medicine_id')->constrained()->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->date('manufacture_date')->nullable();
            $table->date('expiry_date');
            $table->decimal('purchase_price', 10, 2);
            $table->integer('initial_quantity'); // in pieces
            $table->integer('current_quantity'); // remaining pieces
            $table->boolean('is_consignment')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['medicine_id', 'expiry_date']);
            $table->index('batch_number');
            $table->index('expiry_date');
            $table->index('is_consignment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};