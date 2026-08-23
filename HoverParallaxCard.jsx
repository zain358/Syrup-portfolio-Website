// HoverParallaxCard.jsx — v4 (clean, direct events, no gsap.context)
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

/**
 * HoverParallaxCard
 *
 * mode="tilt"  — 3D card tilt. Uses two divs: outer catches pointer events
 *               and sets perspective; inner receives rotateX/Y from GSAP.
 *               Rect is cached on mouseenter (not per-frame) to avoid layout flushes.
 *
 * mode="shift" — viewport-relative float driven by window mousemove.
 *               inverse={true} moves OPPOSITE to mouse (counter-parallax depth).
 *
 * enabled={false} — disables all wiring (use during IntroLoader entrance).
 */
export function HoverParallaxCard({
  mode          = 'tilt',
  // --- tilt mode ---
  maxTilt       = 8,
  perspective   = 800,
  scaleOnHover  = 1.04,
  glowOnHover   = false,
  glowShadow    = '0 20px 60px rgba(0,0,0,0.6)',
  // --- shift mode ---
  shiftX        = 6,
  shiftY        = 4,
  shiftDuration = 0.8,
  inverse       = false,
  // --- global-tilt mode (background elements like panel dome) ---
  globalDuration = 2.5,
  globalRate     = 0.1,
  transformOrigin = 'center center',
  // --- shared ---
  enabled       = true,
  className,
  style,
  children,
}) {
  const outerRef   = useRef(null); // perspective container + pointer event target
  const innerRef   = useRef(null); // receives rotationY from GSAP (tilt / global-tilt)
  const contentRef = useRef(null); // receives Z-depth and horizontal depth shift

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    // Disable all tilt/parallax effects on mobile — no mouse events on touch
    const isMobile = window.matchMedia('(max-width: 959px)').matches;
    if (!outer || !enabled || isMobile) return;

    // ── TILT MODE ────────────────────────────────────────────────────────────
    // HORIZONTAL-ONLY TILT — rotateY only, no rotateX.
    // Portrait photo cards (140×180px) tilt on a single vertical axis,
    // like turning a physical photograph. Mouse left → card leans right,
    // mouse right → card leans left. Up/down does nothing.
    // Full 3D tilt (both axes) reads as wobble — wrong for editorial portrait strips.
    if (mode === 'tilt' && inner) {
      const rotY    = gsap.quickTo(inner, 'rotationY', { duration: 0.45, ease: 'power3.out' });
      const scaleTo = gsap.quickTo(inner, 'scale',     { duration: 0.4,  ease: 'power3.out' });
      let rect = null;

      const onEnter = () => {
        rect = outer.getBoundingClientRect();
        scaleTo(scaleOnHover);
        if (glowOnHover) {
          gsap.to(inner, { boxShadow: glowShadow, duration: 0.4, ease: 'power2.out' });
        }
      };

      const onMove = (e) => {
        if (!rect) return;
        // Only horizontal axis — px = -0.5 (left edge) to +0.5 (right edge)
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        rotY(px * maxTilt * 2);
        // rotX intentionally removed — no vertical wobble on portrait cards
      };

      const onLeave = () => {
        rect = null;
        scaleTo(1);
        // Smooth spring-back on the Y axis with expo.out — more physical than quickTo reset
        gsap.to(inner, {
          rotationY: 0,
          duration:  0.6,
          ease:      'expo.out',
          ...(glowOnHover ? { boxShadow: '0 0px 0px rgba(0,0,0,0)' } : {}),
        });
      };

      outer.addEventListener('mouseenter', onEnter);
      outer.addEventListener('mousemove',  onMove);
      outer.addEventListener('mouseleave', onLeave);

      return () => {
        outer.removeEventListener('mouseenter', onEnter);
        outer.removeEventListener('mousemove',  onMove);
        outer.removeEventListener('mouseleave', onLeave);
        gsap.killTweensOf(inner);
      };
    }

    // ── SHIFT MODE ──────────────────────────────────────────────────────────
    // Window-level listener works even with pointerEvents:'none' on element.
    if (mode === 'shift' && inner) {
      const xTo = gsap.quickTo(inner, 'x', { duration: shiftDuration,       ease: 'power3.out' });
      const yTo = gsap.quickTo(inner, 'y', { duration: shiftDuration + 0.2, ease: 'power3.out' });
      const dir = inverse ? -1 : 1;

      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth  - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        xTo(nx * shiftX * 2 * dir);
        yTo(ny * shiftY * 2 * dir);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', onMove);
        gsap.killTweensOf(inner);
      };
    }

    // ── GLOBAL-TILT MODE ────────────────────────────────────────────────────
    // Exact match to the real sirup.online mouse tilt logic:
    // - Local perspective(1920px) on the transform property of the rotating element itself
    // - Smooth LERP (linear interpolation) rate of 0.1 per requestAnimationFrame
    // - Max tilt of -15 (ranges from 7.5deg on left to -7.5deg on right)
    if (mode === 'global-tilt' && inner) {
      let dest = 0;
      let value = 0;

      const onMouseMove = (e) => {
        // (clientX / width - 0.5) * maxTilt
        // By default, maxTilt is -15, which matches the real site's perspective.amount
        dest = (e.clientX / window.innerWidth - 0.5) * maxTilt;
      };

      let rafId;
      const update = () => {
        value += (dest - value) * globalRate;
        inner.style.transform = `perspective(${perspective}px) rotateY(${value}deg)`;
        rafId = requestAnimationFrame(update);
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      rafId = requestAnimationFrame(update);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(rafId);
      };
    }
  }, [
    enabled, mode, maxTilt, perspective, scaleOnHover, glowOnHover, glowShadow,
    shiftX, shiftY, shiftDuration, inverse, globalDuration, globalRate, transformOrigin,
  ]);


  // TILT: outer = perspective container (no transform on it)
  //        inner = the element that actually rotates
  if (mode === 'tilt') {
    return (
      <div
        ref={outerRef}
        className={className}
        tabIndex={enabled ? 0 : -1}
        role="region"
        aria-label="Interactive 3D Card"
        style={{
          perspective:   `${perspective}px`,
          pointerEvents: 'auto',
          width:         '100%',
          height:        '100%',
          ...style,
        }}
      >
        <div
          ref={innerRef}
          style={{
            width:           '100%',
            height:          '100%',
            transformStyle:  'preserve-3d',
            willChange:      'transform',
            transformOrigin: 'center center',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // GLOBAL-TILT: Decoupled Stage -> Pivot -> Content layers
  //              Uses Flexbox centering and translate3d(0,0,0) for GPU rendering
  if (mode === 'global-tilt') {
    const heightStyle = style && style.height ? style.height : '100%';
    const isAuto = heightStyle === 'auto';
    return (
      <div
        ref={outerRef}
        className={className}
        style={{
          pointerEvents:     'none',   // background — never intercepts clicks
          width:             '100%',
          height:            '100%',
          display:           isAuto ? 'block' : 'flex',
          justifyContent:    'center',
          alignItems:        'center',
          overflow:          'visible',
          ...style,
        }}
      >
        <div
          ref={innerRef}
          style={{
            width:          '100%',
            height:         isAuto ? 'auto' : '100%',
            transformStyle: 'preserve-3d',
            display:        isAuto ? 'block' : 'flex',
            justifyContent: 'center',
            alignItems:     'center',
            willChange:     'transform',
            transformOrigin: transformOrigin,
          }}
        >
          <div
            ref={contentRef}
            style={{
              width:          '100%',
              height:         isAuto ? 'auto' : '100%',
              transformStyle: 'preserve-3d',
              transform:      'translate3d(0, 0, 0)', // GPU rendering cache
              display:        isAuto ? 'block' : 'flex',
              justifyContent: 'center',
              alignItems:     'center',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  // SHIFT: outer = layout anchor, inner = element floating with mouse
  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        ref={innerRef}
        style={{
          width:      '100%',
          // height intentionally omitted — sizes to content in auto-height contexts
          // (text overlays) and inherits 100% from explicit-height parents (panel)
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default HoverParallaxCard;
