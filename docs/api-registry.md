# Data Access (supabase-api)

Proyek **tidak lagi punya REST API server**. Halaman browser berkomunikasi langsung dengan **Supabase** melalui `public/supabase-api.js`, yang mengekspos wrapper `window.sbApi` untuk `index.html` dan `admin.html`.

> Lihat [supabase.md](./supabase.md) untuk setup, dan [schema.md](./schema.md) untuk struktur tabel.

## Client

- **Tunggal (`sb`)**: anon/publishable key → dibatasi RLS (SELECT + INSERT messages). Setelah admin login via **Supabase Auth**, supabase-js otomatis melampirkan sesi JWT user ke klien yang sama sehingga tulis/hapus diizinkan RLS (authenticated + `is_admin()`).

Client dibuat di `public/supabase-api.js` memakai supabase-js v2 (CDN). Tidak ada lagi client service_role (`sbAdm`) di sisi browser.

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
| `getConfig()` | Baris `config` (`id='main'`) atau `null` — termasuk `cv_url` |
| `saveConfig(payload)` | Upsert seluruh kolom config (termasuk `cv_url`) |

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
| `uploadImage(file)` | Upload gambar ke bucket `assets/uploads/` → `{ url, path }` |
| `deleteImage(urlOrPath)` | Hapus objek (terima URL publik / path). URL R2 lama diabaikan |
| `uploadCV(file)` | Upload PDF ke bucket `assets/cv/` → `{ url, path }` |
| `deleteCV(urlOrPath)` | Hapus file CV dari storage |
| `extractImagePath(url)` | Ambil path dari URL storage, atau `null` |
| `listStorage()` | `{ objects: [{ key, url, size }] }` |
| `deleteStorageObject(key)` | Hapus berdasarkan `key` (`assets/uploads/...`) |
| `publicUrl(bucket, path)` | URL publik storage |

### Auth
| Fungsi | Keterangan |
|--------|-----------|
| `signIn(email, password)` | Login Supabase Auth (panel admin) |
| `signOut()` | Logout |
| `getSession()` | Ambil sesi saat ini (atau `null`) |
| `onAuthStateChange(cb)` | Subscribe perubahan sesi (`SIGNED_IN` / `SIGNED_OUT`) |

## Autentikasi Admin

Login Admin Panel memakai **Supabase Auth** (`sbApi.signIn`). Sesi disimpan oleh supabase-js (localStorage) sehingga login bertahan antar kunjungan. Akses tulis/hapus dikendalikan oleh RLS (`public.is_admin()` — klaim email JWT harus cocok dengan email admin di `supabase/schema.sql`). Tidak ada shared key / secret di browser.

## Validasi

- Input dibersihkan via `escapeHtml()` saat render (cegah XSS).
- Gambar dikompresi klien-side (`optimizeImage`) sebelum upload.
- Supabase membatasi akses via RLS; tidak ada endpoint server untuk dilewati.

Lihat juga: [architecture.md](./architecture.md), [supabase.md](./supabase.md).
