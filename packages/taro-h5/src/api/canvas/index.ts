import { temporarilyNotSupport } from '../utils'

// 画布
export const createOffscreenCanvas = temporarilyNotSupport('createOffscreenCanvas')
export { default as createCanvasContext } from './createCanvasContext'
export { default as canvasToTempFilePath } from './canvasToTempFilePath'
export { default as canvasPutImageData } from './canvasPutImageData'
export { default as canvasGetImageData } from './canvasGetImageData'

export const drawCanvas = temporarilyNotSupport('drawCanvas')
