import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Login } from '../src/components/login/login'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Login', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Login],
      template: () => (<taro-login-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-login-core></taro-login-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
