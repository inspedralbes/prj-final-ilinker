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
            //Informacion básica
            $table->string('name');
            $table->string('NIF');
            $table->string('type');
            $table->string('educational_level');
            $table->string('academic_sector');

            //Informacion de contacto
            $table->integer('phone');
            $table->string('email')->unique();
            $table->string('website');

            //Persona a cargo de llevar esto
            $table->string('responsible_name');
            $table->integer('responsible_phone');
            $table->string('responsible_email')->unique();
            $table->string('company_position');

            //Ubicacion de la empresa
            $table->string('address');
            $table->string('city');
            $table->string('state');


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
