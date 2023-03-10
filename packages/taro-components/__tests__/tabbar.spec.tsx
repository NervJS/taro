import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Tabbar } from '../src/components/tabbar/tabbar'

describe('Tabbar', () => {
  let page: SpecPage

  it('base', async () => {
    page = await newSpecPage({
      components: [Tabbar],
      template: () => (<taro-tabbar conf={{
        list: [
          {
            pagePath: 'pages/index/index',
            text: '首页'
          },
          {
            pagePath: 'pages/cate/index',
            text: '分类'
          },
          {
            pagePath: 'pages/cart/index',
            text: '购物车'
          },
          {
            pagePath: 'pages/my/index',
            text: '个人中心'
          }
        ]
      }} />),
    })
    expect(page.root).toMatchSnapshot()
  })
})
