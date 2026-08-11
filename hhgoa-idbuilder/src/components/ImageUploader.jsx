import { useState, useCallback, useRef } from 'react'
import { convertHeicToPng } from '../utils/helpers'

export default function ImageUploader({ onUpload, isProcessing }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) await processFile(file)
  }, [onUpload])

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files[0]
    if (file) await processFile(file)
    e.target.value = ''
  }, [onUpload])

  const processFile = async (file) => {
    try {
      let imageFile = file
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
        imageFile = await convertHeicToPng(file)
      }
      await onUpload(imageFile)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const openFileDialog = () => fileInputRef.current?.click()

  return (
    <div style={{ width: '100%', maxWidth: '440px' }}>
      <div
        className={`upload-zone field-texture field-drift ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
        aria-label="Upload image"
        style={{
          aspectRatio: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '24px',
        }}
      >
        {/* Corner brackets */}
        <span className="corner-bracket tl" />
        <span className="corner-bracket tr" />
        <span className="corner-bracket bl" />
        <span className="corner-bracket br" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileSelect}
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
          aria-hidden="true"
          disabled={isProcessing}
        />

        <button
          type="button"
          className="btn-accent brutal brutal-press sheen"
          style={{ pointerEvents: 'none' }}
          tabIndex={-1}
          disabled={isProcessing}
        >
          {isProcessing ? 'PROCESSING...' : 'UPLOAD A PHOTO'}
        </button>

        <p style={{
          maxWidth: '16rem',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          lineHeight: 1.625,
          letterSpacing: '0.14em',
          color: 'rgba(255, 251, 232, 0.55)',
          textAlign: 'center',
        }}>
          JPG · PNG · HEIC · WEBP<br />
          ANY SHAPE — WE'LL FRAME IT
        </p>
      </div>
    </div>
  )
}