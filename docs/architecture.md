# Architecture

Arsitektur **Eka Ryan Digital Solution** — portfolio digital freelancer (Eka Ryan) yang di-hosting di **Cloudflare Pages** (statis) dengan data di **Supabase**.

## Overview

```
┌───────────────────────────────────────────────────────────────────┐
│  Browser (Client)                                                │
│  ├─ index.html (publik)  → supabase-js (anon key, RLS read)     │
│  └─ admin.html (panel)   → supabase-js (anon key + Supabase Auth│
│      └─ public/supabase-api.js = wrapper `window.sbApi`         │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────▼─────────────────────────────────┐
│  Cloudflare Pages (ekaryandigitalsolution) — STATIS SAJA        │
│  └─ ./public (HTML, CSS, JS, db.js fallback)                   │
│     (tidak ada Functions / D1 / R2 lagi)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────▼─────────────────────────────────┐
│  Supabase (sqimmcecwuoadjbjiyfd, region ap-southeast-1)        │
│  ├─ PostgreSQL  : config, services(+details/tags), workflow,   │
│  │                skills, add_ons, messages   (RLS)            │
│  └─ Storage     : bucket `assets` (gambar) & `audio` (backsound)│
└─────────────────────────────────────────────────────────────────┘
```

## Komponen Utama

| Layer | Teknologi | Nama / Lokasi |
|-------|-----------|---------------|
| Hosting & CDN | Cloudflare Pages (statis) | project `ekaryandigitalsolution` |
| Build output | Static `./public` | deploy langsung via GitHub Actions |
| Database (SQL) | Supabase PostgreSQL | `public.*` (lihat `supabase/schema.sql`) |
| Object storage | Supabase Storage | bucket `assets`, `audio` |
| Client wrapper | supabase-js v2 (CDN) | `public/supabase-api.js` → `window.sbApi` |
| Kredensial | Supabase keys | `public/supabase-config.js` |
| CI/CD | GitHub Actions | `.github/workflows/deploy.yml` |

## Data Flow

### Halaman Publik (`index.html`)
1. Load HTML statis + `db.js` (fallback localStorage).
2. `sbApi.getConfig()` / `getServices()` / `getWorkflow()` / `getSkills()` / `getAddOns()` — baca dari Supabase dengan anon key (dibatasi RLS ke SELECT).
3. Render konten dari Supabase (single source of truth).
4. Gambar di-render dari URL storage Supabase (`/storage/v1/object/public/assets/...`), audio dari `/storage/v1/object/public/audio/backsound.mp3`.
5. Bila fetch gagal → fallback ke `db.getConfig()` (localStorage).

### Admin Panel (`admin.html`)
1. Login via **Supabase Auth** (`sbApi.signIn(email, password)`); sesi otomatis dilampirkan ke client supabase-js.
2. CRUD via `sbApi.saveXxx/deleteXxx` — berjalan sebagai `authenticated`, diizinkan RLS karena user adalah admin (`is_admin()`).
3. Upload gambar → `sbApi.uploadImage()` → Supabase Storage `assets/uploads/<timestamp>_<nama>`.
4. Respons di-mirror ke `db.js` (localStorage) sebagai backup lokal.

### Contact Form
- `sbApi.saveMessage()` — INSERT `messages` dengan anon key (policy RLS `insert` khusus form).

## Keamanan

- Publik: hanya anon key → baca publik + kirim pesan (RLS membatasi).
- Admin: **Supabase Auth** (email/password). Tulis/hapus diizinkan hanya bila klaim email JWT = email admin (`is_admin()` di RLS). Tidak ada secret key di browser.
- Semua tulis lewat client (tidak ada API server); validasi input tetap dilakukan di sisi klien (`optimizeImage`, `escapeHtml`).
- Supabase handle TLS, auth, dan backup secara otomatis.

Lihat juga: [supabase.md](./supabase.md), [api-registry.md](./api-registry.md), [schema.md](./schema.md), [cloudflare.md](./cloudflare.md), [deployment.md](./deployment.md).
