import {useLayoutEffect} from "react";

const QUERY_FLAG = "scrollDebug";
const STORAGE_KEY = "scrollDebug";

const SECTION_SELECTORS = [
  [".lumina-hero-screen", "heroScreen"],
  ["#greeting", "greeting"],
  ["#experience", "experience"],
  ["#projects", "projects"],
  ["#articles", "articles"],
  ["#about", "about"],
  [".polaroid-canvas", "polaroidCanvas"],
  [".misc-contributions", "contributions"],
  [".lumina-blogs-grid", "blogsGrid"],
  ["footer", "footer"]
];

function isDevEnvironment() {
  if (typeof window === "undefined") {
    return false;
  }

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function isScrollDebugEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  if (isDevEnvironment()) {
    return true;
  }

  if (window.localStorage.getItem(STORAGE_KEY) === "1") {
    return true;
  }

  return new URLSearchParams(window.location.search).has(QUERY_FLAG);
}

function now() {
  return performance.now().toFixed(1);
}

function getMaxScrollY() {
  const doc = document.documentElement;
  return Math.max(0, doc.scrollHeight - window.innerHeight);
}

function measureSections() {
  const measures = {};
  SECTION_SELECTORS.forEach(([selector, key]) => {
    const el = document.querySelector(selector);
    if (!el) {
      measures[key] = null;
      return;
    }
    const rect = el.getBoundingClientRect();
    measures[key] = {
      height: Math.round(el.offsetHeight),
      top: Math.round(rect.top + window.scrollY),
      scrollHeight: Math.round(el.scrollHeight)
    };
  });
  return measures;
}

function readScroll() {
  const doc = document.documentElement;
  const body = document.body;
  const scrollHeight = doc ? doc.scrollHeight : null;
  const clientHeight = doc ? doc.clientHeight : null;
  const innerHeight = window.innerHeight;
  const maxScrollY = getMaxScrollY();

  return {
    pageYOffset: window.pageYOffset,
    scrollY: window.scrollY,
    scrollX: window.scrollX,
    docScrollTop: doc ? doc.scrollTop : null,
    bodyScrollTop: body ? body.scrollTop : null,
    scrollHeight,
    bodyScrollHeight: body ? body.scrollHeight : null,
    clientHeight,
    offsetHeight: doc ? doc.offsetHeight : null,
    innerHeight,
    outerHeight: window.outerHeight,
    visualViewportHeight:
      window.visualViewport && window.visualViewport.height
        ? Math.round(window.visualViewport.height)
        : null,
    maxScrollY,
    scrollRestoration: window.history.scrollRestoration,
    hash: window.location.hash || "(none)",
    readyState: document.readyState,
    hiddenReveal: document.querySelectorAll(
      ".scroll-reveal:not(.is-visible)"
    ).length,
    visibleReveal: document.querySelectorAll(".scroll-reveal.is-visible")
      .length
  };
}

function scrollDebugLog(event, data = {}) {
  if (!isScrollDebugEnabled()) {
    return;
  }

  console.log(`[scroll-debug] ${event}`, {
    ts: now(),
    ...readScroll(),
    ...data
  });
}

function scrollDebugWarn(event, data = {}) {
  if (!isScrollDebugEnabled()) {
    return;
  }

  console.warn(`[scroll-debug] ${event}`, {
    ts: now(),
    ...readScroll(),
    ...data
  });
}

function diffSections(prev, next) {
  if (!prev) {
    return null;
  }
  const changes = {};
  Object.keys(next).forEach(key => {
    const a = prev[key];
    const b = next[key];
    if (!a && !b) {
      return;
    }
    if (!a || !b) {
      changes[key] = {from: a, to: b};
      return;
    }
    const dH = b.height - a.height;
    if (Math.abs(dH) >= 1) {
      changes[key] = {
        heightFrom: a.height,
        heightTo: b.height,
        delta: dH
      };
    }
  });
  return Object.keys(changes).length ? changes : null;
}

/**
 * Logs scroll position + document height metrics so maxScrollY shrinks are attributable.
 * On in development by default; elsewhere enable with ?scrollDebug or localStorage.scrollDebug=1.
 */
export function useScrollReloadDebug() {
  useLayoutEffect(() => {
    if (!isScrollDebugEnabled()) {
      return undefined;
    }

    let lastY = window.scrollY;
    let userScrolled = false;
    const bootY = window.scrollY;
    let lastMaxScrollY = getMaxScrollY();
    let lastScrollHeight = document.documentElement.scrollHeight;
    let lastInnerHeight = window.innerHeight;
    let lastSections = measureSections();

    scrollDebugLog("layout-mount", {
      bootY,
      sections: lastSections
    });

    const checkDocumentHeight = reason => {
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const maxScrollY = getMaxScrollY();
      const sections = measureSections();
      const sectionDiff = diffSections(lastSections, sections);

      const heightDelta = scrollHeight - lastScrollHeight;
      const maxDelta = maxScrollY - lastMaxScrollY;
      const innerDelta = innerHeight - lastInnerHeight;

      if (heightDelta !== 0 || maxDelta !== 0 || innerDelta !== 0) {
        const payload = {
          reason,
          scrollHeightFrom: lastScrollHeight,
          scrollHeightTo: scrollHeight,
          scrollHeightDelta: heightDelta,
          maxScrollYFrom: lastMaxScrollY,
          maxScrollYTo: maxScrollY,
          maxScrollYDelta: maxDelta,
          innerHeightFrom: lastInnerHeight,
          innerHeightTo: innerHeight,
          innerHeightDelta: innerDelta,
          windowSizeChanged: innerDelta !== 0,
          sectionChanges: sectionDiff
        };

        if (maxDelta < -1 && innerDelta === 0) {
          scrollDebugWarn("maxScrollY-shrunk", payload);
        } else if (heightDelta < -1 && innerDelta === 0) {
          scrollDebugWarn("scrollHeight-shrunk", payload);
        } else {
          scrollDebugLog("document-height-change", payload);
        }
      }

      lastScrollHeight = scrollHeight;
      lastMaxScrollY = maxScrollY;
      lastInnerHeight = innerHeight;
      lastSections = sections;
    };

    const noteJump = (event, y) => {
      checkDocumentHeight(`before:${event}`);
      const delta = y - lastY;
      const maxScrollY = getMaxScrollY();
      if (Math.abs(delta) >= 8 && !userScrolled) {
        scrollDebugWarn("unexpected-scroll-jump", {
          event,
          from: lastY,
          to: y,
          delta,
          maxScrollY,
          clampedToMax: y >= maxScrollY - 1 && lastY > y,
          sections: measureSections()
        });
      } else {
        scrollDebugLog(event, {from: lastY, to: y, delta, maxScrollY});
      }
      lastY = y;
    };

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      noteJump("raf-1", window.scrollY);
      raf2 = requestAnimationFrame(() => {
        noteJump("raf-2", window.scrollY);
      });
    });

    // Watch document + key sections for size changes without relying on scroll events
    const resizeObservers = [];
    if (typeof ResizeObserver !== "undefined") {
      const onResize = entries => {
        const targets = entries.map(entry => {
          const el = entry.target;
          return el.id
            ? `#${el.id}`
            : el.className && typeof el.className === "string"
              ? `.${el.className.split(" ").filter(Boolean).slice(0, 2).join(".")}`
              : el.tagName;
        });
        checkDocumentHeight(`ResizeObserver:${targets.join(",")}`);
      };

      const docObserver = new ResizeObserver(onResize);
      docObserver.observe(document.documentElement);
      if (document.body) {
        docObserver.observe(document.body);
      }
      resizeObservers.push(docObserver);

      const sectionObserver = new ResizeObserver(onResize);
      SECTION_SELECTORS.forEach(([selector]) => {
        const el = document.querySelector(selector);
        if (el) {
          sectionObserver.observe(el);
        }
      });
      resizeObservers.push(sectionObserver);
    }

    const mutationObserver = new MutationObserver(() => {
      checkDocumentHeight("MutationObserver");
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden"]
    });

    const onPageShow = e => {
      noteJump("pageshow", window.scrollY);
      checkDocumentHeight("pageshow");
      if (e.persisted) {
        scrollDebugWarn("pageshow-bfcache", {persisted: true});
      }
    };

    const onLoad = () => {
      noteJump("window-load", window.scrollY);
      checkDocumentHeight("window-load");
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (performance.now() < 1500 && !userScrolled) {
        noteJump("scroll-event-early", y);
      } else {
        userScrolled = true;
        checkDocumentHeight("scroll-user");
        scrollDebugLog("scroll-event-user", {from: lastY, to: y});
        lastY = y;
      }
    };

    const onHashChange = () => {
      noteJump("hashchange", window.scrollY);
    };

    const lateTimers = [0, 50, 100, 250, 500, 1000].map(ms =>
      window.setTimeout(() => {
        checkDocumentHeight(`timeout-${ms}ms`);
        const y = window.scrollY;
        if (y !== lastY && !userScrolled) {
          noteJump(`timeout-${ms}ms`, y);
        } else {
          scrollDebugLog(`timeout-${ms}ms`, {
            y,
            unchanged: y === lastY,
            maxScrollY: getMaxScrollY()
          });
        }

        if (ms === 1000 && bootY === 0 && y > 50 && !userScrolled) {
          scrollDebugWarn("restored-away-from-top", {bootY, y});
        }
        if (ms === 1000 && bootY > 50 && y < 8 && !userScrolled) {
          scrollDebugWarn("jumped-to-top-after-boot", {bootY, y});
        }
      }, ms)
    );

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("load", onLoad);
    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      lateTimers.forEach(id => window.clearTimeout(id));
      resizeObservers.forEach(observer => observer.disconnect());
      mutationObserver.disconnect();
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);
}
