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
        Schema::create('educational__offering', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();  // Para almacenar el id "fp-daw"
            $table->string('title');
            $table->string('department');
            $table->string('type');
            $table->string('duration');
            $table->string('schedule');
            $table->string('logo')->nullable();
            $table->json('tags');  // Almacenará el array de tags como JSON
            $table->text('description');
            $table->json('modules');  // Almacenará el array de módulos como JSON
            $table->json('job_opportunities');  // Almacenará el array de oportunidades laborales como JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational__offering');
    }
};
