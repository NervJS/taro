import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Map } from '../src/components/map/map'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Map', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
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
