# Cloudflare Setup (D1 + R2 + Pages)

> **Catatan**: Proyek ini **TIDAK menggunakan Firebase**. Dokumen ini menggantikan panduan Firebase lama dengan setup Cloudflare yang sebenarnya (D1 untuk database, R2 untuk file, Pages untuk hosting).

## Prerequisites

- Akun Cloudflare (Account ID: `55bcfa4f9d8d6b01276737c7b64339a8`)
- `wrangler` CLI (`npm i -g wrangler`)
- `wrangler login` sudah dilakukan

## D1 Database (SQL)

Database: `eka-ryan-digital-solution-db` (id `91e5a4c5-92e1-4ae2-b027-cdab35724030`).

```bash
# List database
wrangler d1 list --remote

# Jalankan SQL (selalu pakai --remote di macOS lama)
wrangler d1 execute eka-ryan-digital-solution-db --remote \
  --command="SELECT * FROM services ORDER BY sort_order;"

# Dari file SQL
wrangler d1 execute eka-ryan-digital-solution-db --remote --file=./schema.sql
```

Tabel utama: `config`, `services`, `service_details`, `service_tags`, `workflow`, `skills`, `messages`, `add_ons`.

## R2 Bucket (File Storage)

Bucket: `eka-ryan-digital-solution-assets`.

```bash
# Upload file
wrangler r2 object put eka-ryan-digital-solution-assets/uploads/photo.jpg --file=./photo.jpg

# Hapus file
wrangler r2 object delete eka-ryan-digital-solution-assets/uploads/photo.jpg
```

> **Catatan**: `wrangler r2 object` tidak punya subcommand `list`. Untuk list objek, pakai Cloudflare REST API:
> ```bash
> curl -sk "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/eka-ryan-digital-solution-assets/objects?limit=100" \
>   -H "Authorization: Bearer $TOKEN"
> ```

## Pages Project

- Project name: `ekaryandigitalsolution`
- Build output: `./public` (diatur via `pages_build_output_dir` di `wrangler.toml`)
- Functions: `functions/api/[[route]].js`

## Secrets & Environment

Set via dashboard Cloudflare → Pages → Settings → Environment variables (Production):

| Variable | Keterangan |
|----------|-----------|
| `ADMIN_PASSWORD` | Override key admin (default `Ekaryan443!` bila kosong) |
| `JWT_SECRET` | (opsional) untuk auth lanjutan |

Jangan commit secret ke repo.

## Bindings (wrangler.toml)

```toml
[[d1_databases]]
binding = "DB"
database_name = "eka-ryan-digital-solution-db"
database_id = "91e5a4c5-92e1-4ae2-b027-cdab35724030"

[[r2_buckets]]
binding = "R2"
bucket_name = "eka-ryan-digital-solution-assets"
```

## References
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
