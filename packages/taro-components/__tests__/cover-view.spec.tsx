import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { CoverView } from '../src/components/cover-view/cover-view'
import { delay } from './utils'

describe('CoverView', () => {
  let page: SpecPage

  it('slot', async () => {
    const text = 'i m div'
    page = await newSpecPage({
      components: [CoverView],
      template: () => (<taro-cover-view-core>
        <div />
        <div />
        {text}
      </taro-cover-view-core>),
    })

    expect(page.root?.textContent).toEqual(text)
  })

  it('should hover perform correctly', async () => {
    const hoverClass = 'hover'
    const hoverStartTime = 50
    const hoverStayTime = 400

    page = await newSpecPage({
      components: [CoverView],
      template: () => (<taro-cover-view-core
        hoverClass={hoverClass}
      />),
    })
    page.root?.dispatchEvent(new Event('touchstart'))
    await delay(hoverStartTime + 30)
    await page.waitForChanges()
    expect(page.root?.classList.contains(hoverClass)).toEqual(true)

    page.root?.dispatchEvent(new Event('touchend'))
    await delay(hoverStayTime - 30)
    await page.waitForChanges()
    expect(page.root?.classList.contains(hoverClass)).toEqual(true)
    await delay(100)
    await page.waitForChanges()
    expect(page.root?.classList.contains(hoverClass)).toEqual(false)
  })

  it('should trigger longpress', async () => {
    const onLongPress = jest.fn()
    page = await newSpecPage({
      components: [CoverView],
      template: () => (<taro-cover-view-core onlongpress={onLongPress} />),
    })
    await page.waitForChanges()

    page.root?.dispatchEvent(new Event('touchstart'))
    await delay(400)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })
})
