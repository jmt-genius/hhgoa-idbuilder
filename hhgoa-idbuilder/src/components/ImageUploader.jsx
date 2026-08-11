import { useState, useCallback, useRef } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { convertHeicToPng } from '../utils/helpers'

export default function ImageUploader({ onUpload, isProcessing }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
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
    if (file && isValidImageFile(file)) {
      await processFile(file)
    }
  }, [])

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files[0]
    if (file && isValidImageFile(file)) {
      await processFile(file)
    }
    e.target.value = ''
  }, [])

  const processFile = async (file) => {
    setUploadProgress(0)
    try {
      let imageFile = file
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
        setUploadProgress(50)
        imageFile = await convertHeicToPng(file)
      }
      setUploadProgress(100)
      await onUpload(imageFile)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to process image. Please try another file.')
    } finally {
      setTimeout(() => setUploadProgress(null), 500)
    }
  }

  const isValidImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
    const validExts = ['.jpg', '.jpeg', '.png', '.heic', '.heif']
    return validTypes.includes(file.type) || validExts.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  const openFileDialog = () => fileInputRef.current?.click()

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div
        className={`upload-zone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
        aria-label="Upload image"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif"
          onChange={handleFileSelect}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          aria-hidden="true"
          disabled={isProcessing}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Upload button */}
          <button
            className="btn-primary"
            style={{ pointerEvents: 'none' }}
            tabIndex={-1}
          >
            {isProcessing ? (
              <>
                <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
                PROCESSING...
              </>
            ) : (
              <>
                <Upload style={{ width: 18, height: 18 }} />
                UPLOAD A PHOTO
              </>
            )}
          </button>

          {/* Progress bar */}
          {uploadProgress !== null && (
            <div style={{
              width: '200px',
              height: '3px',
              background: 'rgba(254,252,232,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div 
                style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'var(--yellow)',
                  transition: 'width 0.3s ease-out',
                  borderRadius: '2px',
                }}
              />
            </div>
          )}

          {/* File type hints */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              marginBottom: '4px',
            }}>
              JPG • PNG • HEIC • WEBP
            </p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(254,252,232,0.3)',
            }}>
              ANY SHAPE — WE'LL FRAME IT
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}