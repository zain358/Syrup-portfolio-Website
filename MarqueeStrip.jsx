/**
 * MarqueeStrip.jsx
 * 
 * Infinite text ticker that responds to scroll velocity.
 * - Base speed constantly moves the text
 * - Scroll velocity temporarily accelerates it
 * - direction flips via 'reverse' prop
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useKineticScroll } from './KineticScrollProvider';

export default function MarqueeStrip({ items = [], speed = 0.4, reverse = false, color = '#fff' }) {
  const wrapperRef = useRef(null);
  const { velocity } = useKineticScroll();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    
    let xPos = 0;
    
    const tick = () => {
      // Base speed + scroll velocity influence
      const currentSpeed = speed + Math.abs(velocity.current * 0.015);
      
      if (reverse) {
        xPos += currentSpeed;
      } else {
        xPos -= currentSpeed;
      }
      
      const first = el.firstElementChild;
      if (!first || !first.offsetWidth) return;
      const childWidth = first.offsetWidth;
      
      // Loop the scroll position back
      if (!reverse && xPos <= -childWidth) {
        xPos += childWidth;
      } else if (reverse && xPos >= 0) {
        xPos -= childWidth;
      }
      
      // Use quickSetter for performance if needed, or gsap.set
      gsap.set(el, { x: xPos });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, reverse, velocity]);

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      whiteSpace: 'nowrap',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '28px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: color,
      padding: '12px 0',
      borderTop: color === '#fff' ? '1px solid rgba(255,255,255,0.1)' : 'none',
      borderBottom: color === '#fff' ? '1px solid rgba(255,255,255,0.1)' : 'none',
      pointerEvents: 'none',
    }}>
      <div ref={wrapperRef} style={{ display: 'flex', willChange: 'transform' }}>
        {/* We repeat the items blocks 4 times to ensure it covers wide screens safely */}
        {[0, 1, 2, 3].map(blockIdx => (
          <div key={blockIdx} className="marquee-inner" style={{ display: 'flex', gap: '4vw', paddingRight: '4vw' }}>
            {items.map((item, i) => (
              <span key={i} style={{ opacity: 0.9 }}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
