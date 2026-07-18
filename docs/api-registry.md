# API Registry

API untuk **Eka Ryan Digital Solution** — diimplementasikan sebagai Cloudflare Pages Function di `functions/api/[[route]].js`. Semua endpoint berada di bawah prefix `/api`.

## Base URL

- Production: `https://ekaryandigitalsolution.pages.dev/api`
- Origin yang diizinkan (CORS): `https://ekaryandigitalsolution.pages.dev`

## Autentikasi

Operasi tulis (POST/PUT/DELETE) dilindungi dengan **admin key** sederhana.

- Kirim via query param: `?key=Ekaryan443!`
- Atau via header: `Authorization: Bearer Ekaryan443!`
- Key default adalah `Ekaryan443!` (hardcoded di `admin.html` dan sebagai fallback `env.ADMIN_PASSWORD || 'Ekaryan443!'` di API).
- Untuk mengubah key di production, set **Pages secret** `ADMIN_PASSWORD` di dashboard Cloudflare.
- **Pengecualian publik**: `POST /api/messages` (form kontak) tidak memerlukan key.

Jika key salah: `401 { "error": "Unauthorized" }`.

## Format Respons

- **GET sukses**: mengembalikan data langsung (array/object), bukan dibungkus.
  - Contoh: `GET /api/services` → `[ { id, title, ... }, ... ]`
  - Contoh: `GET /api/config` → `{ id: "main", hero_name, ... }`
- **Write sukses**: `{ "success": true }` atau `{ "id": "<id>", "success": true }` (status 201 untuk create).
- **Error**: `{ "error": "<pesan>" }` dengan status HTTP yang sesuai (400/401/404/500).

## Endpoint Publik (GET)

| Method | Endpoint | Deskripsi | Respons |
|--------|----------|-----------|---------|
| GET | `/api/config` | Ambil konfigurasi hero & kontak | object config |
| GET | `/api/services` | Daftar layanan (join `service_details` + `service_tags`) | array service |
| GET | `/api/services/:id` | Detail satu layanan | object service |
| GET | `/api/workflow` | Daftar alur kerja | array workflow |
| GET | `/api/skills` | Daftar keahlian | array skill |
| GET | `/api/messages` | Daftar pesan masuk (admin) | array message |
| GET | `/api/addons` | Add-ons dikelompokkan per kategori | object `{ category: [addon] }` |
| GET | `/api/addons/list` | Add-ons flat (semua) | array addon |
| GET | `/api/storage` | Daftar objek di R2 bucket | `{ objects: [...], truncated }` |
| GET | `/api/r2/*` | Serve file publik dari R2 (cache 1 tahun) | binary file |

### Bentuk object `service`
```json
{
  "id": "svc_xxx",
  "sort_order": 1,
  "title": "Pengembangan Web",
  "subtitle": "FULL-STACK DEVELOPMENT",
  "description": "...",
  "image": "https://.../r2/uploads/xxx.jpg",
  "price": "Mulai dari Rp 5.000.000",
  "is_active": 1,
  "created_at": "2024-...",
  "details": ["...", "..."],
  "tags": ["web", "react"]
}
```

## Endpoint Tulisan (perlu `?key=`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| PUT | `/api/config` | Update config (hero, kontak, sosmed) | key |
| POST | `/api/services` | Buat layanan | key |
| PUT | `/api/services/:id` | Update layanan | key |
| DELETE | `/api/services/:id` | Hapus layanan | key |
| POST | `/api/workflow` | Buat langkah workflow | key |
| PUT | `/api/workflow/:id` | Update workflow | key |
| DELETE | `/api/workflow/:id` | Hapus workflow | key |
| POST | `/api/skills` | Buat skill | key |
| PUT | `/api/skills/:id` | Update skill | key |
| DELETE | `/api/skills/:id` | Hapus skill | key |
| POST | `/api/messages` | Kirim pesan kontak | **publik** |
| PUT | `/api/messages/:id/read` | Tandai pesan sudah dibaca | key |
| DELETE | `/api/messages/:id` | Hapus satu pesan | key |
| DELETE | `/api/messages` | Hapus semua pesan | key |
| POST | `/api/addons` | Buat add-on | key |
| PUT | `/api/addons/:id` | Update add-on | key |
| DELETE | `/api/addons/:id` | Hapus add-on | key |
| POST | `/api/upload` | Upload file ke R2 (form-data `file`) | key |
| POST | `/api/upload/delete` | Hapus file R2 (body `{ key }`) | key |
| GET | `/api/storage` | List storage R2 | key |
| DELETE | `/api/storage` | Hapus objek R2 (body `{ key }`) | key |

## Validasi & Batasan

- `sanitizeInput()` memotong input ke 500 karakter dan membuang `<` `>`.
- `validateEmail()` untuk field email pesan.
- Tipe file upload diizinkan: JPEG, PNG, GIF, WebP (`ALLOWED_IMAGE_TYPES`).
- Ukuran file maksimal: **5 MB** (`MAX_FILE_SIZE`).
- Panjang pesan maksimal: 5000 karakter (`MAX_MESSAGE_LENGTH`).
- Panjang input umum maksimal: 500 karakter (`MAX_INPUT_LENGTH`).

## Contoh

```bash
# Ambil layanan (publik)
curl -sk https://ekaryandigitalsolution.pages.dev/api/services

# Buat layanan (admin)
curl -sk -X POST "https://ekaryandigitalsolution.pages.dev/api/services?key=Ekaryan443!" \
  -H "Content-Type: application/json" \
  -d '{"title":"Desain Logo","subtitle":"BRANDING","description":"..."}'

# Kirim pesan kontak (publik, tanpa key)
curl -sk -X POST "https://ekaryandigitalsolution.pages.dev/api/messages" \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","email":"budi@mail.com","message":"Halo"}'
```
