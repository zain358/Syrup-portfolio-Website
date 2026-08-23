import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function RevealImage({ src, alt = "Revealed Image" }) {
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    // 1. The Starting State (Hidden and slightly zoomed)
    gsap.set(imageRef.current, {
      yPercent: 105, // 105% down to ensure a clean hide
      scale: 1.12,
      transformOrigin: 'center bottom',
    });

    // 2. The Triggered Animation
    gsap.to(imageRef.current, {
      yPercent: 0,
      scale: 1,
      duration: 1.4,
      ease: 'power4.out', // Cinematic deceleration
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top 88%', // Fires just as the container enters the bottom of the screen
        once: true, // Self-destructs after running once to save GPU memory
      }
    });
  }, { scope: wrapperRef });

  return (
    // THE WALL: overflow: hidden acts as the clipping mask
    <div 
      ref={wrapperRef} 
      style={{ 
        position: 'relative',
        overflow: 'hidden', 
        width: '100%', 
        height: '100%' 
      }}
    >
      {/* THE PAYLOAD: Will change alerts the GPU to prep a compositor layer */}
      <img 
        ref={imageRef} 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          willChange: 'transform' 
        }} 
      />
    </div>
  );
}
