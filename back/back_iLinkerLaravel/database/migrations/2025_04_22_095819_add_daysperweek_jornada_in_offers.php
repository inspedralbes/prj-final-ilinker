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
        Schema::table('offers', function (Blueprint $table) {
            //
            $table->enum('schedule_type', ['full', 'part', 'negociable'])->after('location_type')->nullable();
            $table->integer('days_per_week')->after('schedule_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            //
            $table->dropColumn('schedule_type');
            $table->dropColumn('days_per_week');

        });
    }
};
