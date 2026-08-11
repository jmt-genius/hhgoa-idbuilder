import { useEffect, useRef } from 'react'

export default function Header() {
  const hackerRef = useRef(null)
  const houseRef = useRef(null)
  const goaRef = useRef(null)
  const infoRef = useRef(null)
  const taglineRef = useRef(null)

  useEffect(() => {
    // Animate in sequence
    const els = [hackerRef.current, houseRef.current, goaRef.current, infoRef.current, taglineRef.current]
    els.forEach((el, i) => {
      if (!el) return
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0) rotate(0deg) scale(1)'
      }, 80 + i * 120)
    })
  }, [])

  return (
    <header style={{
      marginBottom: '36px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      maxWidth: '24rem',
    }}>
      {/* Title row: HACKER HOUSE + गोवा */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <h1
          className="font-display"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 12px',
            fontSize: 'clamp(2.6rem, 13vw, 3.6rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.025em',
            color: 'var(--brand-accent)',
            textShadow: '5px 5px 0 #000',
          }}
        >
          <span
            ref={hackerRef}
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'translateY(22px) rotate(-4deg)',
              transition: 'opacity 0.42s var(--ease-snap), transform 0.42s var(--ease-snap)',
            }}
          >
            HACKER
          </span>
          <span
            ref={houseRef}
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: 'translateY(22px) rotate(-4deg)',
              transition: 'opacity 0.42s var(--ease-snap), transform 0.42s var(--ease-snap)',
            }}
          >
            HOUSE
          </span>
        </h1>

        <img
          ref={goaRef}
          src="/goa-devanagari.png"
          alt="गोवा"
          width="724"
          height="720"
          style={{
            marginBottom: '4px',
            height: '48px',
            width: 'auto',
            opacity: 0,
            transform: 'scale(0.6)',
            transition: 'opacity 0.42s var(--ease-snap), transform 0.42s var(--ease-snap)',
          }}
        />
      </div>

      {/* Event info */}
      <p
        ref={infoRef}
        style={{
          marginTop: '16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.28em',
          color: 'var(--brand-lime)',
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        OCT 28–31 · 2026 · GOA
      </p>

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          marginTop: '8px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.16em',
          color: 'rgba(255, 251, 232, 0.55)',
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        LESS NOISE. MORE SIGNAL.
      </p>
    </header>
  )
}