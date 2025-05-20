<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user('sanctum')) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        return $next($request);
    }
}
