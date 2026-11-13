import Taro from '@tarojs/api'

import { MethodHandler } from '../../../utils/handler'

const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

/** Read image bytes with a FileReader fallback for older browsers. */
function readBlob (blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error ?? new Error('could not read the image'))
    reader.readAsArrayBuffer(blob)
  })
}

/** Detect JPEG and static PNG by inspecting the encoded bytes. */
async function getImageType (source: Blob) {
  const signature = new Uint8Array(await readBlob(source.slice(0, pngSignature.length)))
  if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) {
    return 'image/jpeg'
  }
  if (!pngSignature.every((byte, index) => signature[index] === byte)) {
    throw new Error('only JPEG and static PNG images are supported')
  }

  // An APNG declares its animation in an acTL chunk before the first IDAT.
  for (let offset = pngSignature.length; offset + 12 <= source.size;) {
    const header = await readBlob(source.slice(offset, offset + 8))
    const type = String.fromCharCode(...new Uint8Array(header, 4))
    if (type === 'acTL') throw new Error('animated PNG images are not supported')
    if (type === 'IDAT') return 'image/png'
    offset += new DataView(header).getUint32(0) + 12
  }
  throw new Error('invalid PNG image')
}

/** Decode, resize and re-encode an image while preserving its format. */
async function encodeImage (source: Blob, width: number | undefined, height: number | undefined, quality: number) {
  const type = await getImageType(source)
  const url = URL.createObjectURL(source.slice(0, source.size, type))
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const { naturalWidth, naturalHeight } = image
    if (!naturalWidth || !naturalHeight) throw new Error('invalid image dimensions')

    const targetWidth = width ?? (height === undefined ? naturalWidth : Math.max(1, Math.round(height * naturalWidth / naturalHeight)))
    const targetHeight = height ?? (width === undefined ? naturalHeight : Math.max(1, Math.round(width * naturalHeight / naturalWidth)))
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) throw new Error('invalid output dimensions')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('could not create a canvas context')
    context.drawImage(image, 0, 0, targetWidth, targetHeight)

    const output = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, type, type === 'image/jpeg' ? quality / 100 : undefined)
    })
    if (!output || output.type !== type) throw new Error('could not encode the image')
    return output
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Compress an image and return a temporary Blob URL. */
export const compressImage: typeof Taro.compressImage = async options => {
  const handle = new MethodHandler<Taro.compressImage.SuccessCallbackResult>({
    name: 'compressImage',
    success: options?.success,
    fail: options?.fail,
    complete: options?.complete
  })
  if (typeof options?.src !== 'string' || !options.src.trim()) {
    return handle.fail({ errMsg: 'src must be a non-empty string' })
  }
  const { src, quality = 80, compressedWidth, compressedHeight } = options
  if (!Number.isFinite(quality) || quality < 0 || quality > 100) {
    return handle.fail({ errMsg: 'quality must be between 0 and 100' })
  }
  if ([compressedWidth, compressedHeight].some(size => size !== undefined && (!Number.isSafeInteger(size) || size <= 0))) {
    return handle.fail({ errMsg: 'compressedWidth and compressedHeight must be positive integers' })
  }

  let tempFilePath: string
  try {
    const response = await fetch(src)
    if (!response.ok) throw new Error(`image request failed (HTTP ${response.status})`)
    const output = await encodeImage(await response.blob(), compressedWidth, compressedHeight, quality)
    tempFilePath = URL.createObjectURL(output)
  } catch (error) {
    return handle.fail({ errMsg: error?.message || 'could not compress the image' })
  }
  return handle.success({ tempFilePath })
}
