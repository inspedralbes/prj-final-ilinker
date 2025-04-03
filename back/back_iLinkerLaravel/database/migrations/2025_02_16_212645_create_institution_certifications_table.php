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
<<<<<<<< HEAD:back/back_iLinkerLaravel/database/migrations/2025_02_13_084420_create_job_opportunities_table.php
        Schema::create('job_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
========
        Schema::create('institution_certifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->string('name');
            $table->string('issued_by')->nullable();
            $table->string('year')->nullable();
            $table->foreign('institution_id')->references('id')->on('institutions');
>>>>>>>> dev-clara:back/back_iLinkerLaravel/database/migrations/2025_02_16_212645_create_institution_certifications_table.php
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
<<<<<<<< HEAD:back/back_iLinkerLaravel/database/migrations/2025_02_13_084420_create_job_opportunities_table.php
        Schema::dropIfExists('job_opportunities');
========
        Schema::dropIfExists('institution_certifications');
>>>>>>>> dev-clara:back/back_iLinkerLaravel/database/migrations/2025_02_16_212645_create_institution_certifications_table.php
    }
};
