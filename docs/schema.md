# Database Schema (Supabase PostgreSQL)

Skema database **Supabase** untuk **Eka Ryan Digital Solution**. Definisi lengkap (DDL + RLS + seed) ada di **[`supabase/schema.sql`](../supabase/schema.sql)**.

> Project ref `sqimmcecwuoadjbjiyfd`, region `ap-southeast-1`. Semua tabel berada di schema `public`.

## Ringkasan Tabel

### `config`
Satu baris (`id = 'main'`). Menyimpan hero & kontak.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | text | PK, default `'main'` |
| `hero_greeting` | text | "Hai, Saya" |
| `hero_name` | text | "Eka Ryan" |
| `hero_description` | text | Deskripsi hero |
| `hero_tagline` | text | "Web Developer • UI/UX Designer • Freelancer" |
| `hero_image` | text | URL Supabase Storage (`/storage/v1/object/public/assets/...`) |
| `guarantee_title` / `guarantee_desc` / `guarantee_p1..p3` | text | Blok jaminan |
| `quality_title` / `quality_desc` / `quality_p1..p3` | text | Blok kualitas |
| `contact_email` / `contact_wa` / `contact_location` / `contact_website` | text | Info kontak |
| `social_linkedin` / `social_instagram` / `social_tiktok` / `social_twitter` | text | URL sosial |
| `updated_at` | timestamptz | Update otomatis |

### `services`
Layanan utama. Kolom: `id` (text PK), `sort_order` int, `title`, `subtitle`, `description`, `price`, `image` (URL storage), `is_active` integer (1 = aktif), `created_at` timestamptz, `updated_at` timestamptz.

### `service_details`
Detail poin per layanan: `id` (text PK), `service_id` (FK→`services.id`, on delete cascade), `sort_order`, `text`, `created_at`.

### `service_tags`
Tag per layanan: `id` (text PK), `service_id` (FK→`services.id`, cascade), `tag`, `created_at`.

### `workflow`
Langkah alur kerja: `id` (text PK), `title`, `short_desc`, `long_desc`, `sort_order`, `created_at`.

### `skills`
Keahlian: `id` (text PK), `name`, `category` (default `'other'`, mis. `frontend|backend|design|...`), `sort_order`, `created_at`.

### `add_ons`
Fitur tambahan: `id` (text PK), `name`, `category`, `price`, `sort_order`, `created_at`.

### `messages`
Pesan kontak: `id` (text PK, default `gen_random_uuid()::text`), `name`, `email`, `whatsapp`, `service_id`, `subject`, `message`, `add_ons` (**text** berisi JSON string, default `'[]'`), `is_read` (**integer** 0/1), `created_at` timestamptz.

## Relasi

```
services 1──* service_details
services 1──* service_tags
```

## RLS & Keamanan

- Semua tabel `enable row level security`.
- `anon` → SELECT semua tabel publik + INSERT `messages`.
- Write/hapus → hanya service_role (dipakai Admin Panel).
- Lihat `supabase/schema.sql` bagian policy untuk detail.

## Data

Data awal (config `main`, 4 services + details/tags, 5 workflow, 19 skills, 7 add-ons) diambil dari database Cloudflare D1 lama. Jalankan skrip migrasi:

```
SUPABASE_SERVICE_KEY=<service_role key> node supabase/migrate-data.mjs
```

Skrip ini otomatis men-download gambar dari storage R2 lama, upload ke bucket `assets` Supabase, mengganti link gambar di data, lalu insert/upsert. Bisa dijalankan ulang (idempotent). Gambar/audio lama yang sudah tidak terpakai dapat dihapus via Admin Panel > Storage.

> Catatan: `schema.sql` sekarang hanya berisi DDL + RLS + bucket (tanpa seed).

## Akses di Kode

- **Publik** (`index.html`): `sbApi.getConfig/getServices/getWorkflow/getSkills/getAddOns/saveMessage`.
- **Admin** (`admin.html`): `sbApi.saveXxx/deleteXxx/getMessages/uploadImage/listStorage/...`.
- Seluruh fungsi bungkus ada di `public/supabase-api.js`.

Lihat juga: [supabase.md](./supabase.md), [api-registry.md](./api-registry.md), [architecture.md](./architecture.md).
