import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ChannelVideo } from '../src/components/channel-video/channel-video'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ChannelVideo', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ChannelVideo],
      template: () => (<taro-channel-video-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-channel-video-core></taro-channel-video-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
