import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { FunctionalPageNavigator } from './functional-page-navigator'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('FunctionalPageNavigator', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
