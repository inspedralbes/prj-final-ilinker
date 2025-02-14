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
        Schema::table('students', function (Blueprint $table) {
            // Información del centro
            $table->text('description')->nullable();

            // Arrays y objetos JSON
            $table->json('levels')->nullable();
            $table->json('social_media')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Revertir los cambios
            $table->dropColumn([
                'description',
                'levels',
                'social_media'
            ]);
        });
    }
};
