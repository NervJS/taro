import Taro from '@tarojs/api'

type ContextType = '2d' | 'webgl'
type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

/** The browser-backed canvas returned by the named H5 API. */
export interface H5OffscreenCanvas {
  width: number
  height: number
  createImage(): HTMLImageElement
  getContext(contextType: '2d'): Context2D | null
  getContext(contextType: 'webgl'): WebGLRenderingContext | null
  getContext(contextType: ContextType): Context2D | WebGLRenderingContext | null
}

export const createOffscreenCanvas = ({
  type = 'webgl',
  width = 300,
  height = 150,
}: Taro.createOffscreenCanvas.Option = {}): H5OffscreenCanvas => {
  if (type !== '2d' && type !== 'webgl') {
    throw new TypeError('createOffscreenCanvas: expected type to be 2d or webgl')
  }

  const canvas = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  function getContext (contextType: '2d'): Context2D | null
  function getContext (contextType: 'webgl'): WebGLRenderingContext | null
  function getContext (contextType: ContextType): Context2D | WebGLRenderingContext | null
  function getContext (contextType: ContextType) {
    if (contextType !== type) return null
    return contextType === '2d' ? canvas.getContext('2d') : canvas.getContext('webgl')
  }

  return {
    get width () { return canvas.width },
    set width (value) { canvas.width = value },
    get height () { return canvas.height },
    set height (value) { canvas.height = value },
    createImage: () => new Image(),
    getContext,
  }
}
