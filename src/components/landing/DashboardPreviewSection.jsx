import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import Container from "../Container";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Dashboard Preview Section - Gacor CRM
 *
 * Menampilkan MOCKUP statis yang merepresentasikan dashboard CRM sebenarnya,
 * agar pengunjung anonim memahami isi produk sebelum login. Data di bawah adalah
 * contoh statis (tidak menarik data dari API admin demi keamanan akses publik).
 */
const PREVIEW_STATS = [
    { icon: FaUsers, label: "Total Member", value: "128", accent: "bg-emerald-100 text-hijau" },
    { icon: FaBoxOpen, label: "Total Produk", value: "30", accent: "bg-blue-100 text-blue-600" },
    { icon: FaShoppingCart, label: "Total Order", value: "542", accent: "bg-amber-100 text-amber-600" },
    { icon: FaDollarSign, label: "Revenue", value: "Rp 24jt", accent: "bg-purple-100 text-purple-600" },
];

const TIER_DISTRIBUTION = [
    { name: "Bronze", count: 64, color: "bg-orange-400", percent: 50 },
    { name: "Silver", count: 38, color: "bg-slate-400", percent: 30 },
    { name: "Gold", count: 19, color: "bg-amber-400", percent: 15 },
    { name: "Platinum", count: 7, color: "bg-indigo-400", percent: 5 },
];

const RECENT_ORDERS = [
    { id: "#1042", member: "Rina W.", total: "Rp 450.000", status: "Completed", tone: "bg-emerald-100 text-emerald-700" },
    { id: "#1041", member: "Budi S.", total: "Rp 125.000", status: "Pending", tone: "bg-amber-100 text-amber-700" },
    { id: "#1040", member: "Sari A.", total: "Rp 310.000", status: "Completed", tone: "bg-emerald-100 text-emerald-700" },
    { id: "#1039", member: "Toni H.", total: "Rp 85.000", status: "Processing", tone: "bg-blue-100 text-blue-700" },
];

export default function DashboardPreviewSection() {
    const reduced = useReducedMotion();
    const headerMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const windowMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const statsMotion = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section className="bg-white py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...headerMotion}>
                    <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-hijau">
                        Lihat Sebelum Daftar
                    </span>
                    <h2 className="mt-4 font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Gambaran Dashboard CRM
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Antarmuka yang bersih untuk memantau member, produk, order, dan
                        performa bisnis Anda secara real-time.
                    </p>
                </motion.div>

                {/* Mockup window */}
                <motion.div
                    className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-2xl"
                    {...windowMotion}
                >
                    {/* Title bar */}
                    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-5 py-3">
                        <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
                        <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden="true" />
                        <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span className="ml-3 text-xs text-gray-400">
                            app.gacorcrm.com/dashboard
                        </span>
                    </div>

                    <div className="p-5 md:p-7">
                        {/* Stat cards */}
                        <motion.div className="grid grid-cols-2 gap-3 lg:grid-cols-4" {...statsMotion}>
                            {PREVIEW_STATS.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        variants={reduced ? undefined : staggerItem}
                                        className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                    >
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${stat.accent}`}>
                                            <Icon aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p className="font-barlow text-xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-gray-500">{stat.label}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Grid: Recent Orders + Tier distribution */}
                        <div className="mt-5 grid gap-5 lg:grid-cols-3">
                            {/* Recent Orders */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
                                <h3 className="mb-4 font-barlow text-lg font-bold text-gray-900">
                                    Recent Orders
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                                                <th scope="col" className="pb-2 font-semibold">Order ID</th>
                                                <th scope="col" className="pb-2 font-semibold">Member</th>
                                                <th scope="col" className="pb-2 font-semibold">Total</th>
                                                <th scope="col" className="pb-2 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {RECENT_ORDERS.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                                                    <td className="py-3 font-medium text-gray-700">{order.id}</td>
                                                    <td className="py-3 text-gray-600">{order.member}</td>
                                                    <td className="py-3 text-gray-700">{order.total}</td>
                                                    <td className="py-3">
                                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.tone}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Membership Tier distribution */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-5">
                                <h3 className="mb-4 font-barlow text-lg font-bold text-gray-900">
                                    Membership Tier
                                </h3>
                                <div className="space-y-4">
                                    {TIER_DISTRIBUTION.map((tier) => (
                                        <div key={tier.name}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="font-medium text-gray-700">{tier.name}</span>
                                                <span className="text-gray-500">{tier.count} member</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full rounded-full ${tier.color}`}
                                                    style={{ width: `${tier.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
