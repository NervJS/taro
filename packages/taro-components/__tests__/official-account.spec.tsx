import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { OfficialAccount } from '../src/components/official-account/official-account'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('OfficialAccount', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [OfficialAccount],
      template: () => (<taro-official-account-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-official-account-core></taro-official-account-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
