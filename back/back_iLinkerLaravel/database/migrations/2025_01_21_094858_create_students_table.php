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
        Schema::create('students', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');

            //Formacion básica
            $table->string('name');
            $table->string('surname');
            $table->enum('type_document', ['DNI', 'NIE', 'PASAPORTE']);
            $table->string('id_document');
            $table->string('nationality')->nullable();
            $table->string('photo_pic')->nullable();
            $table->date('birthday')->nullable();
            $table->enum('gender',['Masculino', 'Femenino', 'No decir'])->nullable();

            //Informacion del contacte
            $table->integer('phone')->nullable();

            //Datos de vivienda
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();

            //Datos academicos
            $table->json('languages')->nullable()->default(null);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
