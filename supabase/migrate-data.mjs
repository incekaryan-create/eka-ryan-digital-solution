// ============================================================================
// migrate-data.mjs — Migrasi data D1 lama ke Supabase
// ----------------------------------------------------------------------------
// Pendekatan gambar/audio dari storage lama:
//   Check Link (R2) > Download > Upload ke Supabase Storage > Dapatkan link
//   publik baru > Gunakan link baru ke database.
//
// Cara pakai:
//   SUPABASE_SERVICE_KEY=<service_role key> node supabase/migrate-data.mjs
//
// Data sumber dibaca dari supabase/migration-data/*.json (snapshot API lama).
// Skrip idempotent: aman dijalankan ulang (upsert + delete-insert).
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SVC_KEY = process.env.SUPABASE_SERVICE_KEY;
const BASE = 'https://sqimmcecwuoadjbjiyfd.supabase.co';
const ASSET_BUCKET = 'assets';

if (!SVC_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY dulu, contoh:\n  SUPABASE_SERVICE_KEY=eyJ... node supabase/migrate-data.mjs');
  process.exit(1);
}

const headers = {
  apikey: SVC_KEY,
  Authorization: 'Bearer ' + SVC_KEY,
  'Content-Type': 'application/json'
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'migration-data', file), 'utf8'));
}

async function api(pathname, opts = {}) {
  const res = await fetch(BASE + pathname, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  if (res.status >= 400) {
    const body = await res.text();
    throw new Error(`${opts.method || 'GET'} ${pathname} -> ${res.status} ${body.slice(0, 200)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function publicUrl(bucket, objectPath) {
  return `${BASE}/storage/v1/object/public/${bucket}/${objectPath}`;
}

// ---- 1. Upload gambar ke bucket `assets` (download dulu dari R2 lama) ----
// Pemetaan nama: sebagian file lama di-rename agar URL-nya bersih (dan
// menghindari response Content-Type lama yang ter-cache di CDN).
const RENAME = {
  '1784346590252_WhatsApp_Image_2026-07-17_at_21.45.38.jpeg': 'hero_profile.jpeg',
  '1784355661111_svc_web_simple_new.jpg': 'svc_web_simple.jpg'
};

async function migrateImages(items) {
  const urls = [...new Set(
    items
      .map(i => i.url)
      .filter(Boolean)
      .filter(u => /^https?:/.test(u) && u.includes('/uploads/'))
  )];
  const map = {};
  for (const url of urls) {
    const filename = decodeURIComponent(url.split('/').pop());
    const objectPath = 'uploads/' + (RENAME[filename] || filename);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('  ! gagal download:', url, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const up = await fetch(
      `${BASE}/storage/v1/object/${ASSET_BUCKET}/${objectPath}`,
      {
        method: 'POST',
        headers: { ...headers, 'x-upsert': 'true', 'Content-Type': contentType },
        body: buf
      }
    );
    if (up.status >= 400) {
      const body = await up.text();
      console.warn('  ! gagal upload:', objectPath, up.status, body.slice(0, 200));
      continue;
    }
    map[url] = publicUrl(ASSET_BUCKET, objectPath);
    console.log('  +', objectPath, '->', map[url]);
  }
  return map;
}

// ---- 2. Insert data dengan link gambar baru ----
async function upsert(table, rows) {
  if (!rows || !rows.length) return;
  await api(`/rest/v1/${table}?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(rows)
  });
  console.log(`  ~ ${table}: ${rows.length} baris`);
}

async function replaceRows(table, rows) {
  await api(`/rest/v1/${table}?id=neq.*&select=id`, { method: 'DELETE', headers: { ...headers, Prefer: 'return=minimal' } });
  await upsert(table, rows);
}

function toIso(ts) {
  if (!ts) return new Date().toISOString();
  const s = String(ts).trim().replace(' ', 'T');
  return /Z$|[+-]\d\d:\d\d$/.test(s) ? s : s + 'Z';
}

async function main() {
  const config = readJson('old_config.json');
  const services = readJson('old_services.json');
  const workflow = readJson('old_workflow.json');
  const skills = readJson('old_skills.json');
  const addonsRaw = readJson('old_addons.json');

  // Flatkan add-ons (bisa berupa array atau objek yang dikelompokkan kategori).
  const addons = Array.isArray(addonsRaw)
    ? addonsRaw
    : Object.values(addonsRaw).flat();

  console.log('== 1/3 Migrasi gambar R2 lama -> Supabase Storage ==');
  const imageMap = await migrateImages([
    { url: config.hero_image },
    ...services.map(s => ({ url: s.image }))
  ]);

  const heroImage = imageMap[config.hero_image] || config.hero_image || '';
  const svcRows = services.map(s => ({
    id: s.id,
    sort_order: s.sort_order,
    title: s.title,
    subtitle: s.subtitle || '',
    description: s.description || '',
    image: imageMap[s.image] || s.image || '',
    price: s.price || '',
    is_active: s.is_active === undefined ? 1 : Number(s.is_active) ? 1 : 0,
    created_at: toIso(s.created_at),
    updated_at: toIso(s.updated_at || s.created_at)
  }));

  const details = services.flatMap(s =>
    (s.details || []).map((text, i) => ({
      id: `sd_${s.id}_${i + 1}`,
      service_id: s.id,
      sort_order: i + 1,
      text
    }))
  );

  const tags = services.flatMap(s =>
    (s.tags || []).map((tag, i) => ({
      id: `st_${s.id}_${i + 1}`,
      service_id: s.id,
      tag
    }))
  );

  console.log('\n== 2/3 Insert config + services + details + tags ==');
  await upsert('config', [{
    ...config,
    id: 'main',
    hero_image: heroImage,
    updated_at: toIso(config.updated_at)
  }]);
  await replaceRows('services', svcRows);
  await replaceRows('service_details', details);
  await replaceRows('service_tags', tags);

  console.log('\n== 3/3 Insert workflow + skills + add_ons ==');
  await upsert('workflow', workflow.map(w => ({
    id: w.id, sort_order: w.sort_order, title: w.title,
    short_desc: w.short_desc || '', long_desc: w.long_desc || '',
    created_at: toIso(w.created_at)
  })));
  await upsert('skills', skills.map(s => ({
    id: s.id, name: s.name, category: s.category || 'other',
    sort_order: s.sort_order, created_at: toIso(s.created_at)
  })));
  await replaceRows('add_ons', addons.map(a => ({
    id: a.id, name: a.name, category: a.category, price: a.price || '',
    sort_order: a.sort_order, created_at: toIso(a.created_at)
  })));

  console.log('\nSelesai. Hero image:', heroImage || '(kosong)');
}

main().catch(err => {
  console.error('\nGAGAL:', err.message);
  process.exit(1);
});
