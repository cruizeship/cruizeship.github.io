import {useEffect} from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const onClick = event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const id = decodeURIComponent(href.slice(1));
      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
