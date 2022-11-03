import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { NavigationBar } from './navigation-bar'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('NavigationBar', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [NavigationBar],
      template: () => (<taro-navigation-bar-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-navigation-bar-core></taro-navigation-bar-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
