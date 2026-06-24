import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaCrown, FaChartLine } from "react-icons/fa";
import Container from "../Container";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Features Section - Gacor CRM
 * Menampilkan 5 modul inti CRM dengan scroll reveal + hover effect, menghormati
 * prefers-reduced-motion.
 */
const FEATURES = [
    {
        icon: FaUsers,
        title: "Customer Management",
        description:
            "Kelola data pelanggan secara terpusat: profil, kontak, dan riwayat aktivitas dalam satu tempat.",
    },
    {
        icon: FaBoxOpen,
        title: "Product Management",
        description:
            "CRUD produk lengkap dengan kategori, harga, stok, dan soft delete agar data tetap aman.",
    },
    {
        icon: FaShoppingCart,
        title: "Order Management",
        description:
            "Catat dan pantau order beserta itemnya, lengkap dengan status dari pending hingga selesai.",
    },
    {
        icon: FaCrown,
        title: "Membership Tier",
        description:
            "Sistem tier Bronze, Silver, Gold, dan Platinum dengan diskon otomatis untuk loyalitas member.",
    },
    {
        icon: FaChartLine,
        title: "Dashboard Analytics",
        description:
            "Ringkasan statistik untuk admin dan member: total order, revenue, dan distribusi tier.",
    },
];

export default function FeaturesSection() {
    const reduced = useReducedMotion();
    const headerMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const gridMotion = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section id="features" className="bg-latar py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...headerMotion}>
                    <h2 className="font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Fitur Unggulan
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Semua yang Anda butuhkan untuk mengelola hubungan pelanggan dalam
                        satu platform CRM yang terintegrasi.
                    </p>
                </motion.div>

                <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...gridMotion}>
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                variants={reduced ? undefined : staggerItem}
                                whileHover={reduced ? undefined : { y: -6 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="rounded-xl border border-gray-100 bg-white p-6 shadow transition-shadow hover:shadow-lg"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl text-hijau">
                                    <Icon aria-hidden="true" />
                                </div>
                                <h3 className="mb-2 font-barlow text-xl font-bold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </section>
    );
}
