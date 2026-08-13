import React from 'react'
import './TacticalMapBackground.css'

export default function TacticalMapBackground() {
  return (
    <div className="tactical-bg-container" aria-hidden="true">
      {/* Ambient background glows */}
      <div className="tactical-glow top-left"></div>
      <div className="tactical-glow top-right"></div>
      <div className="tactical-glow bottom-center"></div>

      {/* Grid crosshairs overlay */}
      <div className="crosshairs-layer">
        <span className="ch" style={{ top: '8%', left: '20%' }}>+</span>
        <span className="ch" style={{ top: '18%', left: '10%' }}>+</span>
        <span className="ch" style={{ top: '34%', left: '1.5%' }}>+</span>
        <span className="ch" style={{ top: '71%', left: '1.5%' }}>+</span>
        <span className="ch" style={{ top: '46%', left: '91%' }}>+</span>
        <span className="ch" style={{ top: '65%', left: '97%' }}>+</span>
      </div>

      {/* SVG Map and Radar System */}
      <svg className="tactical-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="radar-glow" cx="78%" cy="16%" r="35%">
            <stop offset="0%" stopColor="rgba(154, 201, 95, 0.12)" />
            <stop offset="60%" stopColor="rgba(154, 201, 95, 0.02)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id="sweep-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(154, 201, 95, 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── UPPER-RIGHT RADAR SYSTEM ── */}
        <g className="radar-group">
          {/* Radar background glow */}
          <circle cx="1250" cy="140" r="320" fill="url(#radar-glow)" />

          {/* Concentric rings */}
          <circle cx="1250" cy="140" r="90" className="radar-ring" />
          <circle cx="1250" cy="140" r="170" className="radar-ring" />
          <circle cx="1250" cy="140" r="250" className="radar-ring" />
          <circle cx="1250" cy="140" r="330" className="radar-ring faint" />

          {/* Radar Sweep Line and Beam */}
          <g className="radar-sweep-group">
            <line x1="1250" y1="140" x2="1550" y2="40" className="radar-sweep-line" />
            <circle cx="1550" cy="40" r="3" fill="#9ac95f" />
          </g>
        </g>

        {/* ── COASTLINE CONTOUR & TELEMETRY NETWORK ── */}
        <g className="telemetry-network">
          {/* Goa Coastline terrain vector */}
          <path
            className="coastline-path"
            d="M -10,300 
               C 30,320 60,340 90,345 
               C 105,348 115,365 125,390 
               C 140,430 145,460 160,480 
               C 175,495 200,510 240,515 
               C 270,520 285,550 295,580 
               C 305,610 320,645 350,660 
               C 390,680 430,700 460,740 
               C 490,780 540,785 585,770 
               C 620,760 655,750 680,780 
               C 700,800 740,770 780,750 
               C 830,730 870,735 910,750 
               C 950,770 1010,760 1060,735 
               C 1110,710 1160,680 1200,670 
               C 1240,660 1280,640 1315,580 
               C 1340,540 1370,550 1410,610 
               C 1440,650 1475,700 1520,720 
               C 1560,740 1600,745 1620,750"
          />

          {/* Dotted Trajectory Connecting Arcs */}
          <path
            className="trajectory-arc"
            d="M 105,345 Q 200,430 290,520"
          />
          <path
            className="trajectory-arc"
            d="M 290,520 Q 370,610 460,665"
          />
          <path
            className="trajectory-arc"
            d="M 460,665 Q 600,620 685,760"
          />
          <path
            className="trajectory-arc"
            d="M 685,760 Q 780,720 890,750"
          />
          <path
            className="trajectory-arc"
            d="M 890,750 Q 1000,680 1100,675"
          />
          <path
            className="trajectory-arc"
            d="M 1100,675 Q 1200,620 1330,500"
          />
          <path
            className="trajectory-arc"
            d="M 1330,500 Q 1400,600 1470,700"
          />

          {/* ── TELEMETRY NODES ── */}
          {/* Node 1: North Point (18ms) */}
          <g transform="translate(105, 345)">
            <circle r="18" className="node-ring pulse-1" />
            <circle r="12" className="node-ring pulse-2" />
            <circle r="6" className="node-ring" />
            <circle r="3.5" fill="#f4c93c" filter="url(#glow-filter)" />
            <text x="14" y="-8" className="node-label">18ms</text>
          </g>

          {/* Node 2: Mid-North (PING) */}
          <g transform="translate(290, 520)">
            <circle r="16" className="node-ring pulse-2" />
            <circle r="10" className="node-ring" />
            <circle r="5" className="node-ring" />
            <circle r="3" fill="#f4c93c" />
            <text x="-12" y="24" className="node-label faint">PING</text>
          </g>

          {/* Node 3: Central Coast (15.29°N) */}
          <g transform="translate(460, 665)">
            <circle r="22" className="node-ring pulse-1" />
            <circle r="14" className="node-ring pulse-3" />
            <circle r="7" className="node-ring" />
            <circle r="3.5" fill="#f4c93c" filter="url(#glow-filter)" />
            <text x="-64" y="-12" className="node-label">15.29°N</text>
          </g>

          {/* Node 4: South Central Bay (74.12°E - Pink) */}
          <g transform="translate(685, 760)">
            <circle r="20" className="node-ring-pink pulse-2" />
            <circle r="12" className="node-ring-pink" />
            <circle r="6" className="node-ring-pink" />
            <circle r="3.5" fill="#ff2f7e" filter="url(#glow-filter)" />
            <text x="14" y="-14" className="node-label-pink">74.12°E</text>
          </g>

          {/* Node 5: South Coast (Beacon) */}
          <g transform="translate(890, 750)">
            <circle r="18" className="node-ring pulse-3" />
            <circle r="11" className="node-ring" />
            <circle r="5" className="node-ring" />
            <circle r="3" fill="#f4c93c" />
          </g>

          {/* Node 6: South East (23ms) */}
          <g transform="translate(1100, 675)">
            <circle r="20" className="node-ring pulse-1" />
            <circle r="13" className="node-ring pulse-2" />
            <circle r="6" className="node-ring" />
            <circle r="3.5" fill="#f4c93c" filter="url(#glow-filter)" />
            <text x="-48" y="-14" className="node-label">23ms</text>
          </g>

          {/* Node 7: East Ingress (NODE_09 OK) */}
          <g transform="translate(1330, 500)">
            <circle r="18" className="node-ring pulse-2" />
            <circle r="11" className="node-ring" />
            <circle r="5" className="node-ring" />
            <circle r="3.5" fill="#f4c93c" />
            <text x="110" y="32" className="node-label">NODE_09</text>
            <text x="110" y="46" className="node-label faint">OK</text>
          </g>

          {/* Node 8: Far East Point (PING 214 - Pink) */}
          <g transform="translate(1470, 700)">
            <circle r="20" className="node-ring-pink pulse-1" />
            <circle r="12" className="node-ring-pink" />
            <circle r="6" className="node-ring-pink" />
            <circle r="3.5" fill="#ff2f7e" filter="url(#glow-filter)" />
            <text x="-14" y="-16" className="node-label-pink faint">PING</text>
            <text x="-12" y="24" className="node-label-pink faint">214</text>
          </g>
        </g>

        {/* ── BINARY TELEMETRY MATRIX DOTS ── */}
        <g className="matrix-dots" fill="rgba(154, 201, 95, 0.35)">
          <circle cx="45" cy="370" r="1.5" /><circle cx="58" cy="370" r="1.5" /><circle cx="71" cy="370" r="1.5" />
          <circle cx="45" cy="385" r="1.5" /><circle cx="58" cy="385" r="1.5" /><circle cx="71" cy="385" r="1.5" />
          <circle cx="45" cy="400" r="1.5" /><circle cx="58" cy="400" r="1.5" /><circle cx="71" cy="400" r="1.5" />
          <circle cx="45" cy="415" r="1.5" /><circle cx="58" cy="415" r="1.5" /><circle cx="71" cy="415" r="1.5" />

          <circle cx="1520" cy="550" r="1.5" /><circle cx="1535" cy="550" r="1.5" /><circle cx="1550" cy="550" r="1.5" />
          <circle cx="1520" cy="565" r="1.5" /><circle cx="1535" cy="565" r="1.5" /><circle cx="1550" cy="565" r="1.5" />
          <circle cx="1520" cy="580" r="1.5" /><circle cx="1535" cy="580" r="1.5" /><circle cx="1550" cy="580" r="1.5" />
          <circle cx="1520" cy="595" r="1.5" /><circle cx="1535" cy="595" r="1.5" /><circle cx="1550" cy="595" r="1.5" />
        </g>

        {/* ── 3D PERSPECTIVE BOTTOM GRID ── */}
        <g className="bottom-grid-plane">
          {/* Horizontal lines with perspective fading */}
          <line x1="0" y1="840" x2="1600" y2="840" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="0" y1="865" x2="1600" y2="865" stroke="rgba(154, 201, 95, 0.16)" strokeWidth="1" />
          <line x1="0" y1="890" x2="1600" y2="890" stroke="rgba(154, 201, 95, 0.22)" strokeWidth="1" />

          {/* Perspective converging vertical lines */}
          <line x1="100" y1="820" x2="0" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="250" y1="820" x2="180" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="400" y1="820" x2="360" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="550" y1="820" x2="540" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="700" y1="820" x2="720" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="850" y1="820" x2="900" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="1000" y1="820" x2="1080" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="1150" y1="820" x2="1260" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
          <line x1="1300" y1="820" x2="1440" y2="900" stroke="rgba(154, 201, 95, 0.12)" strokeWidth="1" />
        </g>
      </svg>

      {/* ── TOP-LEFT BRANDING: 2:47PM STUDIO ── */}
      <div className="top-branding-left">
        <img src="/custom-logo.svg" className="branding-logo-left" alt="2:47PM STUDIO" />
      </div>

      {/* ── TOP-RIGHT BRANDING: HACKER HOUSE गोवा 2026 ── */}
      <div className="top-branding-right">
        <div className="hh-badge-lockup">
          <span className="hh-brand-title font-display">HACKER HOUSE</span>
          <img src="/goa-devanagari.png" className="hh-brand-devanagari" alt="गोवा" />
        </div>
        <div className="hh-brand-subrule">
          <span className="hh-brand-year">2026</span>
        </div>
      </div>
    </div>
  )
}
