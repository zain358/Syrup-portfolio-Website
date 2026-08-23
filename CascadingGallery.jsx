import { RevealImage } from './RevealImage.jsx';

// ─── Layout map ───────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    src: 'https://sirup.online/5th/asset/img/header/header-about-photo.webp',
    alt: 'Artist portrait 01',
    width: '28vw', height: '38vw',
    left: '8vw',  top: '0vw',
    delay: 0,
    triggerStart: 'top 85%',
  },
  {
    id: 2,
    src: 'https://sirup.online/5th/asset/img/header/header-roots-photo.webp',
    alt: 'Artist portrait 02',
    width: '38vw', height: '24vw',
    left: '44vw', top: '14vw',
    delay: 0,
    triggerStart: 'top 82%',
  },
  {
    id: 3,
    src: 'https://sirup.online/5th/asset/img/header/pc/header-artist.webp',
    alt: 'Artist portrait 03',
    width: '20vw', height: '28vw',
    left: '24vw', top: '30vw',
    delay: 0,
    triggerStart: 'top 88%',
  },
  {
    id: 4,
    src: 'https://sirup.online/5th/asset/img/header/header-roots-photo.webp',
    alt: 'Artist portrait 04',
    width: '18vw', height: '26vw',
    left: '58vw', top: '34vw',
    delay: 0.15, // 🚨 The delay making sure this doesn't slide up at the exact same time as Image 3!
    triggerStart: 'top 88%',
  },
  {
    id: 5,
    src: 'https://sirup.online/5th/asset/img/header/header-about-photo.webp',
    alt: 'Artist portrait 05',
    width: '40vw', height: '24vw',
    left: '6vw',  top: '52vw',
    delay: 0,
    triggerStart: 'top 86%',
  },
];

export default function CascadingGallery() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '86vw', // Sized to contain the deepest image perfectly
        overflow: 'visible',
      }}
    >
      {GALLERY_ITEMS.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            top:   item.top,
            left:  item.left,
            zIndex: item.id,
          }}
        >
          <RevealImage
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            triggerStart={item.triggerStart}
            duration={1.4}
            ease="power4.out"
            initialScale={1.12}
            delay={item.delay}
          />
        </div>
      ))}
    </section>
  );
}
