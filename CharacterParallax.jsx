import { forwardRef } from 'react';
import HoverParallaxCard from './HoverParallaxCard';

/**
 * CharacterParallax.jsx
 *
 * Implements the exact 3D positioning, local perspective, mouse tilt, and
 * Z-axis floating depth of the character (header-artist) from sirup.online:
 * - Uses the same HoverParallaxCard global-tilt mode and LERP.
 * - Sits in the same 3D space, rotating by the exact same Y angle.
 * - Floats forward on the Z-axis by 300px on PC (0px on mobile) to create natural parallax.
 * - Applies the correct 0.85 scaling and vertical offset.
 */
const CharacterParallax = forwardRef(function CharacterParallax(
  {
    alt           = 'Artist',
    style,
  },
  forwardedRef,
) {
  return (
    <HoverParallaxCard
      mode="global-tilt"
      maxTilt={-15}
      perspective={1920}
      globalRate={0.1}
      transformOrigin="50% calc(750 * var(--pv))"
      className="header-artist"
      style={{
        width:  'calc(2880 * var(--pv))',
        height: 'auto',
        ...style,
      }}
    >
      <div className="character-3d-axis">
        <span style={{ display: 'block', width: '100%' }}>
          <picture>
            <source srcSet="https://sirup.online/5th/asset/img/header/sd/header-artist.webp" media="(max-width: 960px)" type="image/webp" />
            <img
              ref={forwardedRef}
              src="https://sirup.online/5th/asset/img/header/pc/header-artist.webp"
              alt={alt}
              decoding="async"
              style={{
                display:       'block',
                width:         '100%',
                height:        'auto',
                pointerEvents: 'none',
                willChange:    'transform',
              }}
            />
          </picture>
        </span>
      </div>
    </HoverParallaxCard>
  );
});

export default CharacterParallax;
