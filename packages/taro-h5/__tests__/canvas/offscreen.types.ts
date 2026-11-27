import Taro from '@tarojs/taro'

import { createOffscreenCanvas } from '../../src/index'

declare function acceptContext(context: Taro.RenderingContext): void
declare function acceptHandler(handler: (...args: any[]) => any): void
declare const ordinaryCanvas: Taro.Canvas

const miniCanvas = Taro.createOffscreenCanvas({ type: '2d', width: 300, height: 150 })
acceptContext(miniCanvas.getContext('2d'))
acceptHandler(miniCanvas.createImage().onload)
acceptHandler(miniCanvas.createImage().onerror)
acceptHandler(ordinaryCanvas.createImage().onload)
acceptHandler(ordinaryCanvas.createImage().onerror)

export async function drawImage (url: string) {
  const canvas = createOffscreenCanvas({ type: '2d', width: 300, height: 150 })
  const context = canvas.getContext('2d')
  // @ts-expect-error H5 callers must check for an unavailable context.
  context.clearRect(0, 0, 300, 150)
  if (!context) throw new Error('2D context is unavailable')

  const image = canvas.createImage()
  const initialOnload: typeof image.onload = null
  const initialOnerror: typeof image.onerror = null
  image.onload = initialOnload
  image.onerror = initialOnerror
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = reject
    image.src = url
  })
  context.clearRect(0, 0, 300, 150)
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, 300, 150)
}

const gl = createOffscreenCanvas({ type: 'webgl' }).getContext('webgl')
if (gl) gl.clear(gl.COLOR_BUFFER_BIT)
