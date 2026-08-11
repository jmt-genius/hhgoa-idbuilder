export default function Header() {
  return (
    <header className="relative z-50">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: 2:47 PM Studio style badge */}
          <a 
            href="https://hhgoa.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--fg)',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              className="group-hover:opacity-100"
            >
              HH GOA 2026
            </div>
          </a>

          {/* Right: Nav links */}
          <nav className="flex items-center gap-4 md:gap-6">
            <a
              href="https://x.com/hashtag/FrameInGoa"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--fg)',
                opacity: 0.6,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              className="hidden sm:block hover:opacity-100"
            >
              CHECK HYPE
            </a>

            <a
              href="#create"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#1a1a1a',
                background: 'var(--yellow)',
                padding: '8px 20px',
                border: '3px solid #1a1a1a',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
              }}
            >
              CREATE
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}