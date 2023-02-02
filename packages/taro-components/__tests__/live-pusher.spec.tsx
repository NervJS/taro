import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { LivePusher } from '../src/components/live-pusher/live-pusher'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('LivePusher', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [LivePusher],
      template: () => (<taro-live-pusher-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-live-pusher-core></taro-live-pusher-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
