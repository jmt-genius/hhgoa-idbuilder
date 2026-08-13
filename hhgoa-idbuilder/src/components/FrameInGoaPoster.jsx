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
        if (window.innerWidth <= 900) {
          posterRef.current.style.removeProperty('--scale');
          return;
        }

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = window.innerHeight;

        // 1600x900 is the base size
        const scaleX = containerWidth / 1600;
        const scaleY = containerHeight / 900;
        const scale = Math.min(scaleX, scaleY, 1);

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
        {/* Top-left Branding Group (2:47 Studio + Hacker House Goa + Event Info) */}
        <div className="top-left-branding">
          <img src="/custom-logo.svg" className="custom-logo" alt="2:47 Studio" />
          <div className="hh-horizontal-logo">
            <span className="hh-word font-display">HACKER</span>
            <img src="/goa-devanagari.png" className="devanagari-logo-inline" alt="Goa Devanagari" />
            <span className="hh-word font-display">HOUSE</span>
          </div>
          <div className="top-event-info">
            <span className="top-event-dates">28TH – 31ST OCT 2026</span>
            <span className="top-event-loc">GOA, INDIA</span>
          </div>
        </div>



        <div className="top-rule"></div>

        {/* headline */}
        <div className="headline">
          <span className="word frame">FRAME</span>
          <span className="word in">IN</span>
          <span className="word goa">GOA</span>
        </div>

        <div className="bottom-rule"></div>

        <div className="bottom-bar">
          <span className="built">BUILT FOR BUILDERS</span>
          <span className="divider"></span>
          <span className="coords"><span className="globe">&#127760;</span>15.2993&deg; N, 74.1240&deg; E</span>
          <span className="divider"></span>
          <span className="tagline-bottom">MAKE YOUR MARK IN GOA.</span>
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
