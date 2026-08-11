export default function Footer() {
  return (
    <footer className="relative" style={{ borderTop: '1px solid rgba(254, 252, 232, 0.08)' }}>
      {/* Ticker band */}
      <div
        style={{
          overflow: 'hidden',
          padding: '12px 0',
          borderBottom: '1px solid rgba(254, 252, 232, 0.05)',
          background: 'rgba(0,0,0,0.1)',
        }}
      >
        <div className="ticker-track" style={{ gap: '48px' }}>
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} style={{ display: 'flex', gap: '48px', paddingRight: '48px' }}>
              {[
                '#FrameInGoa',
                'HH GOA 2026',
                `August 28-31, 2026`,
                'Goa, India',
                'Less Noise. More Signal.',
                'hhgoa.dev',
                '#FrameInGoa',
                'HH GOA 2026',
                `August 28-31, 2026`,
                'Goa, India',
                'Less Noise. More Signal.',
                'hhgoa.dev',
              ].map((text, idx) => (
                <span
                  key={idx}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: text === '#FrameInGoa' ? 'var(--yellow)' : 'var(--fg-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer content */}
      <div className="container-padding max-w-7xl mx-auto" style={{ padding: '32px 0' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '0 2rem',
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              textAlign: 'center',
            }}
          >
            No login. No signup. One pass.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a
              href="https://x.com/hashtag/FrameInGoa"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--yellow)',
                textDecoration: 'none',
                letterSpacing: '0.08em',
              }}
            >
              #FrameInGoa
            </a>
            <span style={{ color: 'var(--fg-muted)', fontSize: '0.65rem' }}>|</span>
            <a
              href="https://hhgoa.dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--fg-muted)',
                textDecoration: 'none',
                letterSpacing: '0.08em',
              }}
            >
              hhgoa.dev
            </a>
          </div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.55rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: 'rgba(254,252,232,0.25)',
              textAlign: 'center',
            }}
          >
            Built for HH Goa 2026 builders & attendees.
          </p>
        </div>
      </div>
    </footer>
  )
}