import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Map } from '../src/components/map/map'

describe('Map', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Map],
      template: () => (<taro-map-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-map-core>
        <div id="mapContainer" style="width: 100%; height: 100%;"></div>
      </taro-map-core>
    `)
  })
})
