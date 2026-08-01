# Eka Ryan Portfolio — Cloudflare Pages + Supabase

Portfolio website untuk Eka Ryan Digital Solution. Hosting **Cloudflare Pages** (statis) + data di **Supabase** (PostgreSQL + Storage).

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Database**: Supabase PostgreSQL (pengganti Cloudflare D1)
- **Storage**: Supabase Storage, bucket `assets` + `audio` (pengganti Cloudflare R2)
- **Hosting**: Cloudflare Pages (statis, tanpa Functions)
- **Data access**: supabase-js v2 (CDN) via `public/supabase-api.js`

## Features

- Responsive portfolio website
- Admin panel untuk content management
- Contact form tersimpan ke Supabase
- CV/Resume download (PDF) — admin upload via panel, footer button fetch dari Supabase
- File upload ke Supabase Storage
- Logo & favicon (image-based, `#CEED6B` background)
- Social media links (LinkedIn, Instagram, TikTok, X) — admin edit via config
- SEO optimized
- Fast global CDN delivery

## Project Structure

```
eka-ryan-digital-solution/
├── public/                 # Static files (deployed ke Pages)
│   ├── index.html         # Halaman portfolio utama
│   ├── admin.html         # Admin panel
│   ├── db.js              # LocalStorage fallback + backup (bukan sumber utama)
│   ├── supabase-config.js # Kredensial Supabase (url, anonKey — aman publik)
│   ├── supabase-api.js    # Wrapper `window.sbApi` (semua akses data)
│   ├── logo.png           # Brand logo (1080×1080, #CEED6B bg)
│   ├── favicon.ico        # Favicon (ICO format)
│   ├── favicon-16x16.png  # Favicon 16×16
│   ├── favicon-32x32.png  # Favicon 32×32
│   └── apple-touch-icon.png # Apple Touch Icon 180×180
├── supabase/
│   ├── schema.sql         # DDL + RLS + buckets (jalankan di SQL Editor)
│   ├── migrate-data.mjs   # Migrasi data & gambar dari D1/R2 lama
│   └── migration-data/    # Snapshot data lama (config, services, skills, dll)
├── docs/                  # Dokumentasi project
│   ├── architecture.md     # Arsitektur sistem (Pages statis + Supabase)
│   ├── design.md           # Design system & UI guidelines
│   ├── prd.md              # Product Requirements Document
│   ├── rules.md            # Aturan & konvensi project
│   ├── schema.md           # Skema Supabase (tabel & kolom)
│   ├── api-registry.md     # Referensi `sbApi` (data access)
│   ├── supabase.md         # Setup & arsitektur Supabase
│   ├── cloudflare.md       # Cloudflare Pages (static hosting only + cleanup)
│   ├── deployment.md       # Panduan deploy (GitHub Actions)
│   ├── features.md         # Daftar fitur
│   ├── workflow.md         # Git & dev workflow
│   └── troubleshooting.md  # Masalah umum & solusi
├── opencode.json          # Konfigurasi opencode (Supabase MCP)
└── .github/workflows/deploy.yml  # Auto-deploy statis ke Pages
```

## Quick Start

### Prerequisites

- Akun Supabase (project sudah dibuat: `sqimmcecwuoadjbjiyfd`)
- Akun Cloudflare (token Pages)

### 1. Setup Database

Jalankan `supabase/schema.sql` di **Supabase Dashboard → SQL Editor** (tabel, RLS, buckets).

### 1b. Migrasi Data dari D1/R2 Lama (opsional, sudah dilakukan)

```
SUPABASE_SERVICE_KEY=<service_role key> node supabase/migrate-data.mjs
```

Men-download gambar dari R2 lama, upload ke bucket `assets`, lalu mengisi semua tabel dari snapshot `supabase/migration-data/`.

### 2. Isi Kredensial

`public/supabase-config.js`:
- `url` → `https://sqimmcecwuoadjbjiyfd.supabase.co` (sudah terisi)
- `anonKey` → Publishable/anon key (sudah terisi; aman untuk publik)
- **Tidak ada `serviceKey`** — semua tulis admin diatur **Supabase Auth + RLS** (`public.is_admin()`). Buat user admin di **Supabase Dashboard → Authentication → Users** dan pastikan emailnya cocok dengan email di `supabase/schema.sql`.

### 3. Upload Asset

- Gambar hero & layanan: upload via Admin Panel → otomatis ke bucket `assets` (data lama sudah dimigrasi oleh `migrate-data.mjs`).
- `backsound.mp3` (< 50 MB, saat ini 28,9 MB): sudah diupload ke bucket `audio`.

### 4. Deploy

```bash
git push origin main   # auto-deploy via GitHub Actions
```

Atau manual:
```bash
npx wrangler pages deploy ./public --project-name=ekaryandigitalsolution
```

### 5. Access

- **Website**: https://ekaryandigitalsolution.pages.dev
- **Admin Panel**: https://ekaryandigitalsolution.pages.dev/admin
  - Login: **email + password Supabase Auth** (email admin yang ditetapkan di RLS, mis. `inc.ekaryan@gmail.com`)

## Local Development

Tidak ada build step. Edit `public/` langsung. Buka `public/index.html` di browser (data dari Supabase berjalan via HTTPS). Deploy lewat `git push`.

> Catatan: `supabase-config.js` berisi `anonKey` (aman untuk publik). Tidak ada secret key di kode browser — admin diizinkan menulis via Supabase Auth + RLS.

## Data Access (sbApi)

Tidak ada REST API server. Halaman memakai `window.sbApi` (lihat `docs/api-registry.md`):

| Area | Fungsi |
|------|--------|
| Config | `getConfig`, `saveConfig` |
| Services | `getServices`, `saveService`, `deleteService` |
| Workflow | `getWorkflow`, `saveWorkflow`, `deleteWorkflow` |
| Skills | `getSkills`, `saveSkill`, `deleteSkill` |
| Add-ons | `getAddOns`, `saveAddon`, `deleteAddon` |
| Messages | `getMessages`, `saveMessage`, `markMessageRead`, `deleteMessage`, `clearMessages` |
| Storage | `uploadImage`, `deleteImage`, `uploadCV`, `deleteCV`, `listStorage`, `deleteStorageObject`, `publicUrl` |

## Database Tables

- **config**: konfigurasi seluruh situs (termasuk `cv_url` untuk CV/Resume PDF)
- **services** / **service_details** / **service_tags**: layanan + detail + tag
- **workflow**: langkah alur kerja
- **skills**: keahlian
- **add_ons**: fitur tambahan
- **messages**: pesan kontak

## Environment / Secrets

- GitHub Actions: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (repo Settings → Secrets).
- Supabase keys: hanya `anonKey` di `public/supabase-config.js` (publik). Service key hanya untuk operasi server, tidak pernah di repo.

## Documentation

Lihat folder `docs/` — mulai dari `architecture.md`, `supabase.md`, `cloudflare.md`, `deployment.md`.

## License

MIT
