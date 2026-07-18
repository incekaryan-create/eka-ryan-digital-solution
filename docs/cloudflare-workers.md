# Cloudflare Pages Functions & Bindings

## Overview
Proyek ini menggunakan **Cloudflare Pages Functions** (bukan Cloudflare Workers standalone) untuk API backend. Kode ada di `functions/api/[[route]].js` dan otomatis terdeploy bersama folder `./public`.

## Struktur

```
public/                 # Static assets (HTML, JS, CSS)
functions/
  api/
    [[route]].js       # Catch-all API handler (onRequest)
wrangler.toml          # Pages config + bindings (D1, R2)
```

## Pages Function Pattern

Berbeda dengan Worker (`export default { fetch }`), Pages Functions menggunakan named export `onRequest` (atau `onRequestGet`, `onRequestPost`, dst).

```javascript
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const method = request.method;

  // Akses binding
  const services = await env.DB.prepare('SELECT * FROM services').all();
  const object = await env.R2.get('uploads/photo.jpg');

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Bindings (dari wrangler.toml)

### D1 Database
```toml
[[d1_databases]]
binding = "DB"
database_name = "eka-ryan-digital-solution-db"
database_id = "91e5a4c5-92e1-4ae2-b027-cdab35724030"
```
Akses: `env.DB.prepare('...').bind(...).all()`

### R2 Bucket
```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "eka-ryan-digital-solution-assets"
```
Akses: `env.R2.put(key, data)`, `env.R2.get(key)`, `env.R2.delete(key)`

### Vars & Secrets
```toml
[vars]
ENVIRONMENT = "production"
```
Secret (jangan di-commit): `ADMIN_PASSWORD` via Cloudflare Pages dashboard.

## Common Commands

| Command | Description |
|---------|-------------|
| `wrangler pages deploy ./public --project-name=ekaryandigitalsolution` | Deploy ke Pages |
| `wrangler d1 execute eka-ryan-digital-solution-db --remote --command="..."` | Jalankan SQL D1 (pakai `--remote`) |
| `wrangler r2 object put ...` | Upload objek R2 |
| `wrangler tail` | Stream live logs (Worker); untuk Pages lihat di dashboard |

## Best Practices

1. **CORS**: selalu kembalikan header CORS yang konsisten (lihat `getCorsHeaders()`).
2. **Error handling**: bungkus logika di `try/catch`, kembalikan `{ error: "..." }` dengan status tepat.
3. **Secrets**: jangan hardcode key di `functions/`, gunakan `env.ADMIN_PASSWORD`.
4. **Sanitasi**: gunakan `sanitizeInput()` untuk mencegah XSS pada input user.
5. **R2 public serving**: serve via `GET /api/r2/*` dengan `Cache-Control: max-age=31536000`.

## References
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
