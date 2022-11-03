import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { PageMeta } from './page-meta'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('PageMeta', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
