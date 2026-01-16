import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('CoverView e2e', () => {
  let page: E2EPage

  it('default props', async () => {
    page = await newE2EPage({
      html: `<taro-cover-view-core></taro-cover-view-core>`,
    })
    const el = await page.find('taro-cover-view-core')

    expect(await el?.getProperty('hoverClass')).toBeUndefined()
    expect(await el?.getProperty('hoverStartTime')).toEqual(50)
    expect(await el?.getProperty('hoverStayTime')).toEqual(400)
  })

  it('should update props successfully', async () => {
    let hoverClass = 'hover'
    let hoverStartTime = 100
    let hoverStayTime = 300
    page = await newE2EPage({
      html: `<taro-cover-view-core
        hover-class="${hoverClass}"
        hover-start-time="${hoverStartTime}"
        hover-stay-time="${hoverStayTime}"
      >
      </taro-cover-view-core>`,
    })
    let el = await page.find('taro-cover-view-core')
    expect(await el?.getProperty('hoverClass')).toEqual(hoverClass)
    expect(await el?.getProperty('hoverStartTime')).toEqual(hoverStartTime)
    expect(await el?.getProperty('hoverStayTime')).toEqual(hoverStayTime)

    hoverClass = 'active'
    hoverStartTime = 200
    hoverStayTime = 600

    el.setProperty('hoverClass', hoverClass)
    el.setProperty('hoverStartTime', hoverStartTime)
    el.setProperty('hoverStayTime', hoverStayTime)
    await page.waitForChanges()

    el = await page.find('taro-cover-view-core')
    expect(await el?.getProperty('hoverClass')).toEqual(hoverClass)
    expect(await el?.getProperty('hoverStartTime')).toEqual(hoverStartTime)
    expect(await el?.getProperty('hoverStayTime')).toEqual(hoverStayTime)
  })
})
