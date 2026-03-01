/**
 * Redimensiona uma imagem e retorna como data URL (base64) para armazenar no config.
 * Mantém proporção e limita tamanho para caber no localStorage.
 */
export function resizeImageToDataUrl(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img
      let w = width
      let h = height
      if (width > maxWidth || height > maxHeight) {
        const r = Math.min(maxWidth / width, maxHeight / height)
        w = Math.round(width * r)
        h = Math.round(height * r)
      }
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas not supported"))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve(dataUrl)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Falha ao carregar imagem"))
    }
    img.src = url
  })
}

/** Tamanhos máximos para não estourar localStorage */
export const BANNER_MAX = { width: 800, height: 400 }
export const AVATAR_MAX = { width: 200, height: 200 }
export const PRODUCT_IMAGE_MAX = { width: 400, height: 300 }
