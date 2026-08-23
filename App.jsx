import React, { useRef, useEffect, useState } from 'react';
import LivingBackground from './LivingBackground.jsx';
import KineticScrollProvider, { useKineticScroll } from './KineticScrollProvider.jsx';
import { ParallaxLayer } from './ParallaxLayer.jsx';
import { FocalText } from './FocalText.jsx';
import { MagneticBadge } from './MagneticBadge.jsx';
import { StaggeredTextReveal } from './StaggeredTextReveal.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import NoiseOverlay from './NoiseOverlay';
import HeroLogo from './HeroLogo';
import DateSVG from './DateSVG';
import CharacterParallax from './CharacterParallax';
import ScrollHeader from './ScrollHeader';
import MarqueeStrip from './MarqueeStrip';
import HoverParallaxCard from './HoverParallaxCard';
import IntroLoader from './IntroLoader';
import PageNav from './PageNav';
import MusicPlayer from './MusicPlayer';
import SetlistSection from './SetlistSection';
import BeTheGrooveSection from './BeTheGrooveSection';
import DvdSection from './DvdSection';
import RotatingAlbum from './RotatingAlbum';
import BudokanAlbumScroll from './BudokanAlbumScroll';
import ChessShowcase from './ChessShowcase';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared shadow ─────────────────────────────────────────────────────────────
const HERO_SHADOW = 'drop-shadow(0 3px 10px rgba(0,0,0,0.45)) drop-shadow(0 12px 30px rgba(0,0,0,0.20))';

// ─── Social icon SVGs ──────────────────────────────────────────────────────────
const SVGS = {
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L2.25 2.25h6.952l4.263 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  ig: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  yt: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M23 7s-.3-2-1.2-2.8C20.7 3 19.4 3 18.8 2.9 16.4 2.7 12 2.7 12 2.7s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1c0 2.3.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 22.2 12 22.2 12 22.2s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
    </svg>
  ),
  sp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.808-.87 7.076-.496 9.712 1.115.293.18.386.563.21.853zm1.243-2.783c-.225.367-.704.484-1.07.258-2.686-1.65-6.784-2.13-9.964-1.166-.406.122-.83-.108-.952-.515-.122-.406.108-.83.514-.95 3.65-1.102 8.16-.563 11.215 1.314.366.225.483.704.257 1.06zm.116-2.905c-3.216-1.908-8.525-2.083-11.564-1.16-.48.146-.995-.125-1.14-.606-.145-.48.125-.995.606-1.14 3.49-1.063 9.35-.86 13.06 1.34.433.256.575.815.318 1.248-.256.434-.814.576-1.247.318z" />
    </svg>
  ),
  tk: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1 4.54-2.73 6.08-1.57 1.4-3.69 2.11-5.83 2-2.12-.11-4.14-1.08-5.5-2.65-1.55-1.78-2.22-4.18-1.85-6.49.27-1.68 1.07-3.26 2.3-4.4 1.53-1.44 3.64-2.16 5.75-2.09.11 0 .22.01.32.02v4.22c-.11-.01-.21-.01-.32-.01-1.39-.1-2.82.4-3.77 1.43-.88.94-1.21 2.3-1 3.59.18 1.1.84 2.1 1.75 2.74 1.07.75 2.45 1.01 3.73.74 1.25-.26 2.35-1 3-2.09.61-1.01.88-2.19.86-3.37.04-4.8.01-9.6.02-14.41z" />
    </svg>
  ),
};

// ─── About Photo Strip ─────────────────────────────────────────────────────────
function AboutPhotoStrip() {
  const stripRef = useRef(null);
  const cardRefs = useRef([]);
  const { velocity, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    if (!stripRef.current) return;
    const setSkew = gsap.quickSetter(stripRef.current, 'skewY', 'deg');
    let lastSkew = null;
    const tick = () => {
      if (!stripRef.current) return;
      const v = velocity.current * 0.04;
      const skew = Math.abs(v) < 0.01 ? 0 : v;
      if (skew !== lastSkew) { setSkew(skew); lastSkew = skew; }
    };
    addTick(tick);
    return () => removeTick(tick);
  }, [velocity, addTick, removeTick]);

  useGSAP(() => {
    if (!stripRef.current || window.matchMedia('(max-width: 959px)').matches) return;
    const cards = cardRefs.current.filter(Boolean);
    cards.forEach(card => {
      gsap.set(card, { scaleY: 0, transformOrigin: 'bottom center', opacity: 0 });
      const overlay = card.querySelector('[data-overlay]');
      if (overlay) gsap.set(overlay, { scaleY: 0, opacity: 1, transformOrigin: 'bottom center' });
    });
    ScrollTrigger.create({
      trigger: stripRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          const delay = i * 0.07;
          gsap.to(card, { scaleY: 1, opacity: 1, duration: 1.0, ease: 'power3.out', delay });
          const overlay = card.querySelector('[data-overlay]');
          if (overlay) {
            gsap.to(overlay, { scaleY: 1, duration: 1.0, ease: 'power3.out', delay });
            gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power1.inOut', delay: delay + 1.0 });
          }
        });
      },
    });

    cards.forEach((card, i) => {
      const parallaxEx = i * 80;
      const target = card.querySelector('[data-parallax-ex]');
      if (!target) return;

      gsap.to(target, {
        y: () => parallaxEx * (stripRef.current.clientHeight / 560),
        scrollTrigger: {
          trigger: stripRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    });
  }, { scope: stripRef });

  const offsets = [-80, -40, 0, 40];

  return (
    <div ref={stripRef} className="about-photo" style={{
      position: 'absolute', top: '130vh', left: '0.2vw',
      display: 'flex', gap: '2px', zIndex: 60,
      willChange: 'transform', pointerEvents: 'none',
    }}>
      {offsets.map((offset, i) => (
        <div key={i} ref={el => cardRefs.current[i] = el} className="photo" style={{
          position: 'relative',
          width: 'calc(420 * var(--pv))', height: 'calc(560 * var(--pv))',
          overflow: 'hidden', flexShrink: 0, transformOrigin: 'bottom center',
        }}>
          <div data-insert style={{ height: '100%' }}>
            <div data-parallax-ex={i * 80} style={{ height: '100%', position: 'relative' }}>
              <span style={{ display: 'block', position: 'absolute', left: 0, width: '100%', bottom: `calc(${offset} * var(--pv))` }}>
                <img src="https://sirup.online/5th/asset/img/header/header-about-photo.webp" alt="" style={{
                  display: 'block', width: '100%', height: 'auto', willChange: 'transform',
                }} />
                <div data-overlay="true" style={{
                  position: 'absolute', inset: 0, background: '#E03200',
                  mixBlendMode: 'overlay', pointerEvents: 'none', transformOrigin: 'bottom center',
                }} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Roots Photo Strip ─────────────────────────────────────────────────────────
function RootsPhotoStrip() {
  const stripRef = useRef(null);
  const cardRefs = useRef([]);
  const { velocity, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    if (!stripRef.current) return;
    const setSkew = gsap.quickSetter(stripRef.current, 'skewY', 'deg');
    let lastSkew = null;
    const tick = () => {
      if (!stripRef.current) return;
      const v = velocity.current * 0.04;
      const skew = Math.abs(v) < 0.01 ? 0 : v;
      if (skew !== lastSkew) { setSkew(skew); lastSkew = skew; }
    };
    addTick(tick);
    return () => removeTick(tick);
  }, [velocity, addTick, removeTick]);

  useGSAP(() => {
    if (!stripRef.current || window.matchMedia('(max-width: 959px)').matches) return;
    const cards = cardRefs.current.filter(Boolean);
    cards.forEach(card => {
      gsap.set(card, { scaleY: 0, transformOrigin: 'bottom center', opacity: 0 });
      const overlay = card.querySelector('[data-overlay]');
      if (overlay) gsap.set(overlay, { scaleY: 0, opacity: 1, transformOrigin: 'bottom center' });
    });
    ScrollTrigger.create({
      trigger: stripRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          const delay = i * 0.07;
          gsap.to(card, { scaleY: 1, opacity: 1, duration: 1.0, ease: 'power3.out', delay });
          const overlay = card.querySelector('[data-overlay]');
          if (overlay) {
            gsap.to(overlay, { scaleY: 1, duration: 1.0, ease: 'power3.out', delay });
            gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power1.inOut', delay: delay + 1.0 });
          }
        });
      },
    });

    cards.forEach((card, i) => {
      const parallaxEx = i * 80;
      const target = card.querySelector('[data-parallax-ex]');
      if (!target) return;

      gsap.to(target, {
        y: () => parallaxEx * (stripRef.current.clientHeight / 560),
        scrollTrigger: {
          trigger: stripRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    });
  }, { scope: stripRef });

  const offsets = [-80, -40, 0, 40];

  return (
    <div ref={stripRef} className="roots-photo" style={{
      position: 'absolute', top: '260vh', right: '9vw',
      display: 'flex', gap: '2px', zIndex: 60,
      willChange: 'transform', pointerEvents: 'none',
    }}>
      {offsets.map((offset, i) => (
        <div key={i} ref={el => cardRefs.current[i] = el} className="photo" style={{
          position: 'relative',
          width: 'calc(420 * var(--pv))', height: 'calc(560 * var(--pv))',
          overflow: 'hidden', flexShrink: 0, transformOrigin: 'bottom center',
        }}>
          <div data-insert style={{ height: '100%' }}>
            <div data-parallax-ex={i * 80} style={{ height: '100%', position: 'relative' }}>
              <span style={{ display: 'block', position: 'absolute', left: 0, width: '100%', bottom: `calc(${offset} * var(--pv))` }}>
                <img src="https://sirup.online/5th/asset/img/header/header-roots-photo.webp" alt="" style={{
                  display: 'block', width: '100%', height: 'auto', willChange: 'transform',
                }} />
                <div data-overlay="true" style={{
                  position: 'absolute', inset: 0, background: '#E03200',
                  mixBlendMode: 'overlay', pointerEvents: 'none', transformOrigin: 'bottom center',
                }} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Footer Section ────────────────────────────────────────────────────────────
function FooterSection() {
  const containerRef = useRef(null);
  const debutRef = useRef(null);
  const sepRef = useRef(null);
  const nextRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    let dest = 0;
    let value = 0;
    const rate = 0.1;

    let isInitialActive = true;
    let isHoveringPanel = false;

    const onMouseMove = (e) => {
      // Amount matches the global tilt, which ranges up to -15deg (or 15deg).
      dest = (e.clientX / window.innerWidth - 0.5) * 15;

      // If the mouse starts moving/hovering outside the panel, stop the initial automatic rotation
      if (isInitialActive && !isHoveringPanel) {
        isInitialActive = false;
        if (panelRef.current) {
          panelRef.current.classList.remove('is-active');
        }
      }
    };

    const onMouseEnter = () => {
      isHoveringPanel = true;
      isInitialActive = false;
      if (panelRef.current) {
        panelRef.current.classList.add('is-active');
      }
    };

    const onMouseLeave = () => {
      isHoveringPanel = false;
      if (panelRef.current) {
        panelRef.current.classList.remove('is-active');
      }
    };

    let rafId;
    const update = () => {
      value += (dest - value) * rate;
      if (panelRef.current) {
        const targets = panelRef.current.querySelectorAll('[data-preserve-r]');
        targets.forEach(el => {
          el.style.transform = `perspective(480px) rotateY(${value}deg)`;
        });
      }
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(update);

    const linkEl = panelRef.current ? panelRef.current.querySelector('.footer-panel-link') : null;
    if (linkEl) {
      linkEl.addEventListener('mouseenter', onMouseEnter);
      linkEl.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      if (linkEl) {
        linkEl.removeEventListener('mouseenter', onMouseEnter);
        linkEl.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  useGSAP(() => {
    // Debut SVGs stagger reveal
    if (debutRef.current) {
      const items = debutRef.current.querySelectorAll('.debut-item');
      gsap.set(items, { opacity: 0, scaleY: 0, transformOrigin: 'center bottom' });
      ScrollTrigger.create({
        trigger: debutRef.current, start: 'top 85%', once: true,
        onEnter: () => gsap.to(items, { opacity: 1, scaleY: 1, duration: 1.0, ease: 'power3.out', stagger: 0.05 }),
      });
    }
    // Separate spinner reveal
    if (sepRef.current) {
      gsap.set(sepRef.current, { opacity: 0, y: '12.5vh' });
      ScrollTrigger.create({
        trigger: sepRef.current, start: 'top 85%', once: true,
        onEnter: () => gsap.to(sepRef.current, { opacity: 0.9, y: 0, duration: 0.5, ease: 'power3.out' }),
      });
    }
    // NEXT SVG reveal
    if (nextRef.current) {
      gsap.set(nextRef.current, { opacity: 0, y: '12.5vh' });
      ScrollTrigger.create({
        trigger: nextRef.current, start: 'top 85%', once: true,
        onEnter: () => gsap.to(nextRef.current, { opacity: 0.9, y: 0, duration: 0.5, ease: 'power3.out' }),
      });
    }
    // Panel reveal and parallax
    if (panelRef.current) {
      ScrollTrigger.create({
        trigger: panelRef.current,
        start: 'top 95%',
        once: true,
        onEnter: () => {
          panelRef.current.classList.add('is-trigger', 'is-active');
        },
      });

      const parallaxTarget = panelRef.current.querySelector('[data-parallax]');
      if (parallaxTarget) {
        const factor = parseFloat(parallaxTarget.getAttribute('data-parallax') || '27');
        gsap.from(parallaxTarget, {
          y: () => window.innerWidth < 1920
            ? factor * (window.innerWidth / 1920) * 50
            : factor * 50,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          }
        });
      }
    }

    // Blackout overlay triggered by Budokan Album section
    const isMobileView = window.innerWidth < 960;
    const vantaOverlay = document.querySelectorAll('.vanta-front');
    document.querySelectorAll('.budokan-album-scroll').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: isMobileView ? 'top 75%' : 'top center',
        end: isMobileView ? 'bottom 25%' : 'bottom center',
        onEnter: () => gsap.to(vantaOverlay, { opacity: 0.8, duration: 1.0, ease: 'power2.out' }),
        onLeave: () => gsap.to(vantaOverlay, { opacity: 0, duration: 1.0, ease: 'power2.out' }),
        onEnterBack: () => gsap.to(vantaOverlay, { opacity: 0.8, duration: 1.0, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(vantaOverlay, { opacity: 0, duration: 1.0, ease: 'power2.out' }),
      });
    });
  });

  return (
    <div ref={containerRef} className="section-footer-wrap" style={{ marginTop: '4vh' }}>

      {/* Debut SVGs — 2017.9.27 / SIRUP / DEBUT */}
      <div ref={debutRef} className="footer-debut-box" style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 'calc(2400 * var(--pv))',
        width: 'calc(1465 * var(--pv))', margin: 'auto',
        opacity: 0.9, mixBlendMode: 'overlay',
      }}>
        {['footer-debut-1.svg', 'footer-debut-2.svg', 'footer-debut-3.svg'].map((f, i) => (
          <div key={i} className="debut-item" style={{ display: 'block', position: 'absolute', left: 0, bottom: 0, width: '100%' }}>
            <img src={`/asset/img/footer/${f}`} alt="" style={{ display: 'block', width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>

      {/* Separate spinning icon */}
      <div ref={sepRef} className="footer-sep-box" style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 'calc(1900 * var(--pv))',
        width: 'calc(450 * var(--pv))', margin: 'auto',
        opacity: 0, mixBlendMode: 'overlay',
      }}>
        <img src="/asset/img/footer/footer-separate.svg" alt="" style={{
          display: 'block', width: '100%', height: 'auto',
          animation: 'footer-rotateY 2.0s linear infinite',
        }} />
      </div>

      {/* NEXT arrow */}
      <div ref={nextRef} className="footer-next-box" style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 'calc(1400 * var(--pv))',
        width: 'calc(85 * var(--pv))', margin: 'auto',
        opacity: 0, mixBlendMode: 'overlay',
      }}>
        <img src="/asset/img/footer/footer-next.svg" alt="NEXT" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>

      {/* Footer Tickers */}
      <div className="footer-ticker-top" style={{ mixBlendMode: 'overlay', position: 'absolute', left: 0, right: 0, bottom: 'calc(455 * var(--pv))', width: '100%', height: 'calc(290 * var(--pv))', overflow: 'hidden' }}>
        <div style={{ display: 'block', position: 'absolute', left: 0, top: 0, width: 'calc(12532 * var(--pv))', height: '100%', backgroundImage: 'url(https://sirup.online/5th/asset/img/ticker.svg)', backgroundRepeat: 'repeat-x', backgroundPosition: 'left center', backgroundSize: 'contain', opacity: 1.0, animation: 'footer-tickerL 30s linear infinite' }} />
      </div>
      <div className="footer-ticker-bottom" style={{ mixBlendMode: 'overlay', position: 'absolute', left: 0, right: 0, bottom: 'calc(300 * var(--pv))', width: '100%', height: 'calc(155 * var(--pv))', overflow: 'hidden' }}>
        <div style={{ display: 'block', position: 'absolute', right: 0, bottom: 0, width: 'calc(12532 * var(--pv))', height: 'calc(290 * var(--pv))', backgroundImage: 'url(https://sirup.online/5th/asset/img/ticker.svg)', backgroundRepeat: 'repeat-x', backgroundPosition: 'left center', backgroundSize: 'contain', opacity: 0.7, animation: 'footer-tickerR 45s linear infinite' }} />
      </div>

      {/* Footer Panel — rotating 3D card */}
      <div ref={panelRef} className="footer-panel">
        <div data-insert>
          <div data-parallax="27" style={{ width: '100%', height: '100%' }}>
            {/* Front panel */}
            <div className="panel">
              <div data-preserve-r>
                <div data-preserve-axis className="preserve-axis">
                  <span>
                    <img src="/asset/img/footer/footer-panel-1.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                </div>
              </div>
            </div>
            {/* Back panel */}
            <div className="panel">
              <div data-preserve-r>
                <div data-preserve-axis className="preserve-axis">
                  <span>
                    <img src="/asset/img/footer/pc/footer-panel-2.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Transparent rounded overlay to restrict pointer/hover events to the exact semi-circle */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="footer-panel-link"
          style={{
            display: 'block',
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            borderRadius: '100vw 100vw 0 0',
            overflow: 'hidden',
            zIndex: 10,
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Footer Links (bottom left) */}
      <div className="footer-links-row" style={{ position: 'absolute', left: 'calc(110 * var(--pv))', bottom: 'calc(85 * var(--pv))', display: 'flex', gap: 'calc(85 * var(--pv))' }}>
        {[
          { label: 'SIRUP OFFICIAL SITE', href: 'https://sirup.online' },
          { label: 'CHANNEL SRP', href: 'https://subscription.app.c-rayon.com/app/sirup/home' },
        ].map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Termina', 'DM Sans', sans-serif", fontSize: 'calc(11 * var(--pv))', lineHeight: 1, fontWeight: 200, letterSpacing: '0.1em', color: '#ffffff', textDecoration: 'none' }}>
            {label}
          </a>
        ))}
      </div>

      {/* Copyright (bottom center-right) */}
      <div className="footer-copyright-box" style={{ position: 'absolute', right: 'calc(720 * var(--pv))', bottom: 'calc(85 * var(--pv))', fontFamily: "'Termina', 'DM Sans', sans-serif", fontSize: 'calc(11 * var(--pv))', lineHeight: 1, fontWeight: 200, letterSpacing: '0.1em', color: '#ffffff' }}>
        © SIRUP {new Date().getFullYear()}
      </div>

      {/* Social icons (bottom right) */}
      <div className="footer-socials-row" style={{ position: 'absolute', right: 'calc(110 * var(--pv))', bottom: 'calc(85 * var(--pv))', display: 'flex', gap: 'calc(65 * var(--pv))' }}>
        {[
          { alt: 'Twitter/X', src: '/asset/img/icon-twitter.svg', href: 'https://twitter.com/IamSIRUP' },
          { alt: 'Instagram', src: '/asset/img/icon-instagram.svg', href: 'https://www.instagram.com/sirup_insta/' },
          { alt: 'YouTube', src: '/asset/img/icon-youtube.svg', href: 'https://www.youtube.com/channel/UCT0DEDLRQmlcBE93gLzWJ5A/featured' },
          { alt: 'Apple Music', src: '/asset/img/icon-apple.svg', href: 'https://music.apple.com/jp/artist/sirup/1281420386' },
          { alt: 'Spotify', src: '/asset/img/icon-spotify.svg', href: 'https://open.spotify.com/artist/1HzcHe0WFm4koBalCEOkVh' },
        ].map(({ alt, src, href }) => (
          <a key={alt} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: 'calc(20 * var(--pv))' }}>
            <img src={src} alt={alt} style={{ width: 'auto', height: '100%', filter: 'invert(1)' }} />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Velocity Ticker Component ────────────────────────────────────────────────
function VelocityTicker({ baseSpeed = 0.4, direction = 1, opacity = 1, children }) {
  const trackRef = useRef(null);
  const xPos = useRef(0);
  const { velocity } = useKineticScroll();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let oneWidth = 0;

    // Use ResizeObserver to measure repeating segment width dynamically
    const observer = new ResizeObserver(() => {
      oneWidth = track.scrollWidth / 3;
    });
    observer.observe(track);

    // Also monitor image loading to recalculate
    const imgs = track.querySelectorAll('img');
    imgs.forEach(img => {
      if (img.complete) {
        oneWidth = track.scrollWidth / 3;
      } else {
        img.addEventListener('load', () => {
          oneWidth = track.scrollWidth / 3;
        }, { once: true });
      }
    });

    function tick() {
      if (oneWidth === 0) {
        oneWidth = track.scrollWidth / 3;
        return;
      }

      // Velocity adds urgency — magnitude only (abs), direction from prop
      const scrollBoost = Math.abs(velocity.current) * 0.6;
      const advance = (baseSpeed + scrollBoost) * direction;

      xPos.current += advance;

      // Seamless loop
      if (direction < 0 && xPos.current <= -oneWidth) xPos.current += oneWidth;
      if (direction > 0 && xPos.current >= 0)        xPos.current -= oneWidth;

      track.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
    }

    gsap.ticker.add(tick);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [baseSpeed, direction, velocity]);

  return (
    <div style={{ overflow: 'hidden', width: '100%', opacity, display: 'flex', alignItems: 'center', height: '100%' }}>
      <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {/* 3 copies — covers any viewport without seam */}
        {[0, 1, 2].map(i => (
          <span key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{children}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Live Ticker Section ──────────────────────────────────────────────────
function MainLiveSection() {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div className="section-main-live" style={{ marginBottom: '4vh' }}>
      {/* Ticker 1 — moves right, dim */}
      <div className="main-live-ticker-1" style={{ position: 'absolute', left: 0, top: 'calc(-442 * var(--pv))', width: '100%', height: 'calc(235 * var(--pv))', overflow: 'hidden', mixBlendMode: 'overlay' }}>
        <VelocityTicker baseSpeed={0.35} direction={1} opacity={0.4}>
          <img
            src="https://sirup.online/5th/asset/img/ticker.svg"
            alt="SIRUP LIVE"
            style={{ height: 'calc(415 * var(--pv))', pointerEvents: 'none' }}
          />
        </VelocityTicker>
      </div>

      {/* Ticker 2 — moves left, bright */}
      <div className="main-live-ticker-2" style={{ position: 'absolute', left: 0, top: 'calc(-207 * var(--pv))', width: '100%', height: 'calc(415 * var(--pv))', overflow: 'hidden', mixBlendMode: 'overlay' }}>
        <VelocityTicker baseSpeed={0.5} direction={-1} opacity={1.0}>
          <img
            src="https://sirup.online/5th/asset/img/ticker.svg"
            alt="SIRUP LIVE"
            style={{ height: 'calc(415 * var(--pv))', pointerEvents: 'none' }}
          />
        </VelocityTicker>
      </div>

      {/* Ticker 3 — moves right, semi */}
      <div className="main-live-ticker-3" style={{ position: 'absolute', left: 0, top: 'calc(208 * var(--pv))', width: '100%', height: 'calc(235 * var(--pv))', overflow: 'hidden', mixBlendMode: 'overlay' }}>
        <VelocityTicker baseSpeed={0.4} direction={1} opacity={0.7}>
          <img
            src="https://sirup.online/5th/asset/img/ticker.svg"
            alt="SIRUP LIVE"
            style={{ height: 'calc(415 * var(--pv))', pointerEvents: 'none' }}
          />
        </VelocityTicker>
      </div>

      {/* Central CTA Button — exactly between Row 2 and Row 3 */}
      <div className="main-live-btn-box" style={{
        position: 'absolute',
        top: 'calc(208 * var(--pv))', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        pointerEvents: 'auto',
      }}>
        <button
          data-cursor="hover"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            background: btnHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
            fontFamily: "'Termina', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '14px 32px',
            cursor: 'none',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
            transform: btnHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          LIVE ARCHIVE
        </button>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const containerRef = useRef(null);
  const characterRef = useRef(null);
  const panelRef = useRef(null);
  const headlineVeslineRef = useRef(null);
  const headlineDateRef = useRef(null);
  const seventhRef = useRef(null);
  const [loaderDone, setLoaderDone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 959px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 959px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleNavigate = (target) => {
    let el = null;
    if (target === 'details') {
      el = document.querySelector('.about-photo');
    } else if (target === 'chess') {
      el = document.querySelector('.section-main-live');
    } else if (target === 'car') {
      el = document.querySelector('.section-footer-wrap');
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top;
      window.scrollTo({
        top: scrollY,
        behavior: 'smooth'
      });
    }
  };

  // ── Entrance animation (fires once loader is done) ──────────────────────────
  useGSAP(() => {
    if (!loaderDone) return;

    const tl = gsap.timeline({ defaults: { force3D: true } });

    const isMobile = window.matchMedia('(max-width: 959px)').matches;

    if (panelRef.current) {
      if (isMobile) {
        gsap.set(panelRef.current, { y: '50vh', opacity: 0 });
        tl.to(panelRef.current, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, 0.25);
      } else {
        gsap.set(panelRef.current, { yPercent: 40, opacity: 0 });
        tl.to(panelRef.current, { yPercent: 0, opacity: 1, duration: 2.4, ease: 'expo.out' }, 0);
      }
    }

    if (characterRef.current) {
      if (isMobile) {
        gsap.set(characterRef.current, { y: '50vh', opacity: 0 });
        tl.to(characterRef.current, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, 0.75);
      } else {
        gsap.set(characterRef.current, { yPercent: 110 });
        tl.to(characterRef.current, { yPercent: 0, duration: 2.6, ease: 'power4.out' }, 0.3);
      }
    }

    if (headlineDateRef.current) {
      const dateChars = headlineDateRef.current.querySelectorAll('.date-char');
      if (dateChars.length) {
        if (isMobile) {
          gsap.set(dateChars, { transformOrigin: '50% 100%', scaleY: 0, y: '12.5vh', opacity: 0 });
          tl.to(dateChars, { scaleY: 1, y: 0, opacity: 1, duration: 1.0, ease: 'power2.out', stagger: { each: 0.05 } }, 0.9);
        } else {
          gsap.set(dateChars, { y: 120, opacity: 0 });
          tl.to(dateChars, { y: 0, opacity: 1, duration: 1.6, ease: 'expo.out', stagger: { each: 0.05 } }, 0.9);
        }
      }
    }

    if (seventhRef.current) {
      const seventhChars = seventhRef.current.querySelectorAll('.date-char');
      if (seventhChars.length) {
        if (isMobile) {
          gsap.set(seventhChars, { transformOrigin: '50% 100%', scaleY: 0, y: '12.5vh', opacity: 0 });
          tl.to(seventhChars, { scaleY: 1, y: 0, opacity: 1, duration: 1.0, ease: 'power2.out', stagger: { each: 0.05 } }, 1.4);
        } else {
          gsap.set(seventhChars, { y: 160, opacity: 0 });
          tl.to(seventhChars, { y: 0, opacity: 1, duration: 1.8, ease: 'expo.out', stagger: { each: 0.08 } }, 1.4);
        }
      }
    }

    if (headlineVeslineRef.current) {
      if (isMobile) {
        const veslineChars = headlineVeslineRef.current.querySelectorAll('.vesline-char');
        if (veslineChars.length) {
          gsap.set(veslineChars, { transformOrigin: '50% 100%', scaleY: 0, y: '12.5vh', opacity: 0 });
          tl.to(veslineChars, { scaleY: 1, y: 0, opacity: 1, duration: 1.0, ease: 'power2.out', stagger: { each: 0.05 } }, 2.0);
        }
      } else {
        const inner = headlineVeslineRef.current.querySelector('.vesline-inner');
        const lastE = headlineVeslineRef.current.querySelector('.vesline-last-e');
        if (inner) {
          if (lastE) gsap.set(lastE, { opacity: 0, yPercent: -40 });
          gsap.set(inner, { xPercent: -100, y: 20 });
          tl.to(inner, { xPercent: 0, y: 0, duration: 3.5, ease: 'power4.out' }, 2.0);
          if (lastE) tl.to(lastE, { opacity: 1, yPercent: 0, duration: 0.6, ease: 'back.out(2.5)' }, 5.5);
        }
      }
    }

  }, { scope: containerRef, dependencies: [loaderDone] });

  return (
    <div ref={containerRef} className={`page page--live ${loaderDone ? 'is-active' : ''}`}>

      {/* ── Intro Loader ── */}
      {!loaderDone && (
        <IntroLoader
          logoSrc="https://sirup.online/5th/asset/img/header/header-logo.svg"
          onComplete={() => setLoaderDone(true)}
        />
      )}


      {/* ── Fixed background ── */}
      <div className="page-vanta bg-canvas-layer" style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 0, pointerEvents: 'none',
      }}>
        <div className="vanta-back" style={{ position: 'absolute', inset: 0 }}>
          <LivingBackground isPlaying={true} speed={1} colorA="#1a1a2e" colorB="#533483" />
        </div>
        <div className="vanta-front blackout-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: 0 }} />
      </div>

      {/* ── SVG Filter ── */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="sharpen-alpha" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="1.6" offset="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* ── Custom Navigation Toggle (Burger) ── */}
      {loaderDone && (
        <div className={`page-toggle ${isMenuOpen ? 'is-active' : ''}`}>
          <div data-insert>
            <button
              className={isMenuOpen ? 'is-active' : ''}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      )}

      {/* ── Curtain Drawer Menu Overlay ── */}
      <PageNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenPlayer={() => setIsPlayerOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* ── Floating Glassmorphic Music Player ── */}
      <MusicPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />

      {/* ── Navbar ── */}
      <ScrollHeader
        logoSrc="https://sirup.online/5th/asset/img/header/header-logo.svg"
        socials={[
          { key: 'x', href: '#', svg: SVGS.x },
          { key: 'ig', href: '#', svg: SVGS.ig },
          { key: 'yt', href: '#', svg: SVGS.yt },
          { key: 'sp', href: '#', svg: SVGS.sp },
          { key: 'tk', href: '#', svg: SVGS.tk },
        ]}
        zIndex={100}
      />

      {/* ── Kinetic Physics Engine ── */}
      <KineticScrollProvider>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION: HEADER  (section-header)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="section-header" style={{ zIndex: 30 }}>

          {/* Panel dome */}
          <ParallaxLayer parallaxFactor={0} zIndex={10}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(1000 * var(--pv))"
              className="header-panel"
              style={{ width: 'calc(2880 * var(--pv))', height: 'auto' }}
            >
              <div className="panel-container" style={{ position: 'relative', width: '100%', height: 'auto', transformStyle: 'preserve-3d' }}>
                <picture style={{ display: 'block', width: '100%', height: 'auto' }}>
                  <source srcSet="https://sirup.online/5th/asset/img/header/sd/header-panel.webp" media="(max-width: 960px)" type="image/webp" />
                  <img ref={panelRef} src="https://sirup.online/5th/asset/img/header/pc/header-panel.webp" alt=""
                    decoding="async" style={{ width: '100%', height: 'auto', pointerEvents: 'none', willChange: 'transform' }} />
                </picture>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* Character */}
          <ParallaxLayer parallaxFactor={0} zIndex={30}>
            <CharacterParallax ref={characterRef} alt="SIRUP" />
          </ParallaxLayer>

          {/* VESLINE logo */}
          <ParallaxLayer parallaxFactor={-2} zIndex={20}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
              className="hero-vesline-card"
              style={{
                position: 'absolute', left: '50%',
                transform: 'translateX(calc(-50% - 19vw))',
                top: 'calc(27vh + 15.2vw)',
                zIndex: 20, pointerEvents: 'none',
                width: '55vw', maxWidth: '1160px', display: 'block', height: 'auto',
              }}
            >
              <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}>
                <div ref={headlineVeslineRef} style={{ overflow: 'hidden', pointerEvents: 'none' }}>
                  <div className="vesline-inner" style={{
                    display: 'block', width: '100%', opacity: 0.92,
                    mixBlendMode: 'screen', filter: HERO_SHADOW,
                  }}>
                    <HeroLogo fill="#ffffff" width="100%" maxWidth="none" />
                  </div>
                </div>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* Date 2007-2012 */}
          <ParallaxLayer parallaxFactor={-1.5} zIndex={20}>
            <div className="hero-date-box" style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '24vh',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vw',
              zIndex: 20, pointerEvents: 'none',
            }}>
              <HoverParallaxCard
                mode="global-tilt" maxTilt={-15} perspective={1920}
                globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
                style={{ pointerEvents: 'none', width: '100%', display: 'block', height: 'auto' }}
              >
                <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}>
                  <div ref={headlineDateRef} style={{ display: 'flex', justifyContent: 'center' }}>
                    <DateSVG date="2007-2012" height="6.5vw" style={{
                      opacity: 0.92, transform: 'translateY(5.8vw) scaleY(1.04)',
                      mixBlendMode: 'screen', filter: HERO_SHADOW,
                    }} />
                  </div>
                </div>
              </HoverParallaxCard>
              {/* spacer for VESLINE */}
              <div aria-hidden="true" style={{ width: '47vw', maxWidth: '1100px', height: '26.44vw', flexShrink: 0, transform: 'translateX(-10vw) translateY(-4.6vw)' }} />
            </div>
          </ParallaxLayer>

          {/* 7th badge */}
          <ParallaxLayer parallaxFactor={-2.5} zIndex={20}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
              className="hero-seventh-card"
              style={{
                position: 'absolute', right: '25vw', top: '57vh',
                zIndex: 20, pointerEvents: 'none',
                width: '12vw', display: 'block', height: 'auto',
              }}
            >
              <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}>
                <div ref={seventhRef}>
                  <DateSVG date="7th" height="100%" style={{
                    opacity: 0.92, width: '100%', mixBlendMode: 'screen', filter: HERO_SHADOW,
                  }} />
                </div>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* Anniversary title + Synapse text */}
          <ParallaxLayer parallaxFactor={-2} zIndex={20}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
              className="hero-anniversary-card"
              style={{
                position: 'absolute', top: '95vh', left: '50%',
                transform: 'translateX(-50%)', width: '50vw',
                zIndex: 20, display: 'block', height: 'auto',
              }}
            >
              <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto', position: 'relative' }}>
                <img src="https://sirup.online/5th/asset/img/header/pc/header-title-24.svg" alt="2017-2022 5th ANNIVERSARY"
                  style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div className="hero-synapse-text" style={{ position: 'absolute', top: '35px', left: '620px', width: '200px', zIndex: 60 }}>
                  <FocalText>
                    <p style={{
                      margin: 0, padding: 0,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: '12px', lineHeight: '18px', fontWeight: 400,
                      textAlign: 'left', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.498021px',
                    }}>
                      {'\u30672017\u5e74\u306b\u30c7\u30d3\u30e5\u30fc\u30b7\u30f3\u30b0\u30eb\u300cSynapse\u300d\u3092\u30ea\u30ea\u30fc\u30b9'}
                      <br />
                      {'\u3053\u308c\u307e\u3067\u306b2\u679a\u306e\u30d5\u30eb\u30a2\u30eb\u30d0\u30e0\u30683\u679a\u306eEP\u4f5c\u54c1\u3092'}
                      <br />
                      {'\u30ea\u30ea\u30fc\u30b9\u3057\u3066\u304d\u305fSIRUP\u304c2022\u5e74'}
                      <br />
                      {'\u30c7\u30d3\u30e5\u30fc5\u5468\u5e74\u3092\u8fce\u3048\u305f\u3002'}
                    </p>
                  </FocalText>
                </div>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* ABOUT title vertical */}
          <div className="about-title-vertical" style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '180vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vw',
            zIndex: 40, pointerEvents: 'none',
          }}>
            <img src="/about_title (1).png" alt="ABOUT" style={{ width: '35vw', height: 'auto', opacity: 0.8, transform: 'translateX(36vw) translateY(-6vw) rotate(90deg)' }} />
            <div style={{ width: '52vw', height: 'auto', opacity: 0.8, transform: 'translateX(29vw) translateY(0vw) rotate(90deg)' }}>
              <HeroLogo fill="#ffffff" width="100%" maxWidth="none" />
            </div>
          </div>

          {/* About Photo Strip */}
          <AboutPhotoStrip />

          {/* About Text */}
          <div className="about-text-block" style={{ position: 'absolute', top: '170vh', left: '11.5vw', width: '280px', zIndex: 60 }}>
            <FocalText>
              <StaggeredTextReveal startTrigger="top 90%" style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '10.5px', fontWeight: 400, lineHeight: 2.0,
                textAlign: 'left', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', margin: 0,
              }} lines={[
                'ラップと歌を自由に行き来する',
                'ボーカルスタイルと、',
                '自身のルーツであるネオソウル、R&B、ゴスペルと',
                'HIPHOPを融合したジャンルに捉われない音楽で、',
                'イギリス出身の「Years & Years」や',
                'アイリッシュウイスキー「JAMESON」と',
                '国内外問わず様々なアーティストやクリエイターと',
                'コラボレーションも果たすなど',
                '日本を代表するR&Bシンガーとして',
                '音楽のみならず様々な分野で活躍を広げている。'
              ]} />
            </FocalText>
          </div>

          {/* Roots Photo Strip */}
          <RootsPhotoStrip />

          {/* Roots Text */}
          <div className="roots-text-block" style={{ position: 'absolute', top: 'calc(180vw - 925px)', left: '10vw', width: '323px', zIndex: 60 }}>
            <FocalText>
              <StaggeredTextReveal style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '12.5px', fontWeight: 400, lineHeight: 2.2,
                textAlign: 'left', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', margin: 0,
              }} lines={[
                'かつて掘り下げたネオソウルの楽曲から始まり',
                '自身の "歌" のスタイルを確立する上で大きな影響を受けた',
                '同時代のアーティストまで、',
                'ラッパー、R&Bシンガー、バンドなど様々なジャンルのアーティストと',
                '共演するSIRUPを理解するためのヒントとなる楽曲を',
                'プレイリストとして振り返る。'
              ]} />
            </FocalText>
          </div>

          {/* Roots Playlist Button */}
          <div className="roots-btn-block" style={{ position: 'absolute', top: 'calc(180vw - 640px)', left: '25vw', zIndex: 60 }}>
            <MagneticBadge
              label={"KEEP IN TOUCH\nPLAYLIST"}
              onClick={() => setIsPlayerOpen(true)}
            />
          </div>

          {/* ROOTS title */}
          <img src="/roots_title.png" alt="ROOTS" className="roots-title-vertical" style={{
            position: 'absolute', left: '-5vw', top: '195vh',
            width: '60vw', height: 'auto', opacity: 0.8,
            zIndex: 20, pointerEvents: 'none',
          }} />



        </div>{/* end section-header */}

        {/* Rotating Album Showcase Section */}
        <RotatingAlbum />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION: MAIN LIVE (ticker banners)
        ═══════════════════════════════════════════════════════════════════ */}
        <MainLiveSection />

        {/* Budokan 3D Box Album Scroll Showcase */}
        <BudokanAlbumScroll />

        {/* DVD Section */}
        <DvdSection />

        {/* Be The Groove Section */}
        <BeTheGrooveSection />

        {/* Setlist Section */}
        <SetlistSection />


        {/* Chess Showcase */}
        {!isMobile && <ChessShowcase />}


        {/* ═══════════════════════════════════════════════════════════════════
            SECTION: FOOTER
        ═══════════════════════════════════════════════════════════════════ */}
        <FooterSection />

      </KineticScrollProvider>

      {/* Noise overlay — always last */}
      <NoiseOverlay />

      {/* Keyframe animations injected globally */}
      <style>{`
        @keyframes footer-tickerL { 0% { transform: translate(0,0); } 100% { transform: translate(-50%,0); } }
        @keyframes footer-tickerR { 0% { transform: translate(0,0); } 100% { transform: translate(50%,0); } }
        @keyframes footer-rotateY { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        #bg-wrapper, #bg-wrapper > div, #bg-wrapper canvas { width:100%!important; height:100%!important; display:block!important; }
        #bg-wrapper > div { flex:1!important; }
        .burger { background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:4px; opacity:.85; transition:opacity .2s; }
        .burger:hover { opacity:1; }
        .bar { display:block; width:24px; height:2px; background:#fff; border-radius:1px; }
        .logo { position:absolute; left:50%; transform:translateX(-50%); font-family:'Great Vibes',cursive; font-weight:400; font-size:46px; color:#fff; pointer-events:none; }
        .socials { display:flex; align-items:center; gap:18px; }
        .si { color:rgba(255,255,255,0.55); display:flex; transition:color .2s; }
        .si:hover { color:#fff; }
      `}</style>

    </div>
  );
}
