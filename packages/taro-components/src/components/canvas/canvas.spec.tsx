import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Canvas } from './canvas'

describe('Canvas', () => {
  it('props', async () => {
    const canvasId = 'my-canvas'
    const page = await newSpecPage({
      components: [Canvas],
      template: () => (<taro-canvas-core canvasId={canvasId} />),
    })
    await page.waitForChanges()
    const canvas = page.root?.firstChild as HTMLCanvasElement

    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas.getAttribute('canvas-id')).toBe(canvasId)
  })
})
