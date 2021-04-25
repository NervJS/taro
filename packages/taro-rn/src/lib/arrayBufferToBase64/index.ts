import { fromByteArray } from 'base64-js'

export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const buffer = new Uint8Array(arrayBuffer)
  return fromByteArray(buffer)
}