import { useState } from 'react'
import { Download, Share2, RotateCcw, CheckCircle, Loader2 } from 'lucide-react'

export default function ResultActions({ 
  onDownload, 
  onShare, 
  onRetry, 
  isProcessing 
}) {
  const [downloadStatus, setDownloadStatus] = useState('idle')
  const [shareStatus, setShareStatus] = useState('idle')

  const handleDownload = async () => {
    setDownloadStatus('loading')
    try {
      await onDownload()
      setDownloadStatus('success')
      setTimeout(() => setDownloadStatus('idle'), 2000)
    } catch {
      setDownloadStatus('idle')
    }
  }

  const handleShare = async () => {
    setShareStatus('loading')
    try {
      await onShare()
      setShareStatus('success')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      setShareStatus('idle')
    }
  }

  return (
    <div className="glass-card animate-slide-up delay-300" style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
      }}>
        <CheckCircle style={{ width: 20, height: 20, color: 'var(--yellow)' }} className="animate-pulse-glow" />
        <h3 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--fg)',
        }}>
          Your graphic is ready!
        </h3>
      </div>

      <div className="result-actions">
        <button
          onClick={handleDownload}
          disabled={isProcessing || downloadStatus === 'loading'}
          className="btn-primary"
          style={{ minWidth: '160px' }}
        >
          {downloadStatus === 'loading' && <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />}
          {downloadStatus === 'success' && <CheckCircle style={{ width: 16, height: 16 }} />}
          {downloadStatus === 'idle' && <Download style={{ width: 16, height: 16 }} />}
          <span>{downloadStatus === 'success' ? 'Saved!' : 'Download'}</span>
        </button>

        <button
          onClick={handleShare}
          disabled={isProcessing || shareStatus === 'loading'}
          className="btn-secondary"
          style={{ minWidth: '160px' }}
        >
          {shareStatus === 'loading' && <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />}
          {shareStatus === 'success' && <CheckCircle style={{ width: 16, height: 16 }} />}
          {shareStatus === 'idle' && <Share2 style={{ width: 16, height: 16 }} />}
          <span>{shareStatus === 'success' ? 'Opened!' : 'Share to X'}</span>
        </button>

        <button
          onClick={onRetry}
          disabled={isProcessing}
          className="btn-ghost"
        >
          <RotateCcw style={{ width: 16, height: 16 }} />
          <span>Create Another</span>
        </button>
      </div>

      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.55rem',
        fontWeight: 400,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(254,252,232,0.25)',
        textAlign: 'center',
        marginTop: '16px',
      }}>
        No watermarks • No signup • Your image stays on your device
      </p>
    </div>
  )
}