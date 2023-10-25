import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Text e2e', () => {
  let page: E2EPage

  beforeEach(async () => {
    page = await newE2EPage({
      html: `<taro-text-core user-select=true></taro-text-core>`,
    })
  })

  it('props', async () => {
    await page.waitForChanges()
    const el = await page.find('taro-text-core')
    let style = await el.getComputedStyle()
    expect(style.userSelect).toEqual('text')

    el.toggleAttribute('user-select', false)
    el.classList.add('foo')

    await page.waitForChanges()
    style = await el.getComputedStyle()
    expect(style.userSelect).toEqual('none')
    expect(el?.classList.contains('foo')).toEqual(true)
    expect(el?.classList.contains('hydrated')).toEqual(true)
  })

  it('screenshot', async () => {
    await page.waitForChanges()
    await page.compareScreenshot()
  })
})
