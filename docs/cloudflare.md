# Cloudflare Pages (Static Hosting Only)

Cloudflare pada proyek ini sekarang **HANYA untuk hosting statis** `./public`. Database, storage, dan API lama (D1 + R2 + Pages Functions) sudah **dipindahkan ke Supabase**.

> Setup Supabase: [supabase.md](./supabase.md). Deploy: [deployment.md](./deployment.md).

## Yang Masih Dipakai

- **Pages project**: `ekaryandigitalsolution`
- **Build output**: `./public` (HTML, CSS, JS, `db.js`, `supabase-config.js`, `supabase-api.js`)
- **Live URL**: `https://ekaryandigitalsolution.pages.dev/` (admin di `/admin`)
- **Deploy**: GitHub Actions → `cloudflare/wrangler-action@v4` dengan `pages deploy ./public`

## Yang SUDAH Dihapus dari Repo

- `functions/` (Pages Functions API `[[route]].js` + audio proxy)
- `wrangler.toml` (bindings D1 `DB` & R2 `R2`)
- `.wrangler/` (cache lokal)

## Cleanup di Dashboard Cloudflare (langkah manual)

Setelah situs baru terverifikasi, hapus artefak lama agar tidak ada sisa biaya/binding:

1. **Pages project** → `ekaryandigitalsolution` → **Settings → Bindings**:
   - Hapus binding **D1 `DB`** dan **R2 `R2`** (jika masih terpasang).
2. **Workers & Pages → D1**: hapus database `eka-ryan-digital-solution-db` (`91e5a4c5-92e1-4ae2-b027-cdab35724030`) bila sudah tidak dipakai.
3. **R2**: hapus bucket `eka-ryan-digital-solution-assets` bila isinya sudah tidak dibutuhkan (gambar lama tidak ikut migrasi).
4. **Pages → Settings → Environment variables**: hapus `ADMIN_PASSWORD` / `JWT_SECRET` / binding lama yang tak terpakai.

> Kredensial admin sekarang disimpan di `public/supabase-config.js` (Supabase), bukan secret Cloudflare.

## Verifikasi Statis Tanpa Backend

Setelah deploy, pastikan:
- `GET /` mengembalikan HTML (bukan 404/500 dari function).
- `GET /api/*` **harus 404** — ini tanda yang benar (tidak ada Functions lagi).
- Halaman publik merender data dari Supabase (cek Network tab → request ke `sqimmcecwuoadjbjiyfd.supabase.co`).

Lihat juga: [supabase.md](./supabase.md), [architecture.md](./architecture.md), [deployment.md](./deployment.md), [troubleshooting.md](./troubleshooting.md).
