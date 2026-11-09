<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'read_time',
        'snippet',
        'content',
        'image_url',
        'author',
    ];

    protected $casts = [
        'content' => 'array',
    ];
}

