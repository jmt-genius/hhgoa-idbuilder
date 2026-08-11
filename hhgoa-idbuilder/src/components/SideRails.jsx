const HACKER_TITLES = [
  'LATENCY SHAMAN', 'REGEX MONK', 'NULL WHISPERER', 'SEGFAULT SOMMELIER',
  'RACE CONDITION MYSTIC', 'MERGE CONFLICT ARCHITECT', 'EDGE CASE DIPLOMAT',
  'BIG-O CARTOGRAPHER', 'OFF-BY-ONE BOTANIST', 'CACHE LIFEGUARD',
  'DEADLOCK LOCKSMITH', 'RECURSION ORACLE', 'IDEMPOTENT ALCHEMIST',
  'ASYNC NAVIGATOR', 'BAREMETAL WRANGLER', 'MONOREPO CUSTODIAN',
  'ROLLBACK SHAMAN', 'TAIL-CALL MONK',
]

const EVENT_INFO = [
  'OCT 28', 'OCT 29', 'OCT 30', 'OCT 31', '2026', 'GOA',
  '15.2993° N', '74.1240° E', 'LESS NOISE. MORE SIGNAL.', 'HHGOA.COM',
]

export default function SideRails() {
  const leftText = HACKER_TITLES.map(t => `» ${t}   ·   `).join('')
  const rightText = EVENT_INFO.map(t => `${t}   ·   `).join('')

  return (
    <div className="hidden-mobile">
      {/* Left rail - positioned independently */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 'calc(50% - clamp(17rem, 26vw, 34rem))',
          display: 'flex',
          width: '88px',
          gap: '12px',
          flexDirection: 'row-reverse',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Tick line */}
        <div style={{ position: 'relative', width: '12px', flexShrink: 0 }} className="rail-mask">
          <span style={{
            position: 'absolute', top: 0, bottom: 0,
            left: '50%', width: '1px',
            transform: 'translateX(-50%)',
            background: 'rgba(154, 201, 95, 0.25)',
          }} />
          <span
            className="tick-up"
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(154,201,95,0.4) 0 6px, transparent 6px 44px)',
            }}
          />
        </div>

        {/* Text column */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }} className="rail-mask">
          <div
            className="rail-up"
            style={{
              position: 'absolute',
              top: 0,
              whiteSpace: 'nowrap',
              writingMode: 'vertical-rl',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(255, 251, 232, 0.25)',
            }}
          >
            {leftText}{leftText}
          </div>
        </div>
      </div>

      {/* Right rail - positioned independently */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 'calc(50% + clamp(17rem, 26vw, 34rem) - 88px)',
          display: 'flex',
          width: '88px',
          gap: '12px',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Tick line */}
        <div style={{ position: 'relative', width: '12px', flexShrink: 0 }} className="rail-mask">
          <span style={{
            position: 'absolute', top: 0, bottom: 0,
            left: '50%', width: '1px',
            transform: 'translateX(-50%)',
            background: 'rgba(154, 201, 95, 0.25)',
          }} />
          <span
            className="tick-down"
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(154,201,95,0.4) 0 6px, transparent 6px 44px)',
            }}
          />
        </div>

        {/* Text column */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }} className="rail-mask">
          <div
            className="rail-down"
            style={{
              position: 'absolute',
              top: 0,
              whiteSpace: 'nowrap',
              writingMode: 'vertical-rl',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(255, 251, 232, 0.25)',
            }}
          >
            {rightText}{rightText}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1279px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
