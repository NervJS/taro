import { h } from '@stencil/core'
import { AnyHTMLElement } from '@stencil/core/internal'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Button } from '../src/components/button/button'
import { delay } from './utils'

describe('Button', () => {
  let page: SpecPage
  it('props', async () => {
    const size = 'mini'
    const plain = true
    const loading = true
    const disabled = false
    page = await newSpecPage({
      components: [Button],
      template: () => (<taro-button-core
        size={size}
        plain={plain}
        loading={loading}
        disabled={disabled}
      >button</taro-button-core>),
    })

    expect(page.root?.type).not.toBeUndefined()
    expect(page.root?.plain).toEqual(true)
    expect(page.root?.loading).toEqual(true)
    expect(page.root?.size).toEqual('mini')
    expect(page.root?.disabled).toEqual(false)

    await delay(3000)
    const icon = page.root?.querySelector<AnyHTMLElement>('i')
    expect(icon?.classList.contains('weui-loading')).toEqual(true)
    expect(page.root?.textContent).toEqual('button')

    page.root?.setAttribute('plain', 'false')
    await page.waitForChanges()
    expect(page.root?.plain).toEqual(false)

    page.root?.setAttribute('loading', 'false')
    await page.waitForChanges()
    expect(page.root?.loading).toEqual(false)
    expect(icon?.parentNode).toBeNull()

    page.root?.setAttribute('disabled', 'true')
    await page.waitForChanges()
    expect(page.root?.disabled).toEqual(true)

    page.root?.setAttribute('size', 'big')
    await page.waitForChanges()
    expect(page.root?.size).toEqual('big')

    expect(page.root).toMatchSnapshot()
  })
})
