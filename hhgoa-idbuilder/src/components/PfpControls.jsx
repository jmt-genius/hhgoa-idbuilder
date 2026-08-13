import { Dice1 } from 'lucide-react'

const RING_COLORS = [
  { id: 'green', color: '#22c55e', label: 'Green' },
  { id: 'taxi', color: '#fee101', label: 'Taxi' },
  { id: 'night', color: '#1a1a2e', label: 'Night' },
  { id: 'sunset', color: '#ff6b35', label: 'Sunset' },
  { id: 'cream', color: '#fffbe8', label: 'Cream' },
  { id: 'cyan', color: '#00e5ff', label: 'Cyan' },
  { id: 'pink', color: '#ff0080', label: 'Pink' },
  { id: 'holo', color: 'conic-gradient(from 0deg, #ff0080, #fee101, #22c55e, #00bfff, #ff0080)', label: 'Holo' },
]

const PHOTO_LOOKS = [
  { id: 'asshot', label: 'AS SHOT' },
  { id: 'punch', label: 'PUNCH' },
  { id: 'duotone', label: 'DUOTONE' },
  { id: 'grain', label: 'GRAIN' },
]

const PRESETS = [
  {
    id: 'neon',
    label: '🌴 NEON GOA',
    desc: 'Classic green neon',
    ringColor: 'green',
    ringWeight: 10,
    photoLook: 'asshot',
  },
  {
    id: 'cyberpunk',
    label: '⚡ CYBERPUNK',
    desc: 'Hot pink bold',
    ringColor: 'pink',
    ringWeight: 14,
    photoLook: 'punch',
  },
  {
    id: 'sunset',
    label: '🌅 GOA SUNSET',
    desc: 'Warm sunset vibes',
    ringColor: 'sunset',
    ringWeight: 12,
    photoLook: 'grain',
  },
  {
    id: 'holo',
    label: '✨ HOLOGRAPHIC',
    desc: 'Rainbow holo',
    ringColor: 'holo',
    ringWeight: 10,
    photoLook: 'asshot',
  },
]

export default function PfpControls({
  ringColor, onRingColorChange,
  ringWeight, onRingWeightChange,
  photoLook, onPhotoLookChange,
  zoom, onZoomChange,
  showBadge, onShowBadgeChange,
  onSurpriseMe,
  onApplyPreset,
  onChangePhoto,
  onDownload,
  onShare,
  isProcessing,
  presets,
  selectedPreset,
  onPresetChange,
  onGenerateStyle,
  isAIGenerating,
  statusMessage,
}) {
  return (
    <div className="reveal-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '440px' }}>

      {/* Presets */}
      <div>
        <div className="section-label">QUICK PRESETS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="preset-btn"
              onClick={() => onApplyPreset(preset)}
              title={preset.desc}
            >
              <span className="preset-emoji">{preset.label.split(' ')[0]}</span>
              <span className="preset-text">{preset.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

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
      {/* Ring Thickness */}
      <div>
        <div className="section-label">RING THICKNESS</div>
        <input
          type="range"
          min="4"
          max="24"
          value={ringWeight}
          onChange={(e) => onRingWeightChange(Number(e.target.value))}
          className="range-slider"
          aria-label="Ring thickness"
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

      {/* AI Style Option */}
      {presets && presets.length > 0 && (
        <div style={{
          background: 'rgba(10, 26, 17, 0.8)',
          border: '1px solid var(--brand-border)',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--brand-pink)' }}>✦</span> AI STYLE
          </div>
          <select
            value={selectedPreset}
            onChange={(e) => onPresetChange(e.target.value)}
            disabled={isAIGenerating}
            style={{
              width: '100%',
              background: 'rgba(8, 26, 16, 0.9)',
              border: '1px solid var(--brand-border)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
          >
            <option value="original">Original Photo</option>
            {presets.map(p => (
              <option key={p} value={p}>{p.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
          
          {selectedPreset !== 'original' && (
            <button
              onClick={onGenerateStyle}
              disabled={isAIGenerating}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 'bold',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: isAIGenerating ? 'not-allowed' : 'pointer',
                background: isAIGenerating ? 'rgba(30, 58, 40, 0.8)' : 'var(--brand-pink)',
                color: isAIGenerating ? '#7fae8d' : '#ffffff',
                transition: 'all 0.1s',
              }}
            >
              {isAIGenerating ? 'Generating...' : 'Apply AI Style'}
            </button>
          )}
          {statusMessage && (
            <div style={{
              fontSize: '11px',
              color: 'var(--brand-accent)',
              textAlign: 'center',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              {statusMessage}
            </div>
          )}
        </div>
      )}


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

export { RING_COLORS, PHOTO_LOOKS, PRESETS }
