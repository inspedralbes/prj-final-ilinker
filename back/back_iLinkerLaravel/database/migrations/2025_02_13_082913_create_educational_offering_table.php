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
        Schema::create('educational_offering', function (Blueprint $table) {
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
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_offering');
    }
};
