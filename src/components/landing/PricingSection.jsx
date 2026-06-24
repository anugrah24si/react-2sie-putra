import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import Container from "../Container";
import { fadeInUp, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Pricing / Membership Comparison Section - Gacor CRM
 *
 * MELENGKAPI (bukan mengulang) Tier Section: jika Tier Section memperkenalkan tiap
 * tier dan diskonnya, bagian ini menyajikan MATRIKS PERBANDINGAN kapabilitas
 * berdampingan + rekomendasi "cocok untuk", agar pengguna mudah memutuskan.
 */
const TIERS = [
    { key: "bronze", name: "Bronze", discount: "0%", target: "Pengguna baru", highlight: false },
    { key: "silver", name: "Silver", discount: "5%", target: "Pelanggan reguler", highlight: false },
    { key: "gold", name: "Gold", discount: "10%", target: "Pelanggan loyal", highlight: true },
    { key: "platinum", name: "Platinum", discount: "15%", target: "Pelanggan premium", highlight: false },
];

// Baris kapabilitas yang dibandingkan antar-tier (true = tersedia).
const FEATURES_MATRIX = [
    { label: "Akses katalog & order", bronze: true, silver: true, gold: true, platinum: true },
    { label: "Riwayat order & profil", bronze: true, silver: true, gold: true, platinum: true },
    { label: "Diskon loyalitas otomatis", bronze: false, silver: true, gold: true, platinum: true },
    { label: "Prioritas dukungan", bronze: false, silver: true, gold: true, platinum: true },
    { label: "Penawaran eksklusif", bronze: false, silver: false, gold: true, platinum: true },
    { label: "Layanan premium", bronze: false, silver: false, gold: false, platinum: true },
];

function Cell({ available }) {
    return available ? (
        <span className="inline-flex text-hijau" aria-label="Termasuk">
            <FaCheck aria-hidden="true" />
        </span>
    ) : (
        <span className="inline-flex text-gray-300" aria-label="Tidak termasuk">
            <FaTimes aria-hidden="true" />
        </span>
    );
}

export default function PricingSection() {
    const reduced = useReducedMotion();
    const motionProps = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section id="pricing" className="bg-latar py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...motionProps}>
                    <h2 className="font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Bandingkan Tingkatan Membership
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Lihat perbedaan kapabilitas tiap tier secara berdampingan dan pilih
                        yang paling sesuai dengan kebutuhan Anda.
                    </p>
                </motion.div>

                <motion.div className="overflow-x-auto" {...motionProps}>
                    <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <caption className="sr-only">
                            Perbandingan kapabilitas membership tier Bronze, Silver, Gold, dan Platinum
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col" className="bg-gray-50 p-4 text-left text-sm font-semibold text-gray-500">
                                    Kapabilitas
                                </th>
                                {TIERS.map((tier) => (
                                    <th
                                        key={tier.key}
                                        scope="col"
                                        className={`p-4 text-center ${tier.highlight ? "bg-emerald-50" : "bg-gray-50"}`}
                                    >
                                        <span className="block font-barlow text-lg font-bold text-gray-900">
                                            {tier.name}
                                        </span>
                                        {tier.highlight ? (
                                            <span className="mt-1 inline-block rounded-full bg-hijau px-2 py-0.5 text-xs font-semibold text-white">
                                                Paling Populer
                                            </span>
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th scope="row" className="p-4 text-left text-sm font-medium text-gray-500">
                                    Diskon per order
                                </th>
                                {TIERS.map((tier) => (
                                    <td
                                        key={tier.key}
                                        className={`p-4 text-center font-barlow text-xl font-bold text-hijau ${tier.highlight ? "bg-emerald-50/50" : ""}`}
                                    >
                                        {tier.discount}
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {FEATURES_MATRIX.map((row) => (
                                <tr key={row.label} className="border-t border-gray-100">
                                    <th scope="row" className="border-t border-gray-100 p-4 text-left text-sm font-medium text-gray-700">
                                        {row.label}
                                    </th>
                                    {TIERS.map((tier) => (
                                        <td
                                            key={tier.key}
                                            className={`border-t border-gray-100 p-4 text-center ${tier.highlight ? "bg-emerald-50/50" : ""}`}
                                        >
                                            <Cell available={row[tier.key]} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="border-t border-gray-100">
                                <th scope="row" className="p-4 text-left text-sm font-medium text-gray-500">
                                    Cocok untuk
                                </th>
                                {TIERS.map((tier) => (
                                    <td
                                        key={tier.key}
                                        className={`p-4 text-center text-xs text-gray-600 ${tier.highlight ? "bg-emerald-50/50" : ""}`}
                                    >
                                        {tier.target}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </motion.div>

                <motion.div className="mt-8 text-center" {...motionProps}>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center rounded-xl bg-hijau px-7 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                    >
                        Mulai dari Bronze, Gratis
                    </Link>
                </motion.div>
            </Container>
        </section>
    );
}
