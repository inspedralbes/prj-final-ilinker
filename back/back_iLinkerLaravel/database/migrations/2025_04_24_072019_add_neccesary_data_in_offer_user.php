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
        Schema::table('offer_users', function (Blueprint $table) {
            //
            $table->string('cover_letter_attachment')->nullable()->after('user_id');
            $table->string('cv_attachment')->nullable()->after('cover_letter_attachment');
            $table->string('availability')->nullable()->after('cv_attachment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offer_users', function (Blueprint $table) {
            //
            $table->dropColumn('cover_letter_attachment');
            $table->dropColumn('cv_attachment');
            $table->dropColumn('availability');
        });
    }
};
