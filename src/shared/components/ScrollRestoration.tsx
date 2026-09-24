import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Restores scroll position on history back/forward navigation while keeping
// each page's position while the user is navigating forward.
//
// Why a custom component? The guest and frontdesk flows rely on `navigate(-1)`
// back buttons (search results -> property detail, checkout list -> detail,
// etc.) and the window is the real scroll container on most pages, with a few
// exceptions (the frontdesk dashboard) where an inner <main> actually
// overflows. This component:
//
//   - disables native scroll restoration so it never fights us;
//   - detects back/forward reliably via the history index stored by React
//     Router (window.history.state.idx), with a key-sequence fallback for
//     entries that lack an index;
//   - persists positions in sessionStorage keyed by pathname+search so they
//     survive reloads;
//   - resolves the real scroll container at runtime (window vs inner <main>);
//   - keeps re-applying the saved position while content loads/settles, so
//     lazy routes and images land exactly on the saved point.
const STORAGE_KEY = "scroll-positions";

function loadPositions(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storePositions(positions: Record<string, number>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Private mode / storage unavailable: fall back to in-memory behavior.
  }
}

const positionCache = loadPositions();
const historySequence: string[] = [];

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function isScrollable(el: Element | null): boolean {
  return !!el && el.scrollHeight > el.clientHeight;
}

function getScrollContainer(): Element | null {
  const main = document.querySelector("main.flex-1.overflow-auto");
  if (main && isScrollable(main)) {
    return main;
  }
  return document.scrollingElement;
}

function usesWindowScrolling(el: Element | null): boolean {
  return (
    el === null ||
    el === document.documentElement ||
    el === document.body ||
    el === document.scrollingElement
  );
}

function getScrollTop(el: Element | null): number {
  if (usesWindowScrolling(el)) {
    return window.scrollY || document.documentElement.scrollTop || 0;
  }
  return el!.scrollTop || 0;
}

function getMaxScroll(el: Element | null): number {
  if (usesWindowScrolling(el)) {
    const doc = document.scrollingElement || document.documentElement;
    return Math.max(0, doc.scrollHeight - window.innerHeight);
  }
  return Math.max(0, el!.scrollHeight - el!.clientHeight);
}

function persistNextFrame() {
  requestAnimationFrame(() => storePositions(positionCache));
}

export function ScrollRestoration() {
  const location = useLocation();
  const lastIdx = useRef<number | null>(null);
  const lastProgrammaticScroll = useRef<{ top: number; at: number } | null>(null);

  useEffect(() => {
    const key = location.pathname + location.search;
    const saved = positionCache[key];

    // Direction detection: React Router stamps a monotonically increasing
    // index into window.history.state; a lower index => history back.
    const idx: number | undefined = (window.history.state as { idx?: number } | null)?.idx;
    let goingBack = false;

    if (typeof idx === "number" && lastIdx.current !== null) {
      goingBack = idx < lastIdx.current;
    } else {
      if (historySequence.length > 1 && historySequence[historySequence.length - 2] === key) {
        goingBack = true;
      } else if (historySequence[historySequence.length - 1] !== key) {
        historySequence.push(key);
      }
    }
    lastIdx.current = typeof idx === "number" ? idx : lastIdx.current;

    const target = goingBack && saved !== undefined ? saved : 0;

    let containerRef: Element | null = null;
    let raf = 0;
    let timer = 0;
    let saveRaf = 0;
    let attempts = 0;
    let settledTicks = 0;
    let userStopTimer = 0;
    let userInterrupted = false;

    const onUserStop = () => {
      userInterrupted = true;
      window.clearTimeout(userStopTimer);
      userStopTimer = window.setTimeout(() => {
        const el = getScrollContainer();
        positionCache[key] = getScrollTop(el);
        persistNextFrame();
      }, 400);
    };

    const scroll = () => {
      const top = getScrollTop(getScrollContainer());
      const lp = lastProgrammaticScroll.current;
      if (lp && Math.abs(top - lp.top) <= 2 && performance.now() - lp.at < 500) {
        return;
      }
      userInterrupted = true;
      window.clearTimeout(userStopTimer);
      cancelAnimationFrame(saveRaf);
      saveRaf = requestAnimationFrame(() => {
        positionCache[key] = getScrollTop(getScrollContainer());
        persistNextFrame();
      });
    };

    const programmaticScroll = (el: Element | null, top: number) => {
      lastProgrammaticScroll.current = { top, at: performance.now() };
      if (usesWindowScrolling(el)) {
        window.scrollTo(0, top);
      } else {
        el!.scrollTop = top;
      }
    };

    const attachContainerListener = (el: Element | null) => {
      if (!containerRef && !usesWindowScrolling(el)) {
        containerRef = el;
        el!.addEventListener("scroll", scroll, { passive: true });
      }
    };

    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("wheel", onUserStop, { passive: true, capture: true });
    window.addEventListener("touchstart", onUserStop, { passive: true, capture: true });

    const applyRestore = () => {
      const el = getScrollContainer();
      const maxScroll = getMaxScroll(el);
      attachContainerListener(el);
      if (target <= 0) {
        programmaticScroll(el, 0);
        return;
      }
      if (maxScroll >= target) {
        programmaticScroll(el, target);
        settledTicks += 1;
        timer = window.setTimeout(tick, 120);
        return;
      }
      settledTicks = 0;
      attempts += 1;
      if (attempts >= 80) {
        programmaticScroll(el, maxScroll);
        return;
      }
      timer = window.setTimeout(tick, 60);
    };

    function tick() {
      if (userInterrupted || settledTicks >= 2) return;
      applyRestore();
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(saveRaf);
      window.clearTimeout(timer);
      window.clearTimeout(userStopTimer);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("wheel", onUserStop, { capture: true });
      window.removeEventListener("touchstart", onUserStop, { capture: true });
      if (containerRef) {
        containerRef.removeEventListener("scroll", scroll);
      }
    };
  }, [location.pathname, location.search]);

  return null;
}