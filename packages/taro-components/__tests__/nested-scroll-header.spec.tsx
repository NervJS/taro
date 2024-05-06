import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { NestedScrollHeader } from '../src/components/nested-scroll-header/nested-scroll-header'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('NestedScrollHeader', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [NestedScrollHeader],
      template: () => (<taro-nested-scroll-header-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-nested-scroll-header-core></taro-nested-scroll-header-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
