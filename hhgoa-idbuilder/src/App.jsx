import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, Share2, X, Image, Camera, Sparkles, Zap, Loader2, CheckCircle, ChevronRight } from 'lucide-react'
import ImageUploader from './components/ImageUploader'
import FormatSelector from './components/FormatSelector'
import PresetSelector from './components/PresetSelector'
import BuilderForm from './components/BuilderForm'
import ResultActions from './components/ResultActions'
import Header from './components/Header'
import Footer from './components/Footer'
import { PRESETS, FORMATS, BUILDER_TITLES } from './constants'
import { convertHeicToPng, generateShareUrl, downloadImage } from './utils/helpers'

function App() {
  const [format, setFormat] = useState('pfp')
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [builderData, setBuilderData] = useState({
    name: '',
    role: '',
    customTitle: '',
  })
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultBlob, setResultBlob] = useState(null)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = useCallback(async (file) => {
    setError(null)
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
      setProcessedImage(img)
      setShowResult(false)
      setResultBlob(null)
      URL.revokeObjectURL(img.src)
    } catch (err) {
      setError('Failed to load image. Please try another file.')
      console.error(err)
    }
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!originalImage) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas not ready')
      
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      
      let width, height
      if (format === 'pfp') {
        width = 800
        height = 800
      } else {
        width = 1080
        height = 1350
      }
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
      
      if (format === 'pfp') {
        drawPfpFrame(ctx, width, height, processedImage)
      } else {
        drawBuilderCard(ctx, width, height, processedImage, builderData)
      }
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0))
      setResultBlob(blob)
      setShowResult(true)
    } catch (err) {
      setError('Failed to generate image. Please try again.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }, [originalImage, processedImage, format, builderData])

  const handleDownload = useCallback(() => {
    if (resultBlob) {
      downloadImage(resultBlob, `hhgoa-2026-${format}-${Date.now()}.png`)
    }
  }, [resultBlob, format])

  const handleShare = useCallback(() => {
    if (!resultBlob) return
    
    const text = format === 'pfp' 
      ? "Just framed my profile for Hacker House Goa 2026! 🌴💚 #FrameInGoa #HHGoa2026"
      : "Just got my builder badge for Hacker House Goa 2026! 🏗️🌴 #FrameInGoa #HHGoa2026"
    
    const shareUrl = generateShareUrl(text)
    window.open(shareUrl, '_blank', 'width=550,height=420')
  }, [resultBlob, format])

  const handleRetry = useCallback(() => {
    setShowResult(false)
    setResultBlob(null)
  }, [])

  const handlePresetSelect = useCallback((preset) => {
    setSelectedPreset(preset)
    if (preset.id === 'custom') {
      setProcessedImage(originalImage)
    } else {
      applyPreset(originalImage, preset.id).then(img => {
        setProcessedImage(img)
      })
    }
  }, [originalImage])

  return (
    <div className="bg-halftone bg-stripes" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Decorative vertical side text - left */}
      <div className="vertical-text" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
        HACKER HOUSE GOA · OCT 28-31 · 2026 · LESS NOISE MORE SIGNAL · BUILDERS ONLY · FRAME IN GOA
      </div>
      
      {/* Decorative vertical side text - right */}
      <div className="vertical-text" style={{ right: '16px', top: '50%', transform: 'translateY(-50%) rotate(180deg)' }}>
        HACKER HOUSE GOA · OCT 28-31 · 2026 · LESS NOISE MORE SIGNAL · BUILDERS ONLY · FRAME IN GOA
      </div>

      <Header />
      
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* ===== HERO SECTION ===== */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          padding: '40px 20px',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Giant HACKER HOUSE title */}
          <h1 className="hero-title" style={{ marginBottom: '8px' }}>
            HACKER HOUSE
          </h1>
          
          {/* Goa Devanagari image */}
          <img 
            src="/goa-devanagari.png" 
            alt="गोवा - Goa in Devanagari"
            className="goa-devanagari"
            style={{ marginTop: '8px', marginBottom: '24px' }}
          />
          
          {/* Event info pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '32px',
          }}>
            <span className="info-pill">GOA, INDIA</span>
            <span className="info-pill">28 - 31 OCT 2026</span>
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--fg-muted)',
            maxWidth: '500px',
            lineHeight: 1.6,
          }}>
            LESS NOISE. MORE SIGNAL.
          </p>
        </section>

        {/* ===== TOOL SECTION ===== */}
        <section 
          id="create"
          className="bg-crosses"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)',
            padding: '60px 0 80px',
            position: 'relative',
          }}
        >
          <div className="container-padding" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {!originalImage ? (
              <div className="animate-scale-in" style={{ textAlign: 'center' }}>
                {/* Section header */}
                <h2 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  color: 'var(--yellow)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}>
                  Frame Your Identity
                </h2>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-muted)',
                  marginBottom: '40px',
                }}>
                  Upload a photo. Pick a style. Share to X.
                </p>
                <ImageUploader onUpload={handleImageUpload} isProcessing={isProcessing} />
              </div>
            ) : (
              <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <FormatSelector 
                  value={format} 
                  onChange={setFormat} 
                  formats={FORMATS}
                />
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '24px',
                  alignItems: 'start',
                }}>
                  {/* Desktop: side by side */}
                  <style>{`
                    @media (min-width: 768px) {
                      .tool-grid { grid-template-columns: 1fr 1fr !important; }
                    }
                  `}</style>
                  <div className="tool-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '24px',
                    alignItems: 'start',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <PresetSelector 
                        presets={PRESETS}
                        selectedPreset={selectedPreset}
                        onSelect={handlePresetSelect}
                        customPrompt={customPrompt}
                        onCustomPromptChange={setCustomPrompt}
                        disabled={isProcessing}
                      />
                      
                      {format === 'badge' && (
                        <BuilderForm 
                          data={builderData}
                          onChange={setBuilderData}
                          titles={BUILDER_TITLES}
                        />
                      )}
                      
                      <div>
                        <button
                          onClick={handleGenerate}
                          disabled={isProcessing || !originalImage}
                          className="btn-primary"
                          style={{ width: '100%', padding: '16px 32px', fontSize: '0.9rem' }}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Zap style={{ width: 20, height: 20 }} />
                              Generate Graphic
                            </>
                          )}
                        </button>
                      </div>
                      
                      {error && (
                        <div style={{
                          padding: '14px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.75rem',
                        }}>
                          {error}
                        </div>
                      )}
                    </div>
                    
                    <div className="canvas-container" style={{ display: 'flex', justifyContent: 'center' }}>
                      <canvas 
                        ref={canvasRef}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '12px',
                        }}
                        className="card-glow"
                        aria-label="Generated graphic preview"
                      />
                    </div>
                  </div>
                </div>
                
                {showResult && resultBlob && (
                  <ResultActions
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onRetry={handleRetry}
                    isProcessing={isProcessing}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

function drawPfpFrame(ctx, width, height, image) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = 320
  
  ctx.fillStyle = '#052e16'
  ctx.fillRect(0, 0, width, height)
  
  const gridSize = 40
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)'
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5)
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)')
  gradient.addColorStop(1, 'rgba(5, 46, 22, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.clip()
  
  const imgAspect = image.width / image.height
  const frameAspect = 1
  let drawWidth, drawHeight, drawX, drawY
  
  if (imgAspect > frameAspect) {
    drawHeight = radius * 2
    drawWidth = drawHeight * imgAspect
    drawX = centerX - drawWidth / 2
    drawY = centerY - drawHeight / 2
  } else {
    drawWidth = radius * 2
    drawHeight = drawWidth / imgAspect
    drawX = centerX - drawWidth / 2
    drawY = centerY - drawHeight / 2
  }
  
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()
  
  const ringGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius)
  ringGradient.addColorStop(0, '#22c55e')
  ringGradient.addColorStop(0.5, '#16a34a')
  ringGradient.addColorStop(1, '#15803d')
  
  ctx.strokeStyle = ringGradient
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2)
  ctx.stroke()
  
  ctx.strokeStyle = 'rgba(20, 83, 45, 0.5)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2)
  ctx.stroke()
  
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)'
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const x1 = centerX + Math.cos(angle) * (radius + 12)
    const y1 = centerY + Math.sin(angle) * (radius + 12)
    const x2 = centerX + Math.cos(angle) * (radius + 24)
    const y2 = centerY + Math.sin(angle) * (radius + 24)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  
  ctx.fillStyle = '#22c55e'
  ctx.font = 'bold 28px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HACKER HOUSE GOA 2026', centerX, height - 60)
  
  ctx.fillStyle = 'rgba(34, 197, 94, 0.6)'
  ctx.font = '14px "JetBrains Mono", monospace'
  ctx.fillText('#FrameInGoa', centerX, height - 30)
}

function drawBuilderCard(ctx, width, height, image, data) {
  ctx.fillStyle = '#052e16'
  ctx.fillRect(0, 0, width, height)
  
  const gridSize = 40
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  const cardX = 60
  const cardY = 60
  const cardW = width - 120
  const cardH = height - 120
  const radius = 24
  
  ctx.fillStyle = '#0a140a'
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)'
  ctx.lineWidth = 2
  roundRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.fill()
  ctx.stroke()
  
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)'
  ctx.lineWidth = 1
  roundRect(ctx, cardX + 2, cardY + 2, cardW - 4, cardH - 4, radius - 2)
  ctx.stroke()
  
  const photoSize = 220
  const photoX = cardX + (cardW - photoSize) / 2
  const photoY = cardY + 60
  
  ctx.save()
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 16)
  ctx.clip()
  
  const imgAspect = image.width / image.height
  let drawWidth, drawHeight, drawX, drawY
  if (imgAspect > 1) {
    drawHeight = photoSize
    drawWidth = drawHeight * imgAspect
    drawX = photoX - (drawWidth - photoSize) / 2
    drawY = photoY
  } else {
    drawWidth = photoSize
    drawHeight = drawWidth / imgAspect
    drawX = photoX
    drawY = photoY - (drawHeight - photoSize) / 2
  }
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()
  
  const ringGradient = ctx.createLinearGradient(0, photoY, 0, photoY + photoSize)
  ringGradient.addColorStop(0, '#22c55e')
  ringGradient.addColorStop(1, '#15803d')
  ctx.strokeStyle = ringGradient
  ctx.lineWidth = 4
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 16)
  ctx.stroke()
  
  let textY = photoY + photoSize + 40
  
  ctx.fillStyle = '#e8f5e9'
  ctx.font = 'bold 36px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const name = data.name || 'Anonymous Builder'
  ctx.fillText(name, width / 2, textY)
  
  textY += 50
  
  ctx.fillStyle = '#22c55e'
  ctx.font = '20px "Space Grotesk", sans-serif'
  const role = data.role || 'Full Stack Developer'
  ctx.fillText(role, width / 2, textY)
  
  textY += 40
  
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 100, textY)
  ctx.lineTo(width / 2 + 100, textY)
  ctx.stroke()
  
  textY += 30
  
  const title = data.customTitle || getRandomTitle()
  ctx.fillStyle = '#22c55e'
  ctx.font = 'bold 24px "Space Grotesk", sans-serif'
  ctx.fillText(title, width / 2, textY)
  
  textY += 50
  
  ctx.fillStyle = 'rgba(107, 138, 109, 0.8)'
  ctx.font = '14px "JetBrains Mono", monospace'
  ctx.fillText('HACKER HOUSE GOA 2026', width / 2, textY)
  
  textY += 30
  ctx.fillStyle = 'rgba(34, 197, 94, 0.6)'
  ctx.font = '12px "JetBrains Mono", monospace'
  ctx.fillText('#FrameInGoa  •  hhgoa.dev', width / 2, textY)
  
  drawCornerAccents(ctx, cardX, cardY, cardW, cardH, radius)
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

function drawCornerAccents(ctx, x, y, w, h, r) {
  const accentLength = 40
  const accentWidth = 3
  const offset = 20
  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth = accentWidth
  ctx.lineCap = 'round'
  
  ctx.beginPath()
  ctx.moveTo(x + r + offset, y + offset)
  ctx.lineTo(x + r + offset + accentLength, y + offset)
  ctx.moveTo(x + offset, y + r + offset)
  ctx.lineTo(x + offset, y + r + offset + accentLength)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(x + w - r - offset - accentLength, y + offset)
  ctx.lineTo(x + w - r - offset, y + offset)
  ctx.moveTo(x + w - offset, y + r + offset)
  ctx.lineTo(x + w - offset, y + r + offset + accentLength)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(x + r + offset, y + h - offset)
  ctx.lineTo(x + r + offset + accentLength, y + h - offset)
  ctx.moveTo(x + offset, y + h - r - offset - accentLength)
  ctx.lineTo(x + offset, y + h - r - offset)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(x + w - r - offset - accentLength, y + h - offset)
  ctx.lineTo(x + w - r - offset, y + h - offset)
  ctx.moveTo(x + w - offset, y + h - r - offset - accentLength)
  ctx.lineTo(x + w - offset, y + h - r - offset)
  ctx.stroke()
}

function getRandomTitle() {
  const titles = [
    'Code Alchemist', 'Bug Whisperer', 'Deploy Druid', 'Runtime Shaman',
    'Logic Architect', 'Syntax Sorcerer', 'Git Gardener', 'Terminal Tactician',
    'Memory Maverick', 'Async Artist', 'Pipeline Poet', 'Cluster Captain'
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

async function applyPreset(image, presetId) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  switch (presetId) {
    case 'bollywood90s':
      applyBollywood90s(data)
      break
    case 'anime':
      applyAnime(data)
      break
    case 'qubely':
      applyQubely(data)
      break
    case 'cyberpunk':
      applyCyberpunk(data)
      break
    case 'retro8bit':
      applyRetro8Bit(data)
      break
    case 'vaporwave':
      applyVaporwave(data)
      break
    case 'noir':
      applyNoir(data)
      break
    case 'neon':
      applyNeon(data)
      break
    case 'sketch':
      applySketch(data, canvas.width, canvas.height)
      break
    case 'glitch':
      applyGlitch(data, canvas.width, canvas.height)
      break
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  return new Promise(resolve => {
    const img = new Image()
    img.src = canvas.toDataURL('image/png')
    img.onload = () => resolve(img)
  })
}

function applyBollywood90s(data) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.3 + 20)
    data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 10)
    data[i + 2] = Math.min(255, data[i + 2] * 0.8)
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = Math.min(255, data[i] * 0.7 + avg * 0.3 + 30)
    data[i + 1] = Math.min(255, data[i + 1] * 0.7 + avg * 0.3 + 15)
  }
}

function applyAnime(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    if (lum > 180) {
      data[i] = Math.min(255, r * 1.2)
      data[i + 1] = Math.min(255, g * 1.15)
      data[i + 2] = Math.min(255, b * 1.1)
    } else if (lum < 60) {
      data[i] = Math.max(0, r * 0.7)
      data[i + 1] = Math.max(0, g * 0.7)
      data[i + 2] = Math.max(0, b * 0.7)
    }
    data[i] = Math.min(255, data[i] * 1.15)
    data[i + 2] = Math.min(255, data[i + 2] * 1.05)
  }
}

function applyQubely(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const avg = (r + g + b) / 3
    data[i] = Math.min(255, avg * 0.3 + r * 0.7)
    data[i + 1] = Math.min(255, avg * 0.6 + g * 0.4 + 40)
    data[i + 2] = Math.min(255, avg * 0.1 + b * 0.9)
  }
}

function applyCyberpunk(data) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 0.8 + 60)
    data[i + 1] = Math.min(255, data[i + 1] * 0.3)
    data[i + 2] = Math.min(255, data[i + 2] * 1.5 + 40)
  }
}

function applyRetro8Bit(data) {
  const levels = 4
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const val = data[i + c]
      data[i + c] = Math.round(val / (256 / levels)) * (256 / levels)
    }
  }
}

function applyVaporwave(data) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.4 + 30)
    data[i + 1] = Math.min(255, data[i + 1] * 0.6)
    data[i + 2] = Math.min(255, data[i + 2] * 1.3 + 50)
  }
}

function applyNoir(data) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = Math.min(255, avg * 1.3)
  }
}

function applyNeon(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const max = Math.max(r, g, b)
    if (max === r) data[i] = Math.min(255, r * 1.5)
    else if (max === g) data[i + 1] = Math.min(255, g * 1.5)
    else data[i + 2] = Math.min(255, b * 1.5)
  }
}

function applySketch(data, width, height) {
  const gray = new Uint8ClampedArray(width * height)
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  }
  
  const blurred = new Uint8ClampedArray(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += gray[(y + dy) * width + (x + dx)]
        }
      }
      blurred[y * width + x] = sum / 9
    }
  }
  
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4
    const diff = 255 - Math.abs(gray[idx] - blurred[idx]) * 2
    const val = Math.max(0, Math.min(255, diff))
    data[i] = data[i + 1] = data[i + 2] = val
  }
}

function applyGlitch(data, width, height) {
  const sliceHeight = height / 20
  for (let slice = 0; slice < 20; slice++) {
    if (Math.random() < 0.15) {
      const offset = (Math.random() - 0.5) * 40
      const startY = Math.floor(slice * sliceHeight)
      const endY = Math.floor((slice + 1) * sliceHeight)
      for (let y = startY; y < endY; y++) {
        for (let x = 0; x < width; x++) {
          const srcX = Math.min(width - 1, Math.max(0, x + offset))
          const srcIdx = (y * width + srcX) * 4
          const dstIdx = (y * width + x) * 4
          data[dstIdx] = data[srcIdx]
          data[dstIdx + 1] = data[srcIdx + 1]
          data[dstIdx + 2] = data[srcIdx + 2]
        }
      }
    }
  }
}

export default App