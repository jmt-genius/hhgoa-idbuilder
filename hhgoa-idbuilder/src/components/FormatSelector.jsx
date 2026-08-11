export default function FormatSelector({ value, onChange }) {
  const idx = value === 'pfp' ? 0 : 1

  return (
    <div className="tab-toggle" role="tablist" aria-label="Output format">
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
        <span>for your X avatar</span>
      </button>

      <button
        role="tab"
        aria-selected={value === 'badge'}
        data-selected={String(value === 'badge')}
        type="button"
        onClick={() => onChange('badge')}
      >
        BUILDER PASS
        <span>for your timeline</span>
      </button>
    </div>
  )
}