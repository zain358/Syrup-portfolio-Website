import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function StaggeredTextReveal({ lines, className, style, startTrigger = 'top 85%' }) {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  useGSAP(() => {
    if (!containerRef.current || lineRefs.current.length === 0 || window.matchMedia('(max-width: 959px)').matches) return;

    // Clear any existing inline styles just in case
    gsap.set(lineRefs.current, { clearProps: 'all' });

    // Cinematic stagger reveal - Clean and Smooth
    gsap.fromTo(lineRefs.current, {
      y: '110%', // pure translation, no rotation to prevent aliasing/glitches
      opacity: 0,
    }, {
      y: '0%',
      opacity: 1,
      duration: 2.1, // 0.3s slower
      ease: 'power3.out', // smoother ease than power4
      stagger: 0.25, // very slow cascade
      scrollTrigger: {
        trigger: containerRef.current,
        start: startTrigger, // Use the custom prop
        once: true, // Only happens one time
      }
    });
  }, { scope: containerRef });

  return (
    <p ref={containerRef} className={className} style={{ ...style, margin: 0 }}>
      {lines.map((line, i) => (
        <span 
          key={i} 
          style={{ 
            display: 'block', 
            overflow: 'hidden', // The blade that hides the text before it slides up
            paddingBottom: '2px', // Slight padding to prevent descender clipping
          }}
        >
          <span
            ref={el => lineRefs.current[i] = el}
            style={{ 
              display: 'block', 
              transformOrigin: 'left bottom',
              willChange: 'transform, opacity' 
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </p>
  );
}
