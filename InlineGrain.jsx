import { useEffect, useRef } from 'react';

// ─── Tuning ────────────────────────────────────────────────────────────────
const TILE_W     = 200;
const TILE_H     = 200;
const NUM_FRAMES = 10;
const FPS        = 16;   // 16fps analog film stutter
const OPACITY    = 0.22; // Tune this for strength over the character

const DURATION_S = NUM_FRAMES / FPS;
const SPRITE_H   = TILE_H * NUM_FRAMES;

/**
 * InlineGrain — drop this INSIDE any hardware-accelerated container
 * (e.g. a div with willChange/transform) so mix-blend-mode works.
 * A global position:fixed overlay can NEVER blend across GPU compositor
 * layer boundaries — this component solves that by living in the same layer.
 */
export default function InlineGrain({ opacity = OPACITY, zIndex = 20 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pre-bake noise sprite on GPU
    const canvas = document.createElement('canvas');
    canvas.width  = TILE_W;
    canvas.height = SPRITE_H;
    const ctx  = canvas.getContext('2d');
    const data = ctx.createImageData(TILE_W, SPRITE_H);
    const buf  = data.data;

    for (let i = 0; i < buf.length; i += 4) {
      const v  = (Math.random() * 256) | 0;
      buf[i]   = v;
      buf[i+1] = v;
      buf[i+2] = v;
      buf[i+3] = 255;
    }
    ctx.putImageData(data, 0, 0);

    const dataURL = canvas.toDataURL('image/png');
    el.style.backgroundImage = `url(${dataURL})`;
    el.style.backgroundSize  = `${TILE_W}px ${SPRITE_H}px`;

    // Inject keyframes once
    const styleId = 'inline-grain-keyframes';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        @keyframes inlineGrainShift {
          from { background-position-y: 0px; }
          to   { background-position-y: -${SPRITE_H}px; }
        }
      `;
      document.head.appendChild(styleEl);
    }

    el.style.animation = `inlineGrainShift ${DURATION_S}s steps(${NUM_FRAMES}, end) 0s infinite`;

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        mixBlendMode:  'overlay',
        opacity,
        zIndex,
        willChange:    'background-position',
      }}
    />
  );
}
