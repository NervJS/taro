import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { RootPortal } from '../src/components/root-portal/root-portal'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('RootPortal', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [RootPortal],
      template: () => (<taro-root-portal-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-root-portal-core></taro-root-portal-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
