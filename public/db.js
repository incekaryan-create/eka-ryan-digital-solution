/**
 * Portfolio Database Layer
 * LocalStorage-based with Supabase-ready schema
 * 
 * Tables: config, services, workflow, skills, messages
 * Each table has CRUD operations + real-time subscription support
 */

const DB_PREFIX = 'portfolio_';

// ===== SCHEMA VERSION =====
const SCHEMA_VERSION = 2;

// ===== DEFAULT DATA =====
const DEFAULTS = {
  config: {
    id: 'main',
    hero_greeting: 'Hai, Saya',
    hero_name: 'Eka Ryan',
    hero_description: 'Saya merancang dan membangun antarmuka digital yang cepat, estetis, dan berorientasi pada data. Spesialisasi dalam dashboard tingkat lanjut dan pengalaman web interaktif.',
    hero_tagline: 'Web Developer • UI/UX Designer • Freelancer',
    hero_image: '',
    guarantee_title: 'Jaminan Uang Kembali',
    guarantee_desc: 'Jika hasil pekerjaan tidak sesuai dengan kesepakatan awal, saya menjamin pengembalian uang penuh. Kepuasan Anda adalah prioritas utama saya.',
    guarantee_p1: 'Revisi tanpa batas hingga disetujui',
    guarantee_p2: 'Pengembalian dana 100% jika tidak puas',
    guarantee_p3: 'Transparansi proses dari awal hingga akhir',
    quality_title: 'Jaminan Kualitas Saya',
    quality_desc: 'Setiap pixel yang dirancang memiliki fungsi jelas. Saya memadukan estetika desain dengan psikologi pengguna untuk menghasilkan tata letak yang meningkatkan metrik, mempertahankan pengguna, dan memberikan kesan.',
    quality_p1: '100% Tata Letak Kustom',
    quality_p2: 'Desain kontras aksesibel (WCAG)',
    quality_p3: 'Siap coding React yang mulus',
    contact_email: 'inc.ekaryan@gmail.com',
    contact_wa: '6285857854360',
    contact_location: 'Bali, Indonesia',
    contact_website: 'ekaryandigitalsolution.pages.dev',
    social_linkedin: 'https://linkedin.com/in/placeholder',
    social_instagram: 'https://instagram.com/placeholder',
    social_tiktok: 'https://tiktok.com/@placeholder',
    social_twitter: 'https://x.com/placeholder',
    cv_url: ''
  },

  services: [
    {
      id: 'svc_1', sort_order: 1,
      title: 'Pengembangan Web', subtitle: 'FULL-STACK DEVELOPMENT',
      description: 'Membangun website modern, responsif, dan performa tinggi menggunakan teknologi terkini.',
      image: '',
      price: 'Mulai dari Rp 5.000.000',
      is_active: true, created_at: '2024-11-15T08:00:00.000Z'
    },
    {
      id: 'svc_2', sort_order: 2,
      title: 'Desain UI/UX', subtitle: 'UI/UX DESIGN',
      description: 'Merancang antarmuka pengguna yang intuitif dan pengalaman pengguna yang memukau.',
      image: '',
      price: 'Mulai dari Rp 3.000.000',
      is_active: true, created_at: '2024-11-15T08:00:00.000Z'
    },
    {
      id: 'svc_3', sort_order: 3,
      title: 'Aplikasi Mobile', subtitle: 'MOBILE APP DEVELOPMENT',
      description: 'Mengembangkan aplikasi mobile lintas platform untuk iOS dan Android.',
      image: '',
      price: 'Mulai dari Rp 8.000.000',
      is_active: true, created_at: '2024-11-15T08:00:00.000Z'
    },
    {
      id: 'svc_4', sort_order: 4,
      title: 'Dashboard & Admin Panel', subtitle: 'DATA VISUALIZATION',
      description: 'Membangun dashboard analitik interaktif dengan visualisasi data real-time untuk pengambilan keputusan.',
      image: '',
      price: 'Mulai dari Rp 7.000.000',
      is_active: true, created_at: '2024-12-01T08:00:00.000Z'
    },
    {
      id: 'svc_5', sort_order: 5,
      title: 'API & Integrasi', subtitle: 'BACKEND INTEGRATION',
      description: 'Membangun dan mengintegrasikan API backend yang aman, cepat, dan terukur untuk berbagai kebutuhan bisnis.',
      image: '',
      price: 'Mulai dari Rp 4.000.000',
      is_active: true, created_at: '2024-12-10T08:00:00.000Z'
    },
    {
      id: 'svc_6', sort_order: 6,
      title: 'Konsultasi Teknis', subtitle: 'TECHNICAL CONSULTING',
      description: 'Audit kode, arsitektur sistem, dan rekomendasi optimasi untuk proyek yang sudah berjalan.',
      image: '',
      price: 'Mulai dari Rp 2.000.000',
      is_active: true, created_at: '2024-12-20T08:00:00.000Z'
    }
  ],

  service_details: [
    { id: 'sd_1', service_id: 'svc_1', sort_order: 1, text: 'Pengembangan website custom dengan React, Next.js, atau framework modern lainnya' },
    { id: 'sd_2', service_id: 'svc_1', sort_order: 2, text: 'Integrasi API, database, dan sistem backend yang robust' },
    { id: 'sd_3', service_id: 'svc_1', sort_order: 3, text: 'Optimasi performa, SEO, dan responsive design' },
    { id: 'sd_4', service_id: 'svc_1', sort_order: 4, text: 'Deployment dan konfigurasi server lengkap' },
    { id: 'sd_5', service_id: 'svc_2', sort_order: 1, text: 'Research pengguna dan analisis kebutuhan bisnis' },
    { id: 'sd_6', service_id: 'svc_2', sort_order: 2, text: 'Wireframing, prototyping, dan design system' },
    { id: 'sd_7', service_id: 'svc_2', sort_order: 3, text: 'User testing dan iterasi desain' },
    { id: 'sd_8', service_id: 'svc_2', sort_order: 4, text: 'Handoff desain ke tim development' },
    { id: 'sd_9', service_id: 'svc_3', sort_order: 1, text: 'Pengembangan cross-platform dengan React Native atau Flutter' },
    { id: 'sd_10', service_id: 'svc_3', sort_order: 2, text: 'Integrasi API dan layanan backend' },
    { id: 'sd_11', service_id: 'svc_3', sort_order: 3, text: 'Optimasi performa dan user experience mobile' },
    { id: 'sd_12', service_id: 'svc_3', sort_order: 4, text: 'Publishing ke App Store dan Google Play' },
    { id: 'sd_13', service_id: 'svc_4', sort_order: 1, text: 'Dashboard real-time dengan WebSocket dan live updates' },
    { id: 'sd_14', service_id: 'svc_4', sort_order: 2, text: 'Chart interaktif menggunakan Recharts atau D3.js' },
    { id: 'sd_15', service_id: 'svc_4', sort_order: 3, text: 'Filter, pencarian, dan ekspor data lanjutan' },
    { id: 'sd_16', service_id: 'svc_4', sort_order: 4, text: 'Role-based access control dan autentikasi aman' },
    { id: 'sd_17', service_id: 'svc_5', sort_order: 1, text: 'REST API atau GraphQL sesuai kebutuhan proyek' },
    { id: 'sd_18', service_id: 'svc_5', sort_order: 2, text: 'Integrasi payment gateway (Midtrans, Xendit, Stripe)' },
    { id: 'sd_19', service_id: 'svc_5', sort_order: 3, text: 'Webhook, notifikasi push, dan email service' },
    { id: 'sd_20', service_id: 'svc_5', sort_order: 4, text: 'Dokumentasi API otomatis dengan Swagger' },
    { id: 'sd_21', service_id: 'svc_6', sort_order: 1, text: 'Audit performa dan keamanan kode' },
    { id: 'sd_22', service_id: 'svc_6', sort_order: 2, text: 'Review arsitektur dan rekomendasi improvement' },
    { id: 'sd_23', service_id: 'svc_6', sort_order: 3, text: 'Setup CI/CD dan DevOps pipeline' },
    { id: 'sd_24', service_id: 'svc_6', sort_order: 4, text: 'Dokumentasi teknis dan knowledge transfer' }
  ],

  service_tags: [
    { service_id: 'svc_1', tag: 'React' }, { service_id: 'svc_1', tag: 'Next.js' }, { service_id: 'svc_1', tag: 'Node.js' }, { service_id: 'svc_1', tag: 'TypeScript' }, { service_id: 'svc_1', tag: 'Tailwind CSS' },
    { service_id: 'svc_2', tag: 'Figma' }, { service_id: 'svc_2', tag: 'Adobe XD' }, { service_id: 'svc_2', tag: 'Prototyping' }, { service_id: 'svc_2', tag: 'Design System' }, { service_id: 'svc_2', tag: 'User Research' },
    { service_id: 'svc_3', tag: 'React Native' }, { service_id: 'svc_3', tag: 'Flutter' }, { service_id: 'svc_3', tag: 'Expo' }, { service_id: 'svc_3', tag: 'iOS' }, { service_id: 'svc_3', tag: 'Android' },
    { service_id: 'svc_4', tag: 'React' }, { service_id: 'svc_4', tag: 'Recharts' }, { service_id: 'svc_4', tag: 'WebSocket' }, { service_id: 'svc_4', tag: 'PostgreSQL' }, { service_id: 'svc_4', tag: 'Tailwind CSS' },
    { service_id: 'svc_5', tag: 'Node.js' }, { service_id: 'svc_5', tag: 'Express' }, { service_id: 'svc_5', tag: 'REST APIs' }, { service_id: 'svc_5', tag: 'PostgreSQL' }, { service_id: 'svc_5', tag: 'Docker' },
    { service_id: 'svc_6', tag: 'TypeScript' }, { service_id: 'svc_6', tag: 'CI/CD' }, { service_id: 'svc_6', tag: 'Docker' }, { service_id: 'svc_6', tag: 'Git' }, { service_id: 'svc_6', tag: 'Cloud' }
  ],

  workflow: [
    { id: 'wf_1', sort_order: 1, title: 'KEBUTUHAN', short_desc: 'Menganalisis tujuan proyek, kendala arsitektur, dan alur pengguna.', long_desc: 'Kami memulai setiap proyek engineering dengan spesifikasi teknis yang terstruktur, desain skema API, dan definisi arsitektur. Menyesuaikan skema basis data, aturan keamanan, dan pilihan framework dengan target skalabilitas Anda.' },
    { id: 'wf_2', sort_order: 2, title: 'ARSITEKTUR', short_desc: 'Pengaturan basis data, desain API, dan perencanaan alur sistem.', long_desc: 'Menyiapkan skema basis data, dokumentasi API REST atau GraphQL, dan konfigurasi serverless/microservices. Memastikan kendala keamanan tinggi dan jalur yang dioptimalkan untuk mengurangi beban respons server.' },
    { id: 'wf_3', sort_order: 3, title: 'PENGEMBANGAN', short_desc: 'Menulis kode yang bersih, type-safe, dan modular.', long_desc: 'Menulis perangkat lunak yang dioptimalkan menggunakan framework modern dan robust seperti React, Next.js, atau Node.js. Mengikuti konfigurasi TypeScript yang ketat untuk menjamin type-safety, kemampuan pemeliharaan, dan standar kode yang bersih.' },
    { id: 'wf_4', sort_order: 4, title: 'UJI & OPTIMASI', short_desc: 'Pengujian ketat, debugging, dan optimasi performa.', long_desc: 'Menguji jalur kode melalui kasus uji modular, mengoptimalkan pengindeksan basis data, dan mengonfigurasi bundle aset. Mengaudit kecepatan halaman, perilaku rendering responsif, dan metrik latensi backend sebelum integrasi.' },
    { id: 'wf_5', sort_order: 5, title: 'DEPLOY', short_desc: 'Konfigurasi pipeline CI/CD, staging server, dan peluncuran.', long_desc: 'Mendeplikasi aplikasi ke lingkungan produksi dengan otomasi CI/CD. Memverifikasi variabel sisi server, koneksi SSL, kunci API, dan batas beban untuk menjamin uptime dan skalabilitas yang tak tertandingi.' }
  ],

  skills: [
    { id: 'sk_1', name: 'REACT', category: 'frontend', sort_order: 1 },
    { id: 'sk_2', name: 'TYPESCRIPT', category: 'language', sort_order: 2 },
    { id: 'sk_3', name: 'NEXT.JS', category: 'frontend', sort_order: 3 },
    { id: 'sk_4', name: 'NODE.JS', category: 'backend', sort_order: 4 },
    { id: 'sk_5', name: 'EXPRESS', category: 'backend', sort_order: 5 },
    { id: 'sk_6', name: 'POSTGRESQL', category: 'database', sort_order: 6 },
    { id: 'sk_7', name: 'FLUTTER', category: 'mobile', sort_order: 7 },
    { id: 'sk_8', name: 'REACT NATIVE', category: 'mobile', sort_order: 8 },
    { id: 'sk_9', name: 'REST APIS', category: 'backend', sort_order: 9 },
    { id: 'sk_10', name: 'TAILWIND CSS', category: 'frontend', sort_order: 10 },
    { id: 'sk_11', name: 'GIT', category: 'tool', sort_order: 11 },
    { id: 'sk_12', name: 'DOCKER', category: 'devops', sort_order: 12 },
    { id: 'sk_13', name: 'MONGODB', category: 'database', sort_order: 13 },
    { id: 'sk_14', name: 'CI/CD', category: 'devops', sort_order: 14 },
    { id: 'sk_15', name: 'WEBSOCKETS', category: 'backend', sort_order: 15 },
    { id: 'sk_16', name: 'CLOUDFLARE', category: 'devops', sort_order: 16 },
    { id: 'sk_17', name: 'PRISMA', category: 'database', sort_order: 17 },
    { id: 'sk_18', name: 'GRAPHQL', category: 'backend', sort_order: 18 },
    { id: 'sk_19', name: 'FIGMA', category: 'design', sort_order: 19 },
    { id: 'sk_20', name: 'REDUX', category: 'frontend', sort_order: 20 },
    { id: 'sk_21', name: 'SUPABASE', category: 'backend', sort_order: 21 },
    { id: 'sk_22', name: 'FIREBASE', category: 'backend', sort_order: 22 },
    { id: 'sk_23', name: 'VERCEL', category: 'devops', sort_order: 23 },
    { id: 'sk_24', name: 'AWS', category: 'devops', sort_order: 24 },
    { id: 'sk_25', name: 'PYTHON', category: 'language', sort_order: 25 },
    { id: 'sk_26', name: 'VUE.JS', category: 'frontend', sort_order: 26 },
    { id: 'sk_27', name: 'DJANGO', category: 'backend', sort_order: 27 },
    { id: 'sk_28', name: 'REDIS', category: 'database', sort_order: 28 },
    { id: 'sk_29', name: 'KUBERNETES', category: 'devops', sort_order: 29 },
    { id: 'sk_30', name: 'WEBPACK', category: 'tool', sort_order: 30 }
  ],

  messages: [
    {
      id: 'msg_1', name: 'Andi Pratama', email: 'andi.pratama@gmail.com',
      subject: 'Pembuatan Website Toko Online',
      message: 'Halo Eka Ryan, saya tertarik dengan portfolio Anda. Saya ingin membuat website toko online untuk brand fashion saya. Apakah bisa dibuatkan dengan React dan integrasi payment gateway Midtrans?',
      is_read: true, created_at: '2025-01-10T09:15:00.000Z'
    },
    {
      id: 'msg_2', name: 'Sarah Dewi', email: 'sarah.dewi@outlook.com',
      subject: 'Kolaborasi Proyek Dashboard',
      message: 'Hi, saya dari tim product XYZ Corp. Kami butuh developer untuk membuat dashboard analitik internal. Sudah lihat hasil kerja Anda di Nexora Dashboard, keren sekali! Bisa diskusi lebih lanjut?',
      is_read: true, created_at: '2025-01-15T14:30:00.000Z'
    },
    {
      id: 'msg_3', name: 'Rizki Firmansyah', email: 'rizki.firm@yahoo.com',
      subject: 'Aplikasi Mobile UMKM',
      message: 'Mas Eka, saya punya usaha kuliner dan ingin bikin aplikasi mobile buat order dan delivery. Budget sekitar 10-15 juta. Apakah bisa pakai Flutter? Terima kasih.',
      is_read: false, created_at: '2025-06-20T08:45:00.000Z'
    },
    {
      id: 'msg_4', name: 'Lestari Putri', email: 'lestari.putri@gmail.com',
      subject: 'Desain UI/UX Aplikasi Fintech',
      message: 'Hello Eka, saya co-founder startup fintech. Kami butuh UI/UX designer untuk aplikasi mobile banking kami. Sudah lihat karya Anda, sangat clean dan modern. Kapan bisa meet minggu depan?',
      is_read: false, created_at: '2025-06-25T11:20:00.000Z'
    },
    {
      id: 'msg_5', name: 'Budi Santoso', email: 'budi.santoso@company.id',
      subject: 'Migrasi Sistem Legacy',
      message: 'Yth. Eka Ryan, perusahaan kami ingin melakukan migrasi dari sistem legacy ke web-based.但我们更倾向于使用 Next.js. Bisakah Anda membantu audit dan migrasi? Terimakasih.',
      is_read: false, created_at: '2025-07-01T16:00:00.000Z'
    },
    {
      id: 'msg_6', name: 'Maya Anggraeni', email: 'maya.anggraeni@startup.io',
      subject: 'Freelance Project Dashboard',
      message: 'Hai! Saya butuh bantuan untuk membuat admin panel dashboard di website saya. Sudah coba sendiri tapi hasilnya kurang memuaskan. Bisa tolong bantu? Hubungi saya di WA ya.',
      is_read: true, created_at: '2025-07-05T10:30:00.000Z'
    }
  ]
};

// ===== DATABASE CLASS =====
class PortfolioDB {
  constructor() {
    this._listeners = {};
    this._init();
  }

  // ===== INIT =====
  _init() {
    const version = localStorage.getItem(DB_PREFIX + 'schema_version');
    if (version !== String(SCHEMA_VERSION)) {
      this._migrate();
    }
  }

  _migrate() {
    // First install or upgrade
    Object.keys(DEFAULTS).forEach(table => {
      if (!localStorage.getItem(DB_PREFIX + table)) {
        localStorage.setItem(DB_PREFIX + table, JSON.stringify(DEFAULTS[table]));
      }
    });
    localStorage.setItem(DB_PREFIX + 'schema_version', SCHEMA_VERSION);
  }

  // ===== GENERIC TABLE OPS =====
  _getTable(table) {
    try {
      return JSON.parse(localStorage.getItem(DB_PREFIX + table)) || [];
    } catch {
      return [];
    }
  }

  _setTable(table, data) {
    localStorage.setItem(DB_PREFIX + table, JSON.stringify(data));
    this._emit(table, data);
  }

  _generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  // ===== EVENT SYSTEM =====
  _emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
  }

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => {
      this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
    };
  }

  // ===== CONFIG =====
  getConfig() {
    const config = this._getTable('config');
    return config.length > 0 ? config[0] : { ...DEFAULTS.config };
  }

  updateConfig(updates) {
    const config = this.getConfig();
    const merged = { ...config, ...updates };
    this._setTable('config', [merged]);
    return merged;
  }

  // ===== SERVICES =====
  getServices() {
    return this._getTable('services').sort((a, b) => a.sort_order - b.sort_order);
  }

  getService(id) {
    return this.getServices().find(s => s.id === id);
  }

  getServiceWithDetails(id) {
    const service = this.getService(id);
    if (!service) return null;
    return {
      ...service,
      details: this.getServiceDetails(id),
      tags: this.getServiceTags(id)
    };
  }

  getAllServicesWithDetails() {
    return this.getServices().map(s => ({
      ...s,
      details: this.getServiceDetails(s.id),
      tags: this.getServiceTags(s.id)
    }));
  }

  createService(data) {
    const services = this.getServices();
    const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.sort_order)) : 0;
    const service = {
      id: this._generateId('svc'),
      sort_order: maxOrder + 1,
      created_at: new Date().toISOString(),
      is_active: true,
      ...data
    };
    services.push(service);
    this._setTable('services', services);

    // Create details
    if (data.details && data.details.length > 0) {
      const details = this._getTable('service_details');
      data.details.forEach((text, i) => {
        details.push({
          id: this._generateId('sd'),
          service_id: service.id,
          sort_order: i + 1,
          text
        });
      });
      this._setTable('service_details', details);
    }

    // Create tags
    if (data.tags && data.tags.length > 0) {
      const tags = this._getTable('service_tags');
      data.tags.forEach(tag => {
        tags.push({
          service_id: service.id,
          tag
        });
      });
      this._setTable('service_tags', tags);
    }

    return service;
  }

  updateService(id, updates) {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) return null;

    services[idx] = { ...services[idx], ...updates };
    this._setTable('services', services);

    // Update details if provided
    if (updates.details !== undefined) {
      this._setServiceDetails(id, updates.details);
    }

    // Update tags if provided
    if (updates.tags !== undefined) {
      this._setServiceTags(id, updates.tags);
    }

    return services[idx];
  }

  deleteService(id) {
    const services = this.getServices().filter(s => s.id !== id);
    this._setTable('services', services);
    // Also delete details and tags
    const details = this._getTable('service_details').filter(d => d.service_id !== id);
    this._setTable('service_details', details);
    const tags = this._getTable('service_tags').filter(t => t.service_id !== id);
    this._setTable('service_tags', tags);
  }

  _getServiceDetails(serviceId) {
    return this._getTable('service_details')
      .filter(d => d.service_id === serviceId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  _setServiceDetails(serviceId, detailTexts) {
    let details = this._getTable('service_details').filter(d => d.service_id !== serviceId);
    detailTexts.forEach((text, i) => {
      details.push({
        id: this._generateId('sd'),
        service_id: serviceId,
        sort_order: i + 1,
        text
      });
    });
    this._setTable('service_details', details);
  }

  _getServiceTags(serviceId) {
    return this._getTable('service_tags').filter(t => t.service_id === serviceId);
  }

  _setServiceTags(serviceId, tagList) {
    let tags = this._getTable('service_tags').filter(t => t.service_id !== serviceId);
    tagList.forEach(tag => {
      tags.push({ service_id: serviceId, tag });
    });
    this._setTable('service_tags', tags);
  }

  // Alias for backward compatibility
  getServiceDetails(serviceId) { return this._getServiceDetails(serviceId).map(d => d.text); }
  getServiceTags(serviceId) { return this._getServiceTags(serviceId).map(t => t.tag); }

  // ===== WORKFLOW =====
  getWorkflow() {
    return this._getTable('workflow').sort((a, b) => a.sort_order - b.sort_order);
  }

  createWorkflow(data) {
    const workflow = this.getWorkflow();
    const maxOrder = workflow.length > 0 ? Math.max(...workflow.map(w => w.sort_order)) : 0;
    const item = {
      id: this._generateId('wf'),
      sort_order: maxOrder + 1,
      ...data
    };
    workflow.push(item);
    this._setTable('workflow', workflow);
    return item;
  }

  updateWorkflow(id, updates) {
    const workflow = this.getWorkflow();
    const idx = workflow.findIndex(w => w.id === id);
    if (idx === -1) return null;
    workflow[idx] = { ...workflow[idx], ...updates };
    this._setTable('workflow', workflow);
    return workflow[idx];
  }

  deleteWorkflow(id) {
    const workflow = this.getWorkflow().filter(w => w.id !== id);
    // Re-number
    workflow.forEach((w, i) => w.sort_order = i + 1);
    this._setTable('workflow', workflow);
  }

  // ===== SKILLS =====
  getSkills() {
    return this._getTable('skills').sort((a, b) => a.sort_order - b.sort_order);
  }

  createSkill(data) {
    const skills = this.getSkills();
    const maxOrder = skills.length > 0 ? Math.max(...skills.map(s => s.sort_order)) : 0;
    const skill = {
      id: this._generateId('sk'),
      sort_order: maxOrder + 1,
      category: 'other',
      ...data
    };
    skills.push(skill);
    this._setTable('skills', skills);
    return skill;
  }

  updateSkill(id, updates) {
    const skills = this.getSkills();
    const idx = skills.findIndex(s => s.id === id);
    if (idx === -1) return null;
    skills[idx] = { ...skills[idx], ...updates };
    this._setTable('skills', skills);
    return skills[idx];
  }

  deleteSkill(id) {
    const skills = this.getSkills().filter(s => s.id !== id);
    skills.forEach((s, i) => s.sort_order = i + 1);
    this._setTable('skills', skills);
  }

  // ===== MESSAGES =====
  getMessages() {
    return this._getTable('messages').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getUnreadMessages() {
    return this.getMessages().filter(m => !m.is_read);
  }

  createMessage(data) {
    const messages = this._getTable('messages');
    const message = {
      id: this._generateId('msg'),
      is_read: false,
      created_at: new Date().toISOString(),
      ...data
    };
    messages.push(message);
    this._setTable('messages', messages);
    return message;
  }

  markMessageRead(id) {
    const messages = this._getTable('messages');
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.is_read = true;
      this._setTable('messages', messages);
    }
    return msg;
  }

  markAllRead() {
    const messages = this._getTable('messages');
    messages.forEach(m => m.is_read = true);
    this._setTable('messages', messages);
  }

  deleteMessage(id) {
    const messages = this._getTable('messages').filter(m => m.id !== id);
    this._setTable('messages', messages);
  }

  deleteAllMessages() {
    this._setTable('messages', []);
  }

  // ===== EXPORT / IMPORT =====
  exportAll() {
    const data = {
      version: SCHEMA_VERSION,
      exported_at: new Date().toISOString(),
      config: this.getConfig(),
      services: this.getAllServicesWithDetails(),
      workflow: this.getWorkflow(),
      skills: this.getSkills(),
      messages: this.getMessages(),
      add_ons: this.getAddOns()
    };
    return JSON.stringify(data, null, 2);
  }

  importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.config) {
        this.updateConfig(data.config);
      }
      
      if (data.services) {
        // Clear and re-import
        this._setTable('services', []);
        this._setTable('service_details', []);
        this._setTable('service_tags', []);
        data.services.forEach(s => {
          this.createService({
            title: s.title,
            subtitle: s.subtitle,
            description: s.description,
            image: s.image,
            price: s.price,
            details: s.details || [],
            tags: s.tags || [],
            is_active: s.is_active !== false
          });
        });
      }
      
      if (data.workflow) {
        this._setTable('workflow', []);
        data.workflow.forEach(w => {
          this.createWorkflow({
            title: w.title,
            short_desc: w.short_desc,
            long_desc: w.long_desc
          });
        });
      }
      
      if (data.skills) {
        this._setTable('skills', []);
        data.skills.forEach(s => {
          this.createSkill({
            name: s.name,
            category: s.category
          });
        });
      }
      
      if (data.messages) {
        this._setTable('messages', data.messages);
      }
      
      return { success: true, message: 'Data berhasil diimport!' };
    } catch (e) {
      return { success: false, message: 'Gagal import: ' + e.message };
    }
  }

  // ===== ADD-ONS =====
  getAddOns() {
    return this._getTable('add_ons').sort((a, b) => a.sort_order - b.sort_order);
  }

  getAddOnsByCategory() {
    const addons = this.getAddOns();
    const grouped = {};
    for (const addon of addons) {
      if (!grouped[addon.category]) {
        grouped[addon.category] = [];
      }
      grouped[addon.category].push(addon);
    }
    return grouped;
  }

  // ===== RESET =====
  resetAll() {
    Object.keys(DEFAULTS).forEach(table => {
      this._setTable(table, JSON.parse(JSON.stringify(DEFAULTS[table])));
    });
  }
}

// ===== SINGLETON =====
const db = new PortfolioDB();
