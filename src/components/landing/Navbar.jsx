import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

/**
 * Navbar Landing Page - Gacor CRM
 * Sticky navbar dengan menu anchor, tombol Masuk/Daftar, dan menu mobile beranimasi.
 */
const NAV_LINKS = [
    { label: "Fitur", href: "#features" },
    { label: "Tier", href: "#tier" },
    { label: "Harga", href: "#pricing" },
    { label: "Cara Kerja", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    function closeMenu() {
        setIsOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
            <nav className="container mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo / Brand */}
                <a href="#top" className="flex items-center gap-1" onClick={closeMenu}>
                    <span className="font-barlow text-2xl font-bold text-gray-900">
                        Gacor CRM
                    </span>
                    <span className="text-2xl font-bold text-hijau">.</span>
                </a>

                {/* Menu Desktop */}
                <div className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded text-sm font-medium text-gray-600 transition-colors hover:text-hijau focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Tombol Auth Desktop */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        to="/login"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-hijau focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                    >
                        Masuk
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-lg bg-hijau px-5 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau focus-visible:ring-offset-2"
                    >
                        Daftar
                    </Link>
                </div>

                {/* Tombol Hamburger Mobile (area sentuh lebih besar) */}
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
                    aria-label={isOpen ? "Tutup menu" : "Buka menu"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>

            {/* Menu Mobile beranimasi */}
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
                    >
                        <div className="flex flex-col gap-3 px-4 py-4">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-hijau"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="mt-2 flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="rounded-lg bg-hijau px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
                                >
                                    Daftar
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </header>
    );
}
