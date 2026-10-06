<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\RecommendationController;

// Public endpoints with rate limiting
Route::get('/facilities/nearby', [FacilityController::class, 'nearby'])
    ->middleware('throttle:100,1')
    ->name('facilities.nearby');
Route::get('/categories', [CategoryController::class, 'index'])
    ->middleware('throttle:100,1')
    ->name('categories.index');

Route::get('/destinations/{id}', [DestinationController::class, 'show'])
    ->middleware('throttle:100,1')
    ->name('destinations.show');

Route::get('/recommendations', [RecommendationController::class, 'index'])
    ->middleware('throttle:100,1')
    ->name('recommendations.index');

Route::post('/routes/optimized', [RecommendationController::class, 'optimizeRoute'])
    ->middleware('throttle:100,1')
    ->name('routes.optimized');

// Protected endpoint (requires auth token) for authenticated users with higher rate limit
Route::get('/recommendations/protected', [RecommendationController::class, 'index'])
    ->middleware('auth:sanctum', 'throttle:300,1')
    ->name('recommendations.protected');

