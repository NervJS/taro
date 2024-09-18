import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { LivePlayer } from '../src/components/live-player/live-player'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('LivePlayer', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
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
