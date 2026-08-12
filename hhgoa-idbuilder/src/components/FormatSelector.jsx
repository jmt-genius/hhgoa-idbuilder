export default function FormatSelector({ value, onChange }) {
  let idx = 0
  if (value === 'builder') idx = 1
  if (value === 'team') idx = 2

  return (
    <div className="tab-toggle" role="tablist" aria-label="Output format" style={{ maxWidth: '36rem' }}>
      {/* Shadow pill (behind) */}
      <div className="tab-toggle-shadow" data-active={idx} />
      {/* Accent pill (front) */}
      <div className="tab-toggle-pill" data-active={idx} />

      <button
        role="tab"
        aria-selected={value === 'pfp'}
        data-selected={String(value === 'pfp')}
        type="button"
        onClick={() => onChange('pfp')}
      >
        PFP FRAME
        <span>X Avatar</span>
      </button>

      <button
        role="tab"
        aria-selected={value === 'builder'}
        data-selected={String(value === 'builder')}
        type="button"
        onClick={() => onChange('builder')}
      >
        BUILDER PASS
        <span>Timeline Card</span>
      </button>

      <button
        role="tab"
        aria-selected={value === 'team'}
        data-selected={String(value === 'team')}
        type="button"
        onClick={() => onChange('team')}
      >
        TEAM PASS
        <span>3-up Frame</span>
      </button>
    </div>
  )
}