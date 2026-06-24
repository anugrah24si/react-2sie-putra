import { useEffect, useState } from "react";

/**
 * useReducedMotion - Gacor CRM Landing Page
 *
 * Mendeteksi preferensi sistem `prefers-reduced-motion`. Jika pengguna memilih
 * untuk mengurangi gerakan, animasi Framer Motion diredam demi aksesibilitas
 * (WCAG 2.3.3) dan kenyamanan. Ringan: hanya satu media query listener.
 */
export default function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);

        const handler = (event) => setReduced(event.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return reduced;
}
