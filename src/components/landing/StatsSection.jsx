import { motion } from "framer-motion";
import Container from "../Container";
import { staggerContainer, staggerItem, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Stats Section - Gacor CRM
 *
 * KEBIJAKAN DATA (PRD v2/v3):
 * Landing Page bersifat PUBLIK (anonim). dashboardAPI.fetchAdminDashboard() butuh
 * akses data admin yang dilindungi RLS Supabase, sehingga TIDAK dipaksakan dipanggil
 * di sini. FALLBACK_STATS dipakai sebagai SUMBER UTAMA agar landing tetap tampil
 * cepat, aman, dan tanpa error untuk pengunjung anonim.
 *
 * INTEGRASI MASA DEPAN:
 * Jika nanti tersedia endpoint statistik publik (mis. RPC/aggregate yang aman untuk
 * anonim), nilai pada FALLBACK_STATS dapat diganti dengan data dari endpoint tersebut
 * tanpa mengubah struktur tampilan di bawah.
 */
const FALLBACK_STATS = [
    { value: "30+", label: "Produk Tersedia" },
    { value: "128", label: "Member Aktif" },
    { value: "542", label: "Order Diproses" },
    { value: "4", label: "Tingkatan Tier" },
];

export default function StatsSection() {
    const stats = FALLBACK_STATS;
    const reduced = useReducedMotion();
    const motionProps = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section className="border-y border-gray-100 bg-white py-14">
            <motion.div {...motionProps}>
                <Container className="grid grid-cols-2 gap-6 py-0 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={reduced ? undefined : staggerItem}
                            className="text-center"
                        >
                            <p className="font-barlow text-3xl font-bold text-hijau md:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </Container>
            </motion.div>
        </section>
    );
}
