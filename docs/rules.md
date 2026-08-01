# Project Rules & Conventions

Aturan wajib untuk **Eka Ryan Digital Solution**. Patuhi saat mengubah kode, docs, atau deploy.

## 1. Single Source of Truth (Supabase)

- **Data dinamis** (config, services, workflow, skills, add-ons, messages) disimpan di **Supabase PostgreSQL**.
- **File/gambar/audio** disimpan di **Supabase Storage** (bucket `assets`, `audio`).
- `public/db.js` **HANYA** fallback localStorage + backup lokal. **Bukan** sumber utama. Jangan jadikan acuan data.
- Cloudflare Pages **hanya** hosting statis — tidak ada Functions/D1/R2.

## 2. Gambar & Storage

- ✅ Semua gambar **wajib** lewat Supabase Storage: `https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/public/assets/<path>`.
- ❌ **DILARANG** hardcode URL gambar dari luar (imgur, drive, domain lain, base64 inline besar).
- Upload via Admin Panel (`sbApi.uploadImage`) — path `uploads/<timestamp>_<nama>`.
- Meta `og:image` / `twitter:image` di `index.html` harus menunjuk ke URL storage (bukan URL R2 lama).

## 3. Keamanan

- Publik (anon key) hanya bisa **baca** + kirim pesan kontak (diatur RLS).
- Write/hapus **hanya** untuk pengguna **Supabase Auth** yang lolos `public.is_admin()` (email JWT = email admin di `supabase/schema.sql`). Tidak ada service_role key di browser.
- **JANGAN commit service_role key** ke repositori publik (repo GitHub ini public!). Service key hanya dipakai operasi server/backup (mis. `migrate-data.mjs`), bukan di kode browser.
- Login Admin Panel = **Supabase Auth** (email/password) di `/admin`.
- Selalu sanitasi output saat render (`escapeHtml`).

## 4. Data Access

- Akses data lewat `window.sbApi` (`public/supabase-api.js`) — **jangan** akses supabase-js langsung di halaman.
- Halaman publik hanya memakai fungsi read + `saveMessage`.
- Halaman admin memakai fungsi write + storage (diizinkan RLS setelah login sebagai admin).

## 5. Git Workflow

- **Satu branch**: `main`. Tidak ada `develop`/`feature/*`.
- Deploy **otomatis** via GitHub Actions setiap `git push origin main`.
- Jangan commit: `.playwright-mcp/`, `.DS_Store`, `public/src/assets/sound/backsound.mp3`, secret.

### Commit Convention
```
<type>: <subject singkat>
```
- `feat` fitur · `fix` bug · `docs` dokumentasi · `style` format · `refactor` · `chore` maintenance

## 6. Code Review Checklist

- [ ] Tidak ada referensi `/api/*`, `functions/`, `wrangler`, D1, atau R2 tersisa.
- [ ] `db.js` hanya fallback/backup, bukan sumber utama.
- [ ] Tidak ada secret ter-commit (service_role key tidak boleh ada di kode/deploy).
- [ ] Semua gambar → Supabase Storage (tidak ada URL luar / URL R2 lama).
- [ ] Docs (`docs/`) diperbarui bila ada perubahan API/fitur.
- [ ] GitHub Actions deploy sukses (green).

## 7. Dokumentasi

- Setiap perubahan API/fitur → update `docs/` yang relevan.
- Struktur docs: `architecture.md`, `design.md`, `prd.md`, `rules.md`, `schema.md`, `api-registry.md`, `supabase.md`, `cloudflare.md`, `deployment.md`, `features.md`, `workflow.md`, `troubleshooting.md`.
- **Pada sesi baru**, baca semua file di `docs/` dulu sebelum mulai kerja.

## 8. Naming

- Tabel Supabase: `config`, `services`, `service_details`, `service_tags`, `workflow`, `skills`, `messages`, `add_ons`.
- Path storage gambar: `uploads/<timestamp>_<sanitized-name>`.
- Bucket: `assets` (gambar), `audio` (backsound).
- Client wrapper: `sbApi` (`supabase-api.js`), konfigurasi: `supabase-config.js`.
