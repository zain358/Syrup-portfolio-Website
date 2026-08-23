/**
 * IntroLoader.jsx
 *
 * Matches the real sirup.online loading sequence exactly:
 *  1. Mounts: preloads /loading.svg
 *  2. On load: .loading-container gets .is-enter (seal slides up & enters)
 *  3. After 1500ms: .loading-container gets .is-exit (seal spins fast & slides up/out)
 *  4. After 2000ms: .page-loading gets .is-inactive (curtain wipes up & collapses height to 0)
 *  5. After 3200ms: animation complete -> triggers onComplete() to unmount
 */
import { useEffect, useState } from 'react';

export default function IntroLoader({ onComplete }) {
  const [containerClass, setContainerClass] = useState(''); // '' | 'is-enter' | 'is-exit'
  const [wrapperClass, setWrapperClass] = useState(''); // '' | 'is-inactive'

  useEffect(() => {
    let exitTimer;
    let inactiveTimer;
    let doneTimer;

    // Preload loading.svg
    const img = new window.Image();
    img.onload = () => {
      // Step 2: Seal enters
      setContainerClass('is-enter');

      // Step 3: Seal exits after 1.5s
      exitTimer = setTimeout(() => {
        setContainerClass('is-exit');

        // Step 4: Curtain wipes after another 500ms (t = 2.0s)
        inactiveTimer = setTimeout(() => {
          setWrapperClass('is-inactive');

          // Step 5: Loader fully finished after another 1.2s (t = 3.2s)
          doneTimer = setTimeout(() => {
            if (onComplete) onComplete();
          }, 1200);
        }, 500);
      }, 1500);
    };

    img.onerror = () => {
      // Fallback: If image fails, complete immediately
      if (onComplete) onComplete();
    };

    img.src = '/loading.svg';

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(inactiveTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div className={`page-loading ${wrapperClass}`}>
      <div className="loading-curtain">
        <span />
        <span />
        <span />
      </div>
      <div className={`loading-container ${containerClass}`}>
        <div>
          <span>
            <img src="/loading.svg" alt="LOADING" />
          </span>
        </div>
      </div>
    </div>
  );
}
