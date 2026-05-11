<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\RecommendationController;

// Public endpoint with rate limiting (100 requests per minute per IP)
Route::get('/recommendations', [RecommendationController::class, 'index'])
    ->middleware('throttle:100,1')
    ->name('recommendations.index');

// Protected endpoint (requires auth token) for authenticated users with higher rate limit
Route::get('/recommendations/protected', [RecommendationController::class, 'index'])
    ->middleware('auth:sanctum', 'throttle:300,1')
    ->name('recommendations.protected');
