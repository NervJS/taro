import { toByteArray } from 'base64-js'

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return toByteArray(base64)
}