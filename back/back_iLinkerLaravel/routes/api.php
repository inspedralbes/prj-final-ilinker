<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfferController;
use \App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/user')->group(function () {
    Route::post('/create', [UserController::class, 'create'])->name('user.create');
});

Route::prefix('/company')->group(function () {
    Route::post('/create',[CompanyController::class,'create'])->name('company.create');
    Route::post('/update',[CompanyController::class,'update'])->name('company.update');
    Route::post('/delete',[CompanyController::class,'delete'])->name('company.delete');
});

Route::prefix('/offers')->group(function () {
    Route::post('/create', [OfferController::class, 'create'])->name('offers.create');
    Route::post('/update', [OfferController::class, 'update'])->name('offers.update');
    Route::post('/delete', [OfferController::class, 'delete'])->name('offers.delete');
});
