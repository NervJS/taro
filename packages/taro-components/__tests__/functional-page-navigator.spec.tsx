import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { FunctionalPageNavigator } from '../src/components/functional-page-navigator/functional-page-navigator'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('FunctionalPageNavigator', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [FunctionalPageNavigator],
      template: () => (<taro-functional-page-navigator-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-functional-page-navigator-core></taro-functional-page-navigator-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
