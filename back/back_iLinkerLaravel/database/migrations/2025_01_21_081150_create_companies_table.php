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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            //Informacion básica
            $table->string('name');
            $table->string('CIF')->unique();
            $table->string('sector');
            $table->integer('num_people');

            //Informacion de contacto
            $table->string('email')->unique();
            $table->integer('phone');
            $table->string('website');

            //Responsable de practicas
            $table->string('responsible_name');
            $table->integer('responsible_phone');
            $table->string('responsible_email')->unique();
            $table->string('company_position');

            //Ubicacion de la empresa
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->integer('postal_code');
            $table->string('country');

            $table->foreign('user_id')->references('id')->on('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
