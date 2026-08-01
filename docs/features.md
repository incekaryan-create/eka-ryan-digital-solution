# Features Documentation

Fitur nyata **Eka Ryan Digital Solution** — portfolio digital freelancer (Eka Ryan).

> Ringkasan produk ada di [prd.md](./prd.md); arsitektur di [architecture.md](./architecture.md).

## Feature Index

| Fitur | Status | Penyimpanan | Akses |
|-------|--------|-------------|-------|
| Hero & Config | Active | Supabase `config` | Publik baca / Admin edit |
| CV/Resume Download | Active | Supabase `config.cv_url` + Storage `assets/cv/` | Publik unduh / Admin upload |
| Layanan (Services) | Active | Supabase `services` + `service_details` + `service_tags` | Publik baca / Admin CRUD |
| Workflow | Active | Supabase `workflow` | Publik baca / Admin CRUD |
| Skills | Active | Supabase `skills` | Publik baca / Admin CRUD |
| Add-ons | Active | Supabase `add_ons` | Publik baca / Admin CRUD |
| Pesan Kontak | Active | Supabase `messages` | Publik kirim / Admin baca-hapus |
| Storage | Active | Supabase Storage (`assets`, `audio`) | Admin upload/delete |
| Admin Panel | Active | Supabase Auth + RLS | Login email/password admin |
| Backup/Restore | Active | localStorage (`db.js`) | Admin export/import |

## Halaman Publik (`index.html`)

- **Hero**: nama, greeting, deskripsi, tagline, gambar hero (Supabase Storage), jaminan & kualitas.
- **Logo & Favicon**: logo image (`logo.png`) + favicon (`favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`) — background `#CEED6B` (hijau terang/lime).
- **Layanan**: grid layanan dari `sbApi.getServices()` (judul, subtitle, gambar, harga, tags, details).
- **Workflow**: langkah alur kerja dari `sbApi.getWorkflow()`.
- **Skills**: keahlian dari `sbApi.getSkills()`.
- **Add-ons**: checkbox pilihan fitur tambahan dari `sbApi.getAddOns()` (dikelompokkan per kategori).
- **Form Kontak**: kirim pesan via `sbApi.saveMessage()` (publik, tanpa login).
- **CV/Resume Download**: tombol "Unduh CV Saya" di footer → download PDF dari `cv_url` (config Supabase). Fallback ke text file bila belum ada PDF.
- **Social Links**: LinkedIn, Instagram, TikTok, X/Twitter — URL di-update dari Supabase config (overrides placeholder di HTML).
- **Music**: `<audio>` dari URL storage Supabase (`audio/backsound.mp3`).
- **Config fallback**: bila Supabase gagal, `db.getConfig()` (localStorage) dipakai sebagai cadangan.

## Admin Panel (`admin.html`)

Login Admin Panel memakai **Supabase Auth** (`sbApi.signIn(email, password)`); user harus email admin yang ditetapkan di RLS (`is_admin()`). Panel mencakup:

- **Dashboard**: statistik jumlah layanan, workflow, skills, pesan.
- **Services CRUD**: tabel + form tambah/edit/hapus via `sbApi.saveService/deleteService`.
- **Workflow CRUD**: via `sbApi.saveWorkflow/deleteWorkflow`.
- **Skills CRUD**: via `sbApi.saveSkill/deleteSkill`.
- **Add-ons CRUD**: via `sbApi.saveAddon/deleteAddon`.
- **Messages**: lihat, tandai dibaca (`sbApi.markMessageRead`), hapus (`sbApi.deleteMessage`), hapus semua (`sbApi.clearMessages`).
- **Config**: edit hero, kontak, sosial media, CV/Resume via `sbApi.saveConfig` (mirror ke `db.updateConfig()`). Upload CV PDF ke Supabase Storage (`sbApi.uploadCV`).
- **Storage Manager**: list objek (`sbApi.listStorage`), upload (`sbApi.uploadImage`), hapus (`sbApi.deleteStorageObject`).
- **Backup/Restore**: `db.exportAll()` / `db.importAll()` untuk cadangan JSON lokal.

## Storage (Supabase)

- Bucket: `assets` (gambar + CV PDF), `audio` (backsound).
- Path gambar: `assets/uploads/<timestamp>_<nama>`.
- Path CV: `assets/cv/<timestamp>_<nama>.pdf`.
- URL publik: `https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/public/<bucket>/<path>`.
- Gambar dikompresi klien-side (`optimizeImage`) sebelum upload.
- Batas ukuran objek Supabase: 50 MB (audio backsound harus < 50 MB).

## SEO & Meta Tags (`index.html`)

- **Standard**: charset, viewport, description, keywords, author, robots, canonical URL.
- **Open Graph (Facebook/LinkedIn/WhatsApp)**: og:type, og:site_name, og:title, og:description, og:url, og:image (1200×630), og:locale.
- **Twitter/X**: twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image.
- **Geo/Local Business**: geo.region, geo.placename, geo.position, ICBM, business:contact_data (country, locality, email, phone).
- **Pinterest Domain Verification**: `p:domain_verify` — diklaim domain di Pinterest agar bisa mem-publish pin dari website.
- **Structured Data (JSON-LD)**: `@type: ProfessionalService` dengan schema.org markup (address, areaServed, founder, makesOffer).

## Catatan

- **Tidak ada Firebase, autentikasi user, OAuth, atau dashboard analytics** di proyek ini.
- Semua data dinamis disimpan di **Supabase** (PostgreSQL + Storage).
- Cloudflare Pages hanya hosting statis — tidak ada Functions/D1/R2.
- `db.js` hanya sebagai fallback localStorage + backup lokal, bukan sumber utama.

Lihat juga: [supabase.md](./supabase.md), [api-registry.md](./api-registry.md).
