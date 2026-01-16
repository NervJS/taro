import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { TabItem } from '../src/components/tabs/tab-item'
import { Tabs } from '../src/components/tabs/tabs'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Tabs', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Tabs, TabItem],
      template: () => (<taro-tabs-core>
        <taro-tab-item-core />
        <taro-tab-item-core />
        <taro-tab-item-core />
        <taro-tab-item-core />
      </taro-tabs-core>),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-tabs-core>
        <taro-tab-item-core></taro-tab-item-core>
        <taro-tab-item-core></taro-tab-item-core>
        <taro-tab-item-core></taro-tab-item-core>
        <taro-tab-item-core></taro-tab-item-core>
      </taro-tabs-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
