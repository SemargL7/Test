<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $appName = env('APP_NAME');

        $cspHeader = "default-src 'self'; script-src 'self' cdn.example.com; style-src 'self' 'unsafe-inline';" .
            " report-uri /csp-report?app={$appName}";

        $response->header('Content-Security-Policy', $cspHeader);

        return $response;
    }
}
