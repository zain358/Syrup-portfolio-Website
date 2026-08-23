import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useKineticScroll } from './KineticScrollProvider';
import { flipImage } from './useFlipImage';

gsap.registerPlugin(ScrollTrigger);

const BOXES = [
  { w: '55vw', h: '31vw', top: '12vh',  left: '22vw',  pStart: 0.25, pEnd: 0.75 },
  { w: '17vw', h: '10vw', top: '5vh',   left: '3vw',   pStart: 0.35, pEnd: 0.82 },
  { w: '30vw', h: '17vw', top: '4vh',   right: '3vw',  pStart: 0.45, pEnd: 0.90 },
  { w: '28vw', h: '16vw', top: '52vh',  left: '4vw',   pStart: 0.55, pEnd: 1.00 },
];

function drawClipped(ctx, video, rect) {
  if (!video.videoWidth) return;
  const vAspect = video.videoWidth / video.videoHeight;
  const wAspect = window.innerWidth / window.innerHeight;
  let dW, dH, dX, dY;
  if (vAspect > wAspect) {
    dH = window.innerHeight; dW = dH * vAspect;
    dX = (window.innerWidth - dW) / 2; dY = 0;
  } else {
    dW = window.innerWidth; dH = dW / vAspect;
    dX = 0; dY = (window.innerHeight - dH) / 2;
  }
  const sx = (rect.left - dX) * (video.videoWidth / dW);
  const sy = (rect.top  - dY) * (video.videoHeight / dH);
  const sw = rect.width  * (video.videoWidth / dW);
  const sh = rect.height * (video.videoHeight / dH);
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, rect.width, rect.height);
}

// Hook: make a ref element draggable (mouse + touch)
function useDraggable(elRef) {
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let dragging = false, ox = 0, oy = 0;

    const onDown = (cx, cy) => {
      dragging = true;
      const rect = el.getBoundingClientRect();
      ox = cx - rect.left;
      oy = cy - rect.top;
      el.style.cursor = 'grabbing';
      el.style.zIndex  = 20;
      el.style.left    = rect.left + 'px';
      el.style.top     = rect.top  + 'px';
      el.style.right   = 'unset';
    };
    const onMove = (cx, cy) => {
      if (!dragging) return;
      el.style.left = (cx - ox) + 'px';
      el.style.top  = (cy - oy) + 'px';
    };
    const onUp = () => {
      dragging = false;
      el.style.cursor = 'grab';
      el.style.zIndex  = 3;
    };

    const md = e => onDown(e.clientX, e.clientY);
    const mm = e => onMove(e.clientX, e.clientY);
    const mu = ()  => onUp();
    const ts = e => { e.preventDefault(); onDown(e.touches[0].clientX, e.touches[0].clientY); };
    const tm = e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); };

    el.addEventListener('mousedown',  md);
    el.addEventListener('touchstart', ts, { passive: false });
    window.addEventListener('mousemove',  mm);
    window.addEventListener('mouseup',    mu);
    window.addEventListener('touchmove',  tm, { passive: false });
    window.addEventListener('touchend',   mu);

    return () => {
      el.removeEventListener('mousedown',  md);
      el.removeEventListener('touchstart', ts);
      window.removeEventListener('mousemove',  mm);
      window.removeEventListener('mouseup',    mu);
      window.removeEventListener('touchmove',  tm);
      window.removeEventListener('touchend',   mu);
    };
  }, [elRef]);
}

function VideoBox({ box, index, videoRef, canvasRefs }) {
  const boxRef = useRef(null);
  useDraggable(boxRef);

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        width: box.w, height: box.h,
        top: box.top,
        left: box.left   || undefined,
        right: box.right || undefined,
        zIndex: 3,
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
        cursor: 'grab',
        willChange: 'transform, opacity',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={el => canvasRefs.current[index] = el}
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      />
    </div>
  );
}

export default function ChessShowcase() {
  const wrapperRef      = useRef(null);
  const stageRef        = useRef(null);
  const flyRef          = useRef(null);
  const nextSecRef      = useRef(null);
  const startRef        = useRef(null);
  const videoRef        = useRef(null);
  const canvasRefs      = useRef([]);
  const rafRef          = useRef(null);
  const shaderCanvasRef = useRef(null);
  const shaderMaterialRef = useRef(null);
  const { lerpY, addTick, removeTick } = useKineticScroll();

  // Canvas draw loop for video masking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const loop = () => {
      canvasRefs.current.forEach(canvas => {
        if (!canvas) return;
        const ctx  = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width  = rect.width;
        canvas.height = rect.height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        drawClipped(ctx, video, rect);
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    const onLoaded = () => { video.play(); loop(); };
    video.addEventListener('loadeddata', onLoaded);
    if (video.readyState >= 2) onLoaded();
    return () => {
      video.removeEventListener('loadeddata', onLoaded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // WebGL Shader setup for Ironhill noise dissolve transition
  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });

    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform vec2 uResolution;
        uniform vec3 uColor;
        uniform float uSpread;
        varying vec2 vUv;

        float Hash(vec2 p) {
          vec3 p2 = vec3(p.xy, 1.0);
          return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
        }

        float noise(in vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f *= f * (3.0 - 2.0 * f);
          return mix(
            mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
            mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          v += noise(p * 1.0) * 0.5;
          v += noise(p * 2.0) * 0.25;
          v += noise(p * 4.0) * 0.125;
          return v;
        }

        void main() {
          vec2 uv = vUv;
          float aspect = uResolution.x / uResolution.y;
          vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
          
          float dissolveEdge = uv.y - uProgress * 1.25;
          float noiseValue = fbm(centeredUv * 15.0);
          float d = dissolveEdge + noiseValue * uSpread;
          
          float pixelSize = 1.0 / uResolution.y;
          float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(w, h) },
        uColor: { value: new THREE.Vector3(0.0, 0.0, 0.0) }, // black curtain dissolving away
        uSpread: { value: 0.5 },
      },
      transparent: true,
    });
    shaderMaterialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const rw = window.innerWidth;
      const rh = window.innerHeight;
      renderer.setSize(rw, rh);
      material.uniforms.uResolution.value.set(rw, rh);
    };
    window.addEventListener('resize', onResize);

    let rafId;
    const animate = () => {
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Main scroll tick: 3 stages (Flip -> Strategic Gaming -> Ironhill Noise Dissolve)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage   = stageRef.current;
    const fly     = flyRef.current;
    const nextSec = nextSecRef.current;
    if (!wrapper || !stage || !fly || !nextSec) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    gsap.set(nextSec, { y: vh });

    const tick = () => {
      const scrollY = lerpY.current;
      const top     = wrapper.offsetTop;
      const trackH  = wrapper.offsetHeight - vh;
      if (trackH <= 0) return;

      const raw       = scrollY - top;
      const startLock = top;
      const endLock   = top + trackH;
      
      const phase1End = trackH * 0.45;
      const phase2End = trackH * 0.75;

      // Phase 1: Setlist flip image flies out + grows
      if (scrollY >= startLock && !startRef.current) {
        const r = flipImage.rect || { left: vw/2 - 160, top: vh/2 - 90, width: 320, height: 180 };
        startRef.current = r;
        fly.style.backgroundImage = `url(${flipImage.src})`;
      }
      if (scrollY < startLock) startRef.current = null;

      const s = startRef.current;
      if (s) {
        const p = Math.max(0, Math.min(1, raw / phase1End));
        const e = 1 - Math.pow(1 - p, 3);
        fly.style.opacity   = 1;
        fly.style.transform = `translate(${s.left + (0 - s.left) * e}px, ${s.top + (0 - s.top) * e}px)`;
        fly.style.width     = `${s.width  + (vw - s.width)  * e}px`;
        fly.style.height    = `${s.height + (vh - s.height) * e}px`;
      }

      // Phase 2: Strategic Gaming panel slides up + boxes expand from tiny pixel samples
      const p2 = Math.max(0, Math.min(1, (raw - phase1End) / (phase2End - phase1End)));
      const e2 = p2 * (2 - p2);
      nextSec.style.transform = `translateY(${(1 - e2) * 100}%)`;

      BOXES.forEach((b, i) => {
        const boxEl = canvasRefs.current[i]?.parentElement;
        if (!boxEl) return;
        const bp = Math.max(0, Math.min(1, (p2 - (b.pStart || 0)) / ((b.pEnd || 1) - (b.pStart || 0))));
        const be = 1 - Math.pow(1 - bp, 3);
        const scale = 0.03 + 0.97 * be;
        const opacity = bp > 0 ? Math.min(1, bp * 3) : 0;
        boxEl.style.opacity = opacity;
        boxEl.style.transform = `scale(${scale})`;
      });

      // Phase 3: Ironhill organic noise/smoke dissolve into site background below
      const p3 = Math.max(0, Math.min(1, (raw - phase2End) / (trackH - phase2End)));
      if (shaderMaterialRef.current) {
        shaderMaterialRef.current.uniforms.uProgress.value = p3 * 1.25;
      }
      if (shaderCanvasRef.current) {
        shaderCanvasRef.current.style.opacity = p3 > 0 ? 1 : 0;
        shaderCanvasRef.current.style.pointerEvents = p3 > 0 && p3 < 1 ? 'auto' : 'none';
      }
      if (nextSec) {
        nextSec.style.opacity = p3 > 0 ? Math.max(0, 1 - p3 * 3) : 1;
      }

      // Stage lock all the way across all 3 phases
      if (scrollY < startLock)    stage.style.transform = 'translateY(0)';
      else if (scrollY > endLock) stage.style.transform = `translateY(${trackH}px)`;
      else                        stage.style.transform = `translateY(${scrollY - startLock}px)`;
    };

    addTick(tick);
    return () => removeTick(tick);
  }, [lerpY, addTick, removeTick]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', height: '650vh' }}>
      <div
        ref={stageRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100vh',
          overflow: 'hidden', willChange: 'transform',
        }}
      >
        {/* Phase 1: Flip image */}
        <div
          ref={flyRef}
          style={{
            position: 'fixed', top: 0, left: 0, opacity: 0,
            backgroundSize: 'cover', backgroundPosition: 'center',
            willChange: 'transform, width, height', zIndex: 1,
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Phase 2: Strategic Gaming panel */}
        <div
          ref={nextSecRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            background: '#000', zIndex: 10,
            overflow: 'hidden', willChange: 'transform',
          }}
        >
          <video ref={videoRef} src="/chess.mp4" muted loop playsInline style={{ display: 'none' }} />

          {/* Draggable canvas boxes */}
          {BOXES.map((b, i) => (
            <VideoBox key={i} box={b} index={i} videoRef={videoRef} canvasRefs={canvasRefs} />
          ))}

          {/* Label + title */}
          <div style={{
            position: 'absolute', bottom: '8vh', right: '4vw',
            textAlign: 'right', color: '#fff', zIndex: 4, pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '5px',
              color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
              display: 'block', marginBottom: '10px',
            }}>
              Next Chapter
            </span>
            <h3 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 900,
              letterSpacing: '3px', textTransform: 'uppercase', margin: 0, lineHeight: 1.1,
            }}>
              Strategic<br />Gaming
            </h3>
            <p style={{
              marginTop: '16px', fontSize: '13px', lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)', maxWidth: '280px', marginLeft: 'auto',
            }}>
              A world of calculated moves,<br />
              precision and patience.<br />
              The board is set.
            </p>
          </div>
        </div>

        {/* Phase 3: Ironhill WebGL Noise Dissolve Canvas overlay */}
        <canvas
          ref={shaderCanvasRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            zIndex: 15, opacity: 0, pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
