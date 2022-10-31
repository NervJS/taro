import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { VoipRoom } from './voip-room'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('VoipRoom', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
