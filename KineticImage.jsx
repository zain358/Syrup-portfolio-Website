import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useKineticScroll } from './KineticScrollProvider.jsx'; // Corrected path

export function KineticImage({ 
  src, 
  alt = "", 
  speed = 0.2,       // 0.2 means it moves 20% of its own height. Easy!
  zoomFactor = 0.002 // The breathing effect
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  const { lerpY, velocity } = useKineticScroll();
  
  const metrics = useRef({ absTop: 0, boxH: 0, vh: 0 });
  const prevTransform = useRef('');

  const autoScale = 1 + (Math.abs(speed) * 2); 

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      metrics.current = {
        absTop: rect.top + lerpY.current, 
        boxH: rect.height,
        vh: window.innerHeight
      };
    };

    // Wait a tiny fraction of a second for images to paint before measuring
    setTimeout(measure, 50);
    
    // 🚨 FIX: Observe the actual image box, not the body!
    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [lerpY]);

  useEffect(() => {
    const tick = () => {
      if (!imageRef.current) return;

      const { absTop, boxH, vh } = metrics.current;
      if (boxH === 0) return; // Guard against unrendered boxes

      const boxCenterScreen = (absTop + boxH / 2) - lerpY.current;
      const distFromCenter = boxCenterScreen - (vh / 2);
      const range = (vh / 2) + (boxH / 2);

      let normalized = distFromCenter / range;
      normalized = Math.max(-1, Math.min(1, normalized)); 

      // 🚨 FIX: Calculate the pixel movement based on the box height and your speed
      const maxOffsetPixels = boxH * speed;
      const imageOffset = normalized * maxOffsetPixels;

      let currentScale = 1;
      if (zoomFactor !== 0) {
        currentScale = 1 + (Math.abs(velocity.current) * zoomFactor);
      }

      const transformString = `translate3d(0, ${imageOffset.toFixed(3)}px, 0) scale(${currentScale.toFixed(3)})`;

      if (transformString !== prevTransform.current) {
        imageRef.current.style.transform = transformString;
        prevTransform.current = transformString;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, zoomFactor, lerpY, velocity]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden' 
      }}
    >
      <img 
        ref={imageRef} 
        src={src} 
        alt={alt} 
        style={{ 
          position: 'absolute', 
          top: `-${(autoScale - 1) * 50}%`, // Auto-centers the extra slack perfectly
          left: 0, 
          width: '100%', 
          height: `${autoScale * 100}%`, 
          objectFit: 'cover', 
          willChange: 'transform' 
        }} 
      />
    </div>
  );
}
