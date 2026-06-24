import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../Container";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Membership Tier Section - Gacor CRM
 * Memperkenalkan tiap tier (Bronze/Silver/Gold/Platinum) beserta benefit utamanya.
 * Perbandingan kapabilitas berdampingan ada di PricingSection (komplementer).
 */
const TIERS = [
    {
        name: "Bronze",
        discount: "0%",
        accent: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
        highlight: false,
        perks: ["Akses katalog produk", "Riwayat order", "Profil member"],
    },
    {
        name: "Silver",
        discount: "5%",
        accent: "text-slate-600",
        badge: "bg-slate-100 text-slate-600",
        highlight: false,
        perks: ["Semua benefit Bronze", "Diskon 5% setiap order", "Prioritas dukungan"],
    },
    {
        name: "Gold",
        discount: "10%",
        accent: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
        highlight: true,
        perks: ["Semua benefit Silver", "Diskon 10% setiap order", "Penawaran eksklusif"],
    },
    {
        name: "Platinum",
        discount: "15%",
        accent: "text-indigo-600",
        badge: "bg-indigo-100 text-indigo-700",
        highlight: false,
        perks: ["Semua benefit Gold", "Diskon 15% setiap order", "Layanan premium"],
    },
];

export default function TierSection() {
    const reduced = useReducedMotion();
    const headerMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const gridMotion = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section id="tier" className="bg-white py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...headerMotion}>
                    <h2 className="font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Tingkatan Membership
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Semakin aktif berbelanja, semakin besar diskon yang Anda dapatkan.
                        Naik tier secara otomatis dan nikmati benefitnya.
                    </p>
                </motion.div>

                <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" {...gridMotion}>
                    {TIERS.map((tier) => (
                        <motion.div
                            key={tier.name}
                            variants={reduced ? undefined : staggerItem}
                            whileHover={reduced ? undefined : { y: -6 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`rounded-xl border bg-white p-6 shadow transition-shadow hover:shadow-lg ${tier.highlight ? "border-hijau ring-2 ring-hijau" : "border-gray-100"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tier.badge}`}>
                                    {tier.name}
                                </span>
                                {tier.highlight ? (
                                    <span className="rounded-full bg-hijau px-3 py-1 text-xs font-semibold text-white">
                                        Populer
                                    </span>
                                ) : null}
                            </div>

                            <p className="mt-5 font-barlow text-4xl font-bold text-gray-900">
                                {tier.discount}
                            </p>
                            <p className={`text-sm font-medium ${tier.accent}`}>
                                Diskon per order
                            </p>

                            <ul className="mt-5 space-y-2">
                                {tier.perks.map((perk) => (
                                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="mt-0.5 text-hijau" aria-hidden="true">✓</span>
                                        <span>{perk}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/register"
                                className="mt-6 block rounded-lg bg-hijau py-2.5 text-center text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                            >
                                Daftar
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}
