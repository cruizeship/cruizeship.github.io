import {useEffect} from "react";
import {flashDebugLog} from "../utils/flashDebug";

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function useGlobalScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const reveal = el => {
      if (el.classList.contains("is-visible")) {
        return;
      }
      el.classList.add("is-visible");
      flashDebugLog("scroll-reveal", "revealed-on-init", {
        el: el.className
      });
    };

    const revealInViewport = () => {
      document
        .querySelectorAll(".scroll-reveal:not(.is-visible)")
        .forEach(el => {
          if (isInViewport(el)) {
            reveal(el);
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
      if (prefersReducedMotion || isInViewport(el)) {
        reveal(el);
      } else {
        observer.observe(el);
      }
    });

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(revealInViewport, 100);
    };

    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);
}
