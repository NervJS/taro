import { fromByteArray, toByteArray } from 'base64-js'

export function arrayBufferToBase64 (arrayBuffer) {
  return fromByteArray(arrayBuffer)
}

export function base64ToArrayBuffer (base64) {
  return toByteArray(base64)
}

export default {
  arrayBufferToBase64,
  base64ToArrayBuffer
}
