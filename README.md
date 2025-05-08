# Sora - Website Rumah Makan Salwa

## Apa itu Sora?

**Sora** adalah nama dari proyek aplikasi web ini. Ini adalah website full-stack modern untuk **Rumah Makan Salwa**, sebuah restoran yang mengkhususkan diri dalam masakan Indonesia. Website ini dirancang untuk mendigitalisasi dan menyederhanakan operasi restoran, termasuk penelusuran menu, pemesanan online, dan reservasi meja.

## Apa itu Salwa?

**Salwa** merujuk pada restoran itu sendiri: Rumah Makan Salwa. Di seluruh website dan kode, "Salwa" digunakan dalam branding, judul halaman, dan konten untuk mewakili identitas dan misi restoran.

---

## Fitur

- **Penelusuran Menu:** Lihat semua hidangan yang tersedia, filter berdasarkan kategori, dan cari makanan favorit Anda.
- **Pemesanan Online:** Tambahkan item menu ke keranjang dan lakukan checkout.
- **Sistem Reservasi:** Pesan meja terlebih dahulu dengan formulir reservasi yang mudah digunakan.
- **Autentikasi:** Daftar dan masuk sebagai pelanggan untuk mengelola pesanan dan reservasi Anda.
- **Panel Admin:** Kelola item menu, kategori, reservasi, dan lainnya (ditenagai oleh Filament dan Laravel).
- **Desain Responsif:** Bekerja di desktop dan perangkat mobile.

---

## Teknologi yang Digunakan

- **Frontend:** React (dengan Inertia.js), Tailwind CSS, Vite
- **Backend:** Laravel (PHP 8.2+)
- **Database:** MySQL atau PostgreSQL (lihat contoh `.env`)
- **Panel Admin:** Filament

---

## Memulai

### Prasyarat

- Node.js (v18+)
- npm atau yarn
- PHP (8.2+)
- Composer
- MySQL atau PostgreSQL

### Instalasi

1. **Clone repositori:**
   ```bash
   git clone https://github.com/brosora6/sora.git
   cd sora
   ```

2. **Instal dependensi PHP:**
   ```bash
   composer install
   ```

3. **Instal dependensi Node.js:**
   ```bash
   npm install
   # atau
   yarn install
   ```

4. **Salin dan konfigurasi variabel lingkungan:**
   ```bash
   # Untuk MySQL
   cp env_for_mysql.txt .env
   # ATAU untuk PostgreSQL
   cp env_for_pgsql.txt .env
   # Edit .env untuk menyesuaikan dengan pengaturan database dan email Anda
   ```

5. **Buat kunci aplikasi:**
   ```bash
   php artisan key:generate
   ```

6. **Jalankan migrasi dan seeder:**
   ```bash
   php artisan migrate --seed
   ```

7. **Buat symbolic link untuk storage dan atur permission:**
   ```bash
   php artisan storage:link
   chmod -R 775 public/storage
   ```

8. **Mulai server pengembangan:**
   - Jalankan perintah berikut untuk memulai backend Laravel dan frontend Vite:
     ```bash
     composer run dev
     ```

9. **Akses website:**
   - **Superadmin:** Akses panel admin di [http://127.0.0.1:8000/superadmin](http://127.0.0.1:8000/superadmin)
   - **Admin:** Akses panel admin di [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
   - **Pelanggan:** Akses frontend di [http://127.0.0.1:8000](http://127.0.0.1:8000) (atau seperti yang ditunjukkan di terminal Anda)

---

## Penggunaan

- **Telusuri Menu:** Pergi ke halaman Menu untuk melihat semua hidangan.
- **Pesan Makanan:** Tambahkan item ke keranjang dan lanjutkan ke checkout.
- **Buat Reservasi:** Gunakan halaman Reservasi untuk memesan meja.
- **Akses Admin:** Masuk sebagai admin untuk mengelola menu, reservasi, dan lainnya (lihat panel Filament).
- **Akun Pelanggan:** Daftar atau masuk untuk melihat pesanan dan reservasi Anda.

---

## Berkontribusi

1. Fork repositori
2. Buat branch baru (`git checkout -b fitur/fitur-anda`)
3. Commit perubahan Anda
4. Push ke fork Anda dan buka Pull Request

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.

---

## Kredit

- Tim Rumah Makan Salwa
- Tim pengembangan Sora
- Dibangun dengan Laravel, React, Inertia.js, dan Filament
