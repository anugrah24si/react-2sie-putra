import { motion } from "framer-motion";
import { FaUserPlus, FaShoppingBag, FaGift } from "react-icons/fa";
import Container from "../Container";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motionVariants";
import useReducedMotion from "./useReducedMotion";

/**
 * How It Works Section - Gacor CRM
 * 3 langkah: Daftar -> Belanja -> Dapat Benefit, dengan reveal bertahap yang
 * menghormati prefers-reduced-motion.
 */
const STEPS = [
    {
        icon: FaUserPlus,
        step: "1",
        title: "Daftar Akun",
        description: "Buat akun member gratis hanya dalam beberapa langkah.",
    },
    {
        icon: FaShoppingBag,
        step: "2",
        title: "Belanja Produk",
        description: "Jelajahi katalog produk dan buat order dengan mudah.",
    },
    {
        icon: FaGift,
        step: "3",
        title: "Dapat Benefit Tier",
        description: "Kumpulkan poin, naik tier, dan nikmati diskon loyalitas.",
    },
];

export default function HowItWorksSection() {
    const reduced = useReducedMotion();
    const headerMotion = reduced
        ? {}
        : { variants: fadeInUp, initial: "hidden", whileInView: "visible", viewport: viewportOnce };
    const gridMotion = reduced
        ? {}
        : { variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport: viewportOnce };

    return (
        <section id="how-it-works" className="bg-latar py-20">
            <Container className="py-0">
                <motion.div className="mx-auto mb-12 max-w-2xl text-center" {...headerMotion}>
                    <h2 className="font-barlow text-3xl font-bold text-gray-900 md:text-4xl">
                        Cara Kerja
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Mulai menggunakan Gacor CRM hanya dalam tiga langkah sederhana.
                    </p>
                </motion.div>

                <motion.div className="grid gap-6 md:grid-cols-3" {...gridMotion}>
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.step}
                                variants={reduced ? undefined : staggerItem}
                                className="relative rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
                            >
                                <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-hijau text-sm font-bold text-white">
                                    {step.step}
                                </div>
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-hijau">
                                    <Icon aria-hidden="true" />
                                </div>
                                <h3 className="mb-2 font-barlow text-xl font-bold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </section>
    );
}
