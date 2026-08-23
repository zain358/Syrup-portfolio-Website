import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MobileBudokanAlbum() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    let renderer, camera, scene, textureLoader;
    let frontTexture, sideTexture;
    let containerGroup, liveGroup;
    let animationFrameId;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || 450;

    scene = new THREE.Scene();

    const fov = 45;
    camera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 2000);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.userSelect = 'none';
    renderer.domElement.style.webkitUserSelect = 'none';
    renderer.domElement.style.webkitTapHighlightColor = 'transparent';

    textureLoader = new THREE.TextureLoader();
    frontTexture = textureLoader.load('/asset/img/canvas/front/00000000.jpg');
    sideTexture = textureLoader.load('/asset/img/canvas/side/00000000.jpg');

    const frontSize = 1.0;
    const sideSize = 0.0625;

    containerGroup = new THREE.Object3D();
    scene.add(containerGroup);

    liveGroup = new THREE.Object3D();
    liveGroup.scale.set(0, 0, 0);
    liveGroup.rotation.y = THREE.MathUtils.degToRad(-720);
    containerGroup.add(liveGroup);

    const liveCastContainer = new THREE.Object3D();
    liveCastContainer.rotation.x = THREE.MathUtils.degToRad(-90);
    liveCastContainer.rotation.y = THREE.MathUtils.degToRad(10);
    liveGroup.add(liveCastContainer);

    const frontGeo = new THREE.PlaneGeometry(frontSize, frontSize, 1, 1);
    const frontMat1 = new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.DoubleSide });
    const frontMesh1 = new THREE.Mesh(frontGeo, frontMat1);
    frontMesh1.position.y = sideSize / 2;
    frontMesh1.rotation.x = THREE.MathUtils.degToRad(-90);
    frontMesh1.rotation.z = THREE.MathUtils.degToRad(180);
    liveCastContainer.add(frontMesh1);

    const frontMat2 = new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.DoubleSide });
    const frontMesh2 = new THREE.Mesh(frontGeo, frontMat2);
    frontMesh2.position.y = -sideSize / 2;
    frontMesh2.rotation.x = THREE.MathUtils.degToRad(90);
    liveCastContainer.add(frontMesh2);

    const sideGeo = new THREE.PlaneGeometry(frontSize, sideSize, 1, 1);
    const sideMat = new THREE.MeshBasicMaterial({ map: sideTexture, side: THREE.DoubleSide });

    const sideMesh0 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh0.position.z = -frontSize / 2;
    sideMesh0.rotation.y = THREE.MathUtils.degToRad(180);
    liveCastContainer.add(sideMesh0);

    const sideMesh1 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh1.position.x = frontSize / 2;
    sideMesh1.rotation.y = THREE.MathUtils.degToRad(90);
    liveCastContainer.add(sideMesh1);

    const sideMesh2 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh2.position.z = frontSize / 2;
    sideMesh2.rotation.y = THREE.MathUtils.degToRad(0);
    liveCastContainer.add(sideMesh2);

    const sideMesh3 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh3.position.x = -frontSize / 2;
    sideMesh3.rotation.y = THREE.MathUtils.degToRad(-90);
    liveCastContainer.add(sideMesh3);

    const updateCameraFraming = (w, h) => {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const radian = (fov / 2) * (Math.PI / 180);
      const distance = 0.5 / Math.tan(radian);
      camera.position.z = distance * 1.5;
    };
    updateCameraFraming(width, height);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: window,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(liveGroup.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            duration: 1.0,
            ease: 'power2.out'
          });

          gsap.to(liveGroup.rotation, {
            y: 0,
            duration: 2.0,
            ease: 'power2.out'
          });
        }
      });

      gsap.to(liveGroup.position, {
        y: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: window,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      const vantaEl = document.querySelectorAll('.vanta-front');
      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: window,
        start: 'top 75%',
        end: 'bottom 25%',
        onEnter: () => gsap.to(vantaEl, { opacity: 0.8, duration: 1.0, ease: 'power2.out' }),
        onLeave: () => gsap.to(vantaEl, { opacity: 0, duration: 1.0, ease: 'power2.out' }),
        onEnterBack: () => gsap.to(vantaEl, { opacity: 0.8, duration: 1.0, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(vantaEl, { opacity: 0, duration: 1.0, ease: 'power2.out' }),
      });
    }, containerRef);

    const animate = () => {
      containerGroup.rotation.y += THREE.MathUtils.degToRad(0.15);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      updateCameraFraming(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      frontGeo.dispose();
      sideGeo.dispose();
      frontMat1.dispose();
      frontMat2.dispose();
      sideMat.dispose();
      frontTexture.dispose();
      sideTexture.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="budokan-album-scroll"
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        padding: '20px 0',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',

        pointerEvents: 'none',
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          pointerEvents: 'none',
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'none',
            touchAction: 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
}

export default function BudokanAlbumScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 959px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let renderer, camera, scene, textureLoader;
    let frontTexture, sideTexture;
    let containerGroup, liveGroup;
    let animationFrameId;
    let observer;
    let hasAnimatedIn = false;

    let currentRotY = THREE.MathUtils.degToRad(-720); 

    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    scene = new THREE.Scene();

    const fov = 45;
    camera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 2000);
    
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !(/Android|iPhone|iPad/i.test(navigator.userAgent)),
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.innerWidth < 960 ? 1 : Math.min(window.devicePixelRatio, 2));

    textureLoader = new THREE.TextureLoader();
    frontTexture = textureLoader.load('/asset/img/canvas/front/00000000.jpg');
    sideTexture = textureLoader.load('/asset/img/canvas/side/00000000.jpg');

    const frontSize = 1.0;
    const sideSize = 0.0625;

    containerGroup = new THREE.Object3D();
    scene.add(containerGroup);

    liveGroup = new THREE.Object3D();
    liveGroup.scale.set(0, 0, 0); 
    liveGroup.rotation.y = currentRotY; 
    containerGroup.add(liveGroup);

    const liveCastContainer = new THREE.Object3D();
    liveCastContainer.rotation.x = THREE.MathUtils.degToRad(-90);
    liveCastContainer.rotation.y = THREE.MathUtils.degToRad(10);
    liveGroup.add(liveCastContainer);

    const frontGeo = new THREE.PlaneGeometry(frontSize, frontSize, 1, 1);
    const frontMat1 = new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.DoubleSide });
    const frontMesh1 = new THREE.Mesh(frontGeo, frontMat1);
    frontMesh1.position.y = sideSize / 2;
    frontMesh1.rotation.x = THREE.MathUtils.degToRad(-90);
    frontMesh1.rotation.z = THREE.MathUtils.degToRad(180);
    liveCastContainer.add(frontMesh1);

    const frontMat2 = new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.DoubleSide });
    const frontMesh2 = new THREE.Mesh(frontGeo, frontMat2);
    frontMesh2.position.y = -sideSize / 2;
    frontMesh2.rotation.x = THREE.MathUtils.degToRad(90);
    liveCastContainer.add(frontMesh2);

    const sideGeo = new THREE.PlaneGeometry(frontSize, sideSize, 1, 1);
    const sideMat = new THREE.MeshBasicMaterial({ map: sideTexture, side: THREE.DoubleSide });
    
    const sideMesh0 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh0.position.z = -frontSize / 2;
    sideMesh0.rotation.y = THREE.MathUtils.degToRad(180);
    liveCastContainer.add(sideMesh0);

    const sideMesh1 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh1.position.x = frontSize / 2;
    sideMesh1.rotation.y = THREE.MathUtils.degToRad(90);
    liveCastContainer.add(sideMesh1);

    const sideMesh2 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh2.position.z = frontSize / 2;
    sideMesh2.rotation.y = THREE.MathUtils.degToRad(0);
    liveCastContainer.add(sideMesh2);

    const sideMesh3 = new THREE.Mesh(sideGeo, sideMat);
    sideMesh3.position.x = -frontSize / 2;
    sideMesh3.rotation.y = THREE.MathUtils.degToRad(-90);
    liveCastContainer.add(sideMesh3);

    // Exact original site camera logic
    const updateCameraFraming = (w, h) => {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const radian = (fov / 2) * (Math.PI / 180);
      const distance = 0.5 / Math.tan(radian);
      const sf = Math.min(window.innerWidth, 1920) / 1920;
      camera.position.z = distance / sf;
    };
    updateCameraFraming(width, height);

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!hasAnimatedIn && entry.isIntersecting) {
          hasAnimatedIn = true;
          // Scale to a MASSIVE size (0.85 on PC, 1.2 on mobile)
          const targetScale = window.innerWidth >= 960 ? 0.85 : 1.2;
          gsap.to(liveGroup.scale, {
            x: targetScale,
            y: targetScale,
            z: targetScale,
            duration: 1.0,
            ease: 'power2.out'
          });

          gsap.to(liveGroup.rotation, {
            y: 0,
            duration: 2.0,
            ease: 'power2.out'
          });
        }
      });
    }, { root: null, rootMargin: '-10% 0%' });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const animate = () => {
      containerGroup.rotation.y += THREE.MathUtils.degToRad(0.15);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      updateCameraFraming(w, h);
      
      // Update scale on resize
      const targetScale = window.innerWidth >= 960 ? 0.85 : 1.2;
      gsap.to(liveGroup.scale, {
        x: targetScale, y: targetScale, z: targetScale,
        duration: 0.5, ease: 'power2.out'
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      
      frontGeo.dispose();
      sideGeo.dispose();
      frontMat1.dispose();
      frontMat2.dispose();
      sideMat.dispose();
      frontTexture.dispose();
      sideTexture.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, [isMobile]);

  if (isMobile) {
    return <MobileBudokanAlbum />;
  }

  return (
    <div className="budokan-album-scroll" tabIndex={0} role="region" aria-label="3D Budokan Live Stage Animation" style={{
      position: 'relative',
      width: '100%',
      height: '140vh', /* Makes the screen "big" so bounds push off monitor edge */
      minHeight: '800px',
      marginTop: 'calc(-100 * var(--pv))',
      zIndex: 25,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible'
    }}>
      <div ref={containerRef} style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}>
        <canvas ref={canvasRef} style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }} />
      </div>
    </div>
  );
}
