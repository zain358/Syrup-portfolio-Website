import React, { useState, useEffect } from 'react';

export function LivingBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 959px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed', // Locks to the screen permanently 
        top: 0, 
        left: 0, 
        zIndex: 0, 
        pointerEvents: 'none', // Lets scroll interactions pass through
        backgroundColor: '#10102a' // Fallback color
      }}
    >
      <iframe
        src="/liquid/index.html"
        title="Liquid Background"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          inset: 0
        }}
      />
    </div>
  );
}

export default LivingBackground;