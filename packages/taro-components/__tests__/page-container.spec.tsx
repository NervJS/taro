import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { PageContainer } from '../src/components/page-container/page-container'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('PageContainer', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [PageContainer],
      template: () => (<taro-page-container-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-page-container-core></taro-page-container-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
