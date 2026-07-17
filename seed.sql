-- ============================================
-- Portfolio Seed Data for Cloudflare D1
-- Fictional data for development/testing
-- ============================================

-- Default config
INSERT OR REPLACE INTO config (id, hero_greeting, hero_name, hero_description, hero_tagline, hero_image,
  guarantee_title, guarantee_desc, guarantee_p1, guarantee_p2, guarantee_p3,
  quality_title, quality_desc, quality_p1, quality_p2, quality_p3,
  contact_email, contact_wa, contact_location, contact_website,
  social_linkedin, social_instagram, social_tiktok, social_twitter
) VALUES (
  'main',
  'Hai, Saya',
  'Eka Ryan',
  'Saya merancang dan membangun antarmuka digital yang cepat, estetis, dan berorientasi pada data. Spesialisasi dalam dashboard tingkat lanjut dan pengalaman web interaktif.',
  'Web Developer • UI/UX Designer • Freelancer',
  'src/assets/images/alex_morgan_hero_1784011179158.jpg',
  'Jaminan Uang Kembali',
  'Jika hasil pekerjaan tidak sesuai dengan kesepakatan awal, saya menjamin pengembalian uang penuh. Kepuasan Anda adalah prioritas utama saya.',
  'Revisi tanpa batas hingga disetujui',
  'Pengembalian dana 100% jika tidak puas',
  'Transparansi proses dari awal hingga akhir',
  'Jaminan Kualitas Saya',
  'Setiap pixel yang dirancang memiliki fungsi jelas. Saya memadukan estetika desain dengan psikologi pengguna untuk menghasilkan tata letak yang meningkatkan metrik, mempertahankan pengguna, dan memberikan kesan.',
  '100% Tata Letak Kustom',
  'Desain kontras aksesibel (WCAG)',
  'Siap coding React yang mulus',
  'inc.ekaryan@gmail.com',
  '6285857854360',
  'Bali, Indonesia',
  'ekaryandigitalsolution.pages.dev',
  'https://linkedin.com/in/ekaryan',
  'https://instagram.com/ekaryandigital',
  'https://tiktok.com/@ekaryandigital',
  'https://x.com/ekaryandigital'
);

-- Default services
INSERT OR REPLACE INTO services (id, sort_order, title, subtitle, description, image, price) VALUES
  ('svc_1', 1, 'Pengembangan Web', 'FULL-STACK DEVELOPMENT', 'Membangun website modern, responsif, dan performa tinggi menggunakan teknologi terkini.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Mulai dari Rp 5.000.000'),
  ('svc_2', 2, 'Desain UI/UX', 'UI/UX DESIGN', 'Merancang antarmuka pengguna yang intuitif dan pengalaman pengguna yang memukau.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'Mulai dari Rp 3.000.000'),
  ('svc_3', 3, 'Aplikasi Mobile', 'MOBILE APP DEVELOPMENT', 'Mengembangkan aplikasi mobile lintas platform untuk iOS dan Android.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'Mulai dari Rp 8.000.000'),
  ('svc_4', 4, 'Dashboard & Admin Panel', 'DATA VISUALIZATION', 'Membangun dashboard analitik interaktif dengan visualisasi data real-time untuk pengambilan keputusan.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Mulai dari Rp 7.000.000'),
  ('svc_5', 5, 'API & Integrasi', 'BACKEND INTEGRATION', 'Membangun dan mengintegrasikan API backend yang aman, cepat, dan terukur untuk berbagai kebutuhan bisnis.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', 'Mulai dari Rp 4.000.000'),
  ('svc_6', 6, 'Konsultasi Teknis', 'TECHNICAL CONSULTING', 'Audit kode, arsitektur sistem, dan rekomendasi optimasi untuk proyek yang sudah berjalan.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'Mulai dari Rp 2.000.000');

-- Default service details
INSERT OR REPLACE INTO service_details (id, service_id, sort_order, text) VALUES
  ('sd_1', 'svc_1', 1, 'Pengembangan website custom dengan React, Next.js, atau framework modern lainnya'),
  ('sd_2', 'svc_1', 2, 'Integrasi API, database, dan sistem backend yang robust'),
  ('sd_3', 'svc_1', 3, 'Optimasi performa, SEO, dan responsive design'),
  ('sd_4', 'svc_1', 4, 'Deployment dan konfigurasi server lengkap'),
  ('sd_5', 'svc_2', 1, 'Research pengguna dan analisis kebutuhan bisnis'),
  ('sd_6', 'svc_2', 2, 'Wireframing, prototyping, dan design system'),
  ('sd_7', 'svc_2', 3, 'User testing dan iterasi desain'),
  ('sd_8', 'svc_2', 4, 'Handoff desain ke tim development'),
  ('sd_9', 'svc_3', 1, 'Pengembangan cross-platform dengan React Native atau Flutter'),
  ('sd_10', 'svc_3', 2, 'Integrasi API dan layanan backend'),
  ('sd_11', 'svc_3', 3, 'Optimasi performa dan user experience mobile'),
  ('sd_12', 'svc_3', 4, 'Publishing ke App Store dan Google Play'),
  ('sd_13', 'svc_4', 1, 'Dashboard real-time dengan WebSocket dan live updates'),
  ('sd_14', 'svc_4', 2, 'Chart interaktif menggunakan Recharts atau D3.js'),
  ('sd_15', 'svc_4', 3, 'Filter, pencarian, dan ekspor data lanjutan'),
  ('sd_16', 'svc_4', 4, 'Role-based access control dan autentikasi aman'),
  ('sd_17', 'svc_5', 1, 'REST API atau GraphQL sesuai kebutuhan proyek'),
  ('sd_18', 'svc_5', 2, 'Integrasi payment gateway (Midtrans, Xendit, Stripe)'),
  ('sd_19', 'svc_5', 3, 'Webhook, notifikasi push, dan email service'),
  ('sd_20', 'svc_5', 4, 'Dokumentasi API otomatis dengan Swagger'),
  ('sd_21', 'svc_6', 1, 'Audit performa dan keamanan kode'),
  ('sd_22', 'svc_6', 2, 'Review arsitektur dan rekomendasi improvement'),
  ('sd_23', 'svc_6', 3, 'Setup CI/CD dan DevOps pipeline'),
  ('sd_24', 'svc_6', 4, 'Dokumentasi teknis dan knowledge transfer');

-- Default service tags
INSERT OR REPLACE INTO service_tags (id, service_id, tag) VALUES
  ('st_1', 'svc_1', 'React'), ('st_2', 'svc_1', 'Next.js'), ('st_3', 'svc_1', 'Node.js'), ('st_4', 'svc_1', 'TypeScript'), ('st_5', 'svc_1', 'Tailwind CSS'),
  ('st_6', 'svc_2', 'Figma'), ('st_7', 'svc_2', 'Adobe XD'), ('st_8', 'svc_2', 'Prototyping'), ('st_9', 'svc_2', 'Design System'), ('st_10', 'svc_2', 'User Research'),
  ('st_11', 'svc_3', 'React Native'), ('st_12', 'svc_3', 'Flutter'), ('st_13', 'svc_3', 'Expo'), ('st_14', 'svc_3', 'iOS'), ('st_15', 'svc_3', 'Android'),
  ('st_16', 'svc_4', 'React'), ('st_17', 'svc_4', 'Recharts'), ('st_18', 'svc_4', 'WebSocket'), ('st_19', 'svc_4', 'PostgreSQL'), ('st_20', 'svc_4', 'Tailwind CSS'),
  ('st_21', 'svc_5', 'Node.js'), ('st_22', 'svc_5', 'Express'), ('st_23', 'svc_5', 'REST APIs'), ('st_24', 'svc_5', 'PostgreSQL'), ('st_25', 'svc_5', 'Docker'),
  ('st_26', 'svc_6', 'TypeScript'), ('st_27', 'svc_6', 'CI/CD'), ('st_28', 'svc_6', 'Docker'), ('st_29', 'svc_6', 'Git'), ('st_30', 'svc_6', 'Cloud');

-- Default workflow
INSERT OR REPLACE INTO workflow (id, sort_order, title, short_desc, long_desc) VALUES
  ('wf_1', 1, 'KEBUTUHAN', 'Menganalisis tujuan proyek, kendala arsitektur, dan alur pengguna.', 'Kami memulai setiap proyek engineering dengan spesifikasi teknis yang terstruktur, desain skema API, dan definisi arsitektur. Menyesuaikan skema basis data, aturan keamanan, dan pilihan framework dengan target skalabilitas Anda.'),
  ('wf_2', 2, 'ARSITEKTUR', 'Pengaturan basis data, desain API, dan perencanaan alur sistem.', 'Menyiapkan skema basis data, dokumentasi API REST atau GraphQL, dan konfigurasi serverless/microservices. Memastikan kendala keamanan tinggi dan jalur yang dioptimalkan untuk mengurangi beban respons server.'),
  ('wf_3', 3, 'PENGEMBANGAN', 'Menulis kode yang bersih, type-safe, dan modular.', 'Menulis perangkat lunak yang dioptimalkan menggunakan framework modern dan robust seperti React, Next.js, atau Node.js. Mengikuti konfigurasi TypeScript yang ketat untuk menjamin type-safety, kemampuan pemeliharaan, dan standar kode yang bersih.'),
  ('wf_4', 4, 'UJI & OPTIMASI', 'Pengujian ketat, debugging, dan optimasi performa.', 'Menguji jalur kode melalui kasus uji modular, mengoptimalkan pengindeksan basis data, dan mengonfigurasi bundle aset. Mengaudit kecepatan halaman, perilaku rendering responsif, dan metrik latensi backend sebelum integrasi.'),
  ('wf_5', 5, 'DEPLOY', 'Konfigurasi pipeline CI/CD, staging server, dan peluncuran.', 'Mendeplikasi aplikasi ke lingkungan produksi dengan otomasi CI/CD. Memverifikasi variabel sisi server, koneksi SSL, kunci API, dan batas beban untuk menjamin uptime dan skalabilitas yang tak tertandingi.');

-- Default skills
INSERT OR REPLACE INTO skills (id, name, category, sort_order) VALUES
  ('sk_1', 'REACT', 'frontend', 1),
  ('sk_2', 'TYPESCRIPT', 'language', 2),
  ('sk_3', 'NEXT.JS', 'frontend', 3),
  ('sk_4', 'NODE.JS', 'backend', 4),
  ('sk_5', 'EXPRESS', 'backend', 5),
  ('sk_6', 'POSTGRESQL', 'database', 6),
  ('sk_7', 'FLUTTER', 'mobile', 7),
  ('sk_8', 'REACT NATIVE', 'mobile', 8),
  ('sk_9', 'REST APIS', 'backend', 9),
  ('sk_10', 'TAILWIND CSS', 'frontend', 10),
  ('sk_11', 'GIT', 'tool', 11),
  ('sk_12', 'DOCKER', 'devops', 12),
  ('sk_13', 'MONGODB', 'database', 13),
  ('sk_14', 'CI/CD', 'devops', 14),
  ('sk_15', 'WEBSOCKETS', 'backend', 15),
  ('sk_16', 'CLOUDFLARE', 'devops', 16),
  ('sk_17', 'PRISMA', 'database', 17),
  ('sk_18', 'GRAPHQL', 'backend', 18),
  ('sk_19', 'FIGMA', 'design', 19),
  ('sk_20', 'REDUX', 'frontend', 20),
  ('sk_21', 'SUPABASE', 'backend', 21),
  ('sk_22', 'FIREBASE', 'backend', 22),
  ('sk_23', 'VERCEL', 'devops', 23),
  ('sk_24', 'AWS', 'devops', 24),
  ('sk_25', 'PYTHON', 'language', 25),
  ('sk_26', 'VUE.JS', 'frontend', 26),
  ('sk_27', 'DJANGO', 'backend', 27),
  ('sk_28', 'REDIS', 'database', 28),
  ('sk_29', 'KUBERNETES', 'devops', 29),
  ('sk_30', 'WEBPACK', 'tool', 30);

-- Default messages (fictional)
INSERT OR REPLACE INTO messages (id, name, email, subject, message, is_read, created_at) VALUES
  ('msg_1', 'Andi Pratama', 'andi.pratama@gmail.com', 'Pembuatan Website Toko Online', 'Halo Eka Ryan, saya tertarik dengan portfolio Anda. Saya ingin membuat website toko online untuk brand fashion saya. Apakah bisa dibuatkan dengan React dan integrasi payment gateway Midtrans?', 1, '2025-01-10T09:15:00.000'),
  ('msg_2', 'Sarah Dewi', 'sarah.dewi@outlook.com', 'Kolaborasi Proyek Dashboard', 'Hi, saya dari tim product XYZ Corp. Kami butuh developer untuk membuat dashboard analitik internal. Sudah lihat hasil kerja Anda di Nexora Dashboard, keren sekali! Bisa diskusi lebih lanjut?', 1, '2025-01-15T14:30:00.000'),
  ('msg_3', 'Rizki Firmansyah', 'rizki.firm@yahoo.com', 'Aplikasi Mobile UMKM', 'Mas Eka, saya punya usaha kuliner dan ingin bikin aplikasi mobile buat order dan delivery. Budget sekitar 10-15 juta. Apakah bisa pakai Flutter? Terima kasih.', 0, '2025-06-20T08:45:00.000'),
  ('msg_4', 'Lestari Putri', 'lestari.putri@gmail.com', 'Desain UI/UX Aplikasi Fintech', 'Hello Eka, saya co-founder startup fintech. Kami butuh UI/UX designer untuk aplikasi mobile banking kami. Sudah lihat karya Anda, sangat clean dan modern. Kapan bisa meet minggu depan?', 0, '2025-06-25T11:20:00.000'),
  ('msg_5', 'Budi Santoso', 'budi.santoso@company.id', 'Migrasi Sistem Legacy', 'Yth. Eka Ryan, perusahaan kami ingin melakukan migrasi dari sistem legacy ke web-based. Kami lebih倾向于使用 Next.js. Bisakah Anda membantu audit dan migrasi? Terimakasih.', 0, '2025-07-01T16:00:00.000'),
  ('msg_6', 'Maya Anggraeni', 'maya.anggraeni@startup.io', 'Freelance Project Dashboard', 'Hai! Saya butuh bantuan untuk membuat admin panel dashboard di website saya. Sudah coba sendiri tapi hasilnya kurang memuaskan. Bisa tolong bantu? Hubungi saya di WA ya.', 1, '2025-07-05T10:30:00.000');
