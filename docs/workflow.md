# Development Workflow

## Git Workflow (Sederhana)

Proyek ini menggunakan **satu branch utama: `main`**. Tidak ada branch `develop`, `feature/*`, atau `hotfix/*`.

### Alur Kerja Harian

```bash
# 1. Pastikan di main & update
git checkout main
git pull origin main

# 2. Edit kode (public/, functions/, docs/, wrangler.toml)

# 3. Commit
git add -A
git commit -m "feat: tambah storage manager"

# 4. Push → otomatis trigger GitHub Actions deploy
git push origin main
```

Setiap `push` ke `main` memicu `.github/workflows/deploy.yml` yang men-deploy `./public` ke Cloudflare Pages (`ekaryandigitalsolution`).

## Commit Convention

Format bebas, disarankan:

```
<type>: <subject singkat>

<penjelasan opsional>
```

Types:
- `feat` - fitur baru
- `fix` - perbaikan bug
- `docs` - dokumentasi
- `style` - formatting
- `refactor` - restrukturisasi
- `chore` - maintenance

Contoh: `fix: admin panel sekarang baca/tulis D1 bukan localStorage`

## Deployment

Deploy **otomatis** lewat GitHub Actions (lihat `docs/deployment.md`). Tidak ada version bump manual atau release tag wajib.

## Code Review Checklist

- [ ] Perubahan tidak mem-break API publik
- [ ] `db.js` hanya dipakai sebagai fallback/backup, bukan sumber utama
- [ ] Tidak ada secret di-commit
- [ ] Dokumentasi (`docs/`) diperbarui bila ada perubahan API/fitur
- [ ] Deploy GitHub Actions sukses (green)
