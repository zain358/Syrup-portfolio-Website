import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useKineticScroll } from './KineticScrollProvider.jsx';

gsap.registerPlugin(ScrollTrigger);

// ─── Inner Image Parallax (LERP-aware) ────────────────────────────────────────
// The box stays. The image inside drifts with the SAME inertia as the main page.
//
// HOW IT WORKS:
// - getBoundingClientRect() reads the ACTUAL visual position (post LERP transform)
// - So checking it on every gsap.ticker tick naturally follows the kinetic scroll
// - The image drifts like the rest of the page — doesn't snap, doesn't race ahead

export function InnerParallaxImage({ src, alt = '', strength = 55, objectPositionY = '50%' }) {
  const containerRef = useRef(null); // overflow:hidden — the blade
  const parallaxRef  = useRef(null); // gets the y drift (tied to LERP)
  const imgRef       = useRef(null); // gets the reveal animation (once)

  const { lerpY } = useKineticScroll();

  // 1. REVEAL — slides up from below on first scroll entry (once)
  useGSAP(() => {
    const container = containerRef.current;
    const img       = imgRef.current;
    if (!container || !img) return;

    gsap.set(img, { yPercent: 110, transformOrigin: 'center bottom' });
    gsap.to(img, {
      yPercent: 0,
      duration: 1.4,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 88%',
        once: true,
      },
    });
  }, { scope: containerRef });

  // 2. INNER PARALLAX — tied to LERP via getBoundingClientRect()
  useEffect(() => {
    const tick = () => {
      const container = containerRef.current;
      const parallax  = parallaxRef.current;
      if (!container || !parallax) return;

      const rect  = container.getBoundingClientRect();
      const viewH = window.innerHeight;

      // Progress: 0 when element enters from bottom, 1 when it exits at top
      const progress = 1 - (rect.bottom / (viewH + rect.height));
      const clamped  = Math.max(0, Math.min(1, progress));

      // Pure strength-based drift — no yOffset touching the wrapper
      const y = strength * (1 - clamped * 2);
      parallax.style.transform = `translateY(${y}px)`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [strength, lerpY]);

  return (
    // THE BLADE — clips everything inside
    <div ref={containerRef} style={{
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      position: 'relative',
    }}>
      {/* PARALLAX WRAPPER — drifts with LERP inertia */}
      <div ref={parallaxRef} style={{
        width: '100%',
        height: '130%', // taller than box so drift never shows a gap
        willChange: 'transform',
      }}>
        {/* IMAGE — only handles the reveal animation */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `center ${objectPositionY}`,
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
}
