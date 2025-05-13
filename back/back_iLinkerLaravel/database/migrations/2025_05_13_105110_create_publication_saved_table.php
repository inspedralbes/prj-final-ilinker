<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublicationSavedTable extends Migration
{
    public function up()
    {
        Schema::create('publication_saveds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('publication_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Un usuario solo puede guardar una vez la misma publicación
            $table->unique(['user_id', 'publication_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('publication_saveds');
    }
}