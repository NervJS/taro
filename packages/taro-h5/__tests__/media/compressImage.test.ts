import { Blob as BinaryBlob } from 'node:buffer'

import { compressImage } from '../../src/api/media/image'

const jpeg = new BinaryBlob([new Uint8Array([0xff, 0xd8, 0xff])])
const pngSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const imageData = new Uint8Array([0, 0, 0, 0, 0x49, 0x44, 0x41, 0x54, 0, 0, 0, 0])
const png = new BinaryBlob([pngSignature, imageData])
const animationControl = new Uint8Array([0, 0, 0, 8, 0x61, 0x63, 0x54, 0x4c, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0])

const fetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'fetch')
const createURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const revokeURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')

const fetchImage = jest.fn()
const createURL = jest.fn()
const revokeURL = jest.fn()
let canvas: HTMLCanvasElement
let drawImage: jest.Mock
let encode: jest.SpyInstance

beforeEach(() => {
  fetchImage.mockReset().mockResolvedValue({ ok: true, blob: async () => jpeg })
  createURL.mockReset().mockReturnValueOnce('blob:source').mockReturnValueOnce('blob:result')
  revokeURL.mockReset()
  Object.defineProperty(globalThis, 'fetch', { configurable: true, value: fetchImage })
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createURL })
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeURL })

  const image = document.createElement('img')
  Object.defineProperties(image, {
    decode: { value: jest.fn().mockResolvedValue(undefined) },
    naturalWidth: { value: 480 },
    naturalHeight: { value: 320 }
  })
  jest.spyOn(window, 'Image').mockReturnValue(image)
  canvas = document.createElement('canvas')
  drawImage = jest.fn()
  jest.spyOn(canvas, 'getContext').mockReturnValue({ drawImage } as unknown as CanvasRenderingContext2D)
  encode = jest.spyOn(canvas, 'toBlob').mockImplementation((callback, type) => callback(new Blob([], { type })))
  jest.spyOn(document, 'createElement').mockReturnValue(canvas)
})

afterEach(() => {
  jest.restoreAllMocks()
  if (fetchDescriptor) Object.defineProperty(globalThis, 'fetch', fetchDescriptor)
  else delete (globalThis as { fetch?: typeof fetch }).fetch
  if (createURLDescriptor) Object.defineProperty(URL, 'createObjectURL', createURLDescriptor)
  else delete (URL as { createObjectURL?: typeof URL.createObjectURL }).createObjectURL
  if (revokeURLDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeURLDescriptor)
  else delete (URL as { revokeObjectURL?: typeof URL.revokeObjectURL }).revokeObjectURL
})

test.each([
  [{}, 480, 320, 0.8],
  [{ compressedWidth: 240, quality: 0 }, 240, 160, 0],
  [{ compressedHeight: 80 }, 120, 80, 0.8],
  [{ compressedWidth: 240, compressedHeight: 100, quality: 100 }, 240, 100, 1],
] as const)('encodes a JPEG from an extensionless URL with options %j', async (options, width, height, quality) => {
  const success = jest.fn()
  const complete = jest.fn()
  const response = { errMsg: 'compressImage:ok', tempFilePath: 'blob:result' }
  await expect(compressImage({ src: 'blob:chosen-image', ...options, success, complete })).resolves.toEqual(response)
  expect(fetchImage.mock.calls).toEqual([['blob:chosen-image']])
  expect([canvas.width, canvas.height]).toEqual([width, height])
  expect(drawImage).toHaveBeenCalledWith(expect.any(HTMLImageElement), 0, 0, width, height)
  expect(encode).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', quality)
  expect(revokeURL.mock.calls).toEqual([['blob:source']])
  expect(success.mock.calls).toEqual([[response]])
  expect(complete.mock.calls).toEqual([[response]])
})

test('encodes a static PNG as PNG without a lossy quality parameter', async () => {
  fetchImage.mockResolvedValue({ ok: true, blob: async () => png })
  await expect(compressImage({ src: '/picture', quality: 40 })).resolves.toMatchObject({ tempFilePath: 'blob:result' })
  expect(encode).toHaveBeenCalledWith(expect.any(Function), 'image/png', undefined)
})

test.each([
  [{ src: ' ' }, 'src must be a non-empty string'],
  [{ src: '/picture', quality: -1 }, 'quality must be between 0 and 100'],
  [{ src: '/picture', quality: NaN }, 'quality must be between 0 and 100'],
  [{ src: '/picture', compressedWidth: 0 }, 'compressedWidth and compressedHeight must be positive integers'],
  [{ src: '/picture', compressedHeight: 1.5 }, 'compressedWidth and compressedHeight must be positive integers'],
])('rejects invalid options %j before reading the image', async (options, message) => {
  await expect(compressImage(options)).rejects.toEqual({ errMsg: `compressImage:fail ${message}` })
  expect(fetchImage).not.toHaveBeenCalled()
})

test.each([
  [new BinaryBlob(['GIF89a']), 'only JPEG and static PNG images are supported'],
  [new BinaryBlob([pngSignature, animationControl, imageData]), 'animated PNG images are not supported'],
])('rejects unsupported content before decoding', async (source, message) => {
  fetchImage.mockResolvedValue({ ok: true, blob: async () => source })
  await expect(compressImage({ src: '/picture' })).rejects.toEqual({ errMsg: `compressImage:fail ${message}` })
  expect(createURL).not.toHaveBeenCalled()
})

test('reports an HTTP error before reading the response', async () => {
  const blob = jest.fn()
  fetchImage.mockResolvedValue({ ok: false, status: 404, blob })
  await expect(compressImage({ src: '/missing' })).rejects.toEqual({ errMsg: 'compressImage:fail image request failed (HTTP 404)' })
  expect(blob).not.toHaveBeenCalled()
})

test('releases the source URL and reports an encoding failure once', async () => {
  encode.mockImplementation(callback => callback(null))
  const fail = jest.fn()
  const complete = jest.fn()
  const success = jest.fn()
  const result = { errMsg: 'compressImage:fail could not encode the image' }

  await expect(compressImage({ src: '/picture', success, fail, complete })).resolves.toEqual(result)
  expect(createURL).toHaveBeenCalledTimes(1)
  expect(revokeURL.mock.calls).toEqual([['blob:source']])
  expect(success).not.toHaveBeenCalled()
  expect(fail.mock.calls).toEqual([[result]])
  expect(complete.mock.calls).toEqual([[result]])
})
