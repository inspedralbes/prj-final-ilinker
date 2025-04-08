<?php

use App\Http\Controllers\SectorController;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\AuthController;
use \App\Http\Controllers\UserController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\PagesController;
use \App\Http\Controllers\SkillController;
use App\Http\Controllers\SkillsController;
use App\Http\Controllers\CompanyController;
use \App\Http\Controllers\ExperienceController;
use App\Http\Controllers\Auth\GoogleController;
use \App\Http\Controllers\InstitutionController;
use \App\Http\Controllers\StudentEducationController;
use \App\Http\Controllers\CambiarContraseñaController;

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
Route::post('auth/google', [GoogleController::class, 'loginWithGoogle']);


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
    Route::get('/{slug}', [CompanyController::class, 'getCompany'])->name('company.getCompany');
    Route::post('/checkCompanyUser', [CompanyController::class, 'checkCompanyUser'])->name('company.checkCompanyUser');
});

Route::prefix('/institution')->group(function () {
    Route::get('/', [InstitutionController::class, 'index'])->name('institution.index');
    Route::post('/store', [InstitutionController::class, 'store'])->middleware('auth:sanctum')->name('institution.store');
    Route::get('/{id}', [InstitutionController::class, 'show'])->name('institution.show');
    Route::post('/update', [InstitutionController::class, 'update'])->middleware('auth:sanctum')->name('institution.update');
    Route::delete('/{id}', [InstitutionController::class, 'destroy'])->middleware('auth:sanctum')->name('institution.delete');
    Route::get('/custom/{customUrl}', [InstitutionController::class, 'getByCustomUrl'])->name('institution.getByCustomUrl');
});

Route::prefix('/education')->group(function () {
    Route::post('/create', [StudentEducationController::class, 'create'])->name('create.education');
    Route::post('/update', [StudentEducationController::class, 'update'])->name('update.education');
    Route::delete('/delete', [StudentEducationController::class, 'delete'])->name('delete.education');
});

Route::prefix('/experience')->group(function () {
    Route::post('/create', [ExperienceController::class, 'create'])->name('create.experience');
    Route::post('/update', [ExperienceController::class, 'update'])->name('update.experience');
    Route::delete('/delete', [ExperienceController::class, 'delete'])->name('delete.experience');
});

Route::prefix('/skill')->group(function () {
    Route::post('/create', [SkillController::class, 'create'])->name('create.skill');
    Route::post('/assignment', [SkillController::class, 'assignment'])->name('assignment.skill');
});

Route::prefix('/offers')->group(function () {
    Route::post('/create', [OfferController::class, 'create'])->name('offers.create');
    Route::post('/update', [OfferController::class, 'update'])->name('offers.update');
    Route::post('/delete', [OfferController::class, 'delete'])->name('offers.delete');
});

Route::prefix('/skills')->group(function () {
    Route::get('/', [SkillsController::class, 'getSkills']);
});

Route::prefix('/sectors')->group(function () {
    Route::get('/', [SectorController::class, 'getSectors']);
});

Route::prefix('/page')->group(function (){
   Route::get('/register', [PagesController::class, 'registerPage']);
   Route::get('/search', [PagesController::class, 'searchPractices']);
   Route::get('/profile/company', [PagesController::class, 'profileCompany']);
});
