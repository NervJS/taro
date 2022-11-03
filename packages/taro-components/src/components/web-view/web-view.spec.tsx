import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { WebView } from './web-view'

const TARO_WEBSITE = 'https://taro.jd.com/home/in.html'

describe('WebView', () => {
  it('should show an iframe', async () => {
    const page = await newSpecPage({
      components: [WebView],
      template: () => (<taro-web-view-core src={TARO_WEBSITE} />),
    })
    await page.waitForChanges()
    expect(page.root?.src).toEqual(TARO_WEBSITE)
  })

  it('events', async () => {
    const onLoad = jest.fn()
    let page = await newSpecPage({
        components: [WebView],
        template: () => (<taro-web-view-core src={TARO_WEBSITE} onLoad={onLoad} />),
    })
    await page.waitForChanges()
    page.root?.dispatchEvent(new Event('load'))
    expect(onLoad).toBeCalledTimes(1)
  })
})
