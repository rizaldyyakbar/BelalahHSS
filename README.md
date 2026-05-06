# Belalah HSS Project

Project fullstack Belalah HSS dengan Frontend React JS dan Backend Laravel.

## Struktur Project

```
Belalah HSS/
├── frontend/          # React JS Application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── backend/           # Laravel Application
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── composer.json
│   └── README.md
└── README.md
```

## Quick Start

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Dokumentasi

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
