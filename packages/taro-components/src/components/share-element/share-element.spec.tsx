import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { ShareElement } from './share-element'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('ShareElement', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [ShareElement],
      template: () => (<taro-share-element-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-share-element-core></taro-share-element-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
