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
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            //Información básica
            $table->string('name')->unique()->nullable();
            $table->string('slug')->unique()->nullable();
            $table->string('custom_url')->nullable();
            $table->string('slogan')->nullable();
            $table->text('about')->nullable();
            $table->string('NIF')->unique()->nullable();
            $table->string('type')->nullable();
            $table->string('academic_sector')->nullable();
            $table->string('location')->nullable();
            $table->string('size')->nullable();
            $table->string('sector')->nullable();
            $table->string('founded_year')->nullable();
            $table->json('languages')->nullable();
            $table->json('specialties')->nullable();

            // Imagenes de la institucion
            $table->string('logo')->nullable();
            $table->string('cover')->nullable();

            //Informacion de contacto
            $table->string('website')->nullable();
            $table->integer('phone')->nullable();
            $table->string('email')->unique()->nullable();

            //Persona a cargo de llevar esto
            $table->string('responsible_name');
            $table->integer('responsible_phone')->nullable();
            $table->string('responsible_email')->unique();
            $table->string('institution_position')->nullable();

            //Ubicacion de la institucion
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();

            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instittions');
    }
};
