import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { MatchMedia } from './match-media'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('MatchMedia', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [MatchMedia],
      template: () => (<taro-match-media-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-match-media-core></taro-match-media-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
