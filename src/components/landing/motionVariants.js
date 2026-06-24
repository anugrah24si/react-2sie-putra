/**
 * Motion Variants - Gacor CRM Landing Page
 *
 * Kumpulan varian animasi Framer Motion yang reusable agar konsisten di semua
 * section. Animasi sengaja dibuat RINGAN (durasi pendek, easing halus, jarak
 * pergerakan kecil) agar tidak mengganggu performa dan tetap nyaman dibaca.
 */

// Fade-in dari bawah (untuk heading, teks, kartu)
export const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// Fade-in sederhana (tanpa pergerakan)
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// Container untuk efek stagger pada anak-anaknya
export const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};

// Item di dalam staggerContainer
export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

// Konfigurasi viewport standar: animasi reveal hanya sekali saat masuk layar
export const viewportOnce = { once: true, amount: 0.2 };

// Efek hover ringan untuk kartu (elevasi halus)
export const cardHover = {
    rest: { y: 0 },
    hover: {
        y: -6,
        transition: { duration: 0.2, ease: "easeOut" },
    },
};
