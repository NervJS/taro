import * as utils from '../../src/utils'
import { canvasGetImageData } from '../../src/api/canvas/canvasGetImageData'
import { canvasPutImageData } from '../../src/api/canvas/canvasPutImageData'

describe('canvas image data', () => {
  const pixels = new Uint8ClampedArray([255, 0, 0, 255])
  let context: Pick<CanvasRenderingContext2D, 'getImageData' | 'createImageData' | 'putImageData'>

  beforeEach(() => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('canvas-id', 'test')
    const container = document.createElement('div')
    container.appendChild(canvas)
    jest.spyOn(utils, 'findDOM').mockReturnValue(container)

    context = {
      getImageData: jest.fn(() => ({ width: 1, height: 1, data: pixels } as ImageData)),
      createImageData: jest.fn((width, height) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) } as ImageData)),
      putImageData: jest.fn()
    }
    jest.spyOn(canvas, 'getContext').mockReturnValue(context as CanvasRenderingContext2D)
  })

  afterEach(() => jest.restoreAllMocks())

  test('returns the pixel array from ImageData', async () => {
    const result = await canvasGetImageData({ canvasId: 'test', x: 0, y: 0, width: 1, height: 1 })

    expect(result.data).toBe(pixels)
    expect(result.width).toBe(1)
    expect(result.height).toBe(1)
  })

  test('creates ImageData before drawing a pixel array', async () => {
    await canvasPutImageData({ canvasId: 'test', x: 2, y: 3, width: 1, height: 1, data: pixels })

    expect(context.createImageData).toHaveBeenCalledWith(1, 1)
    expect(context.putImageData).toHaveBeenCalledWith(expect.objectContaining({ data: pixels }), 2, 3)
  })

  test('rejects missing canvas rather than reporting success', async () => {
    await expect(canvasGetImageData({ canvasId: 'missing', x: 0, y: 0, width: 1, height: 1 })).rejects.toEqual(
      expect.objectContaining({ errMsg: expect.stringContaining('canvas missing is not available') })
    )
    await expect(canvasPutImageData({ canvasId: 'missing', x: 0, y: 0, width: 1, height: 1, data: pixels })).rejects.toEqual(
      expect.objectContaining({ errMsg: expect.stringContaining('canvas missing is not available') })
    )
  })

  test('rejects pixel arrays whose length does not match the dimensions', async () => {
    await expect(canvasPutImageData({ canvasId: 'test', x: 0, y: 0, width: 2, height: 1, data: pixels })).rejects.toEqual(
      expect.objectContaining({ errMsg: expect.stringContaining('pixel data length does not match') })
    )
    expect(context.putImageData).not.toHaveBeenCalled()
  })
})
