import { E2EPage, newE2EPage } from '@stencil/core/testing'

const TARO_WEBSITE = 'https://taro.jd.com/home/in.html'
describe('WebView e2e', () => {
  let page: E2EPage

  beforeEach(async () => {
    page = await newE2EPage({
      html: `<taro-web-view-core src="${TARO_WEBSITE}"></taro-web-view-core>`,
    })
  })

  it('screenshot', async () => {
    await page.waitForChanges()
    await page.compareScreenshot()
  })
})
