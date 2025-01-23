<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfferController;
use \App\Http\Controllers\UserController;
use \App\Http\Controllers\InstitutionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/users')->group(function () {
    Route::post('/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/update', [UserController::class, 'update'])->name('user.update');
    Route::post('/delete', [UserController::class, 'delete'])->name('user.delete');
});

Route::prefix('/company')->group(function () {
    Route::post('/update',[CompanyController::class,'update'])->name('company.update');
    Route::post('/delete',[CompanyController::class,'delete'])->name('company.delete');
});

Route::prefix('/institution')->group(function () {
    Route::post('/update', [InstitutionController::class, 'update'])->name('institution.update');
    Route::post('/delete', [InstitutionController::class, 'delete'])->name('institution.delete');
});

Route::prefix('/offers')->group(function () {
    Route::post('/create', [OfferController::class, 'create'])->name('offers.create');
    Route::post('/update', [OfferController::class, 'update'])->name('offers.update');
    Route::post('/delete', [OfferController::class, 'delete'])->name('offers.delete');
});
