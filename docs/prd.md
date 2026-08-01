# Product Requirements Document (PRD)

## 1. Overview

**Produk**: Eka Ryan Digital Solution — website portfolio personal untuk freelancer Eka Ryan (Web Developer & UI/UX Designer).

**Tujuan**: Menampilkan layanan, alur kerja, keahlian, dan memudahkan prospek menghubungi Eka Ryan, sekaligus memberi admin panel untuk mengelola konten tanpa deploy ulang.

**Platform**: Web (responsive), di-hosting di Cloudflare Pages.

## 2. Target User

| Tipe | Deskripsi | Kebutuhan |
|------|-----------|-----------|
| **Pengunjung (Prospek)** | Klien potensial | Lihat portofolio, layanan, cara kerja, kirim pesan |
| **Admin (Eka Ryan)** | Pemilik | Kelola konten (CRUD) via panel, upload gambar |

## 3. Fitur Inti

### 3.1 Halaman Publik
- **Hero**: nama, greeting, deskripsi, tagline, foto profil (Supabase Storage), jaminan & kualitas.
- **Layanan**: grid kartu (judul, subtitle, gambar, harga, tags, detail).
- **Workflow**: langkah alur kerja (timeline/step).
- **Skills**: daftar keahlian.
- **Add-ons**: pilihan fitur tambahan (dikelompokkan per kategori).
- **Contact Form**: kirim pesan (publik, tanpa login).
- **SEO**: meta OG/Twitter, JSON-LD, Pinterest domain verification (`p:domain_verify`).

### 3.2 Admin Panel
- Login via Supabase Auth (email/password admin; diatur RLS `is_admin()`).
- Dashboard statistik.
- CRUD: Services, Workflow, Skills, Add-ons, Messages (baca/hapus).
- Edit Config (hero & kontak).
- Storage Manager (list/upload/delete Supabase Storage).
- Backup/Restore (export/import JSON localStorage).

### 3.3 Infrastruktur
- Data: Supabase (PostgreSQL + Storage), akses langsung dari browser via supabase-js.
- Hosting: Cloudflare Pages statis (`./public`).
- Deploy otomatis via GitHub Actions.

## 4. User Stories

- Sebagai prospek, saya ingin melihat layanan & harga agar saya bisa memutuskan kolaborasi.
- Sebagai prospek, saya ingin mengirim pesan kontak agar saya bisa menghubungi Eka Ryan.
- Sebagai admin, saya ingin mengubah foto hero & layanan tanpa deploy agar konten selalu update.
- Sebagai admin, saya ingin mengupload gambar ke storage terpusat (Supabase) agar URL konsisten.

## 5. Acceptance Criteria

- [ ] Halaman publik merender data terbaru dari Supabase (bukan localStorage stale).
- [ ] Semua gambar mengarah ke Supabase Storage (tidak ada URL luar / URL R2 lama).
- [ ] Admin dapat login, CRUD, dan upload gambar dengan sukses.
- [ ] Contact form tersimpan ke Supabase & bisa dibaca di admin.
- [ ] Deploy otomatis jalan (GitHub Actions green) setiap push ke `main`.

## 6. Non-Goals (di luar scope)

- ❌ Firebase / autentikasi user / OAuth.
- ❌ Multi-user / role-based access (hanya 1 admin key).
- ❌ Payment gateway / e-commerce.
- ❌ Analytics dashboard bawaan.
- ❌ CMS headless eksternal.

## 7. Metrik Sukses

- Waktu update konten tanpa deploy = 0 (real-time via Supabase).
- Semua aset di Supabase Storage (CDN global).
- Lighthouse performance tinggi (static + CDN).

Lihat juga: [features.md](./features.md), [architecture.md](./architecture.md).
