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
        Schema::create('instittions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            //Información básica
            $table->string('name');
            $table->string('NIF');
            $table->string('type');
            $table->string('academic_sector');
            $table->string('logo')->nullable();

            //Informacion de contacto
            $table->integer('phone');
            $table->string('email')->unique();
            $table->string('website');

            //Persona a cargo de llevar esto
            $table->string('responsible_name');
            $table->integer('responsible_phone');
            $table->string('responsible_email')->unique();
            $table->string('institution_position');

            //Ubicacion de la institucion
            $table->string('address');
            $table->string('city');
            $table->string('country');
            $table->string('postal_code');

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
