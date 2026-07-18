# Eka Ryan Portfolio - Cloudflare Pages

Portfolio website for Eka Ryan Digital Solution, deployed on Cloudflare Pages with D1 database and R2 storage.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Storage**: Cloudflare R2 (object storage)
- **Hosting**: Cloudflare Pages
- **API**: Cloudflare Pages Functions

## Features

- Responsive portfolio website
- Admin panel for content management
- Contact form with message storage
- File upload to R2 storage
- SEO optimized
- Fast global CDN delivery

## Project Structure

```
eka-ryan-digital-solution/
├── public/                 # Static files (deployed to Pages)
│   ├── index.html         # Main portfolio page
│   ├── admin.html         # Admin panel
│   ├── db.js              # LocalStorage fallback + backup (bukan sumber utama)
│   └── src/               # Assets (images, css, js)
├── functions/             # Pages Functions (API)
│   └── api/
│       └── [[route]].js   # API handler (catch-all)
├── docs/                  # Dokumentasi project
│   ├── api-registry.md
│   ├── deployment.md
│   ├── cloudflare-workers.md
│   ├── features.md
│   ├── firebase-setup.md  # sebenarnya: Cloudflare setup (D1+R2)
│   ├── workflow.md
│   └── troubleshooting.md
├── wrangler.toml          # Cloudflare Pages config + bindings
└── .github/workflows/deploy.yml  # Auto-deploy ke Pages
```

## Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Deploy

Deploy otomatis via GitHub Actions setiap `git push` ke `main`. Untuk deploy manual:

```bash
wrangler pages deploy ./public --project-name=ekaryandigitalsolution
```

### 4. Access Your Website

- **Website**: https://ekaryandigitalsolution.pages.dev
- **Admin Panel**: https://ekaryandigitalsolution.pages.dev/admin (redirect dari `/admin.html`)

## Manual Setup

### Create R2 Bucket

```bash
wrangler r2 bucket create eka-ryan-digital-solution-assets
```

### Create D1 Database

```bash
wrangler d1 create eka-ryan-digital-solution-db
```

Update `wrangler.toml` dengan database ID yang dihasilkan.

### Initialize Database

Skema & seed data sudah ada di Cloudflare D1 (database `eka-ryan-digital-solution-db`). Untuk menjalankan SQL manual:

```bash
wrangler d1 execute eka-ryan-digital-solution-db --remote --command="SELECT * FROM services;"
```

> Di macOS lama, selalu tambahkan `--remote` untuk perintah D1/R2.

### Deploy to Pages

```bash
wrangler pages deploy ./public --project-name=ekaryandigitalsolution
```

## Local Development

Tidak ada build step. Cukup edit `public/` dan `functions/`. Deploy lewat `git push` (GitHub Actions) atau `wrangler pages deploy`.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/config` | Get site configuration | publik |
| PUT | `/api/config` | Update site configuration | key |
| GET | `/api/services` | List all services | publik |
| GET | `/api/services/:id` | Get service details | publik |
| POST | `/api/services` | Create new service | key |
| PUT | `/api/services/:id` | Update service | key |
| DELETE | `/api/services/:id` | Delete service | key |
| GET | `/api/workflow` | List workflow steps | publik |
| POST | `/api/workflow` | Create workflow step | key |
| PUT | `/api/workflow/:id` | Update workflow step | key |
| DELETE | `/api/workflow/:id` | Delete workflow step | key |
| GET | `/api/skills` | List all skills | publik |
| POST | `/api/skills` | Create new skill | key |
| PUT | `/api/skills/:id` | Update skill | key |
| DELETE | `/api/skills/:id` | Delete skill | key |
| GET | `/api/addons` | List add-ons (grouped) | publik |
| GET | `/api/addons/list` | List add-ons (flat) | publik |
| POST | `/api/addons` | Create add-on | key |
| PUT | `/api/addons/:id` | Update add-on | key |
| DELETE | `/api/addons/:id` | Delete add-on | key |
| GET | `/api/messages` | List all messages | key |
| POST | `/api/messages` | Submit contact form | **publik** |
| PUT | `/api/messages/:id/read` | Mark message as read | key |
| DELETE | `/api/messages/:id` | Delete message | key |
| DELETE | `/api/messages` | Delete all messages | key |
| POST | `/api/upload` | Upload file to R2 | key |
| POST | `/api/upload/delete` | Delete file from R2 | key |
| GET | `/api/storage` | List R2 objects | key |
| DELETE | `/api/storage` | Delete R2 object | key |
| GET | `/api/r2/*` | Serve public file from R2 | publik |

Lihat `docs/api-registry.md` untuk detail lengkap.

## Database Tables

- **config**: Site-wide configuration
- **services**: Service offerings
- **service_details**: Service detail items
- **service_tags**: Service tags
- **workflow**: Workflow steps
- **skills**: Technical skills
- **messages**: Contact form submissions

## Admin Panel

Akses `/admin`. Tidak ada username — hanya **admin key**:

- **Admin key**: `Ekaryan443!` (default, hardcoded di `admin.html` & fallback `env.ADMIN_PASSWORD || 'Ekaryan443!'` di API)

Untuk mengubah key di production, set **Pages secret** `ADMIN_PASSWORD` di dashboard Cloudflare (Settings → Environment variables), bukan di `wrangler.toml`.

## Environment Variables

`wrangler.toml` saat ini:

```toml
[vars]
ENVIRONMENT = "production"
```

Secret (jangan di-commit, set via Cloudflare dashboard):
- `ADMIN_PASSWORD` — override admin key (default `Ekaryan443!` bila kosong)
- `JWT_SECRET` — (opsional) untuk auth lanjutan

## Documentation

Lihat folder `docs/`:
- `api-registry.md` — semua endpoint API
- `deployment.md` — cara deploy (GitHub Actions)
- `cloudflare-workers.md` — Pages Functions & bindings
- `features.md` — fitur project
- `firebase-setup.md` — sebenarnya panduan Cloudflare (D1+R2)
- `workflow.md` — git workflow
- `troubleshooting.md` — masalah umum & solusi

## License

MIT
