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
        Schema::table('direct_chats', function (Blueprint $table) {
            //
            $table->boolean('is_bookmarked_user_one')->default(false)->after('user_two_id');
            $table->boolean('is_bookmarked_user_two')->default(false)->after('is_bookmarked_user_one');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('direct_chats', function (Blueprint $table) {
            //
            $table->dropColumn('is_bookmarked_user_one');
            $table->dropColumn('is_bookmarked_user_two');
        });
    }
};
