import { h } from '@stencil/core'
import { AnyHTMLElement } from '@stencil/core/internal'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Slider } from '../src/components/slider/slider'

describe('Slider', () => {
  let page: SpecPage

  it('should be max', async () => {
    const max = 200
    const current = 300
    page = await newSpecPage({
      components: [Slider],
      template: () => (<taro-slider-core
        max={max}
        value={current}
      />),
    })
    await page.waitForChanges()

    expect(page.root?.value).toEqual(max)

    expect(page.root).toMatchSnapshot()
  })

  it('should be min', async () => {
    const min = 50
    const current = 0
    page = await newSpecPage({
      components: [Slider],
      template: () => (<taro-slider-core
        min={min}
        value={current}
      />),
    })

    expect(page.root?.value).toEqual(min)

    expect(page.root).toMatchSnapshot()
  })

  it('steps', async () => {
    page = await newSpecPage({
      components: [Slider],
      template: () => (<taro-slider-core min={50} max={200} step={2} value={79} />),
    })
    const track = page.root?.querySelector<AnyHTMLElement>('.weui-slider__track')
    const handler = page.root?.querySelector<AnyHTMLElement>('.weui-slider__handler')

    expect(page.root?.value).toEqual(80)
    expect(track?.style.width).toEqual('20%')
    expect(handler?.style.left).toEqual('20%')

    expect(page.root).toMatchSnapshot()
  })

  it('events', async () => {
    const onChange = jest.fn()
    const onChanging = jest.fn()
    page = await newSpecPage({
      components: [Slider],
      template: () => (<taro-slider-core onChange={onChange} onChanging={onChanging} />),
    })

    const inner = page.root?.querySelector<AnyHTMLElement>('.weui-slider__inner')
    const handler = page.root?.querySelector<AnyHTMLElement>('.weui-slider__handler')
    const innerWidth = inner?.getBoundingClientRect().width || 0
    const rect = handler?.getBoundingClientRect() || { left: 0, right: 0 }
    const centerPoint = (rect.left + rect.right) / 2

    await page.waitForChanges()
    handler?.dispatchEvent(new Event('touchstart', {
      // @ts-ignore
      targetTouches: [{
        identifier: 0,
        target: handler,
        pageX: centerPoint
      }]
    }))

    handler?.dispatchEvent(new Event('touchmove', {
      // @ts-ignore
      targetTouches: [{
        identifier: 0,
        target: handler,
        pageX: centerPoint + innerWidth / 2
      }]
    }))

    handler?.dispatchEvent(new Event('touchend'))

    const step = 0 // 50
    expect(onChanging).toBeCalledTimes(1)
    expect(onChanging.mock.instances[0].value).toEqual(step)
    expect(page.root?.value).toEqual(step)

    expect(page.root).toMatchSnapshot()
  })
})
