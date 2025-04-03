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
        Schema::create('institution_publications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->string('title');
            $table->text('content')->nullable(); // Descripción o contenido de la publicación
            $table->string('image')->nullable();

            // Columnas para estadísticas
            $table->unsignedInteger('likes')->default(0);
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('shares')->default(0);

            // Fecha de publicación
            $table->timestamp('published_at')->nullable();

            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');                       
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_publications');
    }
};
