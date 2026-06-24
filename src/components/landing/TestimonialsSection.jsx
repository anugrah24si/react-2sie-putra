import { motion } from "framer-motion";
import { FaStar, FaUsers, FaShieldAlt, FaSmile } from "react-icons/fa";
import Container from "../Container";
import Avatar from "../Avatar";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Testimonials Section - Gacor CRM
 * Testimoni profesional (rating bintang) + baris social proof, menghormati
 * prefers-reduced-motion.
 */
const TESTIMONIALS = [
    {
        name: "Rina Wulandari",
        role: "Member Gold",
        rating: 5,
        quote:
            "Sejak pakai Gacor CRM, belanja jadi lebih hemat. Diskon tier-nya benar-benar terasa di setiap order.",
    },
    {
        name: "Budi Santoso",
        role: "Pemilik Bisnis",
        rating: 5,
        quote:
            "Mengelola customer, produk, dan order jadi satu tempat. Dashboard analytics-nya sangat membantu mengambil keputusan.",
    },
    {
        name: "Sari Amelia",
        role: "Member Silver",
        rating: 4,
        quote:
            "Tampilannya bersih dan mudah dipakai. Proses daftar dan buat order cepat, tidak ribet.",
    },
];

// Baris social proof (metrik kepercayaan)
const SOCIAL_PROOF = [
    { icon: FaUsers, value: "120+", label: "Member Aktif" },
    { icon: FaStar, value: "4.8/5", label: "Rating Pengguna" },
    { icon: FaShieldAlt, value: "100%", label: "Data Aman" },
    { icon: FaSmile, value: "95%", label: "Kepuasan" },
];

export default function TestimonialsSection() {
    const reduced = useReducedMotion();
    const headerMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const gridMotion = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const proofMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section className="bg-white py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...headerMotion}>
                    <h2 className="font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Apa Kata Pengguna
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Cerita dari mereka yang sudah merasakan manfaat Gacor CRM.
                    </p>
                </motion.div>

                {/* Kartu testimoni */}
                <motion.div className="grid gap-6 md:grid-cols-3" {...gridMotion}>
                    {TESTIMONIALS.map((item) => (
                        <motion.div
                            key={item.name}
                            variants={reduced ? undefined : staggerItem}
                            whileHover={reduced ? undefined : { y: -6 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="rounded-xl border border-gray-100 bg-white p-6 shadow transition-shadow hover:shadow-lg"
                        >
                            {/* Rating bintang */}
                            <div className="mb-3 flex gap-1" aria-label={`Rating ${item.rating} dari 5`}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                        key={i}
                                        aria-hidden="true"
                                        className={i < item.rating ? "text-amber-400" : "text-gray-200"}
                                    />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-600">
                                &ldquo;{item.quote}&rdquo;
                            </p>
                            <div className="mt-5 flex items-center gap-3">
                                <Avatar name={item.name} />
                                <div>
                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Social proof bar */}
                <motion.div
                    className="mt-12 grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-latar p-8 lg:grid-cols-4"
                    {...proofMotion}
                >
                    {SOCIAL_PROOF.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex flex-col items-center text-center">
                                <Icon className="mb-2 text-2xl text-hijau" aria-hidden="true" />
                                <p className="font-barlow text-2xl font-bold text-gray-900">
                                    {item.value}
                                </p>
                                <p className="text-xs text-gray-500">{item.label}</p>
                            </div>
                        );
                    })}
                </motion.div>
            </Container>
        </section>
    );
}
