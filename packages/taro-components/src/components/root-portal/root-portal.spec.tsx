import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { RootPortal } from './root-portal'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('RootPortal', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
