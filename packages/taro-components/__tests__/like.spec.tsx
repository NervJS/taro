import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Like } from '../src/components/like/like'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Like', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Like],
      template: () => (<taro-like-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-like-core></taro-like-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
