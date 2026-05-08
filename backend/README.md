# Backend Belalah HSS

Backend ini memakai Laravel dan Filament untuk admin panel, serta API rekomendasi destinasi.

## Fitur Utama

- Admin panel untuk kategori, destinasi, fasilitas, kriteria, dan nilai destinasi.
- Upload gambar destinasi/fasilitas.
- Endpoint rekomendasi berbasis data lokasi dan SAW.
- Queue job untuk proses thumbnail gambar.

## Kebutuhan

- PHP dan Composer
- PostgreSQL
- Queue worker bila ingin thumbnail diproses otomatis

## Setup

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

Jika ingin job berjalan otomatis saat upload gambar:

```bash
php artisan queue:work
```

## Endpoint API

- `GET /api/recommendations`

Query parameter:

- `lat` wajib, latitude pengguna
- `lng` wajib, longitude pengguna
- `limit` opsional, default 10
- `sort` opsional, nilai `score` atau `distance`
- `pretty` opsional, isi apa saja untuk JSON rapi

Contoh:

```bash
curl "http://127.0.0.1:8000/api/recommendations?lat=-6.2&lng=106.8&limit=5&sort=distance&pretty=1"
```

## Alur Data Gambar

- `image_url` menyimpan path file asli.
- `image_thumb_url` menyimpan thumbnail jika job queue berhasil jalan.
- Jika thumbnail belum ada, API fallback ke `image_url`.

## Catatan Pengembangan

- Kerjakan fitur di branch terpisah.
- Commit kecil dan jelas.
- Push branch ke GitHub sebelum merge.
