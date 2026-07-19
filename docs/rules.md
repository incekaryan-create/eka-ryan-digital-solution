# Project Rules & Conventions

Aturan wajib untuk **Eka Ryan Digital Solution**. Patuhi saat mengubah kode, docs, atau deploy.

## 1. Single Source of Truth (D1 + R2)

- **Data dinamis** (config, services, workflow, skills, add-ons, messages) disimpan di **Cloudflare D1**.
- **File/gambar** disimpan di **Cloudflare R2** (`uploads/`).
- `public/db.js` **HANYA** fallback localStorage + backup lokal. **Bukan** sumber utama. Jangan jadikan acuan data.

## 2. Gambar & Storage

- ✅ Semua gambar **wajib** lewat R2: `https://ekaryandigitalsolution.pages.dev/api/r2/uploads/<key>`.
- ❌ **DILARANG** hardcode URL gambar dari luar (imgur, drive, domain lain, base64 inline besar).
- Upload via `POST /api/upload` (JPEG/PNG/GIF/WebP, maks 5 MB).
- Meta `og:image` / `twitter:image` di `index.html` harus menunjuk ke R2 (bukan domain luar).

## 3. Keamanan

- Write endpoint (`POST/PUT/DELETE`) **wajib** pakai admin key (`?key=` atau `Authorization: Bearer`).
- `POST /api/messages` adalah **publik** (pengecualian, tanpa key).
- **JANGAN** commit secret. `ADMIN_PASSWORD` & `JWT_SECRET` di-set via dashboard Cloudflare (Pages → Settings → Env).
- Selalu sanitasi input (`sanitizeInput`) & validasi (email, ukuran, tipe).
- CORS hanya untuk origin `https://ekaryandigitalsolution.pages.dev`.

## 4. API

- Format respons GET: data langsung (array/object), tidak dibungkus.
- Write sukses: `{ "success": true }` atau `{ "id": "...", "success": true }`.
- Error: `{ "error": "..." }` dengan status tepat (400/401/404/500).
- Field config hanya dari `ALLOWED_CONFIG_FIELDS` (cegah SQL injection via nama kolom).

## 5. Git Workflow

- **Satu branch**: `main`. Tidak ada `develop`/`feature/*`.
- Deploy **otomatis** via GitHub Actions setiap `git push origin main`.
- Jangan commit: `.playwright-mcp/`, `.wrangler/`, `.DS_Store`, secret.

### Commit Convention
```
<type>: <subject singkat>
```
- `feat` fitur · `fix` bug · `docs` dokumentasi · `style` format · `refactor` · `chore` maintenance

## 6. Code Review Checklist

- [ ] Tidak mem-break API publik.
- [ ] `db.js` hanya fallback/backup, bukan sumber utama.
- [ ] Tidak ada secret ter-commit.
- [ ] Semua gambar → R2 (tidak ada URL luar).
- [ ] Docs (`docs/`) diperbarui bila ada perubahan API/fitur.
- [ ] GitHub Actions deploy sukses (green).

## 7. Dokumentasi

- Setiap perubahan API/fitur → update `docs/` yang relevan.
- Struktur docs: `architecture.md`, `design.md`, `prd.md`, `rules.md`, `schema.md`, `api.md`, `cloudflare.md`, `deployment.md`, `features.md`, `workflow.md`, `troubleshooting.md`.
- **Pada sesi baru**, baca semua file di `docs/` dulu sebelum mulai kerja (lihat skill `docs-orientation`).

## 8. Naming

- Tabel D1: `config`, `services`, `service_details`, `service_tags`, `workflow`, `skills`, `messages`, `add_ons`.
- Key R2 upload: `uploads/<timestamp>_<sanitized-name>`.
- Binding: `DB` (D1), `R2` (R2).
