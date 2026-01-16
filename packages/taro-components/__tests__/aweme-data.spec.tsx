import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { AwemeData } from '../src/components/aweme-data/aweme-data'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('AwemeData', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [AwemeData],
      template: () => (<taro-aweme-data-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-aweme-data-core></taro-aweme-data-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
