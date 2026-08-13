import { useState, useCallback, useRef, useEffect } from 'react'
import { convertHeicToPng, downloadImage, generateShareUrl } from '../utils/helpers'
import { CardContainer, CardBody, CardItem } from './ui/3d-card'

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
  { id: 'grain', label: 'GRAIN' },
  { id: 'bw', label: 'B&W' },
  { id: 'sepia', label: 'SEPIA' },
  { id: 'vintage', label: 'VINTAGE' },
]

const PRESETS = [
  { id: 'neon', label: '🌴 NEON GOA', desc: 'Classic green neon', ringColor: 'green', photoLook: 'asshot' },
  { id: 'cyberpunk', label: '⚡ CYBERPUNK', desc: 'Hot pink bold', ringColor: 'pink', photoLook: 'bw' },
  { id: 'sunset', label: '🌅 GOA SUNSET', desc: 'Warm sunset vibes', ringColor: 'sunset', photoLook: 'grain' },
  { id: 'holo', label: '✨ HOLOGRAPHIC', desc: 'Rainbow holo', ringColor: 'holo', photoLook: 'asshot' },
]

export default function PfpGenerator() {
  const [originalImage, setOriginalImage] = useState(null)
  const [ringColor, setRingColor] = useState('green')
  const [photoLook, setPhotoLook] = useState('asshot')
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [showBadge, setShowBadge] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [isCanvasDragging, setIsCanvasDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const canvasRef = useRef(null)
  const goaBadgeRef = useRef(null)
  const pfpFrameRef = useRef(null)
  const fileInputRef = useRef(null)
  const [frameAssetsReady, setFrameAssetsReady] = useState(false)

  // Load goa badge image and pfp frame overlay
  useEffect(() => {
    const badge = new Image()
    badge.src = '/goa-devanagari.png'
    badge.onload = () => { goaBadgeRef.current = badge }

    const frame = new Image()
    frame.src = '/pfp_overlay.png'
    frame.onload = () => {
      pfpFrameRef.current = frame
      setFrameAssetsReady(true)
    }
  }, [])

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = 2
    const width = 800
    const height = 800
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    const processedImage = originalImage ? applyPhotoLook(originalImage, photoLook) : null
    drawPfpFrame(ctx, width, height, processedImage, {
      ringColor, zoom: zoom / 100, rotation, panX, panY, showBadge,
      goaBadge: goaBadgeRef.current, pfpFrame: pfpFrameRef.current,
    })
  }, [originalImage, ringColor, photoLook, zoom, rotation, panX, panY, showBadge])

  // Redraw preview whenever controls or frame assets change
  useEffect(() => {
    if (frameAssetsReady) generateImage()
  }, [frameAssetsReady, generateImage])

  const handleImageUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    try {
      let imageFile = file
      setSelectedFile(file)
      setFileName(file.name)
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
        setIsProcessing(true)
        imageFile = await convertHeicToPng(file)
        setIsProcessing(false)
        setSelectedFile(imageFile)
      }
      const img = new Image()
      img.src = URL.createObjectURL(imageFile)
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      setOriginalImage(img)
      setPanX(0)
      setPanY(0)
      setRotation(0)
      setZoom(100)
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
    }
  }, [])

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png', 1.0))
    downloadImage(blob, `hhgoa-2026-pfp-${Date.now()}.png`)
  }, [])

  const handleShare = useCallback(() => {
    const text = "Just framed my profile for Hacker House Goa 2026! 🌴💚 #FrameInGoa #HHGoa2026"
    const shareUrl = generateShareUrl(text)
    window.open(shareUrl, '_blank', 'width=550,height=420')
  }, [])

  const handleReset = useCallback(() => {
    setOriginalImage(null)
    setFileName('')
    setSelectedFile(null)
    setRingColor('green')
    setPhotoLook('asshot')
    setZoom(100)
    setRotation(0)
    setPanX(0)
    setPanY(0)
    setShowBadge(true)
  }, [])

  const handleCanvasMouseDown = useCallback((e) => {
    if (!originalImage) return
    setIsCanvasDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [originalImage])

  const handleCanvasMouseMove = useCallback((e) => {
    if (!isCanvasDragging || !originalImage) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    if (e.shiftKey) {
      setRotation(prev => prev + dx * 0.5)
    } else {
      setPanX(prev => prev + dx * 2)
      setPanY(prev => prev + dy * 2)
    }
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isCanvasDragging, dragStart, originalImage])

  const handleCanvasMouseUp = useCallback(() => {
    setIsCanvasDragging(false)
  }, [])

  const isReady = !!originalImage

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0c1f14 0%, #0a1a11 100%)',
        border: '2px solid rgba(30, 58, 40, 0.9)',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '1180px',
        margin: '0 auto',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#eaf5ee',
      }}
    >
      {/* ── Inner header — mirrors builder pass ── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
          padding: '16px clamp(14px, 3vw, 24px)',
          borderBottom: '1px dashed rgba(30, 58, 40, 0.9)',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#7fae8d', textTransform: 'uppercase' }}>
            &gt;&gt;&gt; INIT: PFP_GENERATOR
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(18px, 5vw, 22px)',
              letterSpacing: '0.5px',
              color: '#f6cf1f',
            }}
          >
            HACKER HOUSE <span style={{ color: '#e8226f' }}>गोवा</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#7fae8d', textTransform: 'uppercase' }}>
          HHGOA'26 · FRAME YOUR PFP
        </div>
      </header>

      {/* ── Two-column grid body ── */}
      <div
        className="pfp-inner-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '28px',
          alignItems: 'start',
          padding: '22px clamp(14px, 3vw, 24px) 28px',
        }}
      >
        {/* ── LEFT: Controls panel ── */}
        <div
          className="pfp-controls-panel"
          style={{
            background: 'linear-gradient(180deg, #0c1f14 0%, #0a1a11 100%)',
            border: '1px solid rgba(30, 58, 40, 0.9)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#f6cf1f',
              margin: '0 0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#e8226f' }}>›</span> Your Details
          </h2>

          {/* Photo upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7fae8d', marginBottom: '6px' }}>
              Photo
            </label>
            <div
              style={{
                position: 'relative',
                border: `1.5px dashed ${isDragging ? '#f6cf1f' : originalImage ? '#f6cf1f' : 'rgba(30, 58, 40, 0.9)'}`,
                borderRadius: '10px',
                padding: '22px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragging ? '#0b2216' : '#081a10',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={async (e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files?.[0]
                if (file) await handleImageUpload(file)
              }}
            >
              {originalImage && (
                <canvas
                  width={56}
                  height={56}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    margin: '0 auto 10px',
                    border: '1px solid rgba(30, 58, 40, 0.9)',
                    display: 'block',
                  }}
                  ref={(el) => {
                    if (!el || !originalImage) return
                    const ctx = el.getContext('2d')
                    ctx.clearRect(0, 0, 56, 56)
                    const scale = Math.max(56 / originalImage.width, 56 / originalImage.height)
                    const sw = originalImage.width * scale
                    const sh = originalImage.height * scale
                    ctx.drawImage(originalImage, (56 - sw) / 2, (56 - sh) / 2, sw, sh)
                  }}
                />
              )}
              <div style={{ fontSize: '13px', marginBottom: '4px', color: originalImage ? '#f6cf1f' : '#eaf5ee' }}>
                {fileName
                  ? (fileName.length > 28 ? fileName.slice(0, 25) + '…' : fileName)
                  : 'Click or drop a photo'}
              </div>
              <div style={{ fontSize: '11px', color: '#7fae8d' }}>
                {isProcessing ? 'Converting HEIC…' : 'JPG · PNG · HEIC · WEBP'}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic,.heif"
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) await handleImageUpload(file)
                  e.target.value = ''
                }}
                disabled={isProcessing}
              />
            </div>

            {/* Zoom & Angle sliders */}
            {originalImage && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ whiteSpace: 'nowrap', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7fae8d', margin: 0, width: '45px' }}>
                    Zoom
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="range-slider"
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '11px', color: '#7fae8d', width: '36px', textAlign: 'right' }}>{zoom}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ whiteSpace: 'nowrap', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7fae8d', margin: 0, width: '45px' }}>
                    Angle
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="range-slider"
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '11px', color: '#7fae8d', width: '36px', textAlign: 'right' }}>{rotation}°</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls — revealed after photo is uploaded */}
          {originalImage && (
            <>
              {/* Quick Presets */}
              <div style={{ marginBottom: '18px' }}>
                <div className="section-label">QUICK PRESETS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className="preset-btn"
                      onClick={() => {
                        setRingColor(preset.ringColor)
                        setPhotoLook(preset.photoLook)
                      }}
                      title={preset.desc}
                    >
                      <span className="preset-emoji">{preset.label.split(' ')[0]}</span>
                      <span className="preset-text">{preset.label.split(' ').slice(1).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ring Colour */}
              <div style={{ marginBottom: '18px' }}>
                <div className="section-label">RING COLOUR</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {RING_COLORS.map((rc) => (
                    <button
                      key={rc.id}
                      className={`color-swatch ${ringColor === rc.id ? 'active' : ''}`}
                      onClick={() => setRingColor(rc.id)}
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

              {/* Show Goa Badge */}
              <label className="checkbox-custom" style={{ marginBottom: '18px', display: 'flex' }}>
                <input
                  type="checkbox"
                  checked={showBadge}
                  onChange={(e) => setShowBadge(e.target.checked)}
                />
                SHOW GOA BADGE
              </label>
            </>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={!isReady || isProcessing}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: '8px',
              border: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: isReady && !isProcessing ? 'pointer' : 'not-allowed',
              background: '#f6cf1f',
              color: '#101a10',
              opacity: isReady ? 1 : 0.5,
              transition: 'filter 0.1s',
              marginBottom: '10px',
            }}
            onMouseEnter={(e) => { if (isReady) e.currentTarget.style.filter = 'brightness(1.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
          >
            Download PFP
          </button>

          {originalImage && (
            <>
              <button
                onClick={handleShare}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid rgba(154, 201, 95, 0.3)',
                  background: 'transparent',
                  color: '#eaf5ee',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f6cf1f'; e.currentTarget.style.color = '#f6cf1f' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(154, 201, 95, 0.3)'; e.currentTarget.style.color = '#eaf5ee' }}
              >
                Share to X
              </button>

              <button
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid #e8226f',
                  background: 'transparent',
                  color: '#e8226f',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232, 34, 111, 0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                Reset
              </button>
            </>
          )}

          {/* Tip */}
          <div style={{ fontSize: '11px', color: '#7fae8d', lineHeight: 1.7, marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed rgba(30, 58, 40, 0.8)' }}>
            <b style={{ color: '#eaf5ee' }}>Tip:</b> drag the photo in the preview to align it, or hold Shift to rotate!
          </div>
        </div>

        {/* ── RIGHT: Preview panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
          {/* Status dot */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', color: 'rgba(234, 245, 238, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              flexShrink: 0,
              background: isReady ? '#3ee089' : '#e8226f',
              boxShadow: isReady ? '0 0 8px #3ee089' : '0 0 8px #e8226f',
            }} />
            <span>{isReady ? 'Ready to download' : 'Frame preview — upload a photo'}</span>
          </div>

          {/* Canvas preview — frame visible even before photo upload */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CardContainer containerClassName="py-0 flex justify-center w-full">
              <CardBody className="[transform-style:preserve-3d] w-full h-auto flex items-center justify-center">
                <CardItem translateZ="100" className="w-full flex justify-center">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    style={{
                      width: '100%',
                      maxWidth: '440px',
                      height: 'auto',
                      borderRadius: '18px',
                      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)',
                      display: 'block',
                      cursor: originalImage ? (isCanvasDragging ? 'grabbing' : 'grab') : 'default',
                      touchAction: 'none',
                      aspectRatio: '1',
                    }}
                    aria-label="PFP frame preview"
                  />
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pfp-inner-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 16px 12px 24px !important;
          }
          .pfp-controls-panel {
            padding: 16px 14px !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ── Photo look filters ─────────────────────────── */
function applyPhotoLook(image, look) {
  if (look === 'asshot') return image

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  switch (look) {
    case 'bw':
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        data[i] = data[i + 1] = data[i + 2] = lum
      }
      break

    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
      }
      break
      
    case 'vintage':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.1 + 10)     // warmer reds
        data[i + 1] = Math.min(255, data[i + 1] * 1.05)
        data[i + 2] = data[i + 2] * 0.8                 // less blue
      }
      break

    case 'grain':
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 50
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
      }
      break
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

/* ── Get ring color value ───────────────────────── */
function getRingColorValue(ringColorId) {
  const map = {
    green: '#22c55e',
    taxi: '#fee101',
    night: '#1a1a2e',
    sunset: '#ff6b35',
    cream: '#fffbe8',
    cyan: '#00e5ff',
    pink: '#ff0080',
    holo: null,
  }
  return map[ringColorId] || '#22c55e'
}

/* ── Tint an image to a target color ────────────── */
function tintImage(sourceImage, color, opacity = 0.55) {
  const tintCanvas = document.createElement('canvas')
  tintCanvas.width = sourceImage.width || sourceImage.naturalWidth
  tintCanvas.height = sourceImage.height || sourceImage.naturalHeight
  const tCtx = tintCanvas.getContext('2d')

  tCtx.drawImage(sourceImage, 0, 0, tintCanvas.width, tintCanvas.height)

  tCtx.globalCompositeOperation = 'color'
  tCtx.globalAlpha = opacity
  tCtx.fillStyle = color
  tCtx.fillRect(0, 0, tintCanvas.width, tintCanvas.height)

  tCtx.globalCompositeOperation = 'destination-in'
  tCtx.globalAlpha = 1
  tCtx.drawImage(sourceImage, 0, 0, tintCanvas.width, tintCanvas.height)

  return tintCanvas
}

/* ── Tint for holo (conic gradient) ─────────────── */
function tintImageHolo(sourceImage) {
  const tintCanvas = document.createElement('canvas')
  const w = sourceImage.width || sourceImage.naturalWidth
  const h = sourceImage.height || sourceImage.naturalHeight
  tintCanvas.width = w
  tintCanvas.height = h
  const tCtx = tintCanvas.getContext('2d')

  tCtx.drawImage(sourceImage, 0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const holoGrad = tCtx.createConicGradient(0, cx, cy)
  holoGrad.addColorStop(0, '#ff0080')
  holoGrad.addColorStop(0.25, '#fee101')
  holoGrad.addColorStop(0.5, '#22c55e')
  holoGrad.addColorStop(0.75, '#00bfff')
  holoGrad.addColorStop(1, '#ff0080')

  tCtx.globalCompositeOperation = 'color'
  tCtx.globalAlpha = 0.65
  tCtx.fillStyle = holoGrad
  tCtx.fillRect(0, 0, w, h)

  tCtx.globalCompositeOperation = 'destination-in'
  tCtx.globalAlpha = 1
  tCtx.drawImage(sourceImage, 0, 0, w, h)

  return tintCanvas
}

/* ── Draw PFP frame ─────────────────────────────── */
function drawPfpFrame(ctx, width, height, image, opts) {
  const { ringColor, zoom, rotation, panX, panY, showBadge, goaBadge, pfpFrame } = opts
  const centerX = width / 2
  const centerY = height / 2

  const thicknessScale = 1

  const frameNaturalSize = Math.min(width, height) * 0.96
  const frameSize = frameNaturalSize * (0.85 + thicknessScale * 0.15)
  const innerRadius = frameSize * 0.38

  ctx.clearRect(0, 0, width, height)

  if (image) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
    ctx.clip()

    const imgAspect = image.width / image.height
    let drawWidth, drawHeight

    if (imgAspect > 1) {
      drawHeight = innerRadius * 2 * zoom
      drawWidth = drawHeight * imgAspect
    } else {
      drawWidth = innerRadius * 2 * zoom
      drawHeight = drawWidth / imgAspect
    }

    ctx.translate(centerX + panX, centerY + panY)
    ctx.rotate(rotation * Math.PI / 180)
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    ctx.restore()
  }

  if (pfpFrame) {
    let tintedFrame
    if (ringColor === 'holo') {
      tintedFrame = tintImageHolo(pfpFrame)
    } else if (ringColor === 'green') {
      tintedFrame = pfpFrame
    } else {
      const colorVal = getRingColorValue(ringColor)
      tintedFrame = tintImage(pfpFrame, colorVal, 0.7)
    }

    const fx = centerX - frameSize / 2
    const fy = centerY - frameSize / 2
    ctx.drawImage(tintedFrame, fx, fy, frameSize, frameSize)
  }
}
