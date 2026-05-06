# Belalah HSS - Backend

Backend aplikasi Belalah HSS menggunakan Laravel.

## Setup

### Prerequisites
- PHP >= 8.1
- Composer
- MySQL/MariaDB

### Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Server akan berjalan di http://localhost:8000

## Struktur Folder

- `app/` - Aplikasi core (Models, Controllers, dll)
- `routes/` - Definisi routes
- `resources/` - Views, CSS, JS
- `database/` - Migrations dan seeders
- `storage/` - File uploads dan cache
- `public/` - Assets yang dapat diakses publik
