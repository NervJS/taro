import { Blob as BinaryBlob } from 'node:buffer'

import { createBufferURL, revokeBufferURL } from '../../src/api/storage'

const originalBlob = globalThis.Blob
const createDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const revokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')
const createObjectURL = jest.fn<string, [BinaryBlob]>()
const revokeObjectURL = jest.fn()

beforeEach(() => {
  globalThis.Blob = BinaryBlob as unknown as typeof Blob
  createObjectURL.mockReset().mockReturnValue('blob:buffer')
  revokeObjectURL.mockReset()
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })
})

afterEach(() => {
  globalThis.Blob = originalBlob
  if (createDescriptor) Object.defineProperty(URL, 'createObjectURL', createDescriptor)
  else delete (URL as Partial<typeof URL>).createObjectURL
  if (revokeDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeDescriptor)
  else delete (URL as Partial<typeof URL>).revokeObjectURL
})

test('creates a URL containing the bytes of an ArrayBuffer', async () => {
  const buffer = new Uint8Array([0, 128, 255]).buffer

  expect(createBufferURL(buffer)).toBe('blob:buffer')
  const blob = createObjectURL.mock.calls[0][0]
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(new Uint8Array([0, 128, 255]))
})

test('only includes the bytes covered by the typed array view', async () => {
  const buffer = new Uint8Array([0, 1, 2, 3, 4, 5]).buffer
  const view = new Uint16Array(buffer, 2, 1)

  expect(createBufferURL(view)).toBe('blob:buffer')
  const blob = createObjectURL.mock.calls[0][0]
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(new Uint8Array([2, 3]))
})

test('releases the URL returned by createBufferURL', () => {
  const url = createBufferURL(new ArrayBuffer(0))

  expect(revokeBufferURL(url)).toBeUndefined()
  expect(revokeObjectURL).toHaveBeenCalledWith(url)
})
