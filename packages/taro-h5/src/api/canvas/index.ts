import { temporarilyNotSupport } from '../utils'

// 画布
export const createOffscreenCanvas = temporarilyNotSupport('createOffscreenCanvas')
export * from './createCanvasContext'
export * from './canvasToTempFilePath'
export * from './canvasPutImageData'
export * from './canvasGetImageData'

export const drawCanvas = temporarilyNotSupport('drawCanvas')
