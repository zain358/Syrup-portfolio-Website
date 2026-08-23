import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react'; // The official React Strict Mode lifesaver

gsap.registerPlugin(ScrollTrigger);

export function PortalExpansion({ 
  characterSrc, 
  portalColor = '#0a0a1a', 
  portalSize = 400 // The starting size of the circle in pixels
}) {
  const sectionRef = useRef(null);
  const portalBgRef = useRef(null);
  const characterRef = useRef(null);

  // useGSAP automatically handles all cleanup when you navigate away!
  useGSAP(() => {
    // 1. Math: How big does the circle need to be to cover the whole screen?
    // We calculate the diagonal length of the monitor using the Pythagorean theorem.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const diagonal = Math.sqrt(Math.pow(vw, 2) + Math.pow(vh, 2));
    
    // We scale it up by the diagonal size, plus a 15% safety buffer
    const requiredScale = (diagonal / portalSize) * 1.15;

    // 2. The GSAP Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center', // When the section hits the center of the screen
        end: '+=150%', // Pin it for exactly 1.5x the height of the screen
        pin: true, // 🚨 THE LOCK: Freezes vertical scrolling
        scrub: 1,  // The animation tied directly to your scroll wheel (1 sec smoothing)
      }
    });

    // 3. The Animation Sequence
    tl.to(portalBgRef.current, {
      scale: requiredScale,
      borderRadius: '0%', // Morphs from a circle to a full-screen square
      ease: 'power1.inOut'
    }, 0); // The '0' means this starts immediately

    // Optional: Make the character take a tiny breath as the portal opens
    tl.fromTo(characterRef.current, {
      scale: 0.95,
      opacity: 0.9
    }, {
      scale: 1,
      opacity: 1,
      ease: 'power1.inOut'
    }, 0);

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh', // Takes up exactly one screen
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden' // Ensures the expanding circle doesn't break page width
      }}
    >
      
      {/* THE EXPANDING PORTAL BACKGROUND */}
      <div 
        ref={portalBgRef}
        style={{
          position: 'absolute',
          width: `${portalSize}px`,
          height: `${portalSize}px`,
          backgroundColor: portalColor,
          borderRadius: '50%', // Starts as a perfect circle
          willChange: 'transform, border-radius', // Pre-allocates the GPU layer
          zIndex: 1
        }}
      />

      {/* THE LOCKED CHARACTER */}
      <div 
        ref={characterRef}
        style={{ 
          position: 'relative', 
          zIndex: 2, 
          pointerEvents: 'none' 
        }}
      >
        <img 
          src={characterSrc} 
          alt="Character" 
          style={{ 
            height: '70vh', // Adjust character size
            objectFit: 'contain' 
          }} 
        />
      </div>

    </section>
  );
}
