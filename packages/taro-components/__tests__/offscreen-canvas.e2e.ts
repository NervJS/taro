import { newE2EPage } from '@stencil/core/testing'
import { build } from 'esbuild'

it('draws an image and reads its pixel with the H5 HTML canvas fallback', async () => {
  const { outputFiles } = await build({
    stdin: {
      contents: `
        export { createOffscreenCanvas } from '../../taro-h5/src/api/canvas/createOffscreenCanvas'
      `,
      resolveDir: __dirname,
    },
    bundle: true,
    globalName: 'h5Canvas',
    write: false,
  })
  const page = await newE2EPage()
  await page.addScriptTag({ content: outputFiles[0].text })
  const result = await page.evaluate(async () => {
    Object.defineProperty(window, 'OffscreenCanvas', { configurable: true, value: undefined })
    const { h5Canvas } = window as unknown as {
      h5Canvas: typeof import('../../taro-h5/src/api/canvas/createOffscreenCanvas')
    }
    const canvas = h5Canvas.createOffscreenCanvas({ type: '2d', width: 1, height: 1 })
    const context = canvas.getContext('2d')
    if (!context) throw new Error('2D context is unavailable')

    const image = canvas.createImage()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = reject
      image.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="red"/></svg>'
    })
    context.clearRect(0, 0, 1, 1)
    context.drawImage(image, 0, 0)
    return {
      pixel: Array.from(context.getImageData(0, 0, 1, 1).data),
      detachedHtmlCanvas: context.canvas instanceof HTMLCanvasElement && !context.canvas.isConnected,
    }
  })
  expect(result).toEqual({ pixel: [255, 0, 0, 255], detachedHtmlCanvas: true })
})
