# Troubleshooting Guide

Masalah nyata yang ditemui di proyek **Eka Ryan Digital Solution** (Cloudflare Pages + D1 + R2).

## Cloudflare / Wrangler

### Issue: `wrangler d1` / `wrangler r2` gagal di macOS lama
Cloudflare butuh macOS 13.5+, namun dev environment bisa di bawahnya. Solusi: selalu tambahkan `--remote`.
```bash
wrangler d1 execute eka-ryan-digital-solution-db --remote --command="..."
wrangler r2 object put ... --remote
```

### Issue: `wrangler r2 object list` tidak ada
`wrangler r2 object` tidak punya subcommand `list`. Gunakan REST API:
```bash
curl -sk "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/eka-ryan-digital-solution-assets/objects?limit=100" \
  -H "Authorization: Bearer $TOKEN"
```

### Issue: Deploy GitHub Actions gagal
- Cek secret `CLOUDFLARE_API_TOKEN` & `CLOUDFLARE_ACCOUNT_ID` di repo GitHub (Settings → Secrets).
- Pastikan token punya izin `Pages:Edit` + `Account:Cloudflare Pages`.
- Cek log run di tab Actions.

### Issue: Perubahan tidak muncul di live
- Cloudflare Pages cache: hard refresh (Cmd+Shift+R) atau buka mode incognito.
- `*.pages.dev` adalah subdomain Cloudflare, tidak ada user zone → tidak bisa purge cache via API. Cache akan expire natural.
- Pastikan file benar-benar ter-commit & push ke `main` (deploy otomatis).

## API

### Issue: `401 Unauthorized` saat write
- Pastikan mengirim `?key=Ekaryan443!` (atau header `Authorization: Bearer Ekaryan443!`).
- Bila `ADMIN_PASSWORD` diset di Cloudflare, pakai nilai itu, bukan default.

### Issue: `POST /api/messages` tetap butuh key?
Tidak seharusnya. `/api/messages` adalah publik (ada di `publicWritePaths`). Bila 401, cek `functions/api/[[route]].js` baris auth gate.

### Issue: Data admin tidak muncul di halaman utama
- **Penyebab lama (sudah diperbaiki)**: admin menulis ke `localStorage` (`db.js`) sementara publik membaca D1. Sekarang admin & publik sama-sama pakai D1 via API.
- Bila masih beda: cek `GET /api/services` vs tampilan publik; pastikan tidak ada cache lama di browser.

### Issue: `grep_search` gagal di `functions/api/[[route]].js`
Tool `grep_search` gagal pada file dengan `[[` di nama. Gunakan terminal:
```bash
grep -n "pattern" "functions/api/[[route]].js"
```

## curl / SSL

### Issue: `curl: (60) SSL certificate problem`
macOS di environment ini punya CA store usang → HTTPS ke host eksternal gagal. Gunakan `-k` (insecure) atau `-sk`:
```bash
curl -sk https://ekaryandigitalsolution.pages.dev/api/config
```
Browser tidak terpengaruh.

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

### Cek API live
```bash
curl -sk https://ekaryandigitalsolution.pages.dev/api/config | head -c 300
```

### Cek R2
```bash
curl -sk "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/eka-ryan-digital-solution-assets/objects?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Log Functions
Lihat di dashboard Cloudflare → Pages → project → Functions → Logs (atau `wrangler tail` untuk Worker, tidak untuk Pages statis).

## Getting Help

- Dokumentasi project: `docs/` (api-registry, deployment, cloudflare-workers, features, firebase-setup→cloudflare, workflow, troubleshooting).
- Repo: `incekaryan-create/eka-ryan-digital-solution` (private).
