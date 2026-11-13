import Taro from '@tarojs/api'

export const createOffscreenCanvas: typeof Taro.createOffscreenCanvas = ({
  type = 'webgl',
  width = 300,
  height = 150,
} = {}) => {
  if (type !== '2d' && type !== 'webgl') {
    throw new TypeError('createOffscreenCanvas: expected type to be 2d or webgl')
  }

  const canvas = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  return {
    get width () { return canvas.width },
    set width (value) { canvas.width = value },
    get height () { return canvas.height },
    set height (value) { canvas.height = value },
    createImage: () => new Image(),
    getContext (contextType) {
      if (contextType !== type) return null
      return contextType === '2d' ? canvas.getContext('2d') : canvas.getContext('webgl')
    },
  }
}
