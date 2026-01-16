import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { OpenData } from '../src/components/open-data/open-data'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('OpenData', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [OpenData],
      template: () => (<taro-open-data-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-open-data-core></taro-open-data-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
