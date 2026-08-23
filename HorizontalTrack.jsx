import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function HorizontalTrack({ children, backgroundColor = '#0a0a1a' }) {
  const sectionRef = useRef(null); // The Window
  const trackRef = useRef(null);   // The Train Track

  useGSAP(() => {
    const track = trackRef.current;
    
    // Dynamic math: Exactly how far left does the track need to slide?
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top', // Locks when the section hits the top of the screen
      end: () => `+=${track.scrollWidth - window.innerWidth}`, // Spacer matches the track length perfectly
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true, // Recalculates if the user resizes their browser window
    });

  }, { scope: sectionRef }); // Strict mode safe!

  return (
    // 🪟 THE WINDOW (Locked, 100vw, overflow hidden)
    <section 
      ref={sectionRef} 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden', 
        backgroundColor: backgroundColor,
        position: 'relative'
      }}
    >
      {/* 🚂 THE TRACK (Super wide, holds all the items side-by-side) */}
      <div 
        ref={trackRef} 
        style={{ 
          display: 'flex', 
          height: '100%', 
          width: 'max-content', // Automatically grows as you add more images!
          paddingLeft: '10vw',  // Gives a nice indent before the first item
          alignItems: 'center',
          willChange: 'transform' // GPU acceleration
        }}
      >
        {children}
      </div>
    </section>
  );
}
