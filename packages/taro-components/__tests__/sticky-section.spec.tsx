import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { StickySection } from '../src/components/sticky-section/sticky-section'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('StickySection', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [StickySection],
      template: () => (<taro-sticky-section-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-sticky-section-core></taro-sticky-section-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
