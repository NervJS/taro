import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { VoipRoom } from '../src/components/voip-room/voip-room'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('VoipRoom', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [VoipRoom],
      template: () => (<taro-voip-room-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-voip-room-core></taro-voip-room-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
