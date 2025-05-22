<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller {
    public function toggle(Post $post) {
        $user = Auth::user();

        if ($post->isLikedBy($user)) {
            $post->likes()->detach($user->id);
            return response()->json(['liked' => false]);
        } else {
            $post->likes()->attach($user->id);
            return response()->json(['liked' => true]);
        }
    }
}

