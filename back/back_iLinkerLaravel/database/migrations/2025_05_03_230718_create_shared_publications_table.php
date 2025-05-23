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
        Schema::create('shared_publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('original_publication_id')->constrained('publications')->onDelete('cascade');
            $table->text('content')->nullable(); // Comentario del usuario al compartir
            $table->timestamps();
            
            // Índices para mejorar el rendimiento
            $table->index(['user_id', 'created_at']);
            $table->index('original_publication_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_publications');
    }
}; 