import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { PageMeta } from '../src/components/page-meta/page-meta'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('PageMeta', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [PageMeta],
      template: () => (<taro-page-meta-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-page-meta-core></taro-page-meta-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
