# Design System

Panduan desain **Eka Ryan Digital Solution** — portfolio dengan estetika dark-teal, modern, dan berfokus pada tipografi.

## Tema & Palet

**Warna brand (main):**
- **Primer** `#014D43` (`primary-600`, `zinc-950`) — background utama & permukaan besar.
- **Aksen** `#CEED6B` (`accent-500`) — tombol CTA, logo, badge, highlight, ikon aktif.
- **Netral** `#FFFFFF` — teks utama di atas permukaan gelap.

| Token | Nilai | Penggunaan |
|-------|-------|-----------|
| `zinc-950` | `#014D43` | background halaman (`bg-zinc-950`) |
| `zinc-900` | `#0b5c50` | kartu/panel/input lebih terang, border antar-section |
| `zinc-800` | `#177a6b` | border input & divider yang lebih tegas |
| `zinc-400` | `#8acabf` | teks muted/placeholder |
| `accent-400` | `#dcf08c` | label section, teks aksen lembut |
| `accent-500` | `#CEED6B` | tombol utama, logo, scroll-to-top, WA pill |
| `accent-600` | `#bed755` | hover tombol aksen |
| `primary-950` | `#042f2e` | teks di atas tombol/area aksen (contrast tinggi) |
| `red-400/500` | semantic | hanya error form & aksi delete (destructive) |

- **Netral**: Skala `zinc` disesuaikan (teal-tinted) — zinc-700 border, zinc-800 panel, zinc-500 muted.
- **Kontras aksesibel**: mengikuti WCAG (lihat `quality_p2` di config). Contoh terverifikasi: putih di `#014D43` ≈ 9.8:1, `#CEED6B`+`#042f2e` ≈ 11:1.

### Mapping sebelum → sesudah (recolor)

| Sebelum | Sesudah | Catatan |
|---------|---------|---------|
| `bg-zinc-950` `#09090b` | `#014D43` | background halaman |
| `bg-zinc-900` `#18181b` | `#0b5c50` | kartu/panel |
| `text-red-*` / `bg-red-600` | `accent-*` (lime) | aksen, CTA, hover, focus ring |
| `text-white` di tombol merah | `text-primary-950` | di atas area lime agar kontras |
| `#ef4444` scrollbar hover | `#CEED6B` | scrollbar & focus ring |
| `#3f3f46` scrollbar | `#0d6055` | thumb scrollbar teal |
| `border-red-*` | `border-accent-*` | border aksen |
| `red` (destructive) | tetap `red-*` | hanya error form & aksi hapus |

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
- **Hero**: layout split — teks kiri, gambar profil (`.hero-float img`) kanan, dengan efek float/hover scale.
- **Grid layanan**: kartu (`group-hover:scale-105`) dengan gambar cover `object-cover`.
- **Spacing**: konsisten menggunakan skala Tailwind (p-4, gap-6, dll).
- **Rounded**: `rounded-lg` / `rounded-full` untuk tombol & badge.

## Komponen UI

| Komponen | Catatan |
|----------|---------|
| Tombol CTA | `bg-accent-500 hover:bg-accent-600 text-primary-950`, rounded-full, shadow aksen |
| Kartu layanan | border `zinc-900` (teal-tinted), hover border aksen + scale, lazy-load gambar |
| Input form | `bg-zinc-900 border-zinc-800 text-white`, focus ring aksen |
| Badge/Tag | `text-[10px] uppercase tracking-widest` |
| Modal | `#modal-image` cover, `object-center` |
| Icon | Inline SVG (stroke `currentColor`, `stroke-width=2`) — tidak ada icon font eksternal |

## Gambar & Media

- Semua gambar dari **Supabase Storage** (`https://sqimmcecwuoadjbjiyfd.supabase.co/storage/v1/object/public/assets/<path>`, lihat [supabase.md](./supabase.md)).
- Atribut: `loading="lazy"`, `referrerpolicy="no-referrer"`, `object-cover`.
- Fallback: `onerror="this.style.display='none'"` pada kartu layanan.
- Audio backsound: `audio/backsound.mp3` di bucket `audio` Supabase (URL storage publik).

## Admin Panel

- Panel dark-teal (`bg-zinc-950` `#014D43`), sidebar navigasi dengan item aktif `bg-accent-500` (`#CEED6B`) + teks `#014D43`, tabel data.
- Tombol aksi (Masuk, Tambah, Simpan, Refresh) memakai `bg-accent-500` agar tetap kontras di background `#014D43`.
- Aksi destruktif memakai `red-*` (Hapus), sukses memakai `bg-green-600` (toast).
- Form input konsisten: label `text-[10px] text-zinc-500`, field `bg-zinc-900` / `bg-zinc-950`.

## Prinsip Desain

1. **Kontras tinggi** — teks selalu terbaca di background teal (`#014D43`); tombol aksen memakai teks `primary-950`.
2. **Micro-interaction** — transisi `duration-300/700`, hover scale, warna aksen.
3. **Konsistensi** — satu aksen (lime `#CEED6B`), satu skala netral (zinc teal-tinted), satu primer (`#014D43`).
4. **Performance** — lazy-load gambar, CDN Cloudflare, cache storage Supabase.
