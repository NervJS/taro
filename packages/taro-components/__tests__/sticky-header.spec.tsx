import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { StickyHeader } from '../src/components/sticky-header/sticky-header'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('StickyHeader', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [StickyHeader],
      template: () => (<taro-sticky-header-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-sticky-header-core></taro-sticky-header-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
