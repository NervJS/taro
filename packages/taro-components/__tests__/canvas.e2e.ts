import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Canvas e2e', () => {
  const canvasId = 'my-canvas'
  let page: E2EPage

  beforeEach(async () => {
    page = await newE2EPage({
      html: `<taro-canvas-core canvas-id="${canvasId}"></taro-canvas-core>`,
    })
  })

  it('props', async () => {
    await page.waitForChanges()
    const el = await page.find('taro-canvas-core')

    const style = await el.getComputedStyle()
    expect(el.getAttribute('canvas-id')).toBe(canvasId)
    expect(style.width).toBe('300px')
    expect(style.height).toBe('150px')
  })

  it('screenshot', async () => {
    await page.waitForChanges()
    await page.compareScreenshot()
  })
})
