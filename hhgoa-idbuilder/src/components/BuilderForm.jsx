import { useState } from 'react'
import { Sparkles, Zap, Loader2, Dice1 } from 'lucide-react'

const BUILDER_TITLES = [
  'Code Alchemist', 'Bug Whisperer', 'Deploy Druid', 'Runtime Shaman',
  'Logic Architect', 'Syntax Sorcerer', 'Git Gardener', 'Terminal Tactician',
  'Memory Maverick', 'Async Artist', 'Pipeline Poet', 'Cluster Captain',
  'Refactor Ranger', 'Test Titan', 'Debug Detective', 'Build Bard',
]

export default function BuilderForm({ data, onChange, titles = BUILDER_TITLES }) {
  const [customTitle, setCustomTitle] = useState(data.customTitle || '')

  const handleRandomTitle = () => {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    setCustomTitle(randomTitle)
    onChange(prev => ({ ...prev, customTitle: randomTitle }))
  }

  return (
    <div className="glass-card animate-slide-up delay-200" style={{ padding: '20px' }}>
      <h3 className="section-title" style={{ marginBottom: '16px' }}>Builder Details</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              marginBottom: '8px',
            }}
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => onChange(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Alex Chen"
            className="input-field"
            autoComplete="name"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            style={{
              display: 'block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              marginBottom: '8px',
            }}
          >
            Stack / Role
          </label>
          <input
            id="role"
            type="text"
            value={data.role}
            onChange={(e) => onChange(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Full Stack • React, Go, Rust"
            className="input-field"
          />
        </div>

        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--fg-muted)',
              }}
            >
              Builder Title
            </label>
            <button
              type="button"
              onClick={handleRandomTitle}
              className="btn-ghost"
              style={{ padding: '4px 10px', fontSize: '0.6rem' }}
            >
              <Dice1 style={{ width: 12, height: 12 }} />
              Random
            </button>
          </div>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => {
              setCustomTitle(e.target.value)
              onChange(prev => ({ ...prev, customTitle: e.target.value }))
            }}
            placeholder="Code Alchemist"
            className="input-field"
          />
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            letterSpacing: '0.06em',
            color: 'rgba(254,252,232,0.25)',
            textAlign: 'center',
            marginTop: '6px',
          }}>
            Or let us generate one for you
          </p>
        </div>
      </div>
    </div>
  )
}