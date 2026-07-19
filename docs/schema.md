# Database Schema (Cloudflare D1)

Skema **D1** (`eka-ryan-digital-solution-db`) untuk **Eka Ryan Digital Solution**. Semua tabel diakses via `env.DB` di `functions/api/[[route]].js`.

> Tidak ada file `.sql` di repo; skema & seed dikelola langsung di Cloudflare D1. Jalankan SQL dengan `wrangler d1 execute … --remote` (lihat [cloudflare.md](./cloudflare.md)).

## Tabel

### `config`
Satu baris (`id = 'main'`). Menyimpan hero & kontak.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK, default `'main'` |
| `hero_greeting` | TEXT | "Hai, Saya" |
| `hero_name` | TEXT | "Eka Ryan" |
| `hero_description` | TEXT | Deskripsi hero |
| `hero_tagline` | TEXT | "Web Developer • UI/UX Designer • Freelancer" |
| `hero_image` | TEXT | URL R2 (`/api/r2/uploads/...`) |
| `guarantee_title` | TEXT | Judul jaminan |
| `guarantee_desc` | TEXT | Deskripsi jaminan |
| `guarantee_p1` | TEXT | Poin 1 |
| `guarantee_p2` | TEXT | Poin 2 |
| `guarantee_p3` | TEXT | Poin 3 |
| `quality_title` | TEXT | Judul kualitas |
| `quality_desc` | TEXT | Deskripsi kualitas |
| `quality_p1` | TEXT | Poin 1 |
| `quality_p2` | TEXT | Poin 2 |
| `quality_p3` | TEXT | Poin 3 |
| `contact_email` | TEXT | Email kontak |
| `contact_wa` | TEXT | Nomor WhatsApp (tanpa +) |
| `contact_location` | TEXT | Lokasi |
| `contact_website` | TEXT | Website |
| `social_linkedin` | TEXT | URL LinkedIn |
| `social_instagram` | TEXT | URL Instagram |
| `social_tiktok` | TEXT | URL TikTok |
| `social_twitter` | TEXT | URL X/Twitter |

### `services`
Layanan utama (digabung `service_details` & `service_tags` saat GET).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK (mis. `svc_web_simple`) |
| `sort_order` | INT | Urut tampil |
| `title` | TEXT | Judul layanan |
| `subtitle` | TEXT | Subtitle (mis. "FULL-STACK") |
| `description` | TEXT | Deskripsi |
| `image` | TEXT | URL R2 |
| `price` | TEXT | Harga (string) |
| `is_active` | INT | 0/1 |
| `created_at` | TEXT | ISO timestamp |

### `service_details`
Detail poin per layanan.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK |
| `service_id` | TEXT | FK → `services.id` |
| `detail` | TEXT | Satu poin detail |
| `sort_order` | INT | Urut |

### `service_tags`
Tag per layanan.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK |
| `service_id` | TEXT | FK → `services.id` |
| `tag` | TEXT | Tag (mis. "web", "react") |

### `workflow`
Langkah alur kerja.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK (mis. `wf_1`) |
| `sort_order` | INT | Urut |
| `title` | TEXT | Judul step |
| `description` | TEXT | Deskripsi |
| `is_active` | INT | 0/1 |
| `created_at` | TEXT | ISO timestamp |

### `skills`
Keahlian.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK |
| `sort_order` | INT | Urut |
| `name` | TEXT | Nama skill |
| `level` | TEXT | Level (mis. "Expert") |
| `category` | TEXT | Kategori |
| `is_active` | INT | 0/1 |
| `created_at` | TEXT | ISO timestamp |

### `messages`
Pesan kontak (dari `POST /api/messages`, publik).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK |
| `name` | TEXT | Nama pengirim |
| `email` | TEXT | Email |
| `message` | TEXT | Isi pesan |
| `is_read` | INT | 0/1 |
| `created_at` | TEXT | ISO timestamp |

### `add_ons`
Fitur tambahan (dikelompokkan per kategori di API).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | TEXT | PK |
| `category` | TEXT | Kategori (mis. "SEO", "Performance") |
| `name` | TEXT | Nama add-on |
| `description` | TEXT | Deskripsi |
| `price` | TEXT | Harga |
| `is_active` | INT | 0/1 |
| `sort_order` | INT | Urut |
| `created_at` | TEXT | ISO timestamp |

## Relasi

```
services 1──* service_details
services 1──* service_tags
```

## Catatan

- `GET /api/services` melakukan JOIN `service_details` + `service_tags` → mengembalikan `details: [...]` & `tags: [...]`.
- Field config dibatasi `ALLOWED_CONFIG_FIELDS` di API (cegah injection).
- Semua `image`/`hero_image` berisi URL R2 (`/api/r2/uploads/...`), bukan URL luar.

Lihat juga: [api.md](./api.md), [architecture.md](./architecture.md).
