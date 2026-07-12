import {useEffect} from "react";

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

/**
 * Fade/translate reveal after assets are ready and after first paint, so reload
 * mid-page still plays the enter animation for in-view sections.
 */
export function useGlobalScrollReveal(assetsReady = true) {
  useEffect(() => {
    if (!assetsReady) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const reveal = el => {
      if (el.classList.contains("is-visible")) {
        return;
      }
      el.classList.add("is-visible");
    };

    const revealInViewport = () => {
      document
        .querySelectorAll(".scroll-reveal:not(.is-visible)")
        .forEach(el => {
          if (prefersReducedMotion || isInViewport(el)) {
            reveal(el);
            observer.unobserve(el);
          }
        });
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.08, rootMargin: "0px 0px -4% 0px"}
    );

    document.querySelectorAll(".scroll-reveal:not(.is-visible)").forEach(el => {
      if (prefersReducedMotion) {
        reveal(el);
      } else {
        observer.observe(el);
      }
    });

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(revealInViewport);
    });

    const onPageShow = () => {
      revealInViewport();
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(revealInViewport, 100);
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(resizeTimer);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [assetsReady]);
}
