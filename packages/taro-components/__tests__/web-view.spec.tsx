import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { WebView } from '../src/components/web-view/web-view'

const TARO_WEBSITE = 'https://taro.jd.com/home/in.html'

describe('WebView', () => {
  let page: SpecPage

  it('should show an iframe', async () => {
    page = await newSpecPage({
      components: [WebView],
      template: () => (<taro-web-view-core src={TARO_WEBSITE} />),
    })
    await page.waitForChanges()
    expect(page.root?.src).toEqual(TARO_WEBSITE)
  })

  it('events', async () => {
    const onLoad = jest.fn()
    page = await newSpecPage({
      components: [WebView],
      template: () => (<taro-web-view-core src={TARO_WEBSITE} onLoad={onLoad} />),
    })
    await page.waitForChanges()
    page.root?.dispatchEvent(new Event('load'))
    expect(onLoad).toBeCalledTimes(1)
  })
})
