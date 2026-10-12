<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Quick Admin Access (Easter egg auto-login ke dashboard Filament tanpa form login)
Route::get('/quick-admin', function () {
    $admin = User::where('email', env('ADMIN_EMAIL', 'admin@belalah-hss.id'))->first()
        ?? User::where('role', 'admin')->first()
        ?? User::first();

    if ($admin) {
        Auth::login($admin, true);
        return redirect('/admin');
    }

    return redirect('/admin/login');
})->name('quick.admin');
