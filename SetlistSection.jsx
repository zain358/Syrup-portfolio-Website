import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import tracks from './tracks.json';
import { flipImage } from './useFlipImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SetlistSection() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const swiperRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return;
    if (!window.matchMedia('(max-width: 959px)').matches) return;

    const spans = titleRef.current.querySelectorAll('span');
    if (!spans.length) return;

    gsap.set(spans, { transformOrigin: '50% 100%', scaleY: 0, y: '12.5vh', opacity: 0 });

    const tween = gsap.to(spans, {
      scaleY: 1,
      y: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power2.out',
      stagger: { each: 0.05 },
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="container-setlist" id="setlist" style={{ position: 'relative', width: '100%', padding: '120px 0' }}>
      
      {/* SETLIST Title */}
      <div className="setlist-title">
        <h2 ref={titleRef}>
          <span><img src="/setlist/title-1.svg" alt="SETLIST" /></span>
          <span><img src="/setlist/title-2.svg" alt="" /></span>
          <span><img src="/setlist/title-3.svg" alt="" /></span>
          <span><img src="/setlist/title-4.svg" alt="" /></span>
          <span><img src="/setlist/title-5.svg" alt="" /></span>
          <span><img src="/setlist/title-6.svg" alt="" /></span>
          <span><img src="/setlist/title-7.svg" alt="" /></span>
        </h2>
      </div>

      {/* Setlist Lead Text */}
      <div className="setlist-lead">
        <p>2022年11月11日（金）に開催されたSIRUP初の武道館公演「Roll & Bounce」のおよそ2時間、全29曲のセットリストです。</p>
      </div>

      {/* Setlist Slider Wrapper */}
      <div className="container-setlist" id="setlist2">
        <div className="setlist-for">
          <div className="for-swiper">
            <Swiper
              className="swiper-container"
              modules={[EffectCoverflow, Autoplay]}
              effect="coverflow"
              coverflowEffect={{
                slideShadows: false,
                modifier: 1,
                rotate: -5,
                stretch: -100,
                depth: 200,
              }}
              loop={true}
              slidesPerView="auto"
              centeredSlides={true}
              speed={1000}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                // capture immediately so an image is always ready
                const active = swiper.slides?.[swiper.activeIndex];
                if (active) flipImage.capture(active);
              }}
              onSlideChange={(swiper) => {
                setActiveTrackIndex(swiper.realIndex);
                const active = swiper.slides?.[swiper.activeIndex];
                if (active) flipImage.capture(active);
              }}
            >
              {tracks.map((t, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <span>
                    <img src={`/setlist/setlist-${parseInt(t.num)}-1.jpg`} alt="" />
                  </span>
                  <span>
                    <img src={`/setlist/setlist-${parseInt(t.num)}-2.jpg`} alt="" />
                  </span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Song Details Content */}
          <div className="for-content">
            {tracks.map((t, index) => (
              <div
                key={index}
                className={`content-item content-item--${parseInt(t.num)} ${
                  activeTrackIndex === index ? 'js-active' : ''
                }`}
              >
                <em>{t.num}</em>
                <strong>{t.title}</strong>
                <span>{t.credits}</span>
                <ul>
                  {t.links.map((lnk, lIdx) => {
                    let imgName = '';
                    if (lnk.alt === 'Apple Music') imgName = 'link-apple-pc.png';
                    else if (lnk.alt === 'Spotify') imgName = 'link-spotify-pc.png';
                    else if (lnk.alt === 'AWA') imgName = 'link-awa-pc.png';
                    else if (lnk.alt === 'YouTube') imgName = 'link-youtube-pc.png';
                    else if (lnk.alt === 'ALL') imgName = 'link-all-pc.png';

                    return (
                      <li key={lIdx}>
                        <a href={lnk.url} target="_blank" rel="noopener noreferrer">
                          <img src={`/setlist/${imgName}`} alt={lnk.alt} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Setlist Navigation List */}
        <div className="setlist-nav">
          <ul>
            {tracks.map((t, index) => (
              <li key={index}>
                <button
                  data-index={index}
                  className={activeTrackIndex === index ? 'js-active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    if (swiperRef.current) {
                      swiperRef.current.slideToLoop(index);
                    }
                  }}
                >
                  <span>
                    <i>{t.num[0]}</i>
                    <i>{t.num[1]}</i>
                  </span>
                  <span>{t.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Playlist Link Button */}
        <div className="setlist-button">
          <a href="https://lnk.to/rollandbouce" target="_blank" rel="noopener noreferrer">
            <span>プレイリストはこちら</span>
          </a>
        </div>
      </div>
    </div>
  );
}
