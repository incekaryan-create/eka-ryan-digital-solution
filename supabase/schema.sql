-- ============================================================================
-- Eka Ryan Digital Solution — Skema Supabase (PostgreSQL)
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor > New query.
--
-- Cara pakai:
--   1. Buat project baru di https://supabase.com/dashboard
--   2. Buka SQL Editor dan paste seluruh isi file ini, lalu RUN.
--   3. Salin Project URL + anon key ke public/supabase-config.js (tidak perlu
--      service_role key — akses admin diatur oleh RLS + Supabase Auth).
--   4. Buat user admin di Authentication > Users (lihat bagian RLS di bawah),
--      lalu upload public/src/assets/sound/backsound.mp3 ke bucket `audio`.
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
  cv_url             text not null default '',
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
-- Situs publik hanya membaca (pakai anon key) + INSERT pesan dari form kontak.
-- Semua tulis/hapus (tabel + storage) hanya boleh pengguna yang sudah login
-- melalui Supabase Auth dan lolos fungsi is_admin() (email admin). Tidak ada
-- lagi service_role key di sisi browser — akses diatur sepenuhnya oleh RLS.
--
-- Setup admin:
--   1. Buat user di Supabase Auth (Authentication > Users > Add user):
--        email: <email admin>  password: <password kuat>
--   2. Pastikan email admin di bawah cocok dengan email user tersebut.
--      (auth.jwt() -> klaim "email")

-- Helper: cek pengguna yang login adalah admin (lewat klaim email di JWT).
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'inc.ekaryan@gmail.com';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

grant select, insert, update, delete on public.config, public.services,
      public.service_details, public.service_tags, public.workflow,
      public.skills, public.add_ons, public.messages to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;

alter table public.config           enable row level security;
alter table public.services         enable row level security;
alter table public.service_details  enable row level security;
alter table public.service_tags     enable row level security;
alter table public.workflow         enable row level security;
alter table public.skills           enable row level security;
alter table public.add_ons          enable row level security;
alter table public.messages         enable row level security;

-- Baca: anon + authenticated (situs publik + panel admin).
-- Tulis: hanya admin (authenticated yang lolos is_admin()).
drop policy if exists "anon read config"          on public.config;
drop policy if exists "anon read services"        on public.services;
drop policy if exists "anon read service_details" on public.service_details;
drop policy if exists "anon read service_tags"    on public.service_tags;
drop policy if exists "anon read workflow"        on public.workflow;
drop policy if exists "anon read skills"          on public.skills;
drop policy if exists "anon read add_ons"         on public.add_ons;
drop policy if exists "admin all config"          on public.config;
drop policy if exists "admin all services"        on public.services;
drop policy if exists "admin all service_details" on public.service_details;
drop policy if exists "admin all service_tags"    on public.service_tags;
drop policy if exists "admin all workflow"        on public.workflow;
drop policy if exists "admin all skills"          on public.skills;
drop policy if exists "admin all add_ons"         on public.add_ons;
drop policy if exists "anon insert messages"      on public.messages;
drop policy if exists "admin all messages"        on public.messages;

create policy "anon read config"          on public.config           for select to anon, authenticated using (true);
create policy "anon read services"        on public.services         for select to anon, authenticated using (true);
create policy "anon read service_details" on public.service_details  for select to anon, authenticated using (true);
create policy "anon read service_tags"    on public.service_tags     for select to anon, authenticated using (true);
create policy "anon read workflow"        on public.workflow         for select to anon, authenticated using (true);
create policy "anon read skills"          on public.skills           for select to anon, authenticated using (true);
create policy "anon read add_ons"         on public.add_ons          for select to anon, authenticated using (true);

create policy "admin all config"          on public.config           for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all services"        on public.services         for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all service_details" on public.service_details  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all service_tags"    on public.service_tags     for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all workflow"        on public.workflow         for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all skills"          on public.skills           for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all add_ons"         on public.add_ons          for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Formulir kontak memakai anon key, jadi izinkan INSERT tanpa autentikasi.
-- Read/update/delete pesan hanya untuk admin.
create policy "anon insert messages" on public.messages for insert to anon, authenticated with check (true);
create policy "admin all messages"   on public.messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. STORAGE BUCKETS
-- ---------------------------------------------------------------------------
-- bucket `assets`: gambar profil layanan & konten yang diupload admin.
-- bucket `audio` : backsound.mp3 (bisa dibuat manual lalu upload file, atau
--                  cukup jalankan insert bucket di bawah).
-- Keduanya public = bisa diakses lewat URL publik tanpa autentikasi.
-- Upload/hapus hanya admin (authenticated + is_admin).

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true),
       ('audio', 'audio', true)
on conflict (id) do nothing;

drop policy if exists "public read storage" on storage.objects;
drop policy if exists "admin all storage"   on storage.objects;

create policy "public read storage" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'assets' or bucket_id = 'audio');

create policy "admin all storage" on storage.objects
  for all to authenticated
  using (public.is_admin() and (bucket_id = 'assets' or bucket_id = 'audio'))
  with check (public.is_admin() and (bucket_id = 'assets' or bucket_id = 'audio'));

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
