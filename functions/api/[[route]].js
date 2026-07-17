// Cloudflare Pages Functions - API Handler
// Security-hardened version

const ALLOWED_ORIGIN = 'https://ekaryandigitalsolution.pages.dev';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MESSAGE_LENGTH = 5000;
const MAX_INPUT_LENGTH = 500;

// Allowed config fields to prevent SQL injection via column names
const ALLOWED_CONFIG_FIELDS = [
  'hero_greeting', 'hero_name', 'hero_description', 'hero_tagline', 'hero_image',
  'guarantee_title', 'guarantee_desc', 'guarantee_p1', 'guarantee_p2', 'guarantee_p3',
  'quality_title', 'quality_desc', 'quality_p1', 'quality_p2', 'quality_p3',
  'contact_email', 'contact_wa', 'contact_location', 'contact_website',
  'social_linkedin', 'social_instagram', 'social_tiktok', 'social_twitter'
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim().substring(0, MAX_INPUT_LENGTH);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const method = request.method;
  const corsHeaders = getCorsHeaders(request);

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET endpoints (public)
    if (path === '/config' && method === 'GET') {
      return await getConfig(env, corsHeaders);
    }
    if (path === '/services' && method === 'GET') {
      return await getServices(env, corsHeaders);
    }
    if (path.match(/^\/services\/[^/]+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return await getService(id, env, corsHeaders);
    }
    if (path === '/workflow' && method === 'GET') {
      return await getWorkflow(env, corsHeaders);
    }
    if (path === '/skills' && method === 'GET') {
      return await getSkills(env, corsHeaders);
    }
    if (path === '/messages' && method === 'GET') {
      return await getMessages(env, corsHeaders);
    }
    if (path === '/addons' && method === 'GET') {
      return await getAddOns(env, corsHeaders);
    }
    if (path === '/addons/list' && method === 'GET') {
      return await getAddOnsList(env, corsHeaders);
    }
    if (path === '/messages' && method === 'POST') {
      return await createMessage(request, env, corsHeaders);
    }

    // Write endpoints - require auth via query param (simple protection)
    const authKey = url.searchParams.get('key');
    const expectedKey = env.ADMIN_PASSWORD || 'Ekaryan443!';
    
    // For now, we use a simple key-based auth for write operations
    // In production, implement proper JWT/session auth
    if (method !== 'GET' && method !== 'OPTIONS') {
      // Public endpoints that don't need auth
      const publicWritePaths = ['/messages'];
      const isPublicWrite = publicWritePaths.some(p => path === p || path.startsWith(p + '/'));
      
      if (!isPublicWrite) {
        // Check for auth header or query key
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        
        if (token !== expectedKey && authKey !== expectedKey) {
          return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
        }
      }
    }

    // Write endpoints (protected)
    if (path === '/config' && method === 'PUT') {
      return await updateConfig(request, env, corsHeaders);
    }
    if (path === '/services' && method === 'POST') {
      return await createService(request, env, corsHeaders);
    }
    if (path.match(/^\/services\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return await updateService(id, request, env, corsHeaders);
    }
    if (path.match(/^\/services\/[^/]+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return await deleteService(id, env, corsHeaders);
    }
    if (path === '/workflow' && method === 'POST') {
      return await createWorkflow(request, env, corsHeaders);
    }
    if (path === '/skills' && method === 'POST') {
      return await createSkill(request, env, corsHeaders);
    }
    if (path.match(/^\/messages\/[^/]+\/read$/) && method === 'PUT') {
      const id = path.split('/')[2];
      return await markMessageRead(id, env, corsHeaders);
    }
    if (path === '/addons' && method === 'POST') {
      return await createAddon(request, env, corsHeaders);
    }
    if (path.match(/^\/addons\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return await updateAddon(id, request, env, corsHeaders);
    }
    if (path.match(/^\/addons\/[^/]+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return await deleteAddon(id, env, corsHeaders);
    }
    if (path === '/upload' && method === 'POST') {
      return await uploadFile(request, env, corsHeaders);
    }
    if (path.match(/^\/upload\/delete$/) && method === 'POST') {
      return await deleteFile(request, env, corsHeaders);
    }

    // R2 file serving (public)
    if (path.match(/^\/r2\/.+/) && method === 'GET') {
      const key = path.replace('/r2/', '');
      const object = await env.R2.get(key);
      if (!object) {
        return jsonResponse({ error: 'File not found' }, 404, corsHeaders);
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000');
      return new Response(object.body, { headers });
    }

    return jsonResponse({ error: 'Not found' }, 404, corsHeaders);
  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500, corsHeaders);
  }
}

// ===== CONFIG =====
async function getConfig(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM config WHERE id = ?').bind('main').all();
  return jsonResponse(results[0] || {}, 200, corsHeaders);
}

async function updateConfig(request, env, corsHeaders) {
  const data = await request.json();
  
  // Filter to only allowed fields
  const fields = Object.keys(data).filter(f => ALLOWED_CONFIG_FIELDS.includes(f));
  const values = fields.map(f => sanitizeInput(data[f]));
  
  if (fields.length === 0) {
    return jsonResponse({ error: 'No valid fields to update' }, 400, corsHeaders);
  }

  const setClause = fields.map(f => `${f} = ?`).join(', ');
  await env.DB.prepare(`UPDATE config SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(...values, 'main')
    .run();

  return jsonResponse({ success: true }, 200, corsHeaders);
}

// ===== SERVICES =====
async function getServices(env, corsHeaders) {
  const { results: services } = await env.DB.prepare('SELECT * FROM services ORDER BY sort_order').all();
  
  for (const service of services) {
    const { results: details } = await env.DB.prepare('SELECT * FROM service_details WHERE service_id = ? ORDER BY sort_order')
      .bind(service.id).all();
    const { results: tags } = await env.DB.prepare('SELECT tag FROM service_tags WHERE service_id = ?')
      .bind(service.id).all();
    service.details = details.map(d => d.text);
    service.tags = tags.map(t => t.tag);
  }

  return jsonResponse(services, 200, corsHeaders);
}

async function getService(id, env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).all();
  if (results.length === 0) {
    return jsonResponse({ error: 'Service not found' }, 404, corsHeaders);
  }

  const service = results[0];
  const { results: details } = await env.DB.prepare('SELECT * FROM service_details WHERE service_id = ? ORDER BY sort_order')
    .bind(id).all();
  const { results: tags } = await env.DB.prepare('SELECT tag FROM service_tags WHERE service_id = ?')
    .bind(id).all();
  service.details = details.map(d => d.text);
  service.tags = tags.map(t => t.tag);

  return jsonResponse(service, 200, corsHeaders);
}

async function createService(request, env, corsHeaders) {
  const data = await request.json();
  
  if (!data.title || data.title.trim().length === 0) {
    return jsonResponse({ error: 'Title is required' }, 400, corsHeaders);
  }

  const id = 'svc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  
  await env.DB.prepare('INSERT INTO services (id, sort_order, title, subtitle, description, image, price) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, data.sort_order || 0, sanitizeInput(data.title), sanitizeInput(data.subtitle || ''), sanitizeInput(data.description || ''), data.image || '', sanitizeInput(data.price || ''))
    .run();

  if (data.details && Array.isArray(data.details)) {
    for (let i = 0; i < Math.min(data.details.length, 20); i++) {
      await env.DB.prepare('INSERT INTO service_details (id, service_id, sort_order, text) VALUES (?, ?, ?, ?)')
        .bind('sd_' + Date.now() + '_' + i, id, i + 1, sanitizeInput(data.details[i]))
        .run();
    }
  }

  if (data.tags && Array.isArray(data.tags)) {
    for (const tag of data.tags.slice(0, 20)) {
      await env.DB.prepare('INSERT INTO service_tags (id, service_id, tag) VALUES (?, ?, ?)')
        .bind('st_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8), id, sanitizeInput(tag))
        .run();
    }
  }

  return jsonResponse({ id, success: true }, 201, corsHeaders);
}

async function updateService(id, request, env, corsHeaders) {
  const data = await request.json();
  
  if (!data.title || data.title.trim().length === 0) {
    return jsonResponse({ error: 'Title is required' }, 400, corsHeaders);
  }
  
  await env.DB.prepare('UPDATE services SET title = ?, subtitle = ?, description = ?, image = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(sanitizeInput(data.title), sanitizeInput(data.subtitle || ''), sanitizeInput(data.description || ''), data.image || '', sanitizeInput(data.price || ''), id)
    .run();

  if (data.details !== undefined && Array.isArray(data.details)) {
    await env.DB.prepare('DELETE FROM service_details WHERE service_id = ?').bind(id).run();
    for (let i = 0; i < Math.min(data.details.length, 20); i++) {
      await env.DB.prepare('INSERT INTO service_details (id, service_id, sort_order, text) VALUES (?, ?, ?, ?)')
        .bind('sd_' + Date.now() + '_' + i, id, i + 1, sanitizeInput(data.details[i]))
        .run();
    }
  }

  if (data.tags !== undefined && Array.isArray(data.tags)) {
    await env.DB.prepare('DELETE FROM service_tags WHERE service_id = ?').bind(id).run();
    for (const tag of data.tags.slice(0, 20)) {
      await env.DB.prepare('INSERT INTO service_tags (id, service_id, tag) VALUES (?, ?, ?)')
        .bind('st_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8), id, sanitizeInput(tag))
        .run();
    }
  }

  return jsonResponse({ success: true }, 200, corsHeaders);
}

async function deleteService(id, env, corsHeaders) {
  await env.DB.prepare('DELETE FROM service_details WHERE service_id = ?').bind(id).run();
  await env.DB.prepare('DELETE FROM service_tags WHERE service_id = ?').bind(id).run();
  await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
  return jsonResponse({ success: true }, 200, corsHeaders);
}

// ===== WORKFLOW =====
async function getWorkflow(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM workflow ORDER BY sort_order').all();
  return jsonResponse(results, 200, corsHeaders);
}

async function createWorkflow(request, env, corsHeaders) {
  const data = await request.json();
  
  if (!data.title || data.title.trim().length === 0) {
    return jsonResponse({ error: 'Title is required' }, 400, corsHeaders);
  }

  const id = 'wf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  
  await env.DB.prepare('INSERT INTO workflow (id, sort_order, title, short_desc, long_desc) VALUES (?, ?, ?, ?, ?)')
    .bind(id, data.sort_order || 0, sanitizeInput(data.title), sanitizeInput(data.short_desc || ''), sanitizeInput(data.long_desc || ''))
    .run();

  return jsonResponse({ id, success: true }, 201, corsHeaders);
}

// ===== SKILLS =====
async function getSkills(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM skills ORDER BY sort_order').all();
  return jsonResponse(results, 200, corsHeaders);
}

async function createSkill(request, env, corsHeaders) {
  const data = await request.json();
  
  if (!data.name || data.name.trim().length === 0) {
    return jsonResponse({ error: 'Name is required' }, 400, corsHeaders);
  }

  const id = 'sk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  
  await env.DB.prepare('INSERT INTO skills (id, name, category, sort_order) VALUES (?, ?, ?, ?)')
    .bind(id, sanitizeInput(data.name), sanitizeInput(data.category || 'other'), data.sort_order || 0)
    .run();

  return jsonResponse({ id, success: true }, 201, corsHeaders);
}

// ===== MESSAGES =====
async function getMessages(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 100').all();
  return jsonResponse(results, 200, corsHeaders);
}

async function createMessage(request, env, corsHeaders) {
  const data = await request.json();
  
  // Validation
  if (!data.name || !data.email || !data.message) {
    return jsonResponse({ error: 'Name, email, and message are required' }, 400, corsHeaders);
  }
  
  if (!validateEmail(data.email)) {
    return jsonResponse({ error: 'Invalid email format' }, 400, corsHeaders);
  }
  
  if (data.message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: 'Message too long' }, 400, corsHeaders);
  }

  const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const addOns = JSON.stringify(data.add_ons || []);
  
  await env.DB.prepare('INSERT INTO messages (id, name, email, whatsapp, subject, message, add_ons, service_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, sanitizeInput(data.name), data.email, sanitizeInput(data.whatsapp || ''), sanitizeInput(data.subject || ''), sanitizeInput(data.message), addOns, sanitizeInput(data.service_id || ''))
    .run();

  return jsonResponse({ id, success: true }, 201, corsHeaders);
}

async function markMessageRead(id, env, corsHeaders) {
  await env.DB.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').bind(id).run();
  return jsonResponse({ success: true }, 200, corsHeaders);
}

// ===== ADD-ONS =====
async function getAddOns(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM add_ons ORDER BY category, sort_order').all();
  
  const grouped = {};
  for (const addon of results) {
    if (!grouped[addon.category]) {
      grouped[addon.category] = [];
    }
    grouped[addon.category].push(addon);
  }

  return jsonResponse(grouped, 200, corsHeaders);
}

async function getAddOnsList(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM add_ons ORDER BY category, sort_order').all();
  return jsonResponse(results, 200, corsHeaders);
}

async function createAddon(request, env, corsHeaders) {
  const data = await request.json();
  
  if (!data.name || !data.category) {
    return jsonResponse({ error: 'Name and category are required' }, 400, corsHeaders);
  }

  const id = 'addon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  
  const { results } = await env.DB.prepare('SELECT MAX(sort_order) as max_order FROM add_ons WHERE category = ?')
    .bind(data.category).all();
  const maxOrder = (results[0]?.max_order || 0) + 1;
  
  await env.DB.prepare('INSERT INTO add_ons (id, name, category, price, sort_order) VALUES (?, ?, ?, ?, ?)')
    .bind(id, sanitizeInput(data.name), sanitizeInput(data.category), sanitizeInput(data.price || ''), maxOrder)
    .run();

  return jsonResponse({ id, success: true }, 201, corsHeaders);
}

async function updateAddon(id, request, env, corsHeaders) {
  const data = await request.json();
  
  if (!data.name || !data.category) {
    return jsonResponse({ error: 'Name and category are required' }, 400, corsHeaders);
  }
  
  await env.DB.prepare('UPDATE add_ons SET name = ?, category = ?, price = ? WHERE id = ?')
    .bind(sanitizeInput(data.name), sanitizeInput(data.category), sanitizeInput(data.price || ''), id)
    .run();

  return jsonResponse({ success: true }, 200, corsHeaders);
}

async function deleteAddon(id, env, corsHeaders) {
  await env.DB.prepare('DELETE FROM add_ons WHERE id = ?').bind(id).run();
  return jsonResponse({ success: true }, 200, corsHeaders);
}

// ===== FILE UPLOAD (R2) =====
async function uploadFile(request, env, corsHeaders) {
  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file) {
    return jsonResponse({ error: 'No file provided' }, 400, corsHeaders);
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return jsonResponse({ error: 'Invalid file type. Allowed: ' + ALLOWED_IMAGE_TYPES.join(', ') }, 400, corsHeaders);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return jsonResponse({ error: 'File too large. Maximum size: 5MB' }, 400, corsHeaders);
  }

  // Sanitize filename
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
  const key = `uploads/${Date.now()}_${sanitizedName}`;
  
  await env.R2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return jsonResponse({ 
    url: `https://ekaryandigitalsolution.pages.dev/api/r2/${key}`,
    key 
  }, 201, corsHeaders);
}

async function deleteFile(request, env, corsHeaders) {
  const { key } = await request.json();
  
  if (!key || typeof key !== 'string') {
    return jsonResponse({ error: 'Invalid key' }, 400, corsHeaders);
  }

  // Validate key format
  if (!key.startsWith('uploads/') || key.includes('..')) {
    return jsonResponse({ error: 'Invalid key format' }, 400, corsHeaders);
  }

  await env.R2.delete(key);
  
  return jsonResponse({ success: true }, 200, corsHeaders);
}
