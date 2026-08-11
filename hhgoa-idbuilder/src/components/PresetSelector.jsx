import { useState, useRef, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

const PRESET_ICONS = {
  bollywood90s: '🎬',
  anime: '⚡',
  qubely: '◆',
  cyberpunk: '🌆',
  retro8bit: '🎮',
  vaporwave: '🌊',
  noir: '🕵️',
  neon: '💡',
  sketch: '✏️',
  glitch: '📺',
  custom: '✨',
}

const PRESET_LABELS = {
  bollywood90s: '90s Bollywood',
  anime: 'Anime Style',
  qubely: 'Qubely',
  cyberpunk: 'Cyberpunk',
  retro8bit: 'Retro 8-Bit',
  vaporwave: 'Vaporwave',
  noir: 'Film Noir',
  neon: 'Neon Glow',
  sketch: 'Pencil Sketch',
  glitch: 'Glitch Art',
  custom: 'Custom Prompt',
}

export default function PresetSelector({ 
  presets, 
  selectedPreset, 
  onSelect, 
  customPrompt, 
  onCustomPromptChange,
  disabled 
}) {
  const [showCustom, setShowCustom] = useState(false)
  const customInputRef = useRef(null)

  useEffect(() => {
    if (showCustom && customInputRef.current) {
      customInputRef.current.focus()
    }
  }, [showCustom])

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (customPrompt.trim()) {
      onSelect({ id: 'custom', label: 'Custom Prompt' })
      setShowCustom(false)
    }
  }

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 className="section-title" style={{ marginBottom: '16px' }}>Style Your Photo</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="group" aria-label="Preset styles">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              onSelect(preset)
              setShowCustom(preset.id === 'custom')
            }}
            disabled={disabled}
            className={`preset-btn ${selectedPreset?.id === preset.id ? 'active' : ''} ${
              preset.id === 'custom' ? 'custom' : ''
            }`}
            aria-pressed={selectedPreset?.id === preset.id}
          >
            <span style={{ fontSize: '1rem', display: 'block', marginBottom: '4px' }} aria-hidden="true">
              {PRESET_ICONS[preset.id] || '✨'}
            </span>
            <span>{PRESET_LABELS[preset.id] || preset.label}</span>
          </button>
        ))}
      </div>

      {showCustom && (
        <form onSubmit={handleCustomSubmit} className="animate-slide-up" style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={customInputRef}
              type="text"
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder="Describe your style..."
              className="input-field"
              style={{ flex: 1 }}
              disabled={disabled}
              aria-label="Custom style prompt"
            />
            <button
              type="submit"
              disabled={disabled || !customPrompt.trim()}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.7rem' }}
            >
              <Sparkles style={{ width: 14, height: 14 }} />
              Apply
            </button>
            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="btn-ghost"
              aria-label="Cancel custom prompt"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </form>
      )}

      {selectedPreset && selectedPreset.id !== 'custom' && (
        <div className="animate-fade-in" style={{
          marginTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'var(--yellow)',
          letterSpacing: '0.06em',
        }}>
          <Sparkles style={{ width: 14, height: 14 }} />
          <span>Applied: {PRESET_LABELS[selectedPreset.id]}</span>
        </div>
      )}
    </div>
  )
}