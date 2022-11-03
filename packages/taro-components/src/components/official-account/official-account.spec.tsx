import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { OfficialAccount } from './official-account'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('OfficialAccount', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
