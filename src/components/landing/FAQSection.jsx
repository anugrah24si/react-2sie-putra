import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import Container from "../Container";
import { fadeInUp, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * FAQ Section - Gacor CRM
 * Daftar pertanyaan umum dirender dinamis dari array (map). Accordion
 * beraksesibilitas: tombol dengan aria-expanded/aria-controls, panel ber-region,
 * dapat dioperasikan via keyboard (tombol native menerima Enter/Space).
 */
const FAQS = [
    {
        question: "Apa itu Gacor CRM?",
        answer:
            "Gacor CRM adalah platform manajemen hubungan pelanggan untuk mengelola customer, produk, dan order dalam satu tempat, lengkap dengan sistem membership tier berbenefit diskon.",
    },
    {
        question: "Bagaimana cara mendaftar?",
        answer:
            "Klik tombol Daftar di pojok kanan atas atau pada bagian harga, isi data akun Anda, lalu Anda langsung dapat mulai sebagai member.",
    },
    {
        question: "Apakah data saya aman?",
        answer:
            "Ya. Autentikasi dan penyimpanan data ditangani oleh Supabase dengan kontrol akses berbasis peran (Row Level Security), sehingga data hanya dapat diakses sesuai hak Anda.",
    },
    {
        question: "Bagaimana sistem membership bekerja?",
        answer:
            "Tersedia empat tier: Bronze, Silver, Gold, dan Platinum. Semakin aktif berbelanja, semakin tinggi tier Anda dan semakin besar diskon otomatis yang didapat di setiap order.",
    },
    {
        question: "Apakah bisa digunakan di perangkat mobile?",
        answer:
            "Bisa. Antarmuka Gacor CRM responsif dan dioptimalkan untuk perangkat mobile, tablet, maupun desktop.",
    },
    {
        question: "Apakah ada biaya berlangganan?",
        answer:
            "Anda dapat memulai secara gratis di tier Bronze. Benefit tambahan diperoleh dengan naik tier melalui aktivitas belanja, tanpa biaya berlangganan tersembunyi.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);
    const reduced = useReducedMotion();

    const headerMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    function toggle(index) {
        setOpenIndex((current) => (current === index ? -1 : index));
    }

    return (
        <section id="faq" className="bg-white py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...headerMotion}>
                    <h2 className="font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Pertanyaan Umum
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Hal-hal yang sering ditanyakan sebelum bergabung dengan Gacor CRM.
                    </p>
                </motion.div>

                <div className="mx-auto max-w-3xl space-y-3">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;
                        const panelId = `faq-panel-${index}`;
                        const buttonId = `faq-button-${index}`;
                        return (
                            <div
                                key={faq.question}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                            >
                                <h3 className="m-0">
                                    <button
                                        type="button"
                                        id={buttonId}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggle(index)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-inset"
                                    >
                                        <span>{faq.question}</span>
                                        <FaChevronDown
                                            aria-hidden="true"
                                            className={`shrink-0 text-sm text-hijau transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </h3>
                                <AnimatePresence initial={false}>
                                    {isOpen ? (
                                        <motion.div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            initial={reduced ? false : { height: 0, opacity: 0 }}
                                            animate={reduced ? {} : { height: "auto", opacity: 1 }}
                                            exit={reduced ? {} : { height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
