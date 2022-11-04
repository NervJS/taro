import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Camera } from './camera'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('Camera', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [Camera],
      template: () => (<taro-camera-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-camera-core></taro-camera-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
