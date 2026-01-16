import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Canvas } from '../src/components/canvas/canvas'

describe('Canvas', () => {
  let page: SpecPage

  it('props', async () => {
    const canvasId = 'my-canvas'
    page = await newSpecPage({
      components: [Canvas],
      template: () => (<taro-canvas-core canvasId={canvasId} />),
    })
    await page.waitForChanges()
    const canvas = page.root?.firstChild as HTMLCanvasElement

    expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    expect(canvas.getAttribute('canvas-id')).toBe(canvasId)
  })
})
