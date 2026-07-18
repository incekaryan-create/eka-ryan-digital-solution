# Features Documentation

Fitur nyata **Eka Ryan Digital Solution** — portfolio digital freelancer (Eka Ryan).

## Feature Index

| Fitur | Status | Penyimpanan | Akses |
|-------|--------|-------------|-------|
| Hero & Config | Active | D1 (`config`) | Publik GET / API PUT |
| Layanan (Services) | Active | D1 (`services`, `service_details`, `service_tags`) | Publik GET / Admin CRUD |
| Workflow | Active | D1 (`workflow`) | Publik GET / Admin CRUD |
| Skills | Active | D1 (`skills`) | Publik GET / Admin CRUD |
| Add-ons | Active | D1 (`add_ons`) | Publik GET / Admin CRUD |
| Pesan Kontak | Active | D1 (`messages`) | Publik POST / Admin baca/hapus |
| Storage (R2) | Active | R2 bucket | Admin upload/delete |
| Admin Panel | Active | D1 + R2 | Login key `Ekaryan443!` |
| Backup/Restore | Active | localStorage (`db.js`) | Admin export/import |

## Halaman Publik (`index.html`)

- **Hero**: nama, greeting, deskripsi, tagline, gambar hero (dari R2), jaminan & kualitas.
- **Layanan**: grid layanan dari `GET /api/services` (judul, subtitle, gambar, harga, tags, details).
- **Workflow**: langkah alur kerja dari `GET /api/workflow`.
- **Skills**: keahlian dari `GET /api/skills`.
- **Add-ons**: checkbox pilihan fitur tambahan dari `GET /api/addons` (dikelompokkan per kategori).
- **Form Kontak**: kirim pesan via `POST /api/messages` (publik, tanpa key).
- **Config fallback**: bila API gagal, `db.getConfig()` (localStorage) dipakai sebagai cadangan.

## Admin Panel (`admin.html`)

Login dengan key `Ekaryan443!`. Panel mencakup:

- **Dashboard**: statistik jumlah layanan, workflow, skills, pesan.
- **Services CRUD**: tabel + form tambah/edit/hapus via `POST/PUT/DELETE /api/services`.
- **Workflow CRUD**: via `POST/PUT/DELETE /api/workflow`.
- **Skills CRUD**: via `POST/PUT/DELETE /api/skills`.
- **Add-ons CRUD**: via `POST/PUT/DELETE /api/addons`.
- **Messages**: lihat, tandai dibaca (`PUT /api/messages/:id/read`), hapus (`DELETE /api/messages/:id`), hapus semua (`DELETE /api/messages`).
- **Config**: edit hero & kontak via `PUT /api/config` (mirror ke `db.updateConfig()`).
- **Storage Manager**: list objek R2 (`GET /api/storage`), upload (`POST /api/upload`), hapus (`DELETE /api/storage`).
- **Backup/Restore**: `db.exportAll()` / `db.importAll()` untuk cadangan JSON lokal.

## Storage (R2)

- Bucket: `eka-ryan-digital-solution-assets`.
- File diakses publik via `GET /api/r2/<key>` (cache 1 tahun).
- Upload dibatasi 5 MB, tipe JPEG/PNG/GIF/WebP.
- Hero image & gambar layanan disimpan di `uploads/`.

## Catatan

- **Tidak ada Firebase, autentikasi user, OAuth, atau dashboard analytics** di proyek ini.
- Semua data dinamis disimpan di **Cloudflare D1** (SQL) dan **R2** (file).
- `db.js` hanya sebagai fallback localStorage + backup lokal, bukan sumber utama.
