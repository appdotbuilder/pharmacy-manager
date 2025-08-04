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
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('medicine_id')->constrained()->onDelete('cascade');
            $table->foreignId('batch_id')->constrained()->onDelete('cascade');
            $table->integer('quantity'); // quantity sold
            $table->enum('unit_type', ['piece', 'strip', 'box'])->default('piece');
            $table->decimal('unit_price', 10, 2); // price per unit
            $table->decimal('total_price', 12, 2); // quantity * unit_price
            $table->decimal('cost_price', 10, 2); // for profit calculation
            $table->timestamps();
            
            $table->index('sale_id');
            $table->index(['medicine_id', 'batch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};