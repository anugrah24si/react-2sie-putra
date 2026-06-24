import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Container from "../Container";
import { staggerContainer, staggerItem, fadeInUp } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * Hero Section - Gacor CRM
 * Headline (satu-satunya h1), subheadline, dan CTA utama dengan entrance animation
 * yang menghormati prefers-reduced-motion.
 */
export default function HeroSection() {
    const reduced = useReducedMotion();
    const containerMotion = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", animate: "visible" };
    const itemMotion = reduced ? {} : { variants: staggerItem };
    const visualMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", animate: "visible" };

    return (
        <section id="top" className="bg-gradient-to-b from-emerald-50/60 to-white py-20">
            <Container className="grid items-center gap-10 py-0 lg:grid-cols-2">
                {/* Teks */}
                <motion.div className="text-center lg:text-left" {...containerMotion}>
                    <motion.span
                        {...itemMotion}
                        className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-hijau"
                    >
                        Platform CRM Modern
                    </motion.span>
                    <motion.h1
                        {...itemMotion}
                        className="mt-5 font-barlow text-4xl font-bold leading-tight text-gray-900 md:text-5xl"
                    >
                        Kelola Customer, Produk & Order dalam Satu Platform CRM
                    </motion.h1>
                    <motion.p
                        {...itemMotion}
                        className="mx-auto mt-5 max-w-xl text-lg text-gray-600 lg:mx-0"
                    >
                        Gacor CRM membantu bisnis Anda mengelola pelanggan, produk, dan
                        transaksi sekaligus memberikan benefit tier loyalitas untuk
                        meningkatkan retensi.
                    </motion.p>
                    <motion.div
                        {...itemMotion}
                        className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
                    >
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-hijau px-7 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                        >
                            Mulai Gratis <FaArrowRight aria-hidden="true" />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-7 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                        >
                            Pelajari Fitur
                        </a>
                    </motion.div>
                </motion.div>

                {/* Visual */}
                <motion.div className="flex justify-center" {...visualMotion}>
                    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-barlow text-lg font-bold text-gray-900">
                                Dashboard
                            </span>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-hijau">
                                Live
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-emerald-50 p-4">
                                <p className="text-2xl font-bold text-hijau">128</p>
                                <p className="text-xs text-gray-500">Total Member</p>
                            </div>
                            <div className="rounded-2xl bg-blue-50 p-4">
                                <p className="text-2xl font-bold text-blue-600">542</p>
                                <p className="text-xs text-gray-500">Total Order</p>
                            </div>
                            <div className="rounded-2xl bg-amber-50 p-4">
                                <p className="text-2xl font-bold text-amber-600">30</p>
                                <p className="text-xs text-gray-500">Produk</p>
                            </div>
                            <div className="rounded-2xl bg-purple-50 p-4">
                                <p className="text-2xl font-bold text-purple-600">4</p>
                                <p className="text-xs text-gray-500">Tier</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
