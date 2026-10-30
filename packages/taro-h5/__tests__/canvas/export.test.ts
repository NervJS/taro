import { canvasToTempFilePath } from '../../src/api/canvas/canvasToTempFilePath'
import * as utils from '../../src/utils'

describe('canvas export', () => {
  let container: HTMLDivElement
  let canvas: HTMLCanvasElement
  let otherCanvas: HTMLCanvasElement

  beforeEach(() => {
    container = document.createElement('div')
    otherCanvas = document.createElement('canvas')
    otherCanvas.setAttribute('canvas-id', 'other')
    container.appendChild(otherCanvas)
    canvas = document.createElement('canvas')
    canvas.setAttribute('canvas-id', 'test')
    container.appendChild(canvas)
    jest.spyOn(utils, 'findDOM').mockReturnValue(container)
  })

  afterEach(() => jest.restoreAllMocks())

  test.each(['missing canvas', 'missing container'])('rejects a %s', async scenario => {
    if (scenario === 'missing container') jest.mocked(utils.findDOM).mockReturnValue(undefined)
    await expect(canvasToTempFilePath({ canvasId: 'missing' })).rejects.toEqual({
      errMsg: 'canvasToTempFilePath:fail canvas missing is not available'
    })
  })

  test('calls fail and complete once without reporting success for a missing canvas', async () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const expected = { errMsg: 'canvasToTempFilePath:fail canvas missing is not available' }
    await expect(canvasToTempFilePath({ canvasId: 'missing', success, fail, complete })).resolves.toEqual(expected)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(expected)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(expected)
  })

  test('routes DOM lookup failures through the failure handler', async () => {
    jest.mocked(utils.findDOM).mockImplementation(() => { throw new Error('Canvas lookup failed') })
    await expect(canvasToTempFilePath({ canvasId: 'test' })).rejects.toEqual({
      errMsg: 'canvasToTempFilePath:fail Canvas lookup failed'
    })
  })

  test('routes invalid selector errors through the failure handler', async () => {
    await expect(canvasToTempFilePath({ canvasId: '"]' })).rejects.toEqual({
      errMsg: expect.stringMatching(/^canvasToTempFilePath:fail /)
    })
  })

  test.each(['DOM lookup failure', 'invalid selector'])('calls failure callbacks once for a %s', async scenario => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const canvasId = scenario === 'invalid selector' ? '"]' : 'test'
    if (scenario === 'DOM lookup failure') {
      jest.mocked(utils.findDOM).mockImplementation(() => { throw new Error('Canvas lookup failed') })
    }
    const expected = {
      errMsg: scenario === 'DOM lookup failure'
        ? 'canvasToTempFilePath:fail Canvas lookup failed'
        : expect.stringMatching(/^canvasToTempFilePath:fail /)
    }

    await expect(canvasToTempFilePath({ canvasId, success, fail, complete })).resolves.toEqual(expected)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(expected)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(expected)
  })

  test('reports security errors from exporting a tainted canvas', async () => {
    jest.spyOn(canvas, 'toDataURL').mockImplementation(() => {
      throw new DOMException('Canvas is tainted', 'SecurityError')
    })
    const fail = jest.fn()
    const complete = jest.fn()
    const expected = { errMsg: 'canvasToTempFilePath:fail Canvas is tainted' }
    await expect(canvasToTempFilePath({ canvasId: 'test', fail, complete })).resolves.toEqual(expected)
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(expected)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(expected)
  })

  test.each([
    [undefined, 'image/png'],
    ['png', 'image/png'],
    ['jpg', 'image/jpeg']
  ] as const)('exports %s with the requested quality', async (fileType, mimeType) => {
    const tempFilePath = `data:${mimeType};base64,test`
    const toDataURL = jest.spyOn(canvas, 'toDataURL').mockReturnValue(tempFilePath)
    const otherToDataURL = jest.spyOn(otherCanvas, 'toDataURL').mockReturnValue(`data:${mimeType};base64,other`)
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const expected = { errMsg: 'canvasToTempFilePath:ok', tempFilePath }
    await expect(canvasToTempFilePath({ canvasId: 'test', fileType, quality: 0.8, success, fail, complete })).resolves.toEqual(expected)
    expect(toDataURL).toHaveBeenCalledTimes(1)
    expect(toDataURL).toHaveBeenCalledWith(mimeType, 0.8)
    expect(otherToDataURL).not.toHaveBeenCalled()
    expect(success).toHaveBeenCalledTimes(1)
    expect(success).toHaveBeenCalledWith(expected)
    expect(fail).not.toHaveBeenCalled()
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(expected)
  })
})
