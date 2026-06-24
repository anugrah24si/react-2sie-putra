import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Container from "../Container";
import { fadeInUp, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * CTA Section - Gacor CRM
 * Ajakan akhir untuk mendaftar dengan reveal + emphasis hover, menghormati
 * prefers-reduced-motion.
 */
export default function CTASection() {
    const reduced = useReducedMotion();
    const cardMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const buttonMotion = reduced ? {} : { whileHover: { scale: 1.05 } };

    return (
        <section className="bg-latar py-20">
            <Container className="py-0">
                <motion.div
                    className="rounded-3xl bg-gradient-to-r from-hijau to-emerald-500 px-8 py-14 text-center shadow-xl"
                    {...cardMotion}
                >
                    <h2 className="font-barlow text-3xl font-bold text-white md:text-4xl">
                        Siap meningkatkan bisnis Anda?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-emerald-50">
                        Bergabung dengan Gacor CRM sekarang dan kelola pelanggan, produk,
                        serta order Anda dengan lebih efisien.
                    </p>
                    <motion.div
                        className="mt-8 inline-block"
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        {...buttonMotion}
                    >
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-hijau shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hijau"
                        >
                            Daftar Sekarang <FaArrowRight aria-hidden="true" />
                        </Link>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}
