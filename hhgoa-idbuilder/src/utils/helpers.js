import heic2any from 'heic2any'

export async function convertHeicToPng(file) {
  try {
    const pngBlob = await heic2any({
      blob: file,
      toType: 'image/png',
      quality: 0.9,
    })
    return new File([pngBlob], file.name.replace(/\.heic$/i, '.png'), { type: 'image/png' })
  } catch (err) {
    console.error('HEIC conversion failed:', err)
    throw new Error('Failed to convert HEIC image. Please use JPG or PNG.')
  }
}

export function downloadImage(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateShareUrl(text) {
  const encodedText = encodeURIComponent(text)
  return `https://x.com/intent/tweet?text=${encodedText}`
}

export function createBlobFromCanvas(canvas, type = 'image/png', quality = 1.0) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }
  })
}

export function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function throttle(fn, limit) {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}