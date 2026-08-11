import { useState, useEffect } from 'react'

const BUILDER_TITLES = [
  'Code Alchemist', 'Bug Whisperer', 'Deploy Druid', 'Runtime Shaman',
  'Logic Architect', 'Syntax Sorcerer', 'Git Gardener', 'Terminal Tactician',
  'Memory Maverick', 'Async Artist', 'Pipeline Poet', 'Cluster Captain',
  'Refactor Ranger', 'Test Titan', 'Debug Detective', 'Build Bard',
  'Merge Master', 'Deploy Daimyo', 'Cache Crusader', 'Queue Queen',
  'Stack Sage', 'Binary Bard', 'Loop Loremaster', 'Function Phoenix',
]

const PHOTO_LOOKS = [
  { id: 'asshot', label: 'AS SHOT' },
  { id: 'punch', label: 'PUNCH' },
  { id: 'duotone', label: 'DUOTONE' },
  { id: 'grain', label: 'GRAIN' },
]

function getRandomTitle() {
  return BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)]
}

export default function BuilderControls({
  name, onNameChange,
  role, onRoleChange,
  title, onTitleChange,
  photoLook, onPhotoLookChange,
  zoom, onZoomChange,
  showBadge, onShowBadgeChange,
  onChangePhoto,
  onDownload,
  onShare,
  isProcessing,
}) {
  const [isRoasting, setIsRoasting] = useState(false)

  // Generate a random title on mount if none set
  useEffect(() => {
    if (!title) {
      onTitleChange(getRandomTitle())
    }
  }, [])

  const handleRoastMe = () => {
    setIsRoasting(true)
    // Cycle through random titles for dramatic effect
    let count = 0
    const interval = setInterval(() => {
      onTitleChange(getRandomTitle())
      count++
      if (count >= 8) {
        clearInterval(interval)
        setIsRoasting(false)
      }
    }, 100)
  }

  const handleRandomTitle = () => {
    onTitleChange(getRandomTitle())
  }

  return (
    <div className="reveal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '440px' }}>

      {/* Name */}
      <div>
        <div className="section-label">YOUR NAME</div>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="anon builder"
          className="input-field"
          autoComplete="name"
        />
      </div>

      {/* Stack / Role */}
      <div>
        <div className="section-label">STACK / ROLE</div>
        <input
          type="text"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          placeholder="Full Stack · React, Go, Rust"
          className="input-field"
        />
      </div>

      {/* Builder Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>YOUR TITLE</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'rgba(4, 23, 13, 0.72)',
          border: '2px solid rgba(154, 201, 95, 0.25)',
          borderRadius: '12px',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(255, 251, 232, 0.4)',
            letterSpacing: '0.1em',
          }}>
            »
          </span>
          <span className="title-display" style={{ flex: 1 }}>
            {title || 'Loading...'}
          </span>
          <button
            type="button"
            onClick={handleRandomTitle}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 251, 232, 0.4)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px',
              transition: 'color 0.15s ease',
            }}
            title="Random title"
            onMouseEnter={(e) => e.target.style.color = 'var(--brand-accent)'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 251, 232, 0.4)'}
          >
            🎲
          </button>
        </div>
      </div>

      {/* Roast Me */}
      <button
        type="button"
        className="btn-pink"
        onClick={handleRoastMe}
        disabled={isRoasting}
        style={{ width: '100%' }}
      >
        {isRoasting ? '🔥 ROASTING...' : '🔥 ROAST ME'}
      </button>

      {/* Photo Look */}
      <div>
        <div className="section-label">PHOTO LOOK</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PHOTO_LOOKS.map((look) => (
            <button
              key={look.id}
              className={`look-btn ${photoLook === look.id ? 'active' : ''}`}
              onClick={() => onPhotoLookChange(look.id)}
            >
              {look.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom */}
      <div>
        <div className="section-label">ZOOM</div>
        <input
          type="range"
          min="100"
          max="200"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="range-slider"
          aria-label="Zoom"
        />
      </div>

      {/* Show Goa Badge */}
      <label className="checkbox-custom">
        <input
          type="checkbox"
          checked={showBadge}
          onChange={(e) => onShowBadgeChange(e.target.checked)}
        />
        SHOW GOA BADGE
      </label>

      {/* Change Photo */}
      <div style={{ textAlign: 'center' }}>
        <button type="button" className="btn-ghost" onClick={onChangePhoto}>
          Change Photo
        </button>
      </div>

      {/* Download + Share */}
      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        <button
          type="button"
          className="btn-accent brutal brutal-press sheen"
          onClick={onDownload}
          disabled={isProcessing}
          style={{ width: '100%' }}
        >
          DOWNLOAD
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={onShare}
          disabled={isProcessing}
          style={{ width: '100%' }}
        >
          SHARE TO X
        </button>
      </div>
    </div>
  )
}
