const QUERY_FLAG = "flashDebug";
const STORAGE_KEY = "flashDebug";

function isEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  // Opt-in only — not auto-enabled in development
  if (window.localStorage.getItem(STORAGE_KEY) === "1") {
    return true;
  }

  return new URLSearchParams(window.location.search).has(QUERY_FLAG);
}

function now() {
  return performance.now().toFixed(1);
}

function viewport() {
  return {
    vw: window.innerWidth,
    vh: window.innerHeight,
    dpr: window.devicePixelRatio
  };
}

function parseRgb(color) {
  if (!color || color === "transparent") {
    return null;
  }

  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) {
    return null;
  }

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3])
  };
}

function isLightColor(color) {
  const rgb = parseRgb(color);
  if (!rgb) {
    return false;
  }

  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance > 0.85;
}

function describeElement(node) {
  if (!node) {
    return "null";
  }

  if (node === document.documentElement) {
    return "html";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    const name = node.nodeName ? node.nodeName.toLowerCase() : "unknown-node";
    return `#${name}`;
  }

  const el = node;
  const tag = el.tagName ? el.tagName.toLowerCase() : "unknown";
  const id = el.id ? `#${el.id}` : "";
  const classes =
    el.classList && el.classList.length
      ? `.${[...el.classList].slice(0, 4).join(".")}`
      : "";

  return `${tag}${id}${classes}`;
}

function formatRect(rect) {
  if (!rect) {
    return "null";
  }

  return `{x:${Math.round(rect.x)},y:${Math.round(rect.y)},w:${Math.round(
    rect.width
  )},h:${Math.round(rect.height)}}`;
}

function describeLayoutShiftSource(source) {
  if (!source) {
    return null;
  }

  let nodeLabel = null;
  try {
    nodeLabel = source.node ? describeElement(source.node) : null;
  } catch (error) {
    nodeLabel = `error:${error.message}`;
  }

  return {
    node: nodeLabel,
    previousRect: formatRect(source.previousRect),
    currentRect: formatRect(source.currentRect)
  };
}

function samplePoint(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) {
    return {x, y, el: null, backgroundColor: "none", opacity: "1"};
  }

  const styles = window.getComputedStyle(el);
  return {
    x,
    y,
    el: describeElement(el),
    backgroundColor: styles.backgroundColor,
    opacity: styles.opacity,
    backdropFilter: styles.backdropFilter,
    filter: styles.filter,
    transform: styles.transform
  };
}

function sampleViewport() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const points = [
    samplePoint(Math.floor(w / 2), Math.floor(h / 2)),
    samplePoint(24, 24),
    samplePoint(w - 24, 24),
    samplePoint(24, h - 24),
    samplePoint(w - 24, h - 24)
  ];

  const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const lightHits = points.filter(point => isLightColor(point.backgroundColor));

  return {
    htmlBg,
    bodyBg,
    lightHits,
    points
  };
}

function countBackdropElements() {
  let backdropCount = 0;
  let hiddenRevealCount = 0;
  let visibleRevealCount = 0;

  document
    .querySelectorAll(".glass-panel, .lumina-header-mobile, .featured-card")
    .forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.backdropFilter && styles.backdropFilter !== "none") {
        backdropCount += 1;
      }
    });

  document.querySelectorAll(".scroll-reveal").forEach(el => {
    if (el.classList.contains("is-visible")) {
      visibleRevealCount += 1;
    } else {
      hiddenRevealCount += 1;
    }
  });

  return {backdropCount, hiddenRevealCount, visibleRevealCount};
}

function serializeDebugValue(value) {
  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => serializeDebugValue(item)).join(",")}]`;
  }

  if (typeof value === "object") {
    if (
      "x" in value &&
      "y" in value &&
      "width" in value &&
      "height" in value
    ) {
      return formatRect(value);
    }

    const entries = Object.entries(value).map(
      ([key, entryValue]) => `${key}=${serializeDebugValue(entryValue)}`
    );
    return `{${entries.join(" ")}}`;
  }

  return String(value);
}

function formatFlashMessage(scope, event, data = {}) {
  const payload = {
    ts: now(),
    ...viewport(),
    ...data
  };

  const fields = Object.entries(payload).map(
    ([key, value]) => `${key}=${serializeDebugValue(value)}`
  );

  return `[flash-debug:${scope}] ${event} | ${fields.join(" ")}`;
}

export function flashDebugLog(scope, event, data = {}) {
  if (!isEnabled()) {
    return;
  }

  console.log(formatFlashMessage(scope, event, data));
}

export function flashDebugWarn(scope, event, data = {}) {
  if (!isEnabled()) {
    return;
  }

  console.warn(formatFlashMessage(scope, event, data));
}

export function initFlashDebug() {
  if (!isEnabled()) {
    return () => {};
  }

  flashDebugLog("boot", "enabled", {
    hint: "Enable with localStorage.flashDebug=1 or ?flashDebug"
  });

  let resizeSession = 0;
  let resizeRaf = 0;
  let resizeEndTimer = 0;
  let frameBudget = 0;

  const logSnapshot = (scope, event, extra = {}) => {
    const sample = sampleViewport();
    const counts = countBackdropElements();

    flashDebugLog(scope, event, {
      ...sample,
      ...counts,
      ...extra
    });

    if (sample.lightHits.length > 0) {
      flashDebugWarn(scope, "light-pixel-sample", {
        lightHits: sample.lightHits,
        ...extra
      });
    }

    if (counts.hiddenRevealCount > 0) {
      flashDebugWarn(scope, "hidden-scroll-reveal-elements", {
        hiddenRevealCount: counts.hiddenRevealCount
      });
    }
  };

  const onResize = () => {
    if (!resizeSession) {
      resizeSession += 1;
      logSnapshot("resize", "start", {session: resizeSession});
    } else {
      resizeSession += 1;
    }

    frameBudget = 12;

    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf);
    }

    const tick = () => {
      if (frameBudget <= 0) {
        return;
      }

      frameBudget -= 1;
      const sample = sampleViewport();

      if (sample.lightHits.length > 0) {
        flashDebugWarn("resize", "light-frame-during-resize", {
          session: resizeSession,
          framesLeft: frameBudget,
          lightHits: sample.lightHits,
          ...countBackdropElements()
        });
      }

      resizeRaf = requestAnimationFrame(tick);
    };

    resizeRaf = requestAnimationFrame(tick);

    window.clearTimeout(resizeEndTimer);
    resizeEndTimer = window.setTimeout(() => {
      logSnapshot("resize", "end", {session: resizeSession});
      resizeSession = 0;
      frameBudget = 0;
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = 0;
      }
    }, 180);
  };

  window.addEventListener("resize", onResize, {passive: true});

  let disconnectPerfObservers = null;

  if ("PerformanceObserver" in window) {
    try {
      const layoutObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          flashDebugLog("layout-shift", "entry", {
            value: entry.value,
            hadRecentInput: entry.hadRecentInput,
            sources: entry.sources
              ? entry.sources.map(describeLayoutShiftSource)
              : []
          });
        });
      });
      layoutObserver.observe({type: "layout-shift", buffered: true});

      const longTaskObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.duration >= 50) {
            flashDebugWarn("longtask", "main-thread-blocked", {
              duration: entry.duration.toFixed(1),
              startTime: entry.startTime.toFixed(1)
            });
          }
        });
      });
      longTaskObserver.observe({type: "longtask", buffered: true});

      disconnectPerfObservers = () => {
        layoutObserver.disconnect();
        longTaskObserver.disconnect();
      };
    } catch (error) {
      flashDebugLog("boot", "performance-observer-unavailable", {
        message: error.message
      });
    }
  }

  const revealObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== "attributes" || mutation.attributeName !== "class") {
        return;
      }

      const el = mutation.target;
      if (!el || el.nodeType !== Node.ELEMENT_NODE || !el.classList) {
        return;
      }

      if (!el.classList.contains("scroll-reveal")) {
        return;
      }

      const visible = el.classList.contains("is-visible");
      flashDebugLog("scroll-reveal", visible ? "visible" : "hidden", {
        el: describeElement(el)
      });

      if (!visible) {
        flashDebugWarn("scroll-reveal", "element-lost-is-visible", {
          el: describeElement(el)
        });
      }
    });
  });

  document.querySelectorAll(".scroll-reveal").forEach(el => {
    revealObserver.observe(el, {attributes: true, attributeFilter: ["class"]});
  });

  const revealRootObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        if (node.classList && node.classList.contains("scroll-reveal")) {
          revealObserver.observe(node, {
            attributes: true,
            attributeFilter: ["class"]
          });
        }

        if (node.querySelectorAll) {
          node.querySelectorAll(".scroll-reveal").forEach(el => {
            revealObserver.observe(el, {
              attributes: true,
              attributeFilter: ["class"]
            });
          });
        }
      });
    });
  });
  revealRootObserver.observe(document.body, {childList: true, subtree: true});

  logSnapshot("boot", "initial-snapshot");

  return () => {
    window.removeEventListener("resize", onResize);
    window.clearTimeout(resizeEndTimer);
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf);
    }
    revealObserver.disconnect();
    revealRootObserver.disconnect();
    if (disconnectPerfObservers) {
      disconnectPerfObservers();
    }
  };
}
