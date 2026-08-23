import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useKineticScroll } from './KineticScrollProvider.jsx'; // Corrected Path

export function FocalText({ 
  children, 
  minScale = 1.0,     // Normal size
  maxScale = 1.05,    // The 5% "fool the eye" breath
  minOpacity = 0.35,  // Starts dimmed
  maxOpacity = 1.0,   // Full brightness at focal point
  focalVh = 0.5,      // Where the lock happens (0.5 = exact vertical center)
  approachVh = 0.5    // How early it starts breathing (0.5 = starts when half a screen away)
}) {
  const containerRef = useRef(null);
  const { lerpY } = useKineticScroll();
  
  const metrics = useRef({ absTop: 0, elH: 0, vh: 0 });
  const prevTransform = useRef('');

  // The Cinematic Easing Curve (easeOutQuart)
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      metrics.current = {
        absTop: rect.top + lerpY.current, 
        elH: rect.height,
        vh: window.innerHeight
      };
    };

    // Defer 1 frame to ensure fonts are painted
    requestAnimationFrame(measure);
    
    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [lerpY]);

  useEffect(() => {
    const tick = () => {
      if (!containerRef.current) return;
      if (window.matchMedia('(max-width: 959px)').matches) {
        if (prevTransform.current !== 'scale(1.0000)' || containerRef.current.dataset.lastOpacity !== '1.0000') {
          containerRef.current.style.transform = 'scale(1.0000)';
          containerRef.current.style.opacity = '1.0000';
          prevTransform.current = 'scale(1.0000)';
          containerRef.current.dataset.lastOpacity = '1.0000';
        }
        return;
      }

      const { absTop, elH, vh } = metrics.current;
      if (elH === 0) return;

      // 1. Calculate positions
      const elCenterScreen = (absTop + elH * 0.5) - lerpY.current;
      const focalY = vh * focalVh;
      const dist = elCenterScreen - focalY; // Distance from the focal line
      
      const approachZone = vh * approachVh;

      let currentScale = minScale;
      let currentOpacity = minOpacity;

      // 2. THE GEOMETRIC ONE-WAY LOCK (Zero React State)
      if (dist <= 0 || containerRef.current.dataset.locked === 'true') {
        // We are AT or ABOVE the center line, OR we already hit it once. Lock at maxScale forever.
        currentScale = maxScale;
        currentOpacity = maxOpacity;
        containerRef.current.dataset.locked = 'true'; // Mark it as permanently locked
      } else if (dist > approachZone) {
        // We are way BELOW the approach zone. Stay at minScale.
        currentScale = minScale;
        currentOpacity = minOpacity;
      } else {
        // We are IN the approach zone. Calculate the smooth ramp.
        const rawProgress = 1 - (dist / approachZone); // 0 to 1
        const easedProgress = easeOutQuart(rawProgress);
        currentScale = minScale + ((maxScale - minScale) * easedProgress);
        currentOpacity = minOpacity + ((maxOpacity - minOpacity) * easedProgress);
      }

      // 3. String Settle Guard (Precision to 4 decimal places = 0.0001px)
      const transformString = `scale(${currentScale.toFixed(4)})`;
      const opacityString = currentOpacity.toFixed(4);

      if (transformString !== prevTransform.current || containerRef.current.dataset.lastOpacity !== opacityString) {
        containerRef.current.style.transform = transformString;
        containerRef.current.style.opacity = opacityString;
        prevTransform.current = transformString;
        containerRef.current.dataset.lastOpacity = opacityString;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [minScale, maxScale, minOpacity, maxOpacity, focalVh, approachVh, lerpY]);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        pointerEvents: 'none',
        zIndex: 20 
      }}
    >
      <div 
        ref={containerRef}
        style={{ 
          willChange: 'transform', // Static layer promotion
          transformOrigin: 'center center' 
        }}
      >
        {children}
      </div>
    </div>
  );
}
