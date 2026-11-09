<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * List all articles with optional category filter
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');

        $query = Article::query();

        if ($category && strtolower($category) !== 'semua') {
            $query->where('category', 'like', '%' . $category . '%');
        }

        $articles = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Show single article detail by slug or id
     */
    public function show(string $slug): JsonResponse
    {
        $article = is_numeric($slug)
            ? Article::find($slug)
            : Article::where('slug', $slug)->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }
}

