/**
 * ScrollHeader.jsx
 *
 * Smart fixed header with scroll-aware behavior:
 *   - Transparent at top of page
 *   - Frosted-glass dark background after scrolling past threshold
 *   - Hides (slides up) when scrolling down quickly
 *   - Reveals (slides down) when scrolling up
 *
 * Must be placed OUTSIDE KineticScrollProvider so position:fixed
 * is relative to the actual viewport (not the transformed content div).
 *
 * Uses window.scroll (not lerpY) for show/hide — window.scrollY
 * updates correctly in the KineticScrollProvider system since the
 * body has a real scroll height.
 *
 * Props:
 *   logoSrc  {string}   Path to logo image
 *   socials  {Array}    [{ key, href, svg }]
 *   zIndex   {number}   Default 100
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function ScrollHeader({ logoSrc, socials = [], zIndex = 100 }) {
  const headerRef   = useRef(null);
  const bgRef       = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    const bg     = bgRef.current;
    if (!header || !bg) return;

    let prevY      = 0;
    let hidden     = false;
    const THRESHOLD = 80;   // px before backdrop appears
    const HIDE_SPEED = 4;   // px/frame before header hides

    function onScroll() {
      const y     = window.scrollY;
      const delta = y - prevY;

      // — Backdrop —
      if (y > THRESHOLD) {
        gsap.to(bg, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(bg, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      }

      // — Hide on any scroll down past threshold —
      if (delta > 0 && y > THRESHOLD && !hidden) {
        gsap.to(header, { yPercent: -110, duration: 0.4, ease: 'power3.inOut' });
        hidden = true;
      }

      // — Reveal on any scroll up —
      if (delta < 0 && hidden) {
        gsap.to(header, { yPercent: 0, duration: 0.5, ease: 'power3.out' });
        hidden = false;
      }

      prevY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        height:     '90px',
        padding:    '0 4vw',
        display:    'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex,
        pointerEvents: 'none',
      }}
    >
      {/* Backdrop — fades in on scroll */}
      <div
        ref={bgRef}
        style={{
          position:       'absolute',
          inset:          0,
          opacity:        0,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          background:     'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 100%)',
          pointerEvents:  'none',
          zIndex:         0,
        }}
      />

      {/* Spacer where the burger used to be to preserve flex space */}
      <div style={{ width: '40px' }} />

      {/* Logo — centered */}
      <div
        style={{
          position:  'absolute',
          left:      '50%',
          top:       '10px',
          transform: 'translateX(-50%)',
          zIndex:    1,
          pointerEvents: 'none',
        }}
      >
        <img
          src={logoSrc}
          alt="SIRUP"
          style={{ height: '95px', width: 'auto', display: 'block' }}
        />
      </div>

      {/* Socials — right */}
      <nav
        className="socials"
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
      >
        {socials.map(({ key, href, svg }) => (
          <a key={key} href={href} className="si" aria-label={key}>
            {svg}
          </a>
        ))}
      </nav>
    </header>
  );
}
