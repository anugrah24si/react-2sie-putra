# Product Requirement Document (PRD) — v2

## Landing Page CRM — "Gacor CRM"

| Item | Detail |
|---|---|
| Dokumen | Product Requirement Document |
| Versi | 2.0 |
| Tanggal | 24 Juni 2026 |
| Status | Draft |
| Basis | Pengembangan dari PRD v1 (disetujui & terimplementasi) |
| Fokus v2 | User Experience, Visual Engagement, Kredibilitas Produk |
| Stack | React 19 + Vite + Tailwind CSS v4 + Supabase + Framer Motion |

> Dokumen ini adalah **kelanjutan** dari PRD v1. Bagian yang sudah dijelaskan
> lengkap di v1 (problem statement dasar, persona, struktur dasar) tidak diulang;
> v2 berfokus pada peningkatan dan penambahan.

---

## 1. Evaluation of PRD v1

PRD v1 berhasil menghadirkan Landing Page publik dengan 9 section (Navbar, Hero,
Stats, Features, Membership Tier, How It Works, Testimonials, CTA, Footer), routing
publik untuk pengunjung anonim, dan reuse komponen yang ada. Build lolos tanpa error.

### 1.1 Pencapaian v1
- Landing publik aktif di root `/` untuk pengunjung anonim.
- Role-based redirect tetap berjalan (admin/member).
- Konsistensi tema (warna `#00B074`, font Poppins/Barlow).
- Struktur modular: tiap section adalah komponen terpisah.

### 1.2 Keterbatasan v1 (dasar evaluasi v2)
- Tampilan **statis** — tidak ada animasi/transisi, kesan kurang hidup.
- Stats memakai **data dummy hardcoded**, belum tersambung ke data nyata.
- Hero menampilkan kartu preview sederhana, **belum menggambarkan produk** secara nyata.
- Interaksi minim — tidak ada hover effect yang konsisten pada kartu.
- Testimonial masih sederhana, **social proof lemah** (tanpa rating, logo, atau metrik).
- Mobile UX dasar — navbar berfungsi tapi belum optimal untuk konversi.

---

## 2. Problems Found

| ID | Masalah | Dampak pada Pengguna |
|---|---|---|
| P-01 | Halaman terasa statis, tanpa animasi | Kesan kurang modern; perhatian cepat hilang |
| P-02 | Stats dummy tidak kredibel | Angka terasa "ditempel", mengurangi kepercayaan |
| P-03 | Tidak ada gambaran produk nyata sebelum login | Pengunjung ragu mendaftar karena tidak tahu isi produk |
| P-04 | Tidak ada feedback visual saat interaksi (hover) | Terasa pasif, kurang engaging |
| P-05 | Social proof lemah | Kredibilitas rendah, konversi tertahan |
| P-06 | Spacing antar-section kurang konsisten | Ritme visual kurang rapi |
| P-07 | Mobile UX belum dioptimalkan untuk konversi | CTA kurang menonjol di layar kecil |

---

## 3. Improvement Goals

1. **Visual Engagement** — landing terasa hidup melalui animasi yang halus dan
   bertujuan (bukan dekoratif berlebihan).
2. **Kredibilitas** — data statistik tersambung (dengan fallback) dan social proof
   yang lebih kuat untuk membangun kepercayaan.
3. **Pemahaman Produk** — pengunjung dapat "melihat" produk lewat Dashboard Preview
   sebelum mendaftar.
4. **UX Konsisten** — interaksi hover, spacing, dan ikon yang seragam.
5. **Mobile-First** — pengalaman mobile yang mulus dengan CTA yang mudah dijangkau.

> Prinsip: peningkatan tidak boleh menurunkan performa (NFR-02 v1) maupun merusak
> alur auth/role yang sudah berjalan.

---

## 4. New Features

### 4.1 Integrasi Framer Motion
- **Hero animation**: fade-in + slide-up bertahap (staggered) pada headline,
  subheadline, dan CTA saat halaman dimuat.
- **Scroll reveal**: tiap section muncul (fade/slide) saat masuk viewport
  (`whileInView`, `viewport={{ once: true }}`).
- **Hover interaction**: kartu features/tier/testimonial mengangkat halus
  (`whileHover`) untuk feedback responsif.
- **Alasan**: animasi terarah meningkatkan persepsi kualitas dan memandu fokus
  pengguna ke informasi penting.
- **Dampak UX**: halaman terasa modern dan profesional; perhatian pengguna terjaga
  lebih lama.

### 4.2 Dashboard Preview Section (baru)
- Section khusus menampilkan **preview UI dashboard CRM** (mockup statistik, tabel
  order ringkas, distribusi tier) sebagai gambaran produk.
- Ditempatkan setelah Features atau setelah Stats.
- **Alasan**: menjawab P-03 — pengunjung butuh melihat isi produk sebelum komit daftar.
- **Dampak UX**: mengurangi keraguan, meningkatkan niat mendaftar (konversi).

### 4.3 Dynamic Statistics
- Stats Section disiapkan menarik data dari `services/dashboardAPI.js`
  (`fetchAdminDashboard`): total produk, member, order, dan tier.
- **Fallback data**: bila API gagal/lambat, tampilkan angka default (data v1) tanpa
  membuat halaman error — landing tetap tampil utuh untuk pengunjung anonim.
- **Catatan akses**: pemanggilan harus aman untuk anonim (hormati RLS Supabase).
  Jika data tidak dapat diakses tanpa login, gunakan fallback statis sebagai default.
- **Alasan**: menjawab P-02 — angka nyata jauh lebih kredibel.
- **Dampak UX**: meningkatkan kepercayaan; data terasa autentik.

### 4.4 Visual Improvement
- **Ikon konsisten**: seragamkan set ikon (react-icons `Fa`) dengan ukuran & warna
  aksen yang sama di seluruh section.
- **Card hover effect**: elevasi + shadow + border halus pada hover.
- **Section spacing**: standarisasi padding vertikal antar-section (ritme konsisten).
- **Alasan**: menjawab P-04 & P-06 — keseragaman menaikkan kualitas persepsi.
- **Dampak UX**: tampilan lebih rapi, profesional, mudah dipindai (scannable).

### 4.5 Mobile UX Improvement
- **Navbar mobile** lebih baik: animasi buka/tutup, area sentuh lebih besar,
  menutup otomatis setelah klik.
- **CTA mudah diakses**: pertimbangkan CTA yang tetap terlihat (mis. tombol Daftar
  menonjol) dan urutan konten mobile yang mengutamakan aksi.
- **Optimasi layout**: penyesuaian grid → stack, ukuran font, dan spacing di layar kecil.
- **Alasan**: menjawab P-07 — mayoritas pengunjung kemungkinan dari mobile.
- **Dampak UX**: navigasi & konversi lebih lancar di perangkat mobile.

### 4.6 Trust Building
- **Testimonial lebih profesional**: tambah rating bintang, peran/tier jelas,
  dan layout kartu yang lebih matang.
- **Social proof lebih kuat**: tambah elemen seperti baris metrik kepercayaan
  (mis. "Dipercaya oleh X member"), badge keamanan data, atau ringkasan benefit.
- **Alasan**: menjawab P-05 — social proof mendorong keputusan mendaftar.
- **Dampak UX**: kredibilitas meningkat, mengurangi hambatan psikologis untuk daftar.

---

## 5. Updated User Flow

Alur inti dari v1 dipertahankan (anonim → landing; login → dashboard sesuai role).
Penambahan pada v2 adalah pada **interaksi dalam landing**:

```
Pengunjung buka "/" (anonim)
        │
        ▼
  Landing dimuat → Hero animation (staggered fade-in)
        │
        ▼
  Stats: coba ambil data dashboardAPI
        ├─ sukses → tampilkan data nyata
        └─ gagal  → tampilkan fallback (data default)
        │
        ▼
  Scroll → tiap section reveal saat masuk viewport
        │
        ▼
  Dashboard Preview → pengunjung memahami isi produk
        │
        ▼
  Hover pada kartu → feedback visual (elevasi)
        │
   ┌────┴────┐
   ▼         ▼
 Daftar    Masuk
 /register /login
```

---

## 6. Updated Landing Structure

Urutan section v2 (tanda **[BARU]** dan **[UPGRADE]**):

1. Navbar **[UPGRADE]** — animasi mobile + CTA lebih menonjol
2. Hero **[UPGRADE]** — entrance animation
3. Stats **[UPGRADE]** — dynamic + fallback
4. **Dashboard Preview [BARU]** — gambaran produk
5. Features **[UPGRADE]** — hover effect + ikon konsisten
6. Membership Tier **[UPGRADE]** — hover + reveal
7. How It Works **[UPGRADE]** — reveal bertahap
8. Testimonials **[UPGRADE]** — rating + social proof
9. CTA **[UPGRADE]** — reveal + emphasis
10. Footer — (tetap)

---

## 7. UI/UX Improvements

| Area | v1 | v2 | Manfaat |
|---|---|---|---|
| Animasi | Tidak ada | Framer Motion (entrance, scroll reveal, hover) | Engagement & persepsi kualitas |
| Stats | Dummy statis | Dinamis + fallback | Kredibilitas |
| Preview produk | Kartu sederhana di Hero | Section Dashboard Preview khusus | Pemahaman produk |
| Interaksi | Pasif | Hover feedback konsisten | Responsif & hidup |
| Ikon | Beragam | Seragam (set & ukuran) | Konsistensi visual |
| Spacing | Bervariasi | Terstandarisasi | Ritme & keterbacaan |
| Social proof | Lemah | Rating + metrik kepercayaan | Konversi |
| Mobile | Dasar | Dioptimasi (navbar, CTA, layout) | UX mobile |

---

## 8. Technical Changes

### 8.1 Dependency
- **Framer Motion** (`framer-motion`) sudah terpasang di `package.json` — tidak perlu
  instalasi baru. Tinggal diimpor di komponen yang memerlukan animasi.

### 8.2 Pola Animasi
- Gunakan `motion.*` dengan varian `initial`/`animate`/`whileInView`/`whileHover`.
- Terapkan `viewport={{ once: true }}` agar animasi reveal tidak berulang saat scroll.
- Hormati preferensi aksesibilitas: pertimbangkan `prefers-reduced-motion` agar animasi
  dapat diredam bagi pengguna yang sensitif terhadap gerakan.

### 8.3 Integrasi Data
- StatsSection memanggil `dashboardAPI.fetchAdminDashboard()` di dalam `useEffect`,
  dengan `try/catch` dan state fallback.
- Default value = data v1 (agar tidak ada flash kosong / error untuk anonim).
- Loading state ringan (skeleton/placeholder) bila diperlukan.

### 8.4 Performa
- Animasi dibuat ringan; hindari animasi pada elemen berat.
- Pertahankan lazy loading landing.
- Dashboard Preview memakai mockup statis (bukan komponen dashboard nyata) agar tidak
  menambah beban data untuk pengunjung anonim.

### 8.5 Kompatibilitas
- Perubahan tidak menyentuh `AuthContext`, `ProtectedRoute`, `PublicOnlyRoute`,
  maupun route admin/member. Hanya komponen landing & (opsional) StatsSection.

---

## 9. File Changes Required

> Rencana perubahan. **Belum dieksekusi** — sesuai instruksi, dokumen ini tidak
> menyertakan implementasi kode.

### 9.1 File yang akan DIBUAT
| File | Tujuan |
|---|---|
| `src/components/landing/DashboardPreviewSection.jsx` | Section preview dashboard CRM (baru) |
| `src/components/landing/motionVariants.js` (opsional) | Kumpulan varian animasi Framer Motion agar konsisten & reusable |

### 9.2 File yang akan DIMODIFIKASI
| File | Perubahan |
|---|---|
| `src/components/landing/LandingPage.jsx` | Tambah `DashboardPreviewSection` ke susunan section |
| `src/components/landing/HeroSection.jsx` | Tambah entrance animation (Framer Motion) |
| `src/components/landing/StatsSection.jsx` | Dynamic data dari `dashboardAPI` + fallback |
| `src/components/landing/FeaturesSection.jsx` | Hover effect + scroll reveal + ikon konsisten |
| `src/components/landing/TierSection.jsx` | Hover + reveal |
| `src/components/landing/HowItWorksSection.jsx` | Reveal bertahap |
| `src/components/landing/TestimonialsSection.jsx` | Rating bintang + social proof + reveal |
| `src/components/landing/CTASection.jsx` | Reveal + emphasis |
| `src/components/landing/Navbar.jsx` | Animasi menu mobile + CTA lebih menonjol |

### 9.3 File yang TIDAK diubah
- `src/App.jsx`, `services/*`, `layout/*`, semua halaman admin/member, dan komponen
  inti lain. Alur auth & role-based routing tetap utuh.

---

## 10. Success Criteria v2

| ID | Kriteria | Verifikasi |
|---|---|---|
| SC2-01 | Hero tampil dengan animasi entrance yang halus | Inspeksi visual saat load |
| SC2-02 | Section muncul saat masuk viewport (scroll reveal) | Scroll & amati transisi |
| SC2-03 | Kartu memberi feedback hover yang konsisten | Hover pada features/tier/testimonial |
| SC2-04 | Stats menampilkan data dinamis, dengan fallback saat gagal | Uji kondisi API sukses & gagal |
| SC2-05 | Dashboard Preview menampilkan gambaran produk yang jelas | Inspeksi visual section baru |
| SC2-06 | Testimonial menampilkan rating & social proof | Inspeksi visual |
| SC2-07 | Mobile UX optimal (navbar, CTA, layout) | Uji di layar kecil |
| SC2-08 | Animasi tidak menurunkan performa secara signifikan | Build sukses + load tetap ringan |
| SC2-09 | Alur auth & role-based routing tetap berfungsi | Login admin/member → redirect benar |
| SC2-10 | Animasi menghormati `prefers-reduced-motion` | Uji dengan setting reduce motion |

---

## 11. Perbandingan PRD v1 vs PRD v2

| Aspek | PRD v1 | PRD v2 |
|---|---|---|
| Fokus | Membangun struktur dasar landing | Meningkatkan UX, engagement, kredibilitas |
| Animasi | Tidak ada | Framer Motion (entrance, scroll reveal, hover) |
| Statistik | Data dummy hardcoded | Dinamis dari `dashboardAPI` + fallback |
| Preview produk | Kartu ringkas di Hero | Section Dashboard Preview khusus |
| Interaksi | Statis/pasif | Hover feedback konsisten |
| Ikon & spacing | Fungsional, bervariasi | Konsisten & terstandarisasi |
| Social proof | Testimonial sederhana | Rating + metrik kepercayaan |
| Mobile | UX dasar | UX dioptimasi untuk konversi |
| Section | 9 section | 10 section (+ Dashboard Preview) |
| Tujuan utama | Ada landing yang berfungsi | Landing yang meyakinkan & profesional |

---

## 12. Riwayat Revisi

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 24 Juni 2026 | PRD awal landing page. | Tim Pengembang |
| 2.0 | 24 Juni 2026 | Peningkatan UX, animasi, dynamic stats, dashboard preview, trust building. | Tim Pengembang |

---

> Dokumen PRD v2 ini fokus pada perencanaan peningkatan. Implementasi kode akan
> dikerjakan pada tahap berikutnya setelah PRD v2 disetujui.
