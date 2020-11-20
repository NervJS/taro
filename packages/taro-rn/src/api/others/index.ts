import base64js from 'base64-js'

export function arrayBufferToBase64 (arrayBuffer: ArrayBuffer): string {
  const buffer = new Uint8Array(arrayBuffer)
  return base64js.fromByteArray(buffer)
}

export function base64ToArrayBuffer (base64: string): ArrayBuffer {
  return base64js.toByteArray(base64)
}

export default {
  arrayBufferToBase64,
  base64ToArrayBuffer
}
