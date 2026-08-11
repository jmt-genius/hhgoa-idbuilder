import { useState, useCallback, useRef, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import SideRails from './components/SideRails'
import FormatSelector from './components/FormatSelector'
import ImageUploader from './components/ImageUploader'
import PfpControls, { RING_COLORS } from './components/PfpControls'
import BuilderControls from './components/BuilderControls'
import { convertHeicToPng, generateShareUrl, downloadImage } from './utils/helpers'

function App() {
  const [format, setFormat] = useState('pfp')
  const [originalImage, setOriginalImage] = useState(null)

  // PFP controls
  const [ringColor, setRingColor] = useState('green')
  const [ringWeight, setRingWeight] = useState(8)
  const [photoLook, setPhotoLook] = useState('asshot')
  const [zoom, setZoom] = useState(100)
  const [showBadge, setShowBadge] = useState(true)

  // Builder controls
  const [builderName, setBuilderName] = useState('')
  const [builderRole, setBuilderRole] = useState('')
  const [builderTitle, setBuilderTitle] = useState('')

  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef(null)
  const goaBadgeRef = useRef(null)
  const fileInputRef = useRef(null)

  // Load goa badge image
  useEffect(() => {
    const img = new Image()
    img.src = '/goa-devanagari.png'
    img.onload = () => { goaBadgeRef.current = img }
  }, [])

  // Auto-generate on any control change
  useEffect(() => {
    if (originalImage) {
      generateImage()
    }
  }, [originalImage, format, ringColor, ringWeight, photoLook, zoom, showBadge, builderName, builderRole, builderTitle])

  const handleImageUpload = useCallback(async (file) => {
    try {
      let imageFile = file
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
        setIsProcessing(true)
        imageFile = await convertHeicToPng(file)
        setIsProcessing(false)
      }
      const img = new Image()
      img.src = URL.createObjectURL(imageFile)
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      setOriginalImage(img)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const generateImage = useCallback(() => {
    if (!originalImage) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = 2 // Fixed 2x for quality

    let width, height
    if (format === 'pfp') {
      width = 800; height = 800
    } else {
      width = 1080; height = 1350
    }

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Apply photo look
    const processedImage = applyPhotoLook(originalImage, photoLook)

    if (format === 'pfp') {
      drawPfpFrame(ctx, width, height, processedImage, {
        ringColor, ringWeight, zoom: zoom / 100, showBadge, goaBadge: goaBadgeRef.current,
      })
    } else {
      drawBuilderCard(ctx, width, height, processedImage, {
        name: builderName, role: builderRole, title: builderTitle,
        zoom: zoom / 100, showBadge, goaBadge: goaBadgeRef.current,
      })
    }
  }, [originalImage, format, ringColor, ringWeight, photoLook, zoom, showBadge, builderName, builderRole, builderTitle])

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png', 1.0))
    downloadImage(blob, `hhgoa-2026-${format}-${Date.now()}.png`)
  }, [format])

  const handleShare = useCallback(() => {
    const text = format === 'pfp'
      ? "Just framed my profile for Hacker House Goa 2026! 🌴💚 #FrameInGoa #HHGoa2026"
      : "Just got my builder pass for Hacker House Goa 2026! 🏗️🌴 #FrameInGoa #HHGoa2026"
    const shareUrl = generateShareUrl(text)
    window.open(shareUrl, '_blank', 'width=550,height=420')
  }, [format])

  const handleChangePhoto = useCallback(() => {
    setOriginalImage(null)
  }, [])

  const handleSurpriseMe = useCallback(() => {
    const colors = ['green', 'taxi', 'night', 'sunset', 'cream', 'holo']
    const looks = ['asshot', 'punch', 'duotone', 'grain']
    setRingColor(colors[Math.floor(Math.random() * colors.length)])
    setRingWeight(Math.floor(Math.random() * 18) + 2)
    setPhotoLook(looks[Math.floor(Math.random() * looks.length)])
    setZoom(Math.floor(Math.random() * 100) + 100)
    setShowBadge(Math.random() > 0.3)
  }, [])

  return (
    <>
      <SideRails />

      <main
        className="field-texture"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100dvh',
          padding: '40px 20px 64px',
        }}
      >
        <Header />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
          {/* Format toggle */}
          <FormatSelector value={format} onChange={setFormat} />

          {/* Upload or Canvas + Controls */}
          {!originalImage ? (
            <ImageUploader onUpload={handleImageUpload} isProcessing={isProcessing} />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              width: '100%',
              maxWidth: '440px',
            }}>
              {/* Canvas preview */}
              <div
                className="canvas-container"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    border: '2px solid rgba(154, 201, 95, 0.15)',
                  }}
                  aria-label="Generated graphic preview"
                />
              </div>

              {/* Controls */}
              {format === 'pfp' ? (
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
                  onChangePhoto={handleChangePhoto}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  isProcessing={isProcessing}
                />
              ) : (
                <BuilderControls
                  name={builderName}
                  onNameChange={setBuilderName}
                  role={builderRole}
                  onRoleChange={setBuilderRole}
                  title={builderTitle}
                  onTitleChange={setBuilderTitle}
                  photoLook={photoLook}
                  onPhotoLookChange={setPhotoLook}
                  zoom={zoom}
                  onZoomChange={setZoom}
                  showBadge={showBadge}
                  onShowBadgeChange={setShowBadge}
                  onChangePhoto={handleChangePhoto}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
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
        // Increase contrast
        for (let c = 0; c < 3; c++) {
          data[i + c] = Math.min(255, Math.max(0, ((data[i + c] / 255 - 0.5) * 1.4 + 0.5) * 255))
        }
      }
      break

    case 'duotone':
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        // Green to cream duotone
        const t = lum / 255
        data[i] = Math.round(11 + t * (255 - 11))     // R: dark green to cream
        data[i + 1] = Math.round(104 + t * (251 - 104)) // G
        data[i + 2] = Math.round(57 + t * (232 - 57))   // B
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

  const resultImg = new Image()
  resultImg.width = image.width
  resultImg.height = image.height
  resultImg.src = canvas.toDataURL('image/png')
  // We need to return the canvas directly since toDataURL is sync
  // but Image loading is async. We'll use the canvas as a drawable.
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
    holo: null, // special handling
  }
  return map[ringColorId] || '#22c55e'
}

/* ── Draw PFP frame ─────────────────────────────── */
function drawPfpFrame(ctx, width, height, image, opts) {
  const { ringColor, ringWeight, zoom, showBadge, goaBadge } = opts
  const centerX = width / 2
  const centerY = height / 2
  const radius = 320

  // Background
  ctx.fillStyle = '#0b6839'
  ctx.fillRect(0, 0, width, height)

  // Diagonal stripe texture
  ctx.save()
  ctx.globalAlpha = 0.04
  for (let i = -width; i < width * 2; i += 26) {
    ctx.strokeStyle = '#9ac95f'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + height, height)
    ctx.stroke()
  }
  ctx.restore()

  // Circular clip for photo
  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.clip()

  const imgAspect = image.width / image.height
  let drawWidth, drawHeight, drawX, drawY

  if (imgAspect > 1) {
    drawHeight = radius * 2 * zoom
    drawWidth = drawHeight * imgAspect
  } else {
    drawWidth = radius * 2 * zoom
    drawHeight = drawWidth / imgAspect
  }
  drawX = centerX - drawWidth / 2
  drawY = centerY - drawHeight / 2

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()

  // Ring
  if (ringColor === 'holo') {
    // Draw holo ring with gradient
    const holoGrad = ctx.createConicGradient(0, centerX, centerY)
    holoGrad.addColorStop(0, '#ff0080')
    holoGrad.addColorStop(0.25, '#fee101')
    holoGrad.addColorStop(0.5, '#22c55e')
    holoGrad.addColorStop(0.75, '#00bfff')
    holoGrad.addColorStop(1, '#ff0080')
    ctx.strokeStyle = holoGrad
  } else {
    ctx.strokeStyle = getRingColorValue(ringColor)
  }

  ctx.lineWidth = ringWeight
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + ringWeight / 2, 0, Math.PI * 2)
  ctx.stroke()

  // Event text
  ctx.fillStyle = 'rgba(255, 251, 232, 0.7)'
  ctx.font = '600 14px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HACKER HOUSE GOA · 2026', centerX, height - 50)

  ctx.fillStyle = 'rgba(255, 251, 232, 0.4)'
  ctx.font = '500 11px "JetBrains Mono", monospace'
  ctx.fillText('#FrameInGoa', centerX, height - 28)

  // Goa badge
  if (showBadge && goaBadge) {
    const badgeSize = 80
    const badgeX = centerX + radius - badgeSize / 2
    const badgeY = centerY + radius - badgeSize / 2
    ctx.drawImage(goaBadge, badgeX, badgeY, badgeSize, badgeSize)
  }
}

/* ── Draw Builder Card ──────────────────────────── */
function drawBuilderCard(ctx, width, height, image, opts) {
  const { name, role, title, zoom, showBadge, goaBadge } = opts

  // Background
  ctx.fillStyle = '#0b6839'
  ctx.fillRect(0, 0, width, height)

  // Diagonal stripe texture
  ctx.save()
  ctx.globalAlpha = 0.04
  for (let i = -width; i < width * 2; i += 26) {
    ctx.strokeStyle = '#9ac95f'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + height, height)
    ctx.stroke()
  }
  ctx.restore()

  // Card area
  const cardX = 60
  const cardY = 60
  const cardW = width - 120
  const cardH = height - 120
  const radius = 24

  ctx.fillStyle = 'rgba(4, 23, 13, 0.5)'
  ctx.strokeStyle = 'rgba(154, 201, 95, 0.2)'
  ctx.lineWidth = 2
  roundRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.fill()
  ctx.stroke()

  // Corner brackets on card
  const bracketSize = 30
  const bracketOff = 20
  ctx.strokeStyle = 'rgba(154, 201, 95, 0.35)'
  ctx.lineWidth = 2
  // TL
  ctx.beginPath()
  ctx.moveTo(cardX + bracketOff, cardY + bracketOff + bracketSize)
  ctx.lineTo(cardX + bracketOff, cardY + bracketOff)
  ctx.lineTo(cardX + bracketOff + bracketSize, cardY + bracketOff)
  ctx.stroke()
  // TR
  ctx.beginPath()
  ctx.moveTo(cardX + cardW - bracketOff - bracketSize, cardY + bracketOff)
  ctx.lineTo(cardX + cardW - bracketOff, cardY + bracketOff)
  ctx.lineTo(cardX + cardW - bracketOff, cardY + bracketOff + bracketSize)
  ctx.stroke()
  // BL
  ctx.beginPath()
  ctx.moveTo(cardX + bracketOff, cardY + cardH - bracketOff - bracketSize)
  ctx.lineTo(cardX + bracketOff, cardY + cardH - bracketOff)
  ctx.lineTo(cardX + bracketOff + bracketSize, cardY + cardH - bracketOff)
  ctx.stroke()
  // BR
  ctx.beginPath()
  ctx.moveTo(cardX + cardW - bracketOff - bracketSize, cardY + cardH - bracketOff)
  ctx.lineTo(cardX + cardW - bracketOff, cardY + cardH - bracketOff)
  ctx.lineTo(cardX + cardW - bracketOff, cardY + cardH - bracketOff - bracketSize)
  ctx.stroke()

  // Photo
  const photoSize = 220
  const photoX = cardX + (cardW - photoSize) / 2
  const photoY = cardY + 80

  ctx.save()
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 16)
  ctx.clip()

  const imgAspect = image.width / image.height
  let drawWidth, drawHeight, drawX, drawY
  if (imgAspect > 1) {
    drawHeight = photoSize * zoom
    drawWidth = drawHeight * imgAspect
  } else {
    drawWidth = photoSize * zoom
    drawHeight = drawWidth / imgAspect
  }
  drawX = photoX + (photoSize - drawWidth) / 2
  drawY = photoY + (photoSize - drawHeight) / 2

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()

  // Photo border
  ctx.strokeStyle = 'rgba(154, 201, 95, 0.3)'
  ctx.lineWidth = 2
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 16)
  ctx.stroke()

  // Text
  let textY = photoY + photoSize + 50

  ctx.fillStyle = '#fffbe8'
  ctx.font = '700 36px "Imbue", Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(name || 'Anon Builder', width / 2, textY)

  textY += 52

  ctx.fillStyle = 'rgba(154, 201, 95, 0.8)'
  ctx.font = '500 16px "JetBrains Mono", monospace'
  ctx.fillText(role || 'Full Stack Developer', width / 2, textY)

  textY += 40

  // Separator
  ctx.strokeStyle = 'rgba(154, 201, 95, 0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 100, textY)
  ctx.lineTo(width / 2 + 100, textY)
  ctx.stroke()

  textY += 24

  // Title
  ctx.fillStyle = 'var(--brand-accent)' // Won't work in canvas, use hex
  ctx.fillStyle = '#fee101'
  ctx.font = '700 22px "JetBrains Mono", monospace'
  ctx.fillText(`» ${title || 'Code Alchemist'}`, width / 2, textY)

  textY += 50

  // Event info
  ctx.fillStyle = 'rgba(255, 251, 232, 0.4)'
  ctx.font = '600 12px "JetBrains Mono", monospace'
  ctx.fillText('HACKER HOUSE GOA · OCT 28–31 · 2026', width / 2, textY)

  textY += 24
  ctx.fillStyle = 'rgba(255, 251, 232, 0.25)'
  ctx.font = '500 10px "JetBrains Mono", monospace'
  ctx.fillText('#FrameInGoa  ·  hhgoa.com', width / 2, textY)

  // Goa badge
  if (showBadge && goaBadge) {
    const badgeSize = 60
    ctx.drawImage(goaBadge, width / 2 - badgeSize / 2, textY + 30, badgeSize, badgeSize)
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default App