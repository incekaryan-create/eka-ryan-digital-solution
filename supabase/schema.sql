-- ============================================================================
-- Eka Ryan Digital Solution — Skema Supabase (PostgreSQL)
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor > New query.
--
-- Cara pakai:
--   1. Buat project baru di https://supabase.com/dashboard
--   2. Buka SQL Editor dan paste seluruh isi file ini, lalu RUN.
--   3. Salin Project URL + anon key + service_role key ke public/supabase-config.js
--   4. Buat bucket audio (otomatis dibuat lewat skrip di bawah) dan upload
--      public/src/assets/sound/backsound.mp3 sebagai `backsound.mp3`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABEL
-- ---------------------------------------------------------------------------

-- Pengaturan konten hero, kontak, social, jaminan, dan kualitas.
create table if not exists public.config (
  id                 text primary key default 'main',
  hero_greeting      text not null default 'Hai, Saya',
  hero_name          text not null default 'Eka Ryan',
  hero_description   text not null default '',
  hero_tagline       text not null default '',
  hero_image         text not null default '',
  guarantee_title    text not null default 'Jaminan Uang Kembali',
  guarantee_desc     text not null default '',
  guarantee_p1       text not null default '',
  guarantee_p2       text not null default '',
  guarantee_p3       text not null default '',
  quality_title      text not null default 'Jaminan Kualitas',
  quality_desc       text not null default '',
  quality_p1         text not null default '',
  quality_p2         text not null default '',
  quality_p3         text not null default '',
  contact_email      text not null default '',
  contact_wa         text not null default '',
  contact_location   text not null default '',
  contact_website    text not null default '',
  social_linkedin    text not null default '',
  social_instagram   text not null default '',
  social_tiktok      text not null default '',
  social_twitter     text not null default '',
  updated_at         timestamptz not null default now()
);

-- Daftar layanan.
create table if not exists public.services (
  id          text primary key,
  sort_order  int  not null default 0,
  title       text not null,
  subtitle    text not null default '',
  description text not null default '',
  image       text not null default '',
  price       text not null default '',
  is_active   integer not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Poin detail layanan (di-render sebagai daftar bulat di situs).
create table if not exists public.service_details (
  id          text primary key,
  service_id  text not null references public.services(id) on delete cascade,
  sort_order  int  not null default 0,
  text        text not null,
  created_at  timestamptz not null default now()
);

-- Tag teknologi per layanan (di-render sebagai chip).
create table if not exists public.service_tags (
  id          text primary key,
  service_id  text not null references public.services(id) on delete cascade,
  tag         text not null,
  created_at  timestamptz not null default now()
);

-- Alur kerja (proses pengerjaan).
create table if not exists public.workflow (
  id         text primary key,
  title      text not null,
  short_desc text not null default '',
  long_desc  text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- Keahlian / skill yang ditampilkan di situs.
create table if not exists public.skills (
  id         text primary key,
  name       text not null,
  category   text not null default 'other',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- Fitur tambahan (add-on) yang dikelompokkan berdasarkan kategori.
create table if not exists public.add_ons (
  id         text primary key,
  name       text not null,
  category   text not null,
  price      text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- Pesan masuk dari formulir kontak.
create table if not exists public.messages (
  id         text primary key default gen_random_uuid()::text,
  name       text not null,
  email      text not null,
  whatsapp   text not null default '',
  service_id text not null default '',
  subject    text not null default '',
  message    text not null,
  add_ons    text not null default '[]',
  is_read    integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_service_details_service on public.service_details(service_id);
create index if not exists idx_service_tags_service     on public.service_tags(service_id);
create index if not exists idx_messages_created         on public.messages(created_at desc);

-- ---------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
-- Situs publik hanya membaca (pakai anon key). Semua tulis/hapus admin
-- dilakukan lewat service_role key yang otomatis mem-bypass RLS.

alter table public.config           enable row level security;
alter table public.services         enable row level security;
alter table public.service_details  enable row level security;
alter table public.service_tags     enable row level security;
alter table public.workflow         enable row level security;
alter table public.skills           enable row level security;
alter table public.add_ons          enable row level security;
alter table public.messages         enable row level security;

drop policy if exists "anon read config"          on public.config;
drop policy if exists "anon read services"        on public.services;
drop policy if exists "anon read service_details" on public.service_details;
drop policy if exists "anon read service_tags"    on public.service_tags;
drop policy if exists "anon read workflow"        on public.workflow;
drop policy if exists "anon read skills"          on public.skills;
drop policy if exists "anon read add_ons"         on public.add_ons;
drop policy if exists "anon insert messages"      on public.messages;

create policy "anon read config"          on public.config           for select to anon using (true);
create policy "anon read services"        on public.services         for select to anon using (true);
create policy "anon read service_details" on public.service_details  for select to anon using (true);
create policy "anon read service_tags"    on public.service_tags     for select to anon using (true);
create policy "anon read workflow"        on public.workflow         for select to anon using (true);
create policy "anon read skills"          on public.skills           for select to anon using (true);
create policy "anon read add_ons"         on public.add_ons          for select to anon using (true);

-- Formulir kontak memakai anon key, jadi izinkan INSERT tanpa autentikasi.
create policy "anon insert messages" on public.messages for insert to anon with check (true);

-- ---------------------------------------------------------------------------
-- 3. STORAGE BUCKETS
-- ---------------------------------------------------------------------------
-- bucket `assets`: gambar profil layanan & konten yang diupload admin.
-- bucket `audio` : backsound.mp3 (bisa dibuat manual lalu upload file, atau
--                  cukup jalankan insert bucket di bawah).
-- Keduanya public = bisa diakses lewat URL publik tanpa autentikasi.

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true),
       ('audio', 'audio', true)
on conflict (id) do nothing;

drop policy if exists "public read assets" on storage.objects;
drop policy if exists "public read audio"  on storage.objects;

create policy "public read assets" on storage.objects
  for select using (bucket_id = 'assets');
create policy "public read audio" on storage.objects
  for select using (bucket_id = 'audio');

-- ---------------------------------------------------------------------------
-- 4. DATA
-- ---------------------------------------------------------------------------
-- Data (config, services+details+tags, workflow, skills, add_ons) diisi lewat
-- skrip migrasi supabase/migrate-data.mjs yang mengambil data asli dari
-- database Cloudflare D1 lama dan link gambar/audio dari storage R2 lama:
--
--   Check Link (R2) > Download > Upload ke Supabase Storage > Dapatkan link
--   publik baru > Simpan ke tabel.
--
-- Jalankan setelah skema di atas diterapkan:
--   SUPABASE_SERVICE_KEY=<service_role key> node supabase/migrate-data.mjs
