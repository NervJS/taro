import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { MovableArea } from '../src/components/movable-area/movable-area'
import { MovableView } from '../src/components/movable-area/movable-view'

describe('MovableArea', () => {
  let page: SpecPage

  it('base', async () => {
    page = await newSpecPage({
      components: [MovableArea, MovableView],
      template: () => (<taro-movable-area-core style='height: 200px; width: 200px; background: red;'>
        <taro-movable-view-core style='height: 50px; width: 50px; background: blue;' direction='all'>
          带我走
        </taro-movable-view-core>
      </taro-movable-area-core>),
    })
    expect(page.root).toMatchSnapshot()
  })
})
