// ============================================================================
// supabase-api.js — Wrapper Supabase untuk Eka Ryan Digital Solution
// ----------------------------------------------------------------------------
// Menyediakan antarmuka `window.sbApi` yang dipakai oleh index.html dan
// admin.html. Semua query CRUD dibungkus di sini sehingga halaman tidak
// bergantung langsung pada SDK.
//
// - client tunggal (`sb`): pakai anon key. Setelah login via Supabase Auth,
//   supabase-js otomatis melampirkan sesi JWT user ke klien yang sama, sehingga
//   tulis/hapus diizinkan RLS untuk admin (authenticated + is_admin).
//
// Dependency: supabase-js v2 via CDN + supabase-config.js (dimuat lebih dulu).
// ============================================================================

(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  if (!cfg.url || !cfg.anonKey) {
    console.warn('[supabase-api] SUPABASE_CONFIG belum diisi di supabase-config.js');
    return;
  }
  if (typeof window.supabase === 'undefined') {
    console.warn('[supabase-api] supabase-js belum dimuat (tambahkan tag CDN).');
    return;
  }

  const { createClient } = window.supabase;
  const sb = createClient(cfg.url, cfg.anonKey);

  const ASSET_BUCKET = 'assets';
  const AUDIO_BUCKET = 'audio';

  // ID baru dengan prefix sama seperti skema D1 lama (svc_/wf_/sk_/adn_/sd_/st_).
  function gid(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  function extractPathFromUrl(url) {
    if (!url) return null;
    const marker = '/storage/v1/object/public/';
    const i = url.indexOf(marker);
    if (i === -1) return null;
    return decodeURIComponent(url.slice(i + marker.length));
  }

  // ===== SERVICES (termasuk details + tags) =====
  async function getServices() {
    const { data, error } = await sb
      .from('services')
      .select('*, service_details(id, service_id, sort_order, text), service_tags(id, service_id, tag)')
      .order('sort_order');
    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      details: (s.service_details || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(d => d.text),
      tags: (s.service_tags || []).map(t => t.tag)
    }));
  }

  async function saveService(data, id) {
    const base = {
      title: data.title,
      subtitle: data.subtitle || '',
      description: data.description || '',
      price: data.price || '',
      image: data.image || ''
    };
    let serviceId = id;
    if (serviceId) {
      const { error } = await sb.from('services').update(base).eq('id', serviceId);
      if (error) throw error;
    } else {
      const { data: rows } = await sb
        .from('services').select('sort_order').order('sort_order', { ascending: false }).limit(1);
      serviceId = gid('svc');
      base.sort_order = ((rows && rows[0] && rows[0].sort_order) || 0) + 1;
      base.is_active = 1;
      const { error } = await sb.from('services').insert({ id: serviceId, ...base });
      if (error) throw error;
    }
    // Ganti seluruh details & tags (paling sederhana & konsisten dengan D1).
    const details = Array.isArray(data.details) ? data.details.filter(Boolean) : [];
    const tags = Array.isArray(data.tags) ? data.tags.filter(Boolean) : [];
    await sb.from('service_details').delete().eq('service_id', serviceId);
    await sb.from('service_tags').delete().eq('service_id', serviceId);
    if (details.length) {
      const { error } = await sb.from('service_details').insert(
        details.map((text, i) => ({ id: gid('sd'), service_id: serviceId, sort_order: i + 1, text }))
      );
      if (error) throw error;
    }
    if (tags.length) {
      const { error } = await sb.from('service_tags').insert(
        tags.map(tag => ({ id: gid('st'), service_id: serviceId, tag }))
      );
      if (error) throw error;
    }
    return serviceId;
  }

  async function deleteService(id) {
    const { error } = await sb.from('services').delete().eq('id', id);
    if (error) throw error;
  }

  // ===== WORKFLOW =====
  async function getWorkflow() {
    const { data, error } = await sb.from('workflow').select('*').order('sort_order');
    if (error) throw error;
    return data || [];
  }

  async function saveWorkflow(data, id) {
    if (id) {
      const { error } = await sb.from('workflow').update({
        title: data.title, short_desc: data.short_desc || '', long_desc: data.long_desc || ''
      }).eq('id', id);
      if (error) throw error;
      return id;
    }
    const { data: rows } = await sb
      .from('workflow').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const newId = gid('wf');
    const { error } = await sb.from('workflow').insert({
      id: newId,
      title: data.title,
      short_desc: data.short_desc || '',
      long_desc: data.long_desc || '',
      sort_order: ((rows && rows[0] && rows[0].sort_order) || 0) + 1
    });
    if (error) throw error;
    return newId;
  }

  async function deleteWorkflow(id) {
    const { error } = await sb.from('workflow').delete().eq('id', id);
    if (error) throw error;
  }

  // ===== SKILLS =====
  async function getSkills() {
    const { data, error } = await sb.from('skills').select('*').order('sort_order');
    if (error) throw error;
    return data || [];
  }

  async function saveSkill(data, id) {
    if (id) {
      const { error } = await sb.from('skills').update({ name: data.name, category: data.category }).eq('id', id);
      if (error) throw error;
      return id;
    }
    const { data: rows } = await sb
      .from('skills').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const newId = gid('sk');
    const { error } = await sb.from('skills').insert({
      id: newId,
      name: data.name,
      category: data.category,
      sort_order: ((rows && rows[0] && rows[0].sort_order) || 0) + 1
    });
    if (error) throw error;
    return newId;
  }

  async function deleteSkill(id) {
    const { error } = await sb.from('skills').delete().eq('id', id);
    if (error) throw error;
  }

  // ===== ADD-ONS (dikelompokkan berdasarkan kategori) =====
  async function getAddOns() {
    const { data, error } = await sb.from('add_ons').select('*').order('category').order('sort_order');
    if (error) throw error;
    const grouped = {};
    (data || []).forEach(a => {
      if (!grouped[a.category]) grouped[a.category] = [];
      grouped[a.category].push(a);
    });
    return grouped;
  }

  async function saveAddon(data, id) {
    if (id) {
      const { error } = await sb.from('add_ons').update({
        name: data.name, category: data.category, price: data.price || ''
      }).eq('id', id);
      if (error) throw error;
      return id;
    }
    const { data: rows } = await sb
      .from('add_ons').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const newId = gid('adn');
    const { error } = await sb.from('add_ons').insert({
      id: newId,
      name: data.name,
      category: data.category,
      price: data.price || '',
      sort_order: ((rows && rows[0] && rows[0].sort_order) || 0) + 1
    });
    if (error) throw error;
    return newId;
  }

  async function deleteAddon(id) {
    const { error } = await sb.from('add_ons').delete().eq('id', id);
    if (error) throw error;
  }

  // ===== CONFIG =====
  async function getConfig() {
    const { data, error } = await sb.from('config').select('*').eq('id', 'main').maybeSingle();
    if (error) throw error;
    return data;
  }

  async function saveConfig(payload) {
    const { error } = await sb.from('config').upsert({ id: 'main', ...payload, updated_at: new Date().toISOString() });
    if (error) throw error;
  }

  // ===== MESSAGES =====
  async function getMessages() {
    const { data, error } = await sb.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function saveMessage(msg) {
    const { error } = await sb.from('messages').insert({
      name: msg.name,
      email: msg.email,
      whatsapp: msg.whatsapp || '',
      service_id: msg.service_id || '',
      subject: msg.subject || '',
      message: msg.message,
      add_ons: JSON.stringify(Array.isArray(msg.add_ons) ? msg.add_ons : [])
    });
    if (error) throw error;
  }

  async function markMessageRead(id) {
    const { error } = await sb.from('messages').update({ is_read: 1 }).eq('id', id);
    if (error) throw error;
  }

  async function deleteMessage(id) {
    const { error } = await sb.from('messages').delete().eq('id', id);
    if (error) throw error;
  }

  async function clearMessages() {
    const { error } = await sb.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  }

  // ===== AUTH (Supabase Auth — login admin) =====
  async function signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  }

  async function getSession() {
    const { data } = await sb.auth.getSession();
    return data && data.session;
  }

  function onAuthStateChange(callback) {
    return sb.auth.onAuthStateChange(callback);
  }

  // ===== STORAGE =====
  async function uploadImage(file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = 'uploads/' + Date.now() + '_' + safeName;
    const { error } = await sb.storage.from(ASSET_BUCKET).upload(path, file, {
      cacheControl: '3600', upsert: true
    });
    if (error) throw error;
    const { data } = sb.storage.from(ASSET_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  // Terima URL publik ataupun path (uploads/xxx). Kunci R2 lama tidak bisa
  // dihapus (R2 sudah tidak dipakai) dan akan diabaikan.
  async function deleteImage(urlOrPath) {
    const path = extractPathFromUrl(urlOrPath) || urlOrPath;
    if (!path) return;
    const parts = path.split('/');
    const bucket = parts[0];
    const objectPath = parts.slice(1).join('/');
    if (bucket !== ASSET_BUCKET && bucket !== AUDIO_BUCKET) return;
    await sb.storage.from(bucket).remove([objectPath]);
  }

  function extractImagePath(url) {
    return extractPathFromUrl(url);
  }

  // ===== CV UPLOAD =====
  async function uploadCV(file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = 'cv/' + Date.now() + '_' + safeName;
    const { error } = await sb.storage.from(ASSET_BUCKET).upload(path, file, {
      cacheControl: '3600', upsert: true
    });
    if (error) throw error;
    const { data } = sb.storage.from(ASSET_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  async function deleteCV(urlOrPath) {
    const path = extractPathFromUrl(urlOrPath) || urlOrPath;
    if (!path) return;
    const parts = path.split('/');
    const bucket = parts[0];
    const objectPath = parts.slice(1).join('/');
    if (bucket !== ASSET_BUCKET) return;
    await sb.storage.from(bucket).remove([objectPath]);
  }

  async function listStorage() {
    const buckets = [ASSET_BUCKET];
    const objects = [];
    for (const bucket of buckets) {
      const { data: root, error: errRoot } = await sb.storage.from(bucket).list('', { limit: 1000 });
      const { data: uploads, error: errUploads } = await sb.storage.from(bucket).list('uploads', { limit: 1000 });
      if (errRoot && errUploads) continue;
      const sizeOf = o => Number((o.metadata && (o.metadata.size || o.metadata.contentLength)) || 0);
      (root || []).forEach(o => {
        if (o.id) objects.push({ key: bucket + '/' + o.name, url: publicUrl(bucket, o.name), size: sizeOf(o) });
      });
      (uploads || []).forEach(o => {
        if (o.id) objects.push({ key: bucket + '/uploads/' + o.name, url: publicUrl(bucket, 'uploads/' + o.name), size: sizeOf(o) });
      });
    }
    return { objects };
  }

  async function deleteStorageObject(key) {
    if (!key) return;
    const parts = key.split('/');
    const bucket = parts[0];
    const objectPath = parts.slice(1).join('/');
    if (bucket !== ASSET_BUCKET && bucket !== AUDIO_BUCKET) return;
    await sb.storage.from(bucket).remove([objectPath]);
  }

  function publicUrl(bucket, path) {
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    return data ? data.publicUrl : '';
  }

  window.sbApi = {
    getServices, saveService, deleteService,
    getWorkflow, saveWorkflow, deleteWorkflow,
    getSkills, saveSkill, deleteSkill,
    getAddOns, saveAddon, deleteAddon,
    getConfig, saveConfig,
    getMessages, saveMessage, markMessageRead, deleteMessage, clearMessages,
    signIn, signOut, getSession, onAuthStateChange,
    uploadImage, deleteImage, extractImagePath, listStorage, deleteStorageObject,
    uploadCV, deleteCV,
    publicUrl
  };
})();
