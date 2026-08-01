// ============================================================================
// Konfigurasi Supabase — Eka Ryan Digital Solution
// ----------------------------------------------------------------------------
//   - SUPABASE_URL     : Project URL  (https://<ref>.supabase.co)
//   - SUPABASE_ANON_KEY: anon/public key  (read-only untuk situs publik,
//     dan dipakai panel admin untuk login via Supabase Auth).
//
// Semua tulis/hapus di panel admin dikendalikan oleh RLS dengan acuan
// pengguna yang sudah login (authenticated + is_admin), bukan service key.
// File ini aman untuk publik karena tidak berisi kredensial rahasia.
// ============================================================================

window.SUPABASE_CONFIG = {
  url: "https://sqimmcecwuoadjbjiyfd.supabase.co",
  anonKey: "sb_publishable_QuXa98nQwhAab5jamV1l0A_VjeBumIb"
};
