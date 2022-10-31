import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Map } from './map'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('Map', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [Map],
      template: () => (<taro-map-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-map-core></taro-map-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
