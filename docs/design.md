# Design System

Panduan desain **Eka Ryan Digital Solution** — portfolio dengan estetika gelap (dark), modern, dan berfokus pada tipografi.

## Tema & Palet

- **Base**: Dark mode (`bg-zinc-950` / `bg-zinc-900`), teks terang (`text-zinc-100`/`text-zinc-400`).
- **Aksen utama**: Merah (`red-600` `#dc2626` untuk hover `red-700`). Digunakan pada nama, tombol CTA, highlight.
- **Netral**: Skala `zinc` (zinc-700 border, zinc-800 panel, zinc-500 muted).
- **Kontras aksesibel**: mengikuti WCAG (lihat `quality_p2` di config).

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
| Tombol CTA | `bg-red-600 hover:bg-red-700`, rounded-full, shadow |
| Kartu layanan | border `zinc-700`, hover scale, lazy-load gambar |
| Input form | `bg-zinc-950 border-zinc-700 text-white`, focus ring merah |
| Badge/Tag | `text-[10px] uppercase tracking-widest` |
| Modal | `#modal-image` cover, `object-center` |
| Icon | Inline SVG (stroke `currentColor`, `stroke-width=2`) — tidak ada icon font eksternal |

## Gambar & Media

- Semua gambar dari **R2** via `/api/r2/uploads/<key>` (lihat [rules.md](./rules.md)).
- Atribut: `loading="lazy"`, `referrerpolicy="no-referrer"`, `object-cover`.
- Fallback: `onerror="this.style.display='none'"` pada kartu layanan.
- Audio backsound: `/audio/backsound.mp3` (streaming dari R2).

## Admin Panel

- Panel gelap (`bg-zinc-900/950`), sidebar navigasi, tabel data.
- Form input konsisten: label `text-[10px] text-zinc-500`, field `bg-zinc-950`.
- Toast notification untuk feedback aksi (`toast('…')`).

## Prinsip Desain

1. **Kontras tinggi** — teks selalu terbaca di background gelap.
2. **Micro-interaction** — transisi `duration-300/700`, hover scale, warna aksen.
3. **Konsistensi** — satu aksen (merah), satu skala netral (zinc).
4. **Performance** — lazy-load gambar, CDN Cloudflare, cache R2 1 tahun.
