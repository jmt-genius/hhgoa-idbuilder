import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FrameInGoaPoster.css';

export default function FrameInGoaPoster() {
  const containerRef = useRef(null);
  const posterRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && posterRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = window.innerHeight; // or containerRef.current.clientHeight

        // 1600x900 is the base size
        const scaleX = containerWidth / 1600;
        const scaleY = containerHeight / 900;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up past 1

        posterRef.current.style.setProperty('--scale', scale.toString());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="poster-container" ref={containerRef}>
      <div className="poster-root" ref={posterRef}>
        {/* decorative corner marks */}
        <div className="cross tl"></div>
        <div className="cross bl pink"></div>
        <div className="cross br"></div>
        <div className="cross mid-right"></div>
        {/* Top-left Branding Group */}
        <div className="top-left-branding">
          <img src="/custom-logo.svg" className="custom-logo" alt="Goa Palm Trees" />
        </div>

        {/* Top-right Hacker House Logo */}
        <div className="top-right-branding">
          <div className="hh-stacked-text">
            <span className="hh-word font-display">HACKER</span>
            <span className="hh-word font-display">HOUSE</span>
            <img src="/goa-devanagari.png" className="devanagari-logo" alt="Goa Devanagari" />
          </div>
        </div>

        <div className="top-x">&times;</div>

        <div className="top-labels">
          <span className="l1">HH&#8209;GOA / 26</span>
          <span className="l2">FRAME SYSTEM / 01</span>
        </div>

        <div className="top-rule"></div>

        {/* headline */}
        <div className="headline">
          <span className="word frame">FRAME</span>
          <span className="word in">IN</span>
          <span className="word goa">GOA</span>
        </div>

        <div className="tagline">
          MAKE YOUR MARK<br />IN GOA.
        </div>

        {/* location / date info */}
        <div className="info-block">
          <div className="row"><span className="icon">&#128205;</span><span>GOA, INDIA</span></div>
          <div className="row"><span className="icon">&#128197;</span><span>28 &ndash; 31 OCT 2026</span></div>
          <div className="row"><span className="icon tag">#</span><span>#FrameInGoa</span></div>
        </div>

        <div className="bottom-rule"></div>

        <div className="bottom-bar">
          <span className="built">BUILT FOR BUILDERS</span>
          <span className="divider"></span>
          <span className="coords"><span className="globe">&#127760;</span>15.2993&deg; N, 74.1240&deg; E</span>
        </div>

        <button className="create-btn" onClick={() => navigate('/create')}>
          <div className="shadow"></div>
          <div className="face">
            CREATE
            <svg viewBox="0 0 24 24" fill="none" stroke="#0d1f12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
