import { Image, BadgeCheck } from 'lucide-react'

const FORMATS = [
  {
    id: 'pfp',
    name: 'PFP Frame',
    desc: 'for your X avatar',
    icon: Image,
  },
  {
    id: 'badge',
    name: 'Builder Pass',
    desc: 'for your timeline',
    icon: BadgeCheck,
  },
]

export default function FormatSelector({ value, onChange, formats = FORMATS }) {
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 className="section-title" style={{ marginBottom: '16px' }}>Choose Format</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} role="radiogroup" aria-label="Select format">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onChange(format.id)}
            className={`tab-btn ${value === format.id ? 'active' : ''}`}
            role="radio"
            aria-checked={value === format.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              textAlign: 'left',
            }}
          >
            <format.icon style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden="true" />
            <div>
              <p style={{ 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                marginBottom: '2px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {format.name}
              </p>
              <p style={{ 
                fontSize: '0.6rem', 
                opacity: value === format.id ? 0.7 : 0.5,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {format.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}