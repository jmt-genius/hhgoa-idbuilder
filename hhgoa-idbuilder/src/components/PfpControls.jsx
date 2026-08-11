import { Dice1 } from 'lucide-react'

const RING_COLORS = [
  { id: 'green', color: '#22c55e', label: 'Green' },
  { id: 'taxi', color: '#fee101', label: 'Taxi' },
  { id: 'night', color: '#1a1a2e', label: 'Night' },
  { id: 'sunset', color: '#ff6b35', label: 'Sunset' },
  { id: 'cream', color: '#fffbe8', label: 'Cream' },
  { id: 'holo', color: 'conic-gradient(from 0deg, #ff0080, #fee101, #22c55e, #00bfff, #ff0080)', label: 'Holo' },
]

const PHOTO_LOOKS = [
  { id: 'asshot', label: 'AS SHOT' },
  { id: 'punch', label: 'PUNCH' },
  { id: 'duotone', label: 'DUOTONE' },
  { id: 'grain', label: 'GRAIN' },
]

export default function PfpControls({
  ringColor, onRingColorChange,
  ringWeight, onRingWeightChange,
  photoLook, onPhotoLookChange,
  zoom, onZoomChange,
  showBadge, onShowBadgeChange,
  onSurpriseMe,
  onChangePhoto,
  onDownload,
  onShare,
  isProcessing,
}) {
  return (
    <div className="reveal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px' }}>

      {/* Ring Color */}
      <div>
        <div className="section-label">RING COLOUR</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {RING_COLORS.map((rc) => (
            <button
              key={rc.id}
              className={`color-swatch ${ringColor === rc.id ? 'active' : ''}`}
              onClick={() => onRingColorChange(rc.id)}
              aria-label={rc.label}
              title={rc.label}
              style={{
                background: rc.id === 'holo'
                  ? 'conic-gradient(from 0deg, #ff0080, #fee101, #22c55e, #00bfff, #ff0080)'
                  : rc.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Ring Weight */}
      <div>
        <div className="section-label">RING WEIGHT</div>
        <input
          type="range"
          min="2"
          max="20"
          value={ringWeight}
          onChange={(e) => onRingWeightChange(Number(e.target.value))}
          className="range-slider"
          aria-label="Ring weight"
        />
      </div>

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

      {/* Surprise Me */}
      <button
        type="button"
        className="btn-outline"
        onClick={onSurpriseMe}
        style={{ width: '100%' }}
      >
        <Dice1 style={{ width: 16, height: 16 }} />
        🎲 SURPRISE ME
      </button>

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

export { RING_COLORS, PHOTO_LOOKS }
