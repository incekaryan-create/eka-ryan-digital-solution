# Deployment Guide

## Overview
Proyek **Eka Ryan Digital Solution** dideploy ke **Cloudflare Pages** menggunakan **GitHub Actions**. Tidak menggunakan Firebase, Vercel, Netlify, atau GitHub Pages statis.

## Arsitektur Deploy

- **Source**: folder `./public` (HTML statis + `db.js` fallback).
- **Functions**: `functions/api/[[route]].js` (Pages Functions, otomatis terdeploy bersama).
- **Build output**: dikonfigurasi via `wrangler.toml` → `pages_build_output_dir = "./public"`.
- **Pages project**: `ekaryandigitalsolution`.
- **Live URL**: `https://ekaryandigitalsolution.pages.dev/` (admin di `/admin`).

## GitHub Actions (Cara Deploy Utama)

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy ./public --project-name=ekaryandigitalsolution --commit-dirty=true
```

**Cara deploy**: cukup `git push origin main`. GitHub Actions otomatis build & deploy.

## Bindings (wrangler.toml)

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

> **Catatan**: `ADMIN_PASSWORD` dan `JWT_SECRET` sebaiknya diset sebagai **Pages secret** (dashboard Cloudflare → Pages → Settings → Environment variables), bukan di-commit ke repo.

## Deploy Manual (Lokal, Opsional)

```bash
# Pastikan wrangler login
wrangler whoami

# Deploy manual ke Pages
wrangler pages deploy ./public --project-name=ekaryandigitalsolution
```

> **Penting (macOS)**: wrangler versi lokal mungkin butuh `--remote` untuk perintah D1/R2 karena versi macOS. Gunakan `--remote` bila diperlukan.

## Verifikasi Setelah Deploy

1. Buka `https://ekaryandigitalsolution.pages.dev/`.
2. Buka `/admin` → login dengan key `Ekaryan443!`.
3. Cek GitHub Actions run terakhir = green.
4. Uji API: `curl -sk https://ekaryandigitalsolution.pages.dev/api/config`.

## Rollback

Cloudflare Pages menyimpan deployment history. Rollback via dashboard → Pages → Deployments → pilih versi → "Rollback".

## Checklist

- [ ] Perubahan di-commit & push ke `main`
- [ ] GitHub Actions run sukses (green)
- [ ] Site publik & `/admin` dapat diakses
- [ ] API `GET /api/config` mengembalikan data
- [ ] Tidak ada secret yang ter-commit ke repo
