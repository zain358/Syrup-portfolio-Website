import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ALBUM_DATA = {
  cure: {
    title: 'cure',
    date: '2021.03.17',
    type: '2nd Album',
    description: '前作「FEEL GOOD」から約2年ぶりとなる待望の2ndフルアルバム。国内外のクリエイターとコラボレーションし、ネオソウル、R&B、ファンクなど多彩なブラックミュージックのエッセンスを昇華させた、SIRUPのアイデンティティを確立した名盤。',
    frontImg: '/setlist/cure-front.jpg',
    cdImg: '/setlist/cure-cd.jpg',
    links: {
      apple: 'https://music.apple.com/jp/album/cure/1553832332',
      spotify: 'https://open.spotify.com/album/0rczckrcajbB2EOgcMBADk'
    }
  },
  groove: {
    title: 'BE THE GROOVE',
    date: '2022.10.12',
    type: 'Digital Single',
    description: 'プロデュースにMori Zentaroを迎え、ダンスミュージックの快楽性を追求したバウンシーなトラック。BOSE「QuietComfort Earbuds II」のタイアップ曲としても話題を呼び、フロアを揺らすグルーヴィーなフローが特徴。',
    frontImg: '/setlist/groove-front.jpg',
    cdImg: '/setlist/groove-cd.jpg',
    links: {
      apple: 'https://music.apple.com/album/id/1646401930',
      spotify: 'https://open.spotify.com/album/1MJdzLW8rQadytAc39Lmnb'
    }
  }
};

export default function RotatingAlbum() {
  const [activeAlbum, setActiveAlbum] = useState('cure');
  const sectionRef = useRef(null);
  const cdRef = useRef(null);
  const jacketRef = useRef(null);
  const triggerRef = useRef(null);

  const data = ALBUM_DATA[activeAlbum];

  useEffect(() => {
    // Kill any existing ScrollTrigger animations on this component
    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === sectionRef.current) {
        t.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Create scroll-linked animation
      gsap.fromTo(cdRef.current,
        {
          x: 0,
          rotation: 0
        },
        {
          x: '50%',
          rotation: 720,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 1,
            // markers: false
          }
        }
      );

      // Subtle parallax scale/tilt on jacket
      gsap.fromTo(jacketRef.current,
        {
          y: -10,
          scale: 0.98
        },
        {
          y: 10,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 1
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeAlbum]);

  return (
    <div ref={sectionRef} className="container-album-showcase" tabIndex={0} role="region" aria-label="Rotating Album Showcase" style={{
      position: 'relative',
      width: '100%',
      backgroundColor: 'transparent',
      overflow: 'hidden',
      padding: '100px 0',
      zIndex: 40
    }}>
      {/* Background blur highlight */}
      <div className="album-bg-blur" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        backgroundColor: activeAlbum === 'cure' ? 'rgba(83, 52, 131, 0.15)' : 'rgba(255, 57, 0, 0.12)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transition: 'background-color 0.8s ease'
      }} />

      <div className="album-showcase-wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 40px',
        gap: '60px'
      }}>
        
        {/* Left Side: Release Information */}
        <div className="album-info-col" style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          color: '#FF3900'
        }}>
          {/* Album Toggle Selector */}
          <div className="album-selector" style={{
            display: 'flex',
            gap: '10px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '5px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 57, 0, 0.2)',
            marginBottom: '10px'
          }}>
            <button 
              onClick={() => setActiveAlbum('cure')}
              style={{
                padding: '8px 20px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: activeAlbum === 'cure' ? '#FF3900' : 'transparent',
                color: activeAlbum === 'cure' ? '#ffffff' : '#FF3900',
                cursor: 'pointer',
                fontFamily: "'Termina', sans-serif",
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              CURE
            </button>
            <button 
              onClick={() => setActiveAlbum('groove')}
              style={{
                padding: '8px 20px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: activeAlbum === 'groove' ? '#FF3900' : 'transparent',
                color: activeAlbum === 'groove' ? '#ffffff' : '#FF3900',
                cursor: 'pointer',
                fontFamily: "'Termina', sans-serif",
                fontSize: '11px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              BE THE GROOVE
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{
              fontFamily: "'Termina', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              opacity: 0.8
            }}>
              {data.type}
            </span>
            <h3 style={{
              fontFamily: "'Termina', sans-serif",
              fontSize: '38px',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>
              {data.title}
            </h3>
            <span style={{
              fontFamily: "'Termina', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              marginTop: '5px'
            }}>
              {data.date} RELEASE
            </span>
          </div>

          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: '13.5px',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.75)',
            margin: '10px 0 15px 0',
            textAlign: 'left',
            fontWeight: 300
          }}>
            {data.description}
          </p>

          <div className="album-links" style={{
            display: 'flex',
            gap: '20px',
            marginTop: '5px'
          }}>
            <a href={data.links.apple} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 57, 0, 0.3)',
              backgroundColor: 'rgba(255, 57, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF3900';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 57, 0, 0.05)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <img src="/setlist/link-apple-pc.png" alt="Apple Music" style={{ width: '20px', height: 'auto', filter: 'brightness(10)' }} />
            </a>
            <a href={data.links.spotify} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 57, 0, 0.3)',
              backgroundColor: 'rgba(255, 57, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF3900';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 57, 0, 0.05)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <img src="/setlist/link-spotify-pc.png" alt="Spotify" style={{ width: '20px', height: 'auto', filter: 'brightness(10)' }} />
            </a>
          </div>
        </div>

        {/* Right Side: Rotating Album Artwork */}
        <div className="album-artwork-col" style={{
          position: 'relative',
          width: '460px',
          height: '350px',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0
        }}>
          {/* Square Cover Jacket */}
          <div ref={jacketRef} className="album-jacket-shadow" style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '320px',
            height: '320px',
            zIndex: 10,
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <img src={data.frontImg} alt="Jacket Cover" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }} />
          </div>

          {/* Circular CD Disc */}
          <div ref={cdRef} className="album-cd-clip" style={{
            position: 'absolute',
            left: '0',
            top: '5px',
            width: '310px',
            height: '310px',
            zIndex: 5,
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transformOrigin: 'center center'
          }}>
            <img src={data.cdImg} alt="CD Disc label" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '50%'
            }} />
            
            {/* Transparent hole overlay in middle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '35px',
              height: '35px',
              backgroundColor: '#111',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }} />
          </div>
        </div>

      </div>
    </div>
  );
}
