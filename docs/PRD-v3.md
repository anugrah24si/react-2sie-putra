# Product Requirement Document (PRD) — v3 (Final)

## Landing Page CRM — "Gacor CRM"

| Item | Detail |
|---|---|
| Dokumen | Product Requirement Document |
| Versi | 3.0 (Final) |
| Tanggal | 24 Juni 2026 |
| Status | Draft |
| Basis | Pengembangan dari PRD v1 & v2 (keduanya terimplementasi) |
| Fokus v3 | Conversion Optimization, Professional Presentation, Accessibility, Performance, Production Ready |
| Stack | React 19 + Vite + Tailwind CSS v4 + Supabase + Framer Motion |

> Dokumen ini adalah **versi final**. Isi PRD v1 (struktur dasar) dan PRD v2
> (animasi, dynamic stats, dashboard preview, social proof) **tidak diulang**.
> v3 hanya membahas peningkatan baru menuju kualitas produk profesional.

---

## 1. Evaluation of PRD v2

PRD v2 berhasil meningkatkan engagement dan kredibilitas melalui Framer Motion
(entrance, scroll reveal, hover), Dashboard Preview Section, dynamic stats dengan
fallback, dan social proof (rating + metrik). Build lolos dan alur auth tetap utuh.

### 1.1 Pencapaian v2
- Landing terasa hidup dan modern berkat animasi ringan.
- Pengunjung dapat melihat gambaran produk lewat Dashboard Preview.
- Social proof memperkuat kepercayaan.
- Mobile UX dasar membaik (navbar beranimasi, CTA lebih jelas).

### 1.2 Keterbatasan v2 (dasar evaluasi v3)
- **Konversi belum dioptimalkan**: tidak ada perbandingan tier yang jelas untuk
  membantu keputusan; CTA belum diuji-arahkan secara strategis.
- **Belum ada penanganan keraguan akhir**: tidak ada FAQ untuk menjawab pertanyaan
  umum sebelum mendaftar.
- **SEO minim**: judul halaman masih `fmi-app`, tanpa meta description / Open Graph,
  struktur heading belum sepenuhnya terverifikasi.
- **Aksesibilitas belum standar**: belum ada audit `alt`, fokus keyboard, kontras,
  dan dukungan `prefers-reduced-motion` belum diterapkan eksplisit.
- **Performa belum dioptimalkan**: chunk landing membesar karena Framer Motion;
  belum ada strategi image/bundle optimization.
- **Polish UI belum final**: spacing, tipografi, warna, dan ikonografi masih
  bervariasi antar-section.

---

## 2. Remaining Problems

| ID | Masalah | Dampak |
|---|---|---|
| P-01 | Pengguna sulit membandingkan benefit antar-tier | Keputusan mendaftar tertunda |
| P-02 | Pertanyaan umum tidak terjawab di halaman | Keraguan → bounce sebelum daftar |
| P-03 | SEO buruk (title default, tanpa meta/OG) | Sulit ditemukan, kesan kurang profesional |
| P-04 | Aksesibilitas belum memenuhi standar modern | Mengecualikan sebagian pengguna; kualitas turun |
| P-05 | Bundle landing besar (Framer Motion) | Risiko load lebih lambat |
| P-06 | Inkonsistensi visual halus antar-section | Kesan kurang "jadi" / belum final |
| P-07 | CTA belum dioptimalkan untuk konversi | Potensi konversi belum maksimal |

---

## 3. Final Improvement Goals

1. **Conversion Optimization** — bantu pengguna memutuskan lewat perbandingan tier
   dan FAQ, serta penempatan CTA yang strategis.
2. **Professional Product Presentation** — polish UI final agar konsisten dan matang.
3. **Accessibility** — penuhi praktik aksesibilitas web modern (WCAG sebagai acuan).
4. **Performance** — jaga landing tetap cepat meski fitur bertambah.
5. **Production Ready Experience** — SEO dasar, metadata, dan kualitas siap presentasi.

> Prinsip: seluruh peningkatan tidak boleh merusak alur auth, role-based routing,
> Dashboard Admin/Member, maupun service Supabase.

---

## 4. New Features

### 4.1 Pricing / Membership Comparison Section
- **Tujuan**: memudahkan pengguna memahami perbedaan tier untuk mendorong keputusan.
- **Konten**: perbandingan Bronze, Silver, Gold, Platinum dalam format tabel/kartu
  komparatif yang menampilkan: **Benefit**, **Diskon**, **Target User**, dan
  **highlight tier terbaik** (mis. Gold sebagai "Paling Populer").
- **Catatan**: berbeda dari Tier Section v1/v2 yang berupa kartu terpisah; bagian
  ini menekankan **perbandingan berdampingan (side-by-side)** agar mudah dipindai.
- **Dampak UX**: mempercepat pemahaman & keputusan; menaikkan konversi.

| Tier | Diskon | Target User | Benefit Inti |
|---|---|---|---|
| Bronze | 0% | Pengguna baru | Akses katalog, riwayat order, profil |
| Silver | 5% | Pelanggan reguler | + Diskon 5%, prioritas dukungan |
| Gold ★ | 10% | Pelanggan loyal | + Diskon 10%, penawaran eksklusif |
| Platinum | 15% | Pelanggan premium | + Diskon 15%, layanan premium |

### 4.2 FAQ Section
- **Tujuan**: mengurangi keraguan sebelum mendaftar.
- **Konten**: minimal 6 pertanyaan (accordion):
  1. Apa itu Gacor CRM?
  2. Bagaimana cara mendaftar?
  3. Apakah data saya aman?
  4. Bagaimana sistem membership bekerja?
  5. Apakah bisa digunakan di perangkat mobile?
  6. Apakah ada biaya berlangganan?
- **Interaksi**: accordion buka/tutup beraksesibilitas (keyboard + ARIA).
- **Dampak UX**: menjawab keberatan umum di tempat, mengurangi bounce.

### 4.3 SEO Optimization
- **Page Title** deskriptif (mis. "Gacor CRM — Kelola Customer, Produk & Order").
- **Meta Description** ringkas berisi value proposition.
- **Open Graph** (og:title, og:description, og:image, og:type) untuk preview share.
- **Semantic HTML**: `header`, `nav`, `main`, `section`, `footer` yang benar.
- **Structured Heading**: hierarki `h1` → `h2` → `h3` yang konsisten (satu `h1`).
- **Dampak**: kesan profesional, mudah ditemukan & dibagikan.

### 4.4 Accessibility Improvement
- **Alt Text** pada semua gambar bermakna; `aria-hidden` untuk ikon dekoratif.
- **Keyboard Navigation**: semua elemen interaktif dapat dijangkau & dioperasikan
  via keyboard (Tab/Enter/Escape pada accordion & menu mobile).
- **Focus State** terlihat jelas (focus ring) pada link, tombol, dan accordion.
- **Color Contrast** memenuhi rasio minimal WCAG AA (teks vs latar).
- **Reduced Motion**: hormati `prefers-reduced-motion` — animasi diredam/dimatikan
  bagi pengguna yang memilihnya.
- **Dampak**: inklusif, memenuhi standar web modern.

> Catatan: kepatuhan WCAG penuh memerlukan pengujian manual dengan teknologi bantu
> (screen reader) dan review pakar; PRD ini menargetkan praktik baik yang dapat
> diverifikasi otomatis + uji manual dasar.

### 4.5 Performance Optimization
- **Lazy Loading**: landing tetap lazy; pertimbangkan lazy-load section berat
  (mis. Dashboard Preview) dan gambar di bawah lipatan (`loading="lazy"`).
- **Image Optimization**: aset gambar dikompres, format efisien, dimensi tepat,
  `width`/`height` eksplisit untuk mengurangi layout shift (CLS).
- **Bundle Optimization**: impor ikon secara spesifik; evaluasi ukuran chunk landing;
  pertimbangkan pemisahan (code splitting) bila perlu.
- **Framer Motion Optimization**: gunakan animasi hemat (transform/opacity), batasi
  jumlah elemen beranimasi, `viewport once` agar tidak re-trigger.
- **Dampak**: load cepat, pengalaman mulus, skor performa baik.

### 4.6 Final UI Polish
- **Spacing**: standarisasi padding vertikal section & gap antar-elemen.
- **Typography**: skala heading/body konsisten (Barlow untuk heading, Poppins body).
- **Warna**: patuhi token tema (`hijau #00B074`, netral abu) tanpa warna liar.
- **Iconography**: satu set ikon (`react-icons/Fa`), ukuran & warna aksen seragam.
- **Dampak**: tampilan matang, profesional, dan kohesif.

---

## 5. Updated Landing Structure

Urutan section final v3 (tanda **[BARU]** untuk tambahan v3):

1. Navbar — + anchor ke section baru (Harga, FAQ)
2. Hero
3. Stats
4. Dashboard Preview
5. Features
6. Membership Tier
7. **Pricing / Membership Comparison [BARU]**
8. How It Works
9. Testimonials
10. **FAQ [BARU]**
11. CTA
12. Footer

> Catatan struktur: Pricing Comparison melengkapi (bukan menggantikan) Tier Section —
> Tier Section memperkenalkan, Pricing Comparison membandingkan untuk keputusan.
> Pada tahap implementasi dapat dipertimbangkan penggabungan bila terasa redundan.

---

## 6. Accessibility Requirements

| ID | Requirement | Acuan |
|---|---|---|
| A11Y-01 | Semua gambar bermakna memiliki `alt`; ikon dekoratif `aria-hidden`. | WCAG 1.1.1 |
| A11Y-02 | Hierarki heading benar & tunggal `h1`. | WCAG 1.3.1 |
| A11Y-03 | Kontras teks memenuhi rasio AA (≥ 4.5:1 teks normal). | WCAG 1.4.3 |
| A11Y-04 | Semua kontrol dapat dioperasikan via keyboard. | WCAG 2.1.1 |
| A11Y-05 | Focus state terlihat jelas. | WCAG 2.4.7 |
| A11Y-06 | Accordion FAQ & menu mobile memakai ARIA yang sesuai. | WCAG 4.1.2 |
| A11Y-07 | Hormati `prefers-reduced-motion`. | WCAG 2.3.3 |

---

## 7. SEO Requirements

| ID | Requirement |
|---|---|
| SEO-01 | `<title>` deskriptif & unik untuk landing. |
| SEO-02 | `<meta name="description">` ringkas berisi value proposition. |
| SEO-03 | Open Graph tags (og:title, og:description, og:image, og:type, og:url). |
| SEO-04 | Struktur HTML semantik (`header/nav/main/section/footer`). |
| SEO-05 | Satu `h1` utama + hierarki heading konsisten. |
| SEO-06 | `lang` dokumen sesuai (mis. `id` untuk konten Indonesia). |
| SEO-07 | (Opsional) `meta name="viewport"` sudah ada — verifikasi tetap benar. |

---

## 8. Performance Requirements

| ID | Requirement | Target |
|---|---|---|
| PERF-01 | Landing tetap lazy-loaded. | Tidak membebani route lain |
| PERF-02 | Gambar dioptimasi + `loading="lazy"` di bawah lipatan. | CLS rendah |
| PERF-03 | Dimensi gambar eksplisit. | Hindari layout shift |
| PERF-04 | Animasi hanya transform/opacity, `viewport once`. | Hindari reflow |
| PERF-05 | Evaluasi & jaga ukuran chunk landing tetap wajar. | Build sukses, load cepat |
| PERF-06 | Impor ikon spesifik (tree-shakeable). | Bundle minimal |

---

## 9. Technical Changes

### 9.1 Metadata & SEO
- Update `index.html`: `<title>`, `<meta name="description">`, Open Graph, `lang`.
- (Opsional) penyetelan metadata per-route jika diperlukan di masa depan.

### 9.2 Aksesibilitas
- Audit & tambahkan atribut ARIA pada komponen interaktif (FAQ accordion, navbar).
- Tambahkan focus ring konsisten via util Tailwind.
- Implementasi penghormatan `prefers-reduced-motion` (mis. util/hook untuk meredam
  varian Framer Motion saat preferensi aktif).

### 9.3 Performa
- Terapkan `loading="lazy"` & dimensi pada gambar.
- Tinjau impor ikon dan ukuran chunk landing pasca-penambahan section.

### 9.4 Kompatibilitas
- Tidak menyentuh `AuthContext`, `ProtectedRoute`, `PublicOnlyRoute`, route
  admin/member, layout dashboard, maupun service Supabase.

---

## 10. File Changes Required

> Rencana. **Belum dieksekusi** — dokumen ini fokus PRD, tanpa implementasi kode.

### 10.1 File yang akan DIBUAT
| File | Tujuan |
|---|---|
| `src/components/landing/PricingSection.jsx` | Perbandingan tier side-by-side + highlight terbaik |
| `src/components/landing/FAQSection.jsx` | Accordion FAQ (≥6 pertanyaan) beraksesibilitas |
| `src/components/landing/useReducedMotion.js` (opsional) | Hook/util untuk menghormati `prefers-reduced-motion` |

### 10.2 File yang akan DIMODIFIKASI
| File | Perubahan |
|---|---|
| `index.html` | Title, meta description, Open Graph, `lang` |
| `src/components/landing/LandingPage.jsx` | Sisipkan `PricingSection` & `FAQSection`; pastikan struktur semantik |
| `src/components/landing/Navbar.jsx` | Tambah anchor "Harga" & "FAQ"; audit aksesibilitas |
| `src/components/landing/motionVariants.js` | Dukungan reduced motion (varian aman) |
| Section terkait (Hero/Features/Tier/Testimonials/dst) | Polish UI final (spacing, tipografi, warna, ikon), audit `alt`/ARIA/kontras |

### 10.3 File yang TIDAK diubah
- `src/App.jsx` (logika routing/auth), `services/*`, `layout/*`, halaman admin/member.

---

## 11. Success Criteria v3

| ID | Kriteria | Verifikasi |
|---|---|---|
| SC3-01 | Pricing Comparison menampilkan 4 tier + highlight terbaik | Inspeksi visual |
| SC3-02 | FAQ menampilkan ≥6 pertanyaan dengan accordion fungsional | Inspeksi + uji keyboard |
| SC3-03 | Title, meta description, dan Open Graph tersedia | Inspeksi `index.html` / view-source |
| SC3-04 | Struktur HTML semantik & satu `h1` | Audit struktur |
| SC3-05 | Semua kontrol dapat dioperasikan via keyboard + focus terlihat | Uji navigasi keyboard |
| SC3-06 | Kontras warna memenuhi AA | Audit kontras (mis. Lighthouse/axe) |
| SC3-07 | `prefers-reduced-motion` dihormati | Uji dengan setting reduce motion |
| SC3-08 | Gambar lazy + berdimensi (CLS rendah) | Audit performa |
| SC3-09 | Build sukses & ukuran chunk landing wajar | `npm run build` |
| SC3-10 | UI konsisten (spacing/tipografi/warna/ikon) | Review visual final |
| SC3-11 | Alur auth & role-based routing tetap berfungsi | Login admin/member |
| SC3-12 | Skor Lighthouse baik (Performance/SEO/Accessibility) | Audit Lighthouse |

---

## 12. Perbandingan PRD v1 vs v2 vs v3

| Aspek | PRD v1 | PRD v2 | PRD v3 (Final) |
|---|---|---|---|
| Fokus utama | Struktur dasar landing | Engagement & kredibilitas | Konversi, profesionalisme, produksi |
| Animasi | Tidak ada | Framer Motion (entrance/scroll/hover) | + Optimasi & reduced motion |
| Statistik | Dummy statis | Dynamic + fallback | Fallback aman (dipertahankan) |
| Preview produk | Kartu Hero ringkas | Dashboard Preview Section | + Lazy/optimasi |
| Perbandingan tier | Kartu tier | Kartu tier + hover | Pricing Comparison side-by-side |
| FAQ | Tidak ada | Tidak ada | FAQ accordion (≥6) |
| Social proof | Sederhana | Rating + metrik | Dipertahankan + polish |
| SEO | Belum | Belum | Title, meta, Open Graph, semantik |
| Aksesibilitas | Dasar | Dasar | Standar (alt, keyboard, focus, kontras, reduced motion) |
| Performa | Lazy dasar | Lazy + animasi ringan | Image/bundle/motion optimization |
| UI polish | Fungsional | Lebih konsisten | Final & kohesif |
| Section | 9 | 10 | 12 |
| Status | Dasar berfungsi | Menarik & meyakinkan | Production ready |

### Perkembangan Tiap Versi
- **v1 — Fondasi**: membangun landing publik yang berfungsi dengan 9 section dan
  routing anonim, reuse komponen, konsisten tema.
- **v2 — Engagement**: menghidupkan landing dengan animasi, gambaran produk
  (Dashboard Preview), data dengan fallback, dan social proof.
- **v3 — Finalisasi**: mematangkan menjadi produk profesional — optimasi konversi
  (Pricing Comparison, FAQ), SEO, aksesibilitas, performa, dan polish UI akhir.

---

## 13. Riwayat Revisi

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 24 Juni 2026 | PRD awal landing page. | Tim Pengembang |
| 2.0 | 24 Juni 2026 | Animasi, dynamic stats, dashboard preview, social proof. | Tim Pengembang |
| 3.0 | 24 Juni 2026 | Pricing comparison, FAQ, SEO, aksesibilitas, performa, polish final. | Tim Pengembang |

---

> PRD v3 adalah dokumen perencanaan finalisasi. Implementasi kode dikerjakan pada
> tahap berikutnya setelah PRD v3 disetujui.
