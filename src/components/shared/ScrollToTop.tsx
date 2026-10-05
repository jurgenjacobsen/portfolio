import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const behavior: ScrollBehavior = prefersReducedMotion ? "instant" : "smooth";

        if (hash) {
            const targetElement = document.getElementById(hash.replace("#", ""));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior });
                return;
            }
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior,
        });
    }, [pathname, hash]);

    return null;
}
