import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { NavigationBar } from '../src/components/navigation-bar/navigation-bar'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('NavigationBar', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
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
