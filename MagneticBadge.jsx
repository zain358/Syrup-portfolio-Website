import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function MagneticBadge({ label = "ROOTS\nPLAYLIST", onClick }) {
  const wrapperRef = useRef(null);
  const badgeRef = useRef(null);
  const textRef = useRef(null);

  // We use refs to hold the quickTo functions so they don't re-render
  const xBadge = useRef();
  const yBadge = useRef();
  const xText = useRef();
  const yText = useRef();

  useGSAP(() => {
    xBadge.current = gsap.quickTo(badgeRef.current, 'x', { duration: 0.5, ease: 'power3' });
    yBadge.current = gsap.quickTo(badgeRef.current, 'y', { duration: 0.5, ease: 'power3' });
    
    xText.current = gsap.quickTo(textRef.current, 'x', { duration: 0.5, ease: 'power3' });
    yText.current = gsap.quickTo(textRef.current, 'y', { duration: 0.5, ease: 'power3' });
  }, { scope: wrapperRef });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
    
    // Find the exact dead-center of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from cursor to center
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    xBadge.current(dx * 0.30);
    yBadge.current(dy * 0.30);
    
    xText.current(dx * 0.12);
    yText.current(dy * 0.12);
  };

  const handleMouseLeave = () => {
    // 🚨 THE SNAP-BACK: Heavy elastic bounce when you pull your mouse away
    gsap.to(badgeRef.current, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, 0.4)' });
    
    // Reset quickTo state to prevent math conflicts
    xBadge.current(0); yBadge.current(0);
    xText.current(0); yText.current(0);
  };

  return (
    // THE GRAVITY FIELD (The invisible area that tracks your mouse)
    <div 
      ref={wrapperRef}
      className="magnetic-badge"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
      style={{
        position: 'absolute',
        width: '180px', // Larger than the button to catch the mouse early
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50
      }}
    >
      {/* THE BADGE (The dark circle that gets pulled) */}
      <div 
        ref={badgeRef}
        style={{
          width: '120px',
          height: '120px',
          backgroundColor: '#0a0a1a', // Dark purple/blue to match the dome
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform'
        }}
      >
        {/* THE TEXT (Moves slightly less, creating the 3D parallax illusion) */}
        <div 
          ref={textRef}
          style={{
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: '600',
            textAlign: 'center',
            letterSpacing: '0.1em',
            lineHeight: '1.4',
            whiteSpace: 'pre-line', // Allows the \n to break the line
            pointerEvents: 'none', // Prevents the text from glitching the mouse hover
            willChange: 'transform'
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
