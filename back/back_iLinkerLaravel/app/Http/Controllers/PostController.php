<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller {
    public function index() {
        return Post::with(['user', 'comments.user', 'likes'])->latest()->get();
    }

    public function store(Request $request) {
        $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $imagePath = $request->file('image') ? $request->file('image')->store('posts') : null;

        return Auth::user()->posts()->create([
            'content' => $request->content,
            'image' => $imagePath
        ]);
    }

    public function show(Post $post) {
        return $post->load(['user', 'comments.user', 'likes']);
    }
}

