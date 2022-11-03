import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { OpenData } from './open-data'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('OpenData', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
