# Belalah HSS

Fullstack project untuk rekomendasi destinasi wisata dan pengelolaan data lewat admin panel.

## Struktur

```
Belalah HSS/
├── frontend/   # React app
├── backend/    # Laravel app + Filament admin
└── README.md
```

## Alur Kerja

1. Buat branch baru untuk tiap fitur atau perbaikan.
2. Kerjakan perubahan di branch itu.
3. Uji perubahan sebelum commit.
4. Push branch ke GitHub.
5. Buat pull request ke branch utama.

## Quick Start

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

Jika pakai upload gambar atau job queue:

```bash
php artisan queue:work
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Dokumentasi

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## Branch Naming

- `feature/...` untuk fitur baru
- `fix/...` untuk perbaikan bug
- `docs/...` untuk dokumentasi
