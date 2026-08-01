// ============================================================================
// Konfigurasi Supabase — Eka Ryan Digital Solution
// ----------------------------------------------------------------------------
//   - SUPABASE_URL          : Project URL  (https://<ref>.supabase.co)
//   - SUPABASE_ANON_KEY     : anon/public key  (dipakai situs publik, read-only)
//   - SUPABASE_SERVICE_KEY  : service_role key (hanya untuk Admin Panel) —
//     ditaruh di public/supabase-key.js (di-gitignore), bukan di file ini.
//
// JANGAN commit service_role key ke repositori publik. File ini bisa di
// protect / disetel ulang kapan saja lewat dashboard jika bocor.
// ============================================================================

// serviceKey ditaruh di file terpisah public/supabase-key.js (di-gitignore)
// agar tidak ikut ter-commit. Bila file tersebut tidak ada (mis. di deploy),
// key dipakai apa adanya dari dashboard — isi manual bila perlu.
window.SUPABASE_CONFIG = {
  url: "https://sqimmcecwuoadjbjiyfd.supabase.co",
  anonKey: "sb_publishable_QuXa98nQwhAab5jamV1l0A_VjeBumIb",
  serviceKey: (typeof window.SUPABASE_SERVICE_KEY !== "undefined" && window.SUPABASE_SERVICE_KEY)
    ? window.SUPABASE_SERVICE_KEY
    : "ISI_SERVICE_ROLE_KEY_DARI_DASHBOARD",

  // Kredensial login Admin Panel (shared key sederhana — sama seperti dulu).
  // Ganti bila perlu, lalu sesuaikan kredensial yang sama di dalamnya.
  adminUsername: "Eka Ryan",
  adminPassword: "Ekaryan443!"
};
