<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * List all tourism categories with destination counts
     */
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->withCount('destinations')
            ->orderBy('id', 'asc')
            ->get(['id', 'name', 'slug']);

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
