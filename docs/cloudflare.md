# Cloudflare Setup (D1 + R2 + Pages Functions)

> **Catatan**: Proyek ini **TIDAK menggunakan Firebase**. Dokumen ini mencakup setup Cloudflare yang sebenarnya: D1 (database SQL), R2 (file storage), Pages (hosting), dan Pages Functions (API).

## Prerequisites

- Akun Cloudflare (Account ID: `55bcfa4f9d8d6b01276737c7b64339a8`)
- `wrangler` CLI (`npm i -g wrangler`)
- `wrangler login` sudah dilakukan

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

Akses di kode: `env.DB.prepare('...').bind(...).all()` dan `env.R2.put/get/delete(key)`.

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

Tabel: `config`, `services`, `service_details`, `service_tags`, `workflow`, `skills`, `messages`, `add_ons`. Lihat [schema.md](./schema.md).

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

## Pages Functions

Kode API ada di `functions/api/[[route]].js` (catch-all `onRequest`), otomatis terdeploy bersama `./public`. Pattern berbeda dengan Worker: pakai named export `onRequest(context)` dengan `context = { request, env }`.

```javascript
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const method = request.method;
  const services = await env.DB.prepare('SELECT * FROM services').all();
  const object = await env.R2.get('uploads/photo.jpg');
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Pages Project

- Project name: `ekaryandigitalsolution`
- Build output: `./public` (via `pages_build_output_dir`)
- Functions: `functions/api/[[route]].js`

## Secrets & Environment

Set via dashboard Cloudflare → Pages → Settings → Environment variables (Production):

| Variable | Keterangan |
|----------|-----------|
| `ADMIN_PASSWORD` | Override key admin (default `Ekaryan443!` bila kosong) |
| `JWT_SECRET` | (opsional) untuk auth lanjutan |

Jangan commit secret ke repo.

## Common Commands

| Command | Description |
|---------|-------------|
| `wrangler pages deploy ./public --project-name=ekaryandigitalsolution` | Deploy ke Pages |
| `wrangler d1 execute eka-ryan-digital-solution-db --remote --command="..."` | Jalankan SQL D1 |
| `wrangler r2 object put ...` | Upload objek R2 |
| `wrangler tail` | Stream live logs (Worker); untuk Pages lihat di dashboard |

## Best Practices

1. **CORS**: selalu kembalikan header CORS konsisten (lihat `getCorsHeaders()`).
2. **Error handling**: bungkus di `try/catch`, kembalikan `{ error: "..." }` dengan status tepat.
3. **Secrets**: jangan hardcode key di `functions/`, gunakan `env.ADMIN_PASSWORD`.
4. **Sanitasi**: gunakan `sanitizeInput()` untuk cegah XSS.
5. **R2 public serving**: serve via `GET /api/r2/*` dengan `Cache-Control: max-age=31536000`.

## References
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
