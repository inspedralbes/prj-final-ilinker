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
            $table->string('name')->unique()->nullable();
            $table->string('CIF')->unique()->nullable();
            $table->integer('num_people')->nullable();
            $table->string('logo')->nullable();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();

            //Informacion de contacto
            $table->string('email')->unique()->nullable();
            $table->integer('phone')->nullable();
            $table->string('website')->nullable();

            //Responsable de practicas
            $table->string('responsible_name')->nullable();
            $table->integer('responsible_phone')->nullable();
            $table->string('responsible_email')->unique();
            $table->string('company_position')->nullable();

            //Ubicacion de la empresa
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->integer('postal_code')->nullable();
            $table->string('country')->nullable();

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
