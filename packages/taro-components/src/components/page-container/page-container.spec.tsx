import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { PageContainer } from './page-container'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('PageContainer', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
