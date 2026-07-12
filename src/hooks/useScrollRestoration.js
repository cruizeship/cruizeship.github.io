import {useLayoutEffect} from "react";

const SCROLL_KEY = "__luminaScrollY";
const BOTTOM_THRESHOLD_PX = 100;

function getMaxScrollY() {
  const doc = document.documentElement;
  return Math.max(0, doc.scrollHeight - window.innerHeight);
}

function saveScrollPosition() {
  try {
    sessionStorage.setItem(
      SCROLL_KEY,
      JSON.stringify({
        y: window.scrollY || 0,
        maxY: getMaxScrollY()
      })
    );
  } catch (error) {
    // private mode / quota — ignore
  }
}

function readSavedScrollPosition() {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (raw == null) {
      return null;
    }

    // Legacy: bare number
    if (raw[0] !== "{") {
      const y = Number(raw);
      return Number.isFinite(y) && y >= 0 ? {y, maxY: null} : null;
    }

    const parsed = JSON.parse(raw);
    const y = Number(parsed.y);
    const maxY = parsed.maxY == null ? null : Number(parsed.maxY);
    if (!Number.isFinite(y) || y < 0) {
      return null;
    }
    return {
      y,
      maxY: Number.isFinite(maxY) ? maxY : null
    };
  } catch (error) {
    return null;
  }
}

/**
 * One-shot manual scroll restore. No timeout reasserts — layout above must not
 * grow after paint (see polaroid aspect-ratio / contribution min-height).
 */
export function useScrollRestoration() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let saveTimer = 0;
    const onScrollSave = () => {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(saveScrollPosition, 100);
    };

    window.addEventListener("scroll", onScrollSave, {passive: true});
    window.addEventListener("pagehide", saveScrollPosition);
    window.addEventListener("beforeunload", saveScrollPosition);

    if (!window.location.hash) {
      const saved = readSavedScrollPosition();
      if (saved && saved.y > 0) {
        const maxAtStart = getMaxScrollY();
        const nearBottom =
          saved.maxY != null && saved.y >= saved.maxY - BOTTOM_THRESHOLD_PX;
        const target = nearBottom
          ? maxAtStart
          : Math.min(saved.y, maxAtStart);
        window.scrollTo(0, target);
      }
    }

    return () => {
      window.clearTimeout(saveTimer);
      window.removeEventListener("scroll", onScrollSave);
      window.removeEventListener("pagehide", saveScrollPosition);
      window.removeEventListener("beforeunload", saveScrollPosition);
    };
  }, []);
}
