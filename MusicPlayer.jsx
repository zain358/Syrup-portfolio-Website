import React, { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { title: 'Keep In Touch', artist: 'SIRUP & Summit', duration: 225, durationStr: '03:45' },
  { title: 'Pool', artist: 'SIRUP', duration: 252, durationStr: '04:12' },
  { title: 'Synapse', artist: 'SIRUP', duration: 208, durationStr: '03:28' },
  { title: 'Loop', artist: 'SIRUP', duration: 232, durationStr: '03:52' }
];

export default function MusicPlayer({ isOpen, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const timerRef = useRef(null);
  const activeTrack = TRACKS[currentIdx];

  // Tick the simulated progress time
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeTrack.duration) {
            // Loop track or go to next
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentIdx]);

  // Reset progress when track changes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentIdx]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / activeTrack.duration) * 100;

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    const newTime = Math.floor(clickPercent * activeTrack.duration);
    setCurrentTime(newTime);
  };

  return (
    <div className={`glass-player ${isOpen ? 'is-open' : ''}`}>
      {/* Close Button */}
      <button className="player-close" onClick={onClose} aria-label="Close Music Player">
        ✕
      </button>

      {/* Track Details */}
      <div className={`player-header ${isPlaying ? 'playing' : ''}`}>
        <div className="player-cover">
          {/* Animated vinyl/record style gradient block */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #e03200 0%, #000ac2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold',
            borderRadius: '12px'
          }}>
            ♪
          </div>
        </div>
        <div className="player-meta">
          <div className="player-title">{activeTrack.title}</div>
          <div className="player-artist">{activeTrack.artist}</div>
          
          {/* Live Mini Visualizer */}
          <div className="mini-visualizer">
            <span className="vis-bar" />
            <span className="vis-bar" />
            <span className="vis-bar" />
            <span className="vis-bar" />
          </div>
        </div>
      </div>

      {/* Progress Bar & Media Buttons */}
      <div className="player-controls">
        <div className="progress-container">
          <span className="progress-time">{formatTime(currentTime)}</span>
          <div className="progress-bar-bg" onClick={handleProgressBarClick}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <span className="progress-time">{activeTrack.durationStr}</span>
        </div>

        <div className="control-buttons">
          <button className="btn-ctrl" onClick={handlePrev} aria-label="Previous Track">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button className="btn-ctrl btn-play" onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button className="btn-ctrl" onClick={handleNext} aria-label="Next Track">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Simulated Tracklist */}
      <div className="playlist-container">
        {TRACKS.map((track, idx) => (
          <div 
            key={idx}
            className={`playlist-track ${idx === currentIdx ? 'active' : ''}`}
            onClick={() => setCurrentIdx(idx)}
          >
            <span className="track-name">{track.title}</span>
            <span className="track-duration">{track.durationStr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
