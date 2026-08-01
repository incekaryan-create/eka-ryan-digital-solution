# Design System

Panduan desain **Eka Ryan Digital Solution** — portfolio dengan estetika terang (light-teal), modern, dan berfokus pada tipografi.

## Tema & Palet

**Warna brand (main):**
- **Primer** `#014D43` (`zinc-950`) — warna brand gelap: logo, badge, hover sidebar admin, focus ring, scrollbar.
- **Aksen** `#CEED6B` (`accent-500`) — tombol CTA, logo, badge, highlight, ikon aktif, focus ring.
- **Background** `#FFFFFF` — halaman terang; permukaan sekunder memakai `zinc-50`/`zinc-100` teal-tinted.

| Token | Nilai | Penggunaan |
|-------|-------|-----------|
| `zinc-50` | `#f6faf8` | kartu/panel terang, strip tabel |
| `zinc-100` | `#e9f2ef` | permukaan sekunder (input, pill, accordion hover, row-hover admin) |
| `zinc-200` | `#d5e6e0` | border, divider antar section & kartu |
| `zinc-300` | `#bcd8cf` | border input yang lebih tegas |
| `zinc-500` | `#6f9c91` | placeholder |
| `zinc-600` | `#4c7d72` | teks muted, icon non-aksi; thumb scrollbar |
| `zinc-700` | `#3a635a` | teks sekunder/meta |
| `zinc-900` | `#17332e` | teks utama di atas latar putih |
| `zinc-950` | `#014D43` | brand dark (badge, logo, sidebar hover, focus ring) |
| `accent-500` | `#CEED6B` | tombol utama, logo, scroll-to-top, WA pill |
| `accent-600` | `#bed755` | hover tombol aksen |
| `primary-700` | `#0f766e` | teks aksen (nama, link, label section) |
| `primary-950` | `#042f2e` | teks di atas tombol/area aksen (contrast tinggi) |
| `red-600` | semantic | hanya error form & aksi delete (destructive) |

- **Netral**: Skala `zinc` disesuaikan (teal-tinted) untuk tetap "hangat" di atas putih — teks utama `zinc-900` `#17332e`, bukan hitam murni.
- **Kontras aksesibel**: mengikuti WCAG. Contoh terverifikasi: `#17332e` di `#FFFFFF` ≈ 10:1, `#CEED6B`+`#042f2e` ≈ 11:1.
- **Tombol brand (tetap terang)**: LinkedIn `#0077b5`, Twitter/X hitam, WhatsApp `#25d366`, Telegram `#0088cc`, toast sukses `bg-green-600` — semua memakai `text-white` (dikecualikan dari recolor).
- **Modal backdrop**: tetap `bg-black/60–80` + blur agar konten modal menonjol di atas halaman terang.

### Mapping sebelum → sesudah (recolor dark-teal → light)

| Sebelum (dark-teal) | Sesudah (light) | Catatan |
|---------|---------|---------|
| `<html class="dark">` | `<html>` | dark mode class dihapus |
| `bg-zinc-950` (page `#014D43`) | `bg-white` | background halaman terang |
| `text-white` (body teks) | `text-zinc-900` `#17332e` | teks utama di atas putih |
| `bg-zinc-900` `#0b5c50` (panel) | `bg-zinc-50` / `bg-zinc-100` | kartu, strip, accordion |
| `border/divide zinc-800/850/900` | `border-zinc-200` | border antar elemen |
| `text-accent-400/500` (hover/link) | `text-primary-700` | aksen teks agar kontras di putih |
| `placeholder-zinc-400/600` | `placeholder-zinc-500` | placeholder terbaca |
| `from/to-zinc-950`, `via-zinc-900/40` | `from-zinc-50`, `via-zinc-100/60` | gradient kartu |
| grid overlay `#ffffff05` | `#014d4318` | decorative grid tetap terlihat |
| scrollbar thumb `#0d6055` / hover `#CEED6B` | `#4c7d72` / hover `#014D43` | scrollbar light-friendly |
| `text-red-400` error | `text-red-600` | kontras di latar terang |
| `row-hover` `rgba(255,255,255,0.02)` | `#e9f2ef` | hover baris tabel terlihat |
| `hover:text-red-500` (delete) | `hover:text-red-600` | aksi destruktif kontras |

## Tipografi

Font di-load dari Google Fonts (`index.html` / `admin.html`):

| Font | Penggunaan | Berat |
|------|-----------|-------|
| **Inter** | Body text, UI umum | 300–700 |
| **JetBrains Mono** | Kode, angka, label teknis | 400–700 |
| **Space Grotesk** | Heading sekunder | 500–700 |
| **Syne** | Display / brand utama | 700–800 |

Class helper: `font-heading` (Syne/Space Grotesk), `font-mono` (JetBrains Mono).

## Layout

- **Responsif**: mobile-first, grid yang collapse ke 1 kolom di layar kecil.
- **Hero**: layout split — teks kiri, gambar profil (`.hero-float img`) tengah, metadata kanan, dengan efek float/hover scale.
- **Grid layanan**: kartu (`group-hover:scale-105`) dengan gambar cover `object-cover`.
- **Spacing**: konsisten menggunakan skala Tailwind (p-4, gap-6, dll).
- **Rounded**: `rounded-lg` / `rounded-full` untuk tombol & badge.

## Komponen UI

| Komponen | Catatan |
|----------|---------|
| Tombol CTA | `bg-accent-500 hover:bg-accent-600 text-primary-950`, rounded-full, shadow aksen |
| Kartu layanan | border `zinc-200`, hover border aksen + scale, lazy-load gambar |
| Input form | `bg-white border-zinc-300 text-zinc-900`, focus ring aksen |
| Badge/Tag | `text-[10px] uppercase tracking-widest` |
| Modal | panel `bg-white`/`bg-zinc-100`, backdrop `bg-black/70-80` |
| Icon | Inline SVG (stroke `currentColor`, `stroke-width=2`) — tidak ada icon font eksternal |

## Gambar & Media

- Semua gambar dari **Supabase Storage** (`https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/public/assets/<path>`, lihat [supabase.md](./supabase.md)).
- Atribut: `loading="lazy"`, `referrerpolicy="no-referrer"`, `object-cover`.
- Fallback: `onerror="this.style.display='none'"` pada kartu layanan.
- Audio backsound: `audio/backsound.mp3` di bucket `audio` Supabase (URL storage publik).

## Admin Panel

- Panel terang (`bg-white`), sidebar memakai `bg-white` dengan item aktif `bg-accent-500` (`#CEED6B`) + teks `#014D43`; hover item `#014D43` + teks putih.
- Tombol aksi (Masuk, Tambah, Simpan, Refresh) memakai `bg-accent-500 text-primary-950` agar kontras di latar putih.
- Aksi destruktif memakai `red-600` (Hapus), sukses memakai `bg-green-600` (toast, `text-white`).
- Form input konsisten: label `text-[10px] text-zinc-700`, field `bg-white` / `bg-zinc-100`.
- Hover baris tabel (`row-hover`) memakai `#e9f2ef`.

## Prinsip Desain

1. **Kontras tinggi** — teks selalu terbaca di atas putih (`zinc-900` `#17332e`); tombol aksen memakai teks `primary-950`.
2. **Micro-interaction** — transisi `duration-300/700`, hover scale, warna aksen.
3. **Konsistensi** — satu aksen (lime `#CEED6B`), satu skala netral (zinc teal-tinted), satu primer (`#014D43`), latar putih.
4. **Performance** — lazy-load gambar, CDN Cloudflare, cache storage Supabase.
