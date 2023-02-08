import { E2EPage, newE2EPage } from '@stencil/core/testing'

import { delay } from './utils'

describe('Button e2e', () => {
  let page: E2EPage

  it('event', async () => {
    const hoverStartTime = 50
    const hoverStayTime = 100
    page = await newE2EPage({
      html: `<taro-button-core
        size="fork"
        hover-start-time="${hoverStartTime}"
        hover-stay-time="${hoverStayTime}"
      >button</taro-button-core>`,
    })
    const el = await page.find('taro-button-core')
    const onClick = await el.spyOnEvent('click')
    const onTouchStart = await el.spyOnEvent('touchstart')
    const onTouchEnd = await el.spyOnEvent('touchend')

    expect(el.getAttribute('hover-start-time')).toEqual(hoverStartTime.toString())
    expect(el.getAttribute('hover-stay-time')).toEqual(hoverStayTime.toString())
    // expect(el.classList.contains('button-hover')).toEqual(false)

    el.click()
    await page.waitForChanges()
    expect(onClick).toHaveReceivedEventTimes(1)

    el.triggerEvent('touchstart')
    await page.waitForChanges()
    expect(onTouchStart).toHaveReceivedEventTimes(1)

    await delay(hoverStartTime + 10)
    expect(el.classList.contains('button-hover')).toEqual(true)

    el.triggerEvent('touchend')
    await page.waitForChanges()
    expect(onTouchEnd).toHaveReceivedEventTimes(1)

    await delay(hoverStayTime + 10)
    expect(el.classList.contains('button-hover')).toEqual(false)
  })
})
