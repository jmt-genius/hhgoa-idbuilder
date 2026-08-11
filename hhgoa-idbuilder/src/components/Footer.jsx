export default function Footer() {
  return (
    <footer style={{
      marginTop: '56px',
      textAlign: 'center',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '10px',
      lineHeight: 1.625,
      letterSpacing: '0.2em',
      color: 'rgba(255, 251, 232, 0.35)',
    }}>
      <p>NO LOGIN. NO SIGNUP. ONE PASS.</p>
      <p style={{ marginTop: '8px' }}>
        <span style={{ color: 'var(--brand-pink)' }}>#FrameInGoa</span>
        {' · '}
        hhgoa.com
      </p>
    </footer>
  )
}