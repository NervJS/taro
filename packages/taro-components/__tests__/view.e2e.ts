import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('View e2e', () => {
  let page: E2EPage

  beforeEach(async () => {
    page = await newE2EPage({
      html: `<taro-view-core></taro-view-core>`,
    })
  })

  it('screenshot', async () => {
    await page.waitForChanges()
    await page.compareScreenshot()
  })
})