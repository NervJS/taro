import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Lifestyle } from '../src/components/lifestyle/lifestyle'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Lifestyle', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Lifestyle],
      template: () => (<taro-lifestyle-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-lifestyle-core></taro-lifestyle-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
