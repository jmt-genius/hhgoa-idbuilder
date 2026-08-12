import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SideRails from '../components/SideRails'

export default function LandingPage() {
  const navigate = useNavigate()
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const btnRef = useRef(null)
  const taglineRef = useRef(null)

  useEffect(() => {
    const els = [logoRef.current, titleRef.current, subtitleRef.current, btnRef.current, taglineRef.current]
    els.forEach((el, i) => {
      if (!el) return
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0) scale(1)'
      }, 200 + i * 180)
    })
  }, [])

  return (
    <>
      <SideRails />
      <main
        className="field-texture landing-page"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <img
          ref={logoRef}
          src="/goa-devanagari.png"
          alt="गोवा"
          width="724"
          height="720"
          className="landing-logo"
          style={{
            opacity: 0,
            transform: 'translateY(30px) scale(0.7)',
            transition: 'opacity 0.6s var(--ease-snap), transform 0.6s var(--ease-snap)',
          }}
        />

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display landing-title"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.5s var(--ease-snap), transform 0.5s var(--ease-snap)',
          }}
        >
          HACKER HOUSE
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="landing-subtitle"
          style={{
            opacity: 0,
            transform: 'translateY(15px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          OCT 28–31 · 2026 · GOA
        </p>

        {/* CTA Button */}
        <button
          ref={btnRef}
          type="button"
          className="btn-accent brutal brutal-press sheen landing-cta"
          onClick={() => navigate('/create')}
          style={{
            opacity: 0,
            transform: 'translateY(15px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          CREATE
        </button>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="landing-tagline"
          style={{
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          LESS NOISE. MORE SIGNAL.
        </p>
      </main>
    </>
  )
}
