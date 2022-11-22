import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { MatchMedia } from '../src/components/match-media/match-media'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('MatchMedia', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
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
