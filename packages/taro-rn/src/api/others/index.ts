let base64js = require('base64-js')

export function arrayBufferToBase64 (arrayBuffer) {
  return base64js.fromByteArray(arrayBuffer)
}

export function base64ToArrayBuffer (base64) {
  return base64js.toByteArray(base64)
}

export default {
  arrayBufferToBase64,
  base64ToArrayBuffer
}
