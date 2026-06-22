-- ==========================================
-- SEED DATA: Akun Admin & Member
-- ==========================================
-- CARA PAKAI:
-- 1. Jalankan database-setup.sql TERLEBIH DAHULU
-- 2. Buka Supabase Dashboard → Authentication → Users
-- 3. Klik "Add User" → "Create New User"
--    - Email: admin@gacor.com
--    - Password: admin123
--    - Auto Confirm User: ON (centang)
--    - Klik "Create User"
-- 4. Klik "Add User" lagi → "Create New User"
--    - Email: member@gacor.com
--    - Password: member123
--    - Auto Confirm User: ON (centang)
--    - Klik "Create User"
-- 5. Copy-paste SQL di bawah ini ke SQL Editor → Run
-- ==========================================

-- ==========================================
-- STEP 1: Update role admin di tabel profiles
-- (Profile otomatis dibuat oleh trigger handle_new_user saat user dibuat di Auth)
-- ==========================================

UPDATE public.profiles
SET role = 'admin',
    full_name = 'Admin Gacor',
    city = 'Jakarta'
WHERE email = 'admin@gacor.com';

-- ==========================================
-- STEP 2: Pastikan member sudah benar
-- ==========================================

UPDATE public.profiles
SET role = 'member',
    full_name = 'Member Test',
    city = 'Bandung'
WHERE email = 'member@gacor.com';

-- ==========================================
-- STEP 3: Verifikasi akun yang sudah dibuat
-- ==========================================

SELECT id, email, full_name, role, tier, total_points, accumulated_points
FROM public.profiles
ORDER BY role;

-- ==========================================
-- HASIL YANG DIHARAPKAN:
-- +--------------------------------------+------------------+-------------+--------+--------+
-- | id                                   | email            | full_name   | role   | tier   |
-- +--------------------------------------+------------------+-------------+--------+--------+
-- | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | admin@gacor.com  | Admin Gacor | admin  | Bronze |
-- | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | member@gacor.com | Member Test | member | Bronze |
-- +--------------------------------------+------------------+-------------+--------+--------+
-- ==========================================
-- LOGIN INFO:
-- Admin  → Email: admin@gacor.com  | Password: admin123
-- Member → Email: member@gacor.com | Password: member123
-- ==========================================
