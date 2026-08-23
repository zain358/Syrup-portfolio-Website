import { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const KineticScrollContext = createContext({
  lerpY:     { current: 0 },
  targetY:   { current: 0 },
  velocity:  { current: 0 },
  addTick:    () => {},
  removeTick: () => {},
});

export function useKineticScroll() {
  return useContext(KineticScrollContext);
}

const LERP_WEIGHT = 0.025; // Lower weight = more drift/inertia
const FRAME_BASE = 1000 / 60; // 16.67ms
const SNAP_THRESH = 0.05; // Stops micro-stuttering

function lerpDT(current, target, dt) {
  const alpha = 1 - Math.pow(1 - LERP_WEIGHT, dt / FRAME_BASE);
  return current + (target - current) * alpha;
}

export function KineticScrollProvider({ children }) {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const lerpY         = useRef(0);
  const targetY        = useRef(0);
  const velocity       = useRef(0);
  const lastTime       = useRef(performance.now());
  const rafId          = useRef(null);
  const tickCallbacks  = useRef(new Set());

  const addTick    = useCallback((fn) => { tickCallbacks.current.add(fn); },    []);
  const removeTick = useCallback((fn) => { tickCallbacks.current.delete(fn); }, []);

  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen width to toggle native scroll vs virtual scroll
  useEffect(() => {
    const media = window.matchMedia('(max-width: 959px)');
    const listener = (e) => setIsMobile(e.matches);
    setIsMobile(media.matches);

    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, []);

  // 1. Sync Native Body Height to Virtual Content Height (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(([entry]) => {
      const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      document.body.style.height = `${Math.ceil(h)}px`;
    });

    observer.observe(content);
    return () => {
      observer.disconnect();
      document.body.style.height = '';
    };
  }, [isMobile]);

  // 2. Capture Native Scroll Velocity smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        lerpY.current = window.scrollY;
        targetY.current = window.scrollY;
      } else {
        targetY.current = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // 3. The Pure Math Render Loop (Zero GSAP Dependency) (Desktop only)
  useEffect(() => {
    if (isMobile) {
      ScrollTrigger.defaults({ scroller: window });
      return;
    }

    const tick = (now) => {
      const dt = Math.min(now - lastTime.current, 50);
      lastTime.current = now;

      const prev = lerpY.current;
      const next = lerpDT(prev, targetY.current, dt);
      lerpY.current = next;

      velocity.current = (next - prev) / (dt / FRAME_BASE);

      if (Math.abs(lerpY.current - targetY.current) < SNAP_THRESH) {
        lerpY.current = targetY.current;
        velocity.current = 0;
      }

      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${-lerpY.current}px, 0)`;
      }

      tickCallbacks.current.forEach(fn => fn());
      ScrollTrigger.update();

      rafId.current = requestAnimationFrame(tick);
    };

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop() {
        return lerpY.current;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
    ScrollTrigger.defaults({ scroller: document.body });

    const onRefreshInit = () => {
      lerpY.current = targetY.current;
    };
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    rafId.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId.current);
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
      ScrollTrigger.scrollerProxy(document.body, null);
    };
  }, [isMobile]);

  return (
    <KineticScrollContext.Provider value={{ lerpY, targetY, velocity, addTick, removeTick }}>
      {/* Viewport shell: fixed on desktop, static/flow on mobile */}
      <div
        ref={viewportRef}
        className="page-scroll"
        style={isMobile ? {
          position: 'static',
          width: '100%',
          height: 'auto',
          overflow: 'visible',
        } : {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Moving track: translate3d on desktop, flat on mobile */}
        <div ref={contentRef} className="scroll-container" style={isMobile ? {} : { willChange: 'transform' }}>
          {children}
        </div>
      </div>
    </KineticScrollContext.Provider>
  );
}

export default KineticScrollProvider;
