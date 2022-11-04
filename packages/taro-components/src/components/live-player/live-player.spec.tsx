import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { LivePlayer } from './live-player'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('LivePlayer', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [LivePlayer],
      template: () => (<taro-live-player-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-live-player-core></taro-live-player-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
