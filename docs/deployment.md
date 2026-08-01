# Deployment Guide

> Setup Cloudflare & cleanup: [cloudflare.md](./cloudflare.md) · Setup Supabase: [supabase.md](./supabase.md) · Git workflow: [workflow.md](./workflow.md).

## Overview

Proyek **Eka Ryan Digital Solution** di-hosting di **Cloudflare Pages** (statis) dan menggunakan **Supabase** untuk database & storage. Deploy otomatis via **GitHub Actions**.

## Arsitektur Deploy

- **Source**: folder `./public` (HTML statis + JS). Tidak ada build step (Tailwind via CDN).
- **Backend**: Supabase (bukan Cloudflare Functions) — akses langsung dari browser lewat `supabase-api.js`.
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
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 24 }
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy ./public --project-name=ekaryandigitalsolution
```

**Cara deploy**: `git push origin main` → GitHub Actions otomatis deploy.

## Persyaratan Secret GitHub

- `CLOUDFLARE_API_TOKEN` — token dengan izin `Pages:Edit`.
- `CLOUDFLARE_ACCOUNT_ID` — account Cloudflare.

> Tidak ada secret Supabase di GitHub Actions (kunci Supabase ada di `public/supabase-config.js`).

## Deploy Manual (Lokal, Opsional)

```bash
npx wrangler pages deploy ./public --project-name=ekaryandigitalsolution
```

## Sebelum Deploy (persiapan Supabase)

1. `supabase/schema.sql` sudah dijalankan di SQL Editor (tabel + RLS + buckets).
2. Data & gambar sudah dimigrasi dari D1/R2 lama: `SUPABASE_SERVICE_KEY=<key> node supabase/migrate-data.mjs` (lihat [supabase.md](./supabase.md)).
3. `public/supabase-config.js` berisi `url` + `anonKey` (publishable); `serviceKey` diisi dari `public/supabase-key.js` (gitignored, hanya lokal).
4. `backsound.mp3` sudah diupload ke bucket `audio` (**< 50 MB**, saat ini 28,9 MB).

## Verifikasi Setelah Deploy

1. Buka `https://ekaryandigitalsolution.pages.dev/` — konten harus muncul (bukan kosong).
2. Buka `/admin` → login `Eka Ryan` / `Ekaryan443!`.
3. Cek GitHub Actions run terakhir = green.
4. Cek Network tab → request ke `https://sqimmcecwuoadjbjiyfd.supabase.co/...` berhasil (HTTP 200).
5. `/api/*` harus **404** (tidak ada Functions — benar).

## Rollback

Cloudflare Pages menyimpan deployment history. Rollback via dashboard → Pages → Deployments → pilih versi → "Rollback".

## Checklist

- [ ] Schema Supabase terpasang (DDL + RLS + buckets)
- [ ] `supabase-config.js` berisi kunci yang benar (serviceKey tidak di-commit di repo publik)
- [ ] Audio & gambar sudah diupload ke Supabase Storage
- [ ] Perubahan di-commit & push ke `main`
- [ ] GitHub Actions run sukses (green)
- [ ] Site publik & `/admin` dapat diakses
- [ ] Tidak ada secret yang ter-commit ke repo

Lihat juga: [supabase.md](./supabase.md), [cloudflare.md](./cloudflare.md), [troubleshooting.md](./troubleshooting.md).
