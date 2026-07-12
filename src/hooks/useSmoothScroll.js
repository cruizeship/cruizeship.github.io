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

      // Keep URL hashless so reload uses sessionStorage scroll restore
      // instead of the browser's native #section jump.
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", cleanUrl);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
