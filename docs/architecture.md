# Architecture

Arsitektur **Eka Ryan Digital Solution** — portfolio digital freelancer (Eka Ryan) yang di-deploy di **Cloudflare Pages**.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Client)                                          │
│  ├─ index.html  (publik)      → fetch /api/* (D1 + R2)    │
│  └─ admin.html  (panel)       → fetch /api/* + key auth   │
└───────────────────────────┬───────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼───────────────────────────────┐
│  Cloudflare Pages (ekaryandigitalsolution)                 │
│  ├─ Static: ./public (HTML, db.js, assets)                │
│  └─ Functions: functions/api/[[route]].js (onRequest)     │
│         │                                                  │
│         ├──────────────┬───────────────┐                  │
│         ▼              ▼               ▼                   │
│      Cloudflare D1   Cloudflare R2   Cloudflare KV/Secrets│
│   (eka-ryan-...-db) (eka-ryan-...-  (ADMIN_PASSWORD)     │
│                        assets)                             │
└─────────────────────────────────────────────────────────────┘
```

## Komponen Utama

| Layer | Teknologi | Binding / Nama |
|-------|-----------|----------------|
| Hosting & CDN | Cloudflare Pages | project `ekaryandigitalsolution` |
| Build output | Static `./public` | `pages_build_output_dir = "./public"` |
| API backend | Cloudflare Pages Functions | `functions/api/[[route]].js` |
| Database (SQL) | Cloudflare D1 | binding `DB`, db `eka-ryan-digital-solution-db` |
| Object storage | Cloudflare R2 | binding `R2`, bucket `eka-ryan-digital-solution-assets` |
| Secrets | Cloudflare Pages Env | `ADMIN_PASSWORD` (dashboard) |
| CI/CD | GitHub Actions | `.github/workflows/deploy.yml` |

## Data Flow

### Halaman Publik (`index.html`)
1. Load HTML statis + `db.js` (fallback localStorage).
2. JS fetch `GET /api/config`, `/api/services`, `/api/workflow`, `/api/skills`, `/api/addons`.
3. Render konten dari respons D1 (single source of truth).
4. Gambar di-render dari URL `https://…/api/r2/uploads/<key>` (R2).
5. Bila fetch gagal → fallback ke `db.getConfig()` (localStorage).

### Admin Panel (`admin.html`)
1. Login dengan key `Ekaryan443!` (atau `ADMIN_PASSWORD`).
2. CRUD via `POST/PUT/DELETE /api/*` dengan `?key=` atau header `Authorization: Bearer`.
3. Upload gambar → `POST /api/upload` (multipart) → simpan ke R2 `uploads/<timestamp>_<name>`.
4. Respons API di-mirror ke `db.js` (localStorage) sebagai backup lokal.

### Contact Form
- `POST /api/messages` (publik, tanpa key) → simpan ke D1 `messages`.

## R2 Serving

File diakses publik lewat catch-all:
```
GET /api/r2/<key>  →  env.R2.get(key)  →  Response(binary, Cache-Control: max-age=31536000)
```
Semua gambar (hero, layanan, dll.) **wajib** lewat path ini — tidak ada URL gambar hardcoded dari luar.

## Bindings (`wrangler.toml`)

```toml
name = "ekaryandigitalsolution"
compatibility_date = "2024-12-01"
pages_build_output_dir = "./public"

[[d1_databases]]
binding = "DB"
database_name = "eka-ryan-digital-solution-db"
database_id = "91e5a4c5-92e1-4ae2-b027-cdab35724030"

[[r2_buckets]]
binding = "R2"
bucket_name = "eka-ryan-digital-solution-assets"

[vars]
ENVIRONMENT = "production"
```

## Keamanan (Ringkas)
- CORS dibatasi ke origin `https://ekaryandigitalsolution.pages.dev`.
- Write endpoint dilindungi admin key.
- Input disanitasi (`sanitizeInput`) & divalidasi (email, ukuran file 5 MB, tipe gambar).
- Secret tidak di-commit; di-set via dashboard Cloudflare.

Lihat juga: [api.md](./api.md), [schema.md](./schema.md), [cloudflare.md](./cloudflare.md), [deployment.md](./deployment.md).
