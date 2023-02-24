import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ChannelLive } from '../src/components/channel-live/channel-live'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ChannelLive', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ChannelLive],
      template: () => (<taro-channel-live-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-channel-live-core></taro-channel-live-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
