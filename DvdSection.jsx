import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DvdSection() {
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
    <div className="container-dvd" id="dvd">
      {/* Title */}
      <div className="dvd-title">
        <h2 ref={titleRef}>
          <span><img src="/setlist/dvd-title-1-pc.svg" alt="BLU-RAY & DVD" /></span>
          <span><img src="/setlist/dvd-title-2-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-3-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-4-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-5-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-6-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-7-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-8-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-9-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-10-pc.svg" alt="" /></span>
          <span><img src="/setlist/dvd-title-11-pc.svg" alt="" /></span>
        </h2>
      </div>

      {/* Image */}
      <div className="dvd-photo">
        <img src="/setlist/dvd-photo.jpg" alt="Blu-ray & DVD Poster" />
      </div>

      {/* Ticker / Tour info */}
      <div className="dvd-roll">
        <p>ROLL & BOUNCE<br />2022.11.11<br /><span>LIVE AT</span> NIPPON BUDOKAN</p>
      </div>

      {/* Catch phrase */}
      <div className="dvd-catch">
        <p>SIRUP初の単独武道館公演「Roll&Bounce」の<br />Blu-ray & DVD発売決定！</p>
      </div>

      {/* Description text */}
      <div className="dvd-lead">
        <p>
          自身の1st EP「SIRUP EP」リリースから5周年を迎え、昨年11月11日に初の武道館公演に臨んだSIRUP。チームで積み重ねてきたものをフルで活かし、crew(ファン)と共に新たな時代の幕開けを果たした公演からはや一年。
          <br />
          誰もが待ち望んでいた「あの時の感動、瞬間」をいつでも味わうことができます。
          <br />
          特典としてSIRUPとバンドメンバーの井上惇志(showmore)、Shin Sakiura３者による会話を収録した副音声や、ステージを正面から捉えた定点映像を収録。自分が見ていたあの時の景色とはまた別の視点から「Roll&Bounce」を楽しむことができます。
        </p>
      </div>

      {/* Pricing info */}
      <div className="dvd-meta">
        <ul>
          <li className="c1">
            <p><span className="large margin">価格(Blu-ray)</span></p>
            <p><span className="x-large margin">6,600</span><span className="medium margin">円</span><span className="small">(税込/送料別)</span></p>
          </li>
          <li className="c1">
            <p><span className="large margin">価格(DVD)</span></p>
            <p><span className="x-large margin">5,500</span><span className="medium margin">円</span><span className="small">(税込/送料別)</span></p>
          </li>
        </ul>
      </div>

      {/* Advance Booking Period */}
      <div className="dvd-meta">
        <ul>
          <li className="c1">
            <p><span className="large margin">先行予約販売期間</span></p>
            <p>
              <span className="smallx2">2023&nbsp;.</span>
              <span className="x-large margin">&nbsp;9.2</span>
              <span className="small margin">(土)</span>
              <span className="x-large">12:00</span>
              <span className="medium2">&nbsp;〜&nbsp;</span>
              <br className="issp" />
              <span className="x-large margin">9.5</span>
              <span className="small margin">(火)</span>
              <span className="x-large">23:59</span>
            </p>
          </li>
        </ul>
      </div>

      {/* Note 1 */}
      <div className="dvd-note2">
        <ul>
          <li>※先行販売については一商品につき一つ「特典ポストカード」が付いてきます。</li>
          <li>※先行販売期間中でも売り切れ次第終了です。ただし、先行販売期間中にキャンセルが出た場合は在庫が戻る可能性がございます。</li>
        </ul>
      </div>

      {/* General Sale */}
      <div className="dvd-meta">
        <ul>
          <li className="c1">
            <p><span className="large margin">一般販売開始</span></p>
            <p><span className="smallx2">2023&nbsp;.</span><span className="x-large margin">&nbsp;9.7</span><span className="small margin">(木)</span><span className="x-large">21:00</span><span className="medium2">&nbsp;〜&nbsp;</span></p>
          </li>
          <li className="c1">
            <p><span className="large margin">発売日</span></p>
            <p><span className="smallx2">2023&nbsp;.</span><span className="x-large margin">&nbsp;9.13</span><span className="small margin">(水)</span></p>
          </li>
        </ul>
      </div>

      {/* Note 2 */}
      <div className="dvd-note2">
        <ul>
          <li>※販売数に達し次第終了いたします。</li>
          <li>※キャンセルが出た場合は在庫が戻る可能性がございます。予めご了承ください。</li>
        </ul>
      </div>

      {/* Purchase Button */}
      <div className="dvd-sbutton">
        <a href="https://sirup.theshop.jp" target="_blank" rel="noopener noreferrer">
          <span>販売サイトはこちら</span>
        </a>
      </div>
    </div>
  );
}
