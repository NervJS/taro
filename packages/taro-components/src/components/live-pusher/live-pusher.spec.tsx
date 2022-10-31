import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { LivePusher } from './live-pusher'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('LivePusher', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
