import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { OpenContainer } from '../src/components/open-container/open-container'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('OpenContainer', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [OpenContainer],
      template: () => (<taro-open-container-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-open-container-core></taro-open-container-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
