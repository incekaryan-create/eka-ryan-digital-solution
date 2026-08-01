# Troubleshooting Guide

Masalah nyata yang ditemui di proyek **Eka Ryan Digital Solution** (Cloudflare Pages statis + Supabase).

## Supabase

### Issue: Data halaman kosong di preview/branch
**Penyebab lama (Cloudflare)**: binding D1/R2 hanya di Production → preview 500. **Sekarang tidak relevan** — data datang langsung dari Supabase via browser, jadi preview & production sama-sama membaca data yang sama. Bila kosong:
- Cek Network tab → request ke `sqimmcecwuoadjbjiyfd.supabase.co` status 200/403/404.
- Pastikan `supabase-config.js` sudah berisi `url` + `anonKey` yang benar.

### Issue: `GET /rest/v1/...` mengembalikan `404`
- Tabel belum dibuat → jalankan `supabase/schema.sql` di **SQL Editor**.

### Issue: `403` pada baca data publik
- Policy RLS `anon read ...` belum dibuat, atau memakai key yang salah (mis. admin memakai anon key untuk tulis). Cek bagian RLS di `supabase/schema.sql`.

### Issue: Admin gagal simpan/hapus
- `serviceKey` di `supabase-config.js` masih placeholder (`ISI_SERVICE_ROLE_KEY_DARI_DASHBOARD`) atau salah.
- Ambil service_role/secret key: **Supabase Dashboard → Project Settings → API Keys**.

### Issue: Upload gambar `401/403`
- Upload memakai service_role key (bukan publishable). Pastikan `serviceKey` benar.
- Cek bucket `assets` ada & public.

### Issue: Audio backsound tidak bunyi
- Bucket `audio` harus ada & public; objek `backsound.mp3` harus ter-upload.
- **Batas 50 MB**: file 76 MB tidak bisa — kompres/trim dulu (lihat [supabase.md](./supabase.md)).

### Issue: Tidak bisa konek langsung (psql)
- Supabase direct connection bersifat IPv6-only. Gunakan **pooler** IPv4:
  `host aws-0-ap-southeast-1.pooler.supabase.com`, port `6543`, user `postgres.sqimmcecwuoadjbjiyfd`.

## Cloudflare Pages

### Issue: Deploy GitHub Actions gagal
- Cek secret `CLOUDFLARE_API_TOKEN` & `CLOUDFLARE_ACCOUNT_ID` di repo GitHub (Settings → Secrets).
- Pastikan token punya izin `Pages:Edit` + `Account:Cloudflare Pages`.
- Cek log run di tab Actions.

### Issue: Perubahan tidak muncul di live
- Hard refresh (Cmd+Shift+R) atau mode incognito.
- `*.pages.dev` adalah subdomain Cloudflare → cache expire natural, tidak bisa di-purge via API.
- Pastikan file ter-commit & push ke `main` (deploy otomatis).

### Issue: `/api/*` masih ada (404)
- Itu **normal & diharapkan** setelah migrasi: tidak ada Functions lagi. Halaman tidak lagi memakai `/api`.

## Data / Admin

### Issue: Data admin tidak muncul di halaman utama
- **Penyebab lama (sudah diperbaiki)**: admin menulis ke `localStorage` (`db.js`) sementara publik membaca D1. Sekarang admin & publik sama-sama baca/tulis **Supabase**.
- Bila masih beda: hard refresh browser; pastikan tidak ada cache lama.

### Issue: Gambar lama (URL `/api/r2/...`) rusak
- R2 tidak lagi dipakai. Upload ulang gambar lewat **Admin Panel** (Simpan) → otomatis tersimpan di Supabase Storage.

## curl / SSL

### Issue: `curl: (60) SSL certificate problem`
- CA store macOS di environment ini usang. Gunakan `-k`/`-sk`:
  ```bash
  curl -sk https://sqimmcecwuoadjbjiyfd.supabase.co/rest/v1/config?select=id \
    -H "apikey: <ANON_KEY>"
  ```

## Git

### Issue: Push rejected
```bash
git pull --rebase origin main
git push
```

### Issue: File tidak sengaja ter-commit (mis. `.playwright-mcp/`)
```bash
git rm -r --cached .playwright-mcp/
echo ".playwright-mcp/" >> .gitignore
git add -A && git commit -m "chore: ignore playwright cache"
```

## Debug Tips

### Cek data live (publik)
```bash
curl -sk "https://sqimmcecwuoadjbjiyfd.supabase.co/rest/v1/config?select=hero_name" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
```

### Cek objek storage (admin)
```bash
curl -sk "https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/list/assets/uploads" \
  -H "apikey: <SERVICE_ROLE_KEY>" -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```

## Getting Help

- Dokumentasi project: `docs/` — [architecture.md](./architecture.md), [design.md](./design.md), [prd.md](./prd.md), [rules.md](./rules.md), [schema.md](./schema.md), [api-registry.md](./api-registry.md), [supabase.md](./supabase.md), [cloudflare.md](./cloudflare.md), [deployment.md](./deployment.md), [features.md](./features.md), [workflow.md](./workflow.md), [troubleshooting.md](./troubleshooting.md).
- Repo: `incekaryan-create/eka-ryan-digital-solution`.
