# Supabase Setup & Architecture

Panduan lengkap penggunaan **Supabase** pada proyek **Eka Ryan Digital Solution** — pengganti Cloudflare D1 (database) + R2 (storage) yang lama.

> **Project ref**: `sqimmcecwuoadjbjiyfd` · Region `ap-southeast-1` (Singapore)
> **Project URL**: `https://sqimmcecwuoadjbjiyfd.supabase.co`

## Peran Supabase

| Lapisan | Dulu (Cloudflare) | Sekarang (Supabase) |
|---------|-------------------|---------------------|
| Database | D1 (`DB`) | PostgreSQL (tabel `public.*`) |
| File/gambar | R2 (`uploads/`) | Storage bucket `assets` |
| Audio | R2 (`backsound.mp3`) | Storage bucket `audio` |
| API backend | Pages Functions `/api/*` | **Tidak ada** — browser akses langsung via supabase-js |

Cloudflare Pages sekarang **hanya hosting statis** (`./public`). Semua data & file disimpan di Supabase.

## Skema

Skema lengkap ada di [`supabase/schema.sql`](../supabase/schema.sql) dan sudah diterapkan ke project. Tabel:

- `config` — pengaturan hero, kontak, sosial, jaminan & kualitas (1 baris, `id='main'`).
- `services` + `service_details` + `service_tags` — layanan + detail poin + tag.
- `workflow` — langkah alur kerja.
- `skills` — keahlian.
- `add_ons` — fitur tambahan (dikelompokkan per kategori).
- `messages` — pesan kontak (kolom `add_ons` text berisi JSON string, `is_read` integer 0/1).

Relasi: `services 1—* service_details`, `services 1—* service_tags`.

### Menjalankan ulang skema (mis. ke project baru)

```bash
# Opsional: koneksi langsung lewat pooler (IPv4) bila perlu perintah SQL manual
psql "postgresql://postgres.sqimmcecwuoadjbjiyfd:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" -f supabase/schema.sql
```

Atau copy-paste isi `supabase/schema.sql` ke **Supabase Dashboard → SQL Editor → Run**.

## Kredensial & Autentikasi

File `public/supabase-config.js` hanya memuat **satu** kunci:

| Kunci | Nama di config | Dipakai oleh | Hak |
|-------|----------------|--------------|-----|
| Publishable (anon) | `anonKey` | `index.html` + `admin.html` | baca semua + insert `messages` |

- `anonKey` diambil dari **Supabase Dashboard → Project Settings → API Keys** dan aman untuk dipakai di browser (dibatasi RLS).
- **Tidak ada lagi `serviceKey` di sisi browser.** Semua tulis/hapus admin dikendalikan oleh **Supabase Auth + RLS**.
- Login Admin Panel (`/admin`) memakai **Supabase Auth** (email + password), bukan shared key.

### Setup user admin (Supabase Auth)

1. **Dashboard → Authentication → Users → Add user** — buat user dengan email & password yang akan dipakai login panel admin (mis. `inc.ekaryan@gmail.com`).
2. Pastikan email tersebut cocok dengan email di fungsi `public.is_admin()` pada `supabase/schema.sql` (RLS hanya mengizinkan admin menulis bila email JWT sama).
3. Login `/admin` dengan email + password tersebut.

## RLS (Row Level Security)

Ringkasan policy (detail di `supabase/schema.sql`):

- Semua tabel `public.*` mengaktifkan RLS.
- `anon` (publishable key) → **SELECT** semua tabel publik + **INSERT** ke `messages` (form kontak).
- Tulis/hapus (tabel + storage) **hanya** untuk pengguna `authenticated` yang lolos `public.is_admin()` (klaim email di JWT = email admin).
- Storage buckets `assets` & `audio` bersifat **public read** (URL gambar/audio bisa diakses tanpa login); upload/hapus hanya admin.
- `service_role` key tetap ada (untuk operasi admin/backup lewat server, mis. skrip migrasi) dan otomatis mem-bypass RLS — **jangan dipakai di browser/repo**. Bagian kode browser hanya memakai `anonKey`.

## Storage

Bucket:

- `assets` — gambar profil & layanan. Admin upload via Admin Panel → path `uploads/<timestamp>_<nama>`.
- `audio` — `backsound.mp3`. Dijamin public.

### Upload audio

```bash
curl -X POST "https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/audio/backsound.mp3" \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: audio/mpeg" \
  --data-binary "@public/src/assets/sound/backsound.mp3"
```

> **Batas objek Supabase = 50 MB.** `backsound.mp3` asli ±76 MB (60 menit) sudah di-render ulang ke **28,9 MB** (64 kbps, 44,1 kHz, stereo, durasi penuh) dan di-upload ke bucket `audio`. File hasil render: `/var/folders/1x/36s4gn4d4xj22dnngjxxftn80000gn/T/opencode/backsound_64k.mp3`.

### Akses publik

```
https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/public/assets/<path>
https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/public/audio/backsound.mp3
```

## Data Access di Frontend

Tidak ada REST API lagi. Halaman memakai `window.sbApi` dari `public/supabase-api.js` (lihat [api-registry.md](./api-registry.md) untuk daftar fungsinya).

## Koneksi Langsung (opsional, untuk admin SQL)

Supabase baru menerima koneksi langsung via **IPv6-only**; untuk IPv4 gunakan pooler:

```
Host: aws-0-ap-southeast-1.pooler.supabase.com
Port: 6543
User: postgres.sqimmcecwuoadjbjiyfd
Password: <database password dari dashboard>
Database: postgres
```

## Migrasi dari Cloudflare

1. Skema diterapkan lewat `supabase/schema.sql` (DDL + RLS + bucket).
2. Data & gambar dari D1/R2 lama dipindahkan otomatis lewat skrip **`supabase/migrate-data.mjs`**:
   ```
   SUPABASE_SERVICE_KEY=<service_role key> node supabase/migrate-data.mjs
   ```
   Pendekatannya: **Check Link (R2) > Download > Upload ke Supabase Storage > Dapatkan link publik baru > Gunakan link baru di database**. Data sumber berupa snapshot `supabase/migration-data/*.json`; gambar lama di-upload ke bucket `assets`, link-nya diganti di `config.hero_image` dan `services.image`, lalu seluruh baris di-upsert. Bisa dijalankan ulang.
3. Setelah semua terverifikasi, hapus artefak Cloudflare (lihat [cloudflare.md](./cloudflare.md) → Cleanup).

Lihat juga: [architecture.md](./architecture.md), [cloudflare.md](./cloudflare.md), [deployment.md](./deployment.md), [rules.md](./rules.md).
