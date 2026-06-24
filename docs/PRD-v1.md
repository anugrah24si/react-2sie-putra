# Product Requirement Document (PRD) — v1

## Landing Page CRM — "Gacor CRM"

| Item | Detail |
|---|---|
| Dokumen | Product Requirement Document |
| Versi | 1.0 |
| Tanggal | 24 Juni 2026 |
| Status | Draft |
| Produk | Landing Page CRM |
| Mata Kuliah | Pemrograman Framework Lanjutan |
| Stack | React 19 + Vite + Tailwind CSS v4 + Supabase |

---

## 1. Project Overview

Project ini adalah aplikasi CRM (Customer Relationship Management) berbasis web yang
sudah memiliki area terproteksi untuk dua peran pengguna: **Admin** dan **Member**.
Aplikasi dibangun dengan React + Vite, di-styling menggunakan Tailwind CSS v4, dan
menggunakan Supabase sebagai backend (autentikasi, database, dan Row Level Security).

Saat ini aplikasi langsung mengarahkan pengunjung anonim ke halaman `/login` tanpa
adanya halaman publik yang memperkenalkan produk. PRD ini mendefinisikan kebutuhan
untuk membangun sebuah **Landing Page CRM yang profesional** sebagai pintu masuk
publik (public-facing) yang menjelaskan nilai produk dan mengarahkan pengunjung untuk
mendaftar (Register) atau masuk (Login).

Landing Page akan memanfaatkan modul-modul nyata yang sudah ada di aplikasi:
- **Customer Management** — pengelolaan data customer/member.
- **Product Management** — CRUD produk dengan soft delete.
- **Order Management** — order beserta item dan status.
- **Membership Tier** — sistem tier Bronze / Silver / Gold / Platinum beserta diskon.
- **Dashboard Analytics** — statistik untuk Admin dan Member.

### Ruang Lingkup v1

**In Scope:**
- Satu halaman landing publik (single page, multi-section) yang responsif.
- Navigasi ke halaman Login dan Register yang sudah ada.
- Penyesuaian routing agar landing dapat diakses pengunjung anonim.
- Layout publik baru (tanpa sidebar admin/member).

**Out of Scope (v1):**
- Pembuatan kode landing page (PRD ini hanya dokumen kebutuhan).
- Halaman marketing tambahan (Blog, Pricing detail, About terpisah).
- Integrasi form kontak ke backend / email.
- Multi-bahasa (i18n).
- Mode gelap (dark mode).

---

## 2. Problem Statement

Aplikasi CRM saat ini tidak memiliki halaman publik. Begitu pengunjung membuka root
(`/`), mereka langsung dipaksa menuju `/login`. Hal ini menimbulkan beberapa masalah:

1. **Tidak ada konteks produk.** Pengunjung baru tidak tahu apa itu aplikasi ini,
   fitur apa yang ditawarkan, dan mengapa mereka harus mendaftar.
2. **Konversi rendah.** Tanpa penjelasan nilai (value proposition) dan ajakan
   bertindak (call-to-action) yang jelas, pengunjung tidak terdorong untuk register.
3. **Citra kurang profesional.** Sebuah produk CRM yang langsung menampilkan form
   login terlihat seperti aplikasi internal, bukan produk yang siap dipasarkan.
4. **Tidak ada jalur edukasi.** Calon Member tidak memahami keuntungan sistem
   Membership Tier (diskon berdasarkan tier) sebelum mendaftar.

**Kesimpulan:** Dibutuhkan Landing Page yang menjelaskan produk, membangun
kepercayaan, dan mengarahkan pengunjung menuju Register/Login secara efektif.

---

## 3. Goals

### 3.1 Tujuan Bisnis
- Meningkatkan jumlah pendaftaran Member baru melalui CTA yang jelas.
- Menampilkan citra produk CRM yang profesional dan kredibel.
- Mengkomunikasikan nilai utama: kelola customer, produk, order, dan benefit tier.

### 3.2 Tujuan Produk
- Menyediakan halaman publik yang dapat diakses tanpa login.
- Menjelaskan 5 modul inti CRM secara ringkas dan menarik.
- Mengarahkan pengunjung ke `/register` (utama) dan `/login` (sekunder).

### 3.3 Tujuan Teknis
- Membangun landing page yang reusable dengan komponen yang sudah ada.
- Menjaga konsistensi tema (warna `#00B074`, font Poppins/Barlow).
- Memastikan landing tidak mengganggu alur auth & proteksi route yang sudah berjalan.
- Skor performa baik (lazy load, aset teroptimasi, responsif).

### 3.4 Non-Goals
- Tidak membangun sistem pembayaran.
- Tidak mengubah skema database Supabase.
- Tidak membuat dashboard analitik baru di landing (hanya menampilkan angka statis/ringkas).

---

## 4. Target Users

| Segmen | Deskripsi | Kebutuhan di Landing Page |
|---|---|---|
| Calon Member | Pelanggan yang ingin membeli produk & mendapat benefit tier | Memahami benefit, cara daftar, dan keuntungan tier |
| Admin / Pemilik Bisnis | Pengelola yang ingin mengevaluasi kapabilitas CRM | Melihat fitur manajemen (customer, produk, order, analytics) |
| Pengunjung Umum | Orang yang baru pertama kali mengenal produk | Penjelasan singkat, jelas, dan ajakan bertindak |
| Dosen / Penguji | Mengevaluasi hasil tugas | Tampilan profesional, fitur lengkap, struktur jelas |

---

## 5. User Persona

### Persona 1 — Rina, Calon Member
- **Usia:** 24 tahun
- **Profesi:** Karyawan swasta
- **Tujuan:** Mencari platform belanja yang memberi diskon loyalitas.
- **Frustrasi:** Tidak mau mendaftar di aplikasi yang tidak jelas manfaatnya.
- **Ekspektasi di Landing:** Penjelasan singkat soal benefit Member & tier, tombol
  daftar yang mudah ditemukan.

### Persona 2 — Pak Budi, Pemilik Bisnis (Admin)
- **Usia:** 38 tahun
- **Profesi:** Pemilik usaha retail
- **Tujuan:** Mengelola customer, produk, dan order dalam satu sistem.
- **Frustrasi:** Tools yang ada terlalu rumit dan tidak menampilkan ringkasan data.
- **Ekspektasi di Landing:** Melihat bahwa CRM ini punya manajemen lengkap dan
  dashboard analytics.

### Persona 3 — Sari, Pengunjung Umum
- **Usia:** 20 tahun
- **Profesi:** Mahasiswa
- **Tujuan:** Sekadar melihat-lihat sebelum memutuskan.
- **Frustrasi:** Halaman yang lambat dan membingungkan.
- **Ekspektasi di Landing:** Halaman cepat, ringkas, mobile-friendly.

---

## 6. User Flow

### 6.1 Flow Pengunjung Anonim
```
Pengunjung buka "/" (anonim)
        │
        ▼
   Landing Page tampil
        │
   ┌────┴───────────────┐
   ▼                    ▼
Klik "Daftar"      Klik "Masuk"
   │                    │
   ▼                    ▼
 /register            /login
   │                    │
   ▼                    ▼
Isi data         Autentikasi Supabase
   │                    │
   ▼                    ▼
Akun dibuat      Cek role (admin/member)
   │                    │
   └──────────┬─────────┘
              ▼
   admin → /dashboard
   member → /member
```

### 6.2 Flow Pengguna Sudah Login
```
User sudah login buka "/"
        │
        ▼
  Cek auth state (AuthContext)
        │
   ┌────┴────┐
   ▼         ▼
 admin     member
   │         │
   ▼         ▼
/dashboard  /member
```
> Catatan: pengguna yang sudah login tidak perlu melihat landing; langsung diarahkan
> ke dashboard sesuai role. Landing diutamakan untuk pengunjung anonim.

### 6.3 Flow Navigasi Internal Landing
```
Navbar (sticky)
  ├─ Logo  → scroll ke atas (Hero)
  ├─ Fitur → scroll ke section Features
  ├─ Tier  → scroll ke section Membership Tier
  ├─ Masuk → /login
  └─ Daftar → /register
```

---

## 7. Landing Page Structure

Landing page berupa **single page** dengan urutan section dari atas ke bawah:

1. **Navbar** (sticky) — logo, menu anchor, tombol Login & Register.
2. **Hero Section** — headline, subheadline, CTA utama, visual.
3. **Trust / Stats Bar** — angka ringkas (jumlah produk, member, order).
4. **Features Section** — 5 modul inti CRM.
5. **Membership Tier Section** — Bronze, Silver, Gold, Platinum + benefit diskon.
6. **How It Works** — 3 langkah: Daftar → Belanja → Dapat Benefit.
7. **Testimonials** — kutipan pengguna (data dummy).
8. **CTA Section** — ajakan akhir untuk mendaftar.
9. **Footer** — brand, link, copyright.

---

## 8. Section Description

| # | Section | Tujuan | Konten Utama | Komponen Reusable |
|---|---|---|---|---|
| 1 | Navbar | Navigasi & akses cepat auth | Logo, menu anchor, tombol Masuk/Daftar | — (baru) |
| 2 | Hero | Menangkap perhatian & value prop | Headline, subheadline, CTA, ilustrasi | `Button`, `Container` |
| 3 | Stats Bar | Membangun kepercayaan | Total produk, member, order, revenue (ringkas) | `Container`, `Card` |
| 4 | Features | Menjelaskan kapabilitas | 5 kartu: Customer, Product, Order, Tier, Analytics | `Card`, `Container`, `Badge` |
| 5 | Membership Tier | Menonjolkan benefit loyalitas | 4 kartu tier + persentase diskon | `Card`, `Badge`, `Button` |
| 6 | How It Works | Mengedukasi alur penggunaan | 3 langkah bernomor | `Container`, `Card` |
| 7 | Testimonials | Social proof | 3 kutipan + avatar | `Avatar`, `Card` |
| 8 | CTA | Mendorong konversi | Headline + tombol Daftar | `Button`, `Container` |
| 9 | Footer | Informasi & penutup | Brand, link, copyright | `Footer` |

---

## 9. Wireframe (ASCII / Text)

### 9.1 Desktop
```
┌─────────────────────────────────────────────────────────────┐
│  Gacor CRM •      Fitur   Tier   Cara Kerja     [Masuk][Daftar]│  ← Navbar (sticky)
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   Kelola Customer, Produk & Order            ┌─────────────┐  │
│   dalam Satu Platform CRM                    │             │  │
│                                              │   ILUSTRASI │  │  ← Hero
│   Sistem CRM modern dengan benefit tier      │   / VISUAL  │  │
│   loyalitas untuk pelanggan Anda.            │             │  │
│                                              └─────────────┘  │
│   [ Mulai Gratis ]  [ Pelajari Fitur ]                        │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│   [ 30+ Produk ]  [ 100+ Member ]  [ 500+ Order ]  [ 4 Tier ] │  ← Stats Bar
├─────────────────────────────────────────────────────────────┤
│                    Fitur Unggulan                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │Customer│ │Product │ │ Order  │ │  Tier  │ │Analytic│       │  ← Features
│  │  Mgmt  │ │  Mgmt  │ │  Mgmt  │ │ System │ │  Dash  │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
├─────────────────────────────────────────────────────────────┤
│                  Tingkatan Membership                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐               │
│  │ BRONZE │  │ SILVER │  │  GOLD  │  │PLATINUM│               │  ← Tier
│  │  0%    │  │  5%    │  │  10%   │  │  15%   │               │
│  │ [Daftar]│ │ [Daftar]│ │[Daftar]│ │[Daftar]│               │
│  └────────┘  └────────┘  └────────┘  └────────┘               │
├─────────────────────────────────────────────────────────────┤
│                     Cara Kerja                                │
│   (1) Daftar  →  (2) Belanja  →  (3) Dapat Benefit Tier        │  ← How It Works
├─────────────────────────────────────────────────────────────┤
│                  Apa Kata Pengguna                            │
│   ◯ "..."        ◯ "..."         ◯ "..."                      │  ← Testimonials
├─────────────────────────────────────────────────────────────┤
│            Siap meningkatkan bisnis Anda?                     │
│                   [ Daftar Sekarang ]                         │  ← CTA
├─────────────────────────────────────────────────────────────┤
│  Gacor CRM   |  Fitur  Tier  Kontak   |   © 2026              │  ← Footer
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Mobile
```
┌──────────────────────┐
│ Gacor CRM •      [≡]  │  ← Navbar (hamburger)
├──────────────────────┤
│  Kelola Customer,    │
│  Produk & Order      │  ← Hero
│  dalam 1 Platform    │
│                      │
│   [ Mulai Gratis ]   │
│   [ Pelajari Fitur ] │
├──────────────────────┤
│  [ 30+ Produk ]      │
│  [ 100+ Member ]     │  ← Stats (stacked)
│  [ 500+ Order ]      │
├──────────────────────┤
│   Fitur Unggulan     │
│  ┌────────────────┐  │
│  │ Customer Mgmt  │  │  ← Features
│  ├────────────────┤  │     (1 kolom)
│  │ Product Mgmt   │  │
│  ├────────────────┤  │
│  │ ...            │  │
│  └────────────────┘  │
├──────────────────────┤
│   Membership Tier    │
│  ┌────────────────┐  │  ← Tier (stacked)
│  │ BRONZE  0%     │  │
│  └────────────────┘  │
│  ...                 │
├──────────────────────┤
│  [ Daftar Sekarang ] │  ← CTA
├──────────────────────┤
│  Footer              │
└──────────────────────┘
```

---

## 10. Functional Requirements

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01 | Landing page dapat diakses publik di route tanpa autentikasi. | Must |
| FR-02 | Navbar menampilkan tombol "Masuk" (→ `/login`) dan "Daftar" (→ `/register`). | Must |
| FR-03 | Menu navbar mendukung anchor scroll ke section (Fitur, Tier, Cara Kerja). | Should |
| FR-04 | Hero menampilkan headline, subheadline, dan minimal satu CTA utama. | Must |
| FR-05 | Section Features menampilkan 5 modul: Customer, Product, Order, Tier, Analytics. | Must |
| FR-06 | Section Membership Tier menampilkan 4 tier (Bronze/Silver/Gold/Platinum) + diskon. | Must |
| FR-07 | Section How It Works menampilkan 3 langkah penggunaan. | Should |
| FR-08 | Section Testimonials menampilkan minimal 3 kutipan dengan avatar. | Could |
| FR-09 | Section CTA akhir mengarahkan ke `/register`. | Must |
| FR-10 | Footer menampilkan brand, link navigasi, dan copyright. | Must |
| FR-11 | Pengguna yang sudah login diarahkan ke dashboard sesuai role saat membuka root. | Must |
| FR-12 | Seluruh tombol CTA berfungsi sebagai navigasi React Router (tanpa reload). | Must |
| FR-13 | Navbar bersifat sticky saat scroll. | Should |
| FR-14 | Mobile menampilkan menu hamburger yang dapat dibuka/tutup. | Should |

---

## 11. Non-Functional Requirements

| ID | Kategori | Requirement |
|---|---|---|
| NFR-01 | Responsivitas | Tampil baik di breakpoint mobile (≤768px), tablet, dan desktop. |
| NFR-02 | Performa | Memanfaatkan lazy loading; first load ringan; aset gambar teroptimasi. |
| NFR-03 | Konsistensi | Mengikuti token tema: warna `#00B074`, font Poppins (body) & Barlow (heading). |
| NFR-04 | Aksesibilitas | Kontras warna memadai, `alt` pada gambar, struktur heading semantik, fokus keyboard. |
| NFR-05 | Maintainability | Section dipecah menjadi komponen terpisah dan reusable. |
| NFR-06 | Kompatibilitas | Berfungsi di browser modern (Chrome, Firefox, Edge, Safari terbaru). |
| NFR-07 | Keamanan | Landing tidak mengekspos data sensitif; tidak memanggil endpoint terproteksi tanpa auth. |
| NFR-08 | SEO dasar | Judul halaman, meta description, dan struktur heading yang benar. |

---

## 12. Technical Considerations

### 12.1 Stack & Dependency (sudah tersedia)
- **React 19** + **Vite 7** — SPA dengan lazy loading (`React.lazy` + `Suspense`).
- **react-router-dom 7** — routing & navigasi.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — styling, dengan tema kustom `@theme`.
- **Supabase** (`@supabase/supabase-js`) — auth & database (sudah terkonfigurasi).
- **framer-motion** — tersedia tapi belum dipakai; cocok untuk animasi scroll/hero.
- **react-icons** — ikon untuk fitur & navigasi.

### 12.2 Routing
- Tambahkan layout publik baru (mis. `PublicLayout`) **tanpa** sidebar admin/member.
- Tambahkan route landing yang dapat diakses anonim.
- Sesuaikan `RootRedirect` di `App.jsx`:
  - Anonim → tampilkan Landing (bukan langsung `/login`).
  - Sudah login → redirect ke `/dashboard` (admin) atau `/member` (member).
- `PublicOnlyRoute` dan `ProtectedRoute` yang ada tetap dipertahankan.

### 12.3 Reuse Komponen
- `Button`, `Card`, `Container`, `Badge`, `Avatar`, `Footer`, `AlertBox`.
- Komponen baru landing sebaiknya dikelompokkan (mis. `components/landing/` dan
  `pages/Landing/`).

### 12.4 Data
- Angka pada Stats Bar v1 boleh statis/placeholder; opsional di versi berikutnya
  ditarik dari `dashboardAPI.js`.
- Tier dan diskon mengikuti tabel `tier_config` Supabase agar konsisten dengan aplikasi.

### 12.5 Catatan Keamanan
- Kredensial Supabase saat ini hardcoded di `supabaseClient.js` dan `notesAPI.js`.
  Disarankan dipindah ke variabel environment (`import.meta.env.VITE_SUPABASE_*`).
  Ini di luar scope landing tetapi perlu dicatat sebagai utang teknis.

### 12.6 Branding
- Satukan penamaan menjadi satu brand (rekomendasi: **"Gacor CRM"**) untuk
  menghindari campuran "Gacor" / "Sedap." / "MyApp".

---

## 13. Success Criteria

| ID | Kriteria Keberhasilan | Metrik / Verifikasi |
|---|---|---|
| SC-01 | Landing dapat diakses publik tanpa login. | Buka root sebagai anonim → landing tampil, bukan redirect ke login. |
| SC-02 | Semua section pada struktur (Bagian 7) tampil lengkap. | Inspeksi visual 9 section. |
| SC-03 | Tombol Login & Register berfungsi. | Klik mengarah ke `/login` dan `/register` tanpa reload. |
| SC-04 | Pengguna login diarahkan ke dashboard sesuai role. | Login sebagai admin/member → diarahkan benar. |
| SC-05 | Responsif di mobile, tablet, desktop. | Uji di 3 ukuran layar tanpa layout rusak. |
| SC-06 | Konsisten dengan tema (warna & font). | Bandingkan dengan token `tailwind.css`. |
| SC-07 | Build berhasil tanpa error. | `npm run build` sukses. |
| SC-08 | Tidak ada error lint/console kritis. | `npm run lint` bersih dari error baru. |
| SC-09 | Tampilan profesional & kredibel. | Review kualitatif (dosen/penguji). |

---

## 14. Riwayat Revisi

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 24 Juni 2026 | Versi awal PRD Landing Page CRM. | Tim Pengembang |

---

> Dokumen ini adalah PRD versi 1. Implementasi kode Landing Page belum dilakukan dan
> akan dikerjakan pada tahap berikutnya setelah PRD disetujui.
