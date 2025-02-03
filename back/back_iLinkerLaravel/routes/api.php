<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfferController;
use \App\Http\Controllers\UserController;
use \App\Http\Controllers\InstitutionController;
use \App\Http\Controllers\AuthController;
use \App\Http\Controllers\CambiarContraseñaController;
use \App\Http\Controllers\StudentEducationController;
use \App\Http\Controllers\ExperienceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    // ruta para enviar el código de recuperación de contraseña
    Route::post('/sendRecoveryCode', [CambiarContraseñaController::class, 'sendCode']);
    Route::post('/verifyCode', [CambiarContraseñaController::class, 'verifyCode']);
    Route::post('/resetPassword', [CambiarContraseñaController::class, 'resetPassword']);
});

Route::prefix('/users')->group(function () {
    Route::post('/update', [UserController::class, 'update'])->name('user.update');
    Route::post('/delete', [UserController::class, 'delete'])->name('user.delete');
    Route::get('/info', [UserController::class, 'getUser'])->name('get.user');
    Route::post('/deactivate', [UserController::class, 'deactivate'])->name('user.deactivate');
    Route::post('/activate', [UserController::class, 'activate'])->name('user.activate');
});

Route::prefix('/company')->group(function () {
    Route::post('/update', [CompanyController::class, 'update'])->name('company.update');
    Route::post('/delete', [CompanyController::class, 'delete'])->name('company.delete');
});

Route::prefix('/institution')->group(function () {
    Route::post('/update', [InstitutionController::class, 'update'])->name('institution.update');
    Route::post('/delete', [InstitutionController::class, 'delete'])->name('institution.delete');
});

Route::prefix('/education')->group(function () {
    Route::post('/create', [StudentEducationController::class, 'create'])->name('create.education');
    Route::post('/update', [StudentEducationController::class, 'update'])->name('update.education');
    Route::delete('/delete', [StudentEducationController::class, 'delete'])->name('delete.education');
});

Route::prefix('/experience')->group(function () {
    Route::post('/create', [ExperienceController::class, 'create'])->name('create.experience');
    Route::post('/update',[ExperienceController::class, 'udpate'])->name('update.experience');
    Route::delete('/delete', [ExperienceController::class, 'delete'])->name('delete.experience');
});

Route::prefix('/offers')->group(function () {
    Route::post('/create', [OfferController::class, 'create'])->name('offers.create');
    Route::post('/update', [OfferController::class, 'update'])->name('offers.update');
    Route::post('/delete', [OfferController::class, 'delete'])->name('offers.delete');
});
