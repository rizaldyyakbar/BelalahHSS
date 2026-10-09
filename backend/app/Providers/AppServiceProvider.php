<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            $host = request()->getHost();
            if (!in_array($host, ['localhost', '127.0.0.1', '::1'], true)) {
                URL::forceScheme('https');
            }
        } catch (\Throwable) {
            if (env('APP_ENV') === 'production') {
                URL::forceScheme('https');
            }
        }
    }
}
