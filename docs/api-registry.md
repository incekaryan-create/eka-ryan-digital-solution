# Data Access (supabase-api)

Proyek **tidak lagi punya REST API server**. Halaman browser berkomunikasi langsung dengan **Supabase** melalui `public/supabase-api.js`, yang mengekspos wrapper `window.sbApi` untuk `index.html` dan `admin.html`.

> Lihat [supabase.md](./supabase.md) untuk setup, dan [schema.md](./schema.md) untuk struktur tabel.

## Client

- **Publik (`sb`)**: anon/publishable key → dibatasi RLS (SELECT + INSERT messages).
- **Admin (`sbAdm`)**: service_role key → write/hapus + storage.

Kedua client dibuat di `public/supabase-api.js` memakai supabase-js v2 (CDN).

## Fungsi `window.sbApi`

### Services
| Fungsi | Keterangan |
|--------|-----------|
| `getServices()` | Semua layanan (urut `sort_order`), tiap item punya `details[]` & `tags[]` |
| `saveService(data, id?)` | Buat (id baru) / update layanan + ganti details & tags |
| `deleteService(id)` | Hapus layanan (cascade details/tags) |

`data` untuk `saveService`: `{ title, subtitle, description, price, image, tags[], details[] }`.

### Workflow
| Fungsi | Keterangan |
|--------|-----------|
| `getWorkflow()` | Semua langkah (urut `sort_order`) |
| `saveWorkflow(data, id?)` | `data: { title, short_desc, long_desc }` |
| `deleteWorkflow(id)` | Hapus langkah |

### Skills
| Fungsi | Keterangan |
|--------|-----------|
| `getSkills()` | Semua skill (urut `sort_order`) |
| `saveSkill(data, id?)` | `data: { name, category }` |
| `deleteSkill(id)` | Hapus skill |

### Add-ons
| Fungsi | Keterangan |
|--------|-----------|
| `getAddOns()` | Object `{ category: [addon] }` (urut kategori & sort_order) |
| `saveAddon(data, id?)` | `data: { name, category, price }` |
| `deleteAddon(id)` | Hapus add-on |

### Config
| Fungsi | Keterangan |
|--------|-----------|
| `getConfig()` | Baris `config` (`id='main'`) atau `null` |
| `saveConfig(payload)` | Upsert seluruh kolom config |

### Messages
| Fungsi | Keterangan |
|--------|-----------|
| `getMessages()` | Semua pesan (terbaru dulu) — admin |
| `saveMessage(msg)` | Insert pesan dari form (publik) |
| `markMessageRead(id)` | Tandai dibaca |
| `deleteMessage(id)` | Hapus satu |
| `clearMessages()` | Hapus semua |

### Storage
| Fungsi | Keterangan |
|--------|-----------|
| `uploadImage(file)` | Upload ke bucket `assets/uploads/` → `{ url, path }` |
| `deleteImage(urlOrPath)` | Hapus objek (terima URL publik / path). URL R2 lama diabaikan |
| `extractImagePath(url)` | Ambil path dari URL storage, atau `null` |
| `listStorage()` | `{ objects: [{ key, url, size }] }` |
| `deleteStorageObject(key)` | Hapus berdasarkan `key` (`assets/uploads/...`) |
| `publicUrl(bucket, path)` | URL publik storage |

## Autentikasi Admin

Login Admin Panel tetap **shared key sederhana** (bukan Supabase Auth). Kredensial ada di `public/supabase-config.js` → `adminUsername` / `adminPassword` (default `Eka Ryan` / `Ekaryan443!`). Setelah login, `sessionStorage.admin_logged` = `'1'`.

## Validasi

- Input dibersihkan via `escapeHtml()` saat render (cegah XSS).
- Gambar dikompresi klien-side (`optimizeImage`) sebelum upload.
- Supabase membatasi akses via RLS; tidak ada endpoint server untuk dilewati.

Lihat juga: [architecture.md](./architecture.md), [supabase.md](./supabase.md).
