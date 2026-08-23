/**
 * CustomCursor.jsx — Single Dot (gsap.quickTo)
 *
 * Matches the exact cursor behavior from that portfolio template:
 *  - One small compact dot, STAYS SMALL always (no expanding)
 *  - gsap.quickTo() with velocity for the silky smooth gliding lag
 *  - On hover: subtle color/opacity shift only — no size change
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    // Don't run on touch/mobile devices — no mouse pointer
    if (window.matchMedia('(max-width: 959px)').matches) return;

    // gsap.quickTo — this is what those portfolio templates use.
    // The 'velocity' parameter creates that signature smooth lag feel.
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3' });

    function onMouseMove(e) {
      xTo(e.clientX);
      yTo(e.clientY);
    }

    // Hover: only a subtle opacity change — cursor NEVER changes size
    function onMouseOver(e) {
      if (e.target.closest('a, button, [data-cursor="hover"]')) {
        gsap.to(cursor, {
          opacity: 0.5,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }

    function onMouseOut(e) {
      if (e.target.closest('a, button, [data-cursor="hover"]')) {
        gsap.to(cursor, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout',  onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout',  onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        width:           '10px',
        height:          '10px',
        marginLeft:      '-5px',
        marginTop:       '-5px',
        backgroundColor: '#fff',
        borderRadius:    '50%',
        pointerEvents:   'none',
        zIndex:          9998,
        mixBlendMode:    'difference',
        willChange:      'transform',
      }}
    />
  );
}
