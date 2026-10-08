# Panduan Deployment Belalah HSS (Production)

Dokumen ini berisi panduan komprehensif langkah-demi-langkah untuk mendeploy aplikasi fullstack **Belalah HSS** (Frontend React 19 + Backend Laravel 12 & Filament 5).

---

## 🏗️ Arsitektur Rekomendasi Deployment

1. **Frontend (Client Web SPA):**
   - Platform: **Vercel**, **Netlify**, **Cloudflare Pages**, atau **Nginx VPS**.
   - Output: Static Build (`dist/`).
2. **Backend (API & Admin Panel):**
   - Platform: **VPS (Ubuntu 22.04/24.04)**, **Railway**, **Render**, atau **Cloud Server**.
   - Database: **PostgreSQL (didukung ekstensi PostGIS)**.

---

## 🚀 Bagian 1: Deployment Backend (Laravel + Filament)

### 1. Persyaratan Server
- PHP >= 8.3 dengan ekstensi: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `intl`, `json`, `libxml`, `mbstring`, `openssl`, `pcre`, `pdo_pgsql`, `session`, `tokenizer`, `xml`.
- Database: **PostgreSQL** dengan ekstensi **PostGIS** aktif:
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```
- Composer >= 2.x
- Web Server: Nginx / Apache
- Process Manager: Supervisor (untuk `php artisan queue:work`)

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env` pada server:
```bash
cp .env.example .env
```
Sesuaikan variabel penting untuk production:
```env
APP_NAME="Belalah HSS"
APP_ENV=production
APP_KEY= # Generate dengan php artisan key:generate
APP_DEBUG=false
APP_URL=https://api.domain-kamu.com

# URL Frontend (PENTING untuk CORS)
FRONTEND_URL=https://domain-frontend-kamu.com
CORS_ALLOWED_ORIGINS=https://domain-frontend-kamu.com,https://www.domain-frontend-kamu.com

# Database PostgreSQL + PostGIS
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=belalah_production
DB_USERNAME=belalah_user
DB_PASSWORD=PasswordKuatKamu!

# Storage & Upload Media
FILESYSTEM_DISK=public

# Admin Akun Awal (Digunakan saat seeder)
ADMIN_EMAIL=admin@belalah-hss.id
ADMIN_PASSWORD=GantiPasswordKuatAdmin123!
ADMIN_NAME="Administrator Belalah HSS"
```

### 3. Perintah Setup di Server Backend
Jalankan langkah-langkah berikut di direktori `backend/`:

```bash
# 1. Install dependensi production (tanpa dev packages)
composer install --no-dev --optimize-autoloader

# 2. Generate application key (jika belum ada)
php artisan key:generate --force

# 3. Jalankan migrasi database
php artisan migrate --force

# 4. (Opsional) Jalankan seeder data awal destinasi & kriteria SAW
php artisan db:seed --force

# 5. Buat symbolic link storage untuk foto destinasi
php artisan storage:link

# 6. Cache konfigurasi, rute, dan blade untuk performa maksimal
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 4. Konfigurasi Nginx untuk Backend
Contoh blok server Nginx (`/etc/nginx/sites-available/belalah-backend`):
```nginx
server {
    listen 80;
    server_name api.domain-kamu.com;
    root /var/www/belalah/backend/public;

    index index.php index.html;

    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 🌐 Bagian 2: Deployment Frontend (React + Vite)

### Opsi A: Deploy ke Vercel (Paling Mudah)
1. Push branch `main` ke repository GitHub.
2. Buka dashboard [Vercel](https://vercel.com) dan klik **Add New Project**.
3. Import repository BelalahHSS.
4. Set **Root Directory** ke: `frontend`.
5. Buka bagian **Environment Variables** dan tambahkan:
   - `VITE_API_BASE_URL` = `https://api.domain-kamu.com/api`
   - `VITE_STORAGE_BASE_URL` = `https://api.domain-kamu.com`
6. Klik **Deploy**.
*(File `vercel.json` sudah disediakan otomatis untuk menangani rewrite rute SPA).*

### Opsi B: Deploy ke Netlify
1. Buka [Netlify](https://netlify.com) -> **Import from Git**.
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Tambahkan Environment Variables: `VITE_API_BASE_URL` dan `VITE_STORAGE_BASE_URL`.
*(File `public/_redirects` sudah disertakan otomatis).*

### Opsi C: Deploy Static di VPS Nginx
1. Pada laptop/CI:
   ```bash
   cd frontend
   npm install
   VITE_API_BASE_URL=https://api.domain-kamu.com/api npm run build
   ```
2. Upload folder `frontend/dist/` ke server, misal `/var/www/belalah/frontend/dist`.
3. Konfigurasi Nginx:
   ```nginx
   server {
       listen 80;
       server_name domain-frontend-kamu.com;
       root /var/www/belalah/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## 🛡️ Checklist Pasca-Deployment

- [ ] SSL/HTTPS terpasang pada kedua domain (Frontend & Backend) menggunakan Let's Encrypt / Cloudflare.
- [ ] Tes akses Admin Panel di `https://api.domain-kamu.com/admin` dan pastikan login berhasil.
- [ ] Tes upload foto destinasi di Admin Panel dan pastikan foto muncul di frontend tanpa error 404.
- [ ] Tes fitur pencarian rekomendasi SAW & optimasi rute di frontend.
- [ ] Pastikan me-refresh halaman `/destinasi/1` di browser tidak menghasilkan error 404.
