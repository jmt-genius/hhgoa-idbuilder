import { useState, useCallback, useRef, useEffect } from 'react'
import ImageUploader from './ImageUploader'
import PfpControls from './PfpControls'
import { convertHeicToPng, downloadImage, generateShareUrl } from '../utils/helpers'
import { CardContainer, CardBody, CardItem } from './ui/3d-card'

export default function PfpGenerator() {
  const [originalImage, setOriginalImage] = useState(null)

  // PFP controls
  const [ringColor, setRingColor] = useState('green')
  const [ringWeight, setRingWeight] = useState(10)
  const [photoLook, setPhotoLook] = useState('asshot')
  const [zoom, setZoom] = useState(100)
  const [showBadge, setShowBadge] = useState(true)

  // AI Feature States
  const [selectedFile, setSelectedFile] = useState(null)
  const [presets] = useState([
    "ghibli", "indian_cinema", "jojo_anime", "cyberpunk", "watercolor", 
    "oil_painting", "pixel_art", "film_noir", "vintage_polaroid", "vaporwave"
  ])
  const [selectedPreset, setSelectedPreset] = useState('original')
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef(null)
  const goaBadgeRef = useRef(null)
  const pfpFrameRef = useRef(null)

  // Load goa badge image and pfp frame overlay
  useEffect(() => {
    const badge = new Image()
    badge.src = '/goa-devanagari.png'
    badge.onload = () => { goaBadgeRef.current = badge }

    const frame = new Image()
    frame.src = '/pfp_overlay.png'
    frame.onload = () => { pfpFrameRef.current = frame }
  }, [])

  // Auto-generate on any control change
  useEffect(() => {
    if (originalImage) {
      generateImage()
    }
  }, [originalImage, ringColor, ringWeight, photoLook, zoom, showBadge])

  const handleImageUpload = useCallback(async (file) => {
    try {
      let imageFile = file
      setSelectedFile(file)
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
      setSelectedPreset('original')
    } catch (err) {
      console.error(err)
    }
  }, [])

  const pollStatus = async (runId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/status/${runId}`)
      const data = await res.json()
      if (data.status === 'success' && data.image_url) {
        const img = new Image()
        // We set crossOrigin to anonymous to avoid tainted canvas on download
        img.crossOrigin = 'anonymous'
        img.src = data.image_url
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        setOriginalImage(img)
        setIsAIGenerating(false)
        setStatusMessage('Generation complete!')
        setTimeout(() => setStatusMessage(''), 3000)
      } else if (data.status === 'failed') {
        setIsAIGenerating(false)
        setStatusMessage('Generation failed.')
      } else {
        setTimeout(() => pollStatus(runId), 3000)
      }
    } catch (e) {
      console.error(e)
      setIsAIGenerating(false)
      setStatusMessage('Error checking status.')
    }
  }

  const handleGenerateStyle = async () => {
    if (!selectedFile || selectedPreset === 'original') return
    
    setIsAIGenerating(true)
    setStatusMessage('Uploading image...')
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('preset', selectedPreset)
    
    try {
      const res = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok && data.run_id) {
        setStatusMessage('✨ Generating your style... Please wait...')
        pollStatus(data.run_id)
      } else {
        throw new Error(data.detail || 'Failed to start generation')
      }
    } catch (e) {
      console.error(e)
      setIsAIGenerating(false)
      setStatusMessage('Failed to connect to AI server.')
    }
  }

  const generateImage = useCallback(() => {
    if (!originalImage) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = 2 // Fixed 2x for quality
    const width = 800
    const height = 800

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Apply photo look
    const processedImage = applyPhotoLook(originalImage, photoLook)

    drawPfpFrame(ctx, width, height, processedImage, {
      ringColor,
      ringWeight,
      zoom: zoom / 100,
      showBadge,
      goaBadge: goaBadgeRef.current,
      pfpFrame: pfpFrameRef.current,
    })
  }, [originalImage, ringColor, ringWeight, photoLook, zoom, showBadge])

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

  const handleChangePhoto = useCallback(() => {
    setOriginalImage(null)
  }, [])

  const handleSurpriseMe = useCallback(() => {
    const colors = ['green', 'taxi', 'night', 'sunset', 'cream', 'cyan', 'pink', 'holo']
    const looks = ['asshot', 'punch', 'duotone', 'grain']
    setRingColor(colors[Math.floor(Math.random() * colors.length)])
    setRingWeight(Math.floor(Math.random() * 20) + 4)
    setPhotoLook(looks[Math.floor(Math.random() * looks.length)])
    setZoom(Math.floor(Math.random() * 100) + 100)
    setShowBadge(Math.random() > 0.3)
  }, [])

  const handleApplyPreset = useCallback((preset) => {
    setRingColor(preset.ringColor)
    setRingWeight(preset.ringWeight)
    setPhotoLook(preset.photoLook)
  }, [])

  return (
    <div className="layout" style={{ width: '100%', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Left panel: Form/Controls */}
      <div className="panel form-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '14px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--brand-accent)',
          margin: '0 0 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Your Details
        </h2>

        {!originalImage ? (
          <div>
            <div className="section-label" style={{ marginBottom: '12px' }}>PHOTO</div>
            <ImageUploader onUpload={handleImageUpload} isProcessing={isProcessing} />
          </div>
        ) : (
          <PfpControls
            ringColor={ringColor}
            onRingColorChange={setRingColor}
            ringWeight={ringWeight}
            onRingWeightChange={setRingWeight}
            photoLook={photoLook}
            onPhotoLookChange={setPhotoLook}
            zoom={zoom}
            onZoomChange={setZoom}
            showBadge={showBadge}
            onShowBadgeChange={setShowBadge}
            onSurpriseMe={handleSurpriseMe}
            onApplyPreset={handleApplyPreset}
            onChangePhoto={handleChangePhoto}
            onDownload={handleDownload}
            onShare={handleShare}
            isProcessing={isProcessing}
            presets={presets}
            selectedPreset={selectedPreset}
            onPresetChange={setSelectedPreset}
            onGenerateStyle={handleGenerateStyle}
            isAIGenerating={isAIGenerating}
            statusMessage={statusMessage}
          />
        )}
      </div>

      {/* Right panel: Preview */}
      <div className="panel preview-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px'
      }}>
        <div className="status-row" style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontSize: '11px',
          color: 'rgba(255, 251, 232, 0.4)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          <span className={`dot ${originalImage ? 'on' : ''}`} style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: originalImage ? '#3ee089' : 'var(--brand-pink)',
            boxShadow: originalImage ? '0 0 8px #3ee089' : '0 0 8px var(--brand-pink)'
          }}></span>
          <span>{originalImage ? 'Ready to download' : 'Waiting for photo'}</span>
        </div>

        <div className="canvas-shell" style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <CardContainer containerClassName="py-0 flex justify-center w-full">
            <CardBody className="[transform-style:preserve-3d] w-full h-auto flex items-center justify-center">
              <CardItem translateZ="100" className="w-full flex justify-center">
                {originalImage ? (
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: '100%',
                      maxWidth: '440px',
                      height: 'auto',
                      borderRadius: '18px',
                      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)',
                      display: 'block'
                    }}
                    aria-label="Generated graphic preview"
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    maxWidth: '440px',
                    aspectRatio: '1',
                    borderRadius: '18px',
                    background: 'rgba(4, 23, 13, 0.5)',
                    border: '2px dashed rgba(154, 201, 95, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 251, 232, 0.3)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px'
                  }}>
                    Preview Canvas
                  </div>
                )}
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
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
    case 'punch':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.3 + 10)
        data[i + 1] = Math.min(255, data[i + 1] * 1.2 + 5)
        data[i + 2] = Math.min(255, data[i + 2] * 1.1)
        for (let c = 0; c < 3; c++) {
          data[i + c] = Math.min(255, Math.max(0, ((data[i + c] / 255 - 0.5) * 1.4 + 0.5) * 255))
        }
      }
      break

    case 'duotone':
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        const t = lum / 255
        data[i] = Math.round(11 + t * (255 - 11))
        data[i + 1] = Math.round(104 + t * (251 - 104))
        data[i + 2] = Math.round(57 + t * (232 - 57))
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
  const { ringColor, ringWeight, zoom, showBadge, goaBadge, pfpFrame } = opts
  const centerX = width / 2
  const centerY = height / 2

  const thicknessScale = ringWeight / 10

  const frameNaturalSize = Math.min(width, height) * 0.96
  const frameSize = frameNaturalSize * (0.85 + thicknessScale * 0.15)
  const innerRadius = frameSize * 0.38

  ctx.clearRect(0, 0, width, height)

  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
  ctx.clip()

  const imgAspect = image.width / image.height
  let drawWidth, drawHeight, drawX, drawY

  if (imgAspect > 1) {
    drawHeight = innerRadius * 2 * zoom
    drawWidth = drawHeight * imgAspect
  } else {
    drawWidth = innerRadius * 2 * zoom
    drawHeight = drawWidth / imgAspect
  }
  drawX = centerX - drawWidth / 2
  drawY = centerY - drawHeight / 2

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()

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
