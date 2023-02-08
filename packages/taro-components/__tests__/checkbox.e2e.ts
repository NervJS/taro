import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Checkbox', () => {
  let page: E2EPage

  it('checkbox', async () => {
    const value = 'taro'
    const red = 'rgb(255, 0, 0)'
    page = await newE2EPage({
      html: `<taro-checkbox-core value="${value}" color="${red}"></taro-checkbox-core>`,
    })
    await page.waitForChanges()
    const el = await page.find('taro-checkbox-core')
    const input = await el.find('input')

    const style = await input.getComputedStyle()
    expect(style.color).toBe(red)
    expect(el.getAttribute('value')).toBe(value)
    expect(await el.getProperty('checked')).toBe(false)
    expect(await input.getProperty('checked')).toBe(false)

    await input.click()
    await page.waitForChanges()
    expect(await input.getProperty('checked')).toBe(true)
  })

  it('checkbox-group', async () => {
    const list = [
      { value: 'America' },
      { value: 'China', checked: 'true' },
      { value: 'Brazil' },
      { value: 'Japan' },
      { value: 'Britain' },
      { value: 'French' }
    ]
    page = await newE2EPage({
      html: `<taro-checkbox-group-core name="checkbox">
        ${list.map(item => `<taro-checkbox-core
          key="${item.value}"
          value="${item.value}"
          ${item.checked ? 'checked' : ''}
        />`).join('')}
      </taro-checkbox-group-core>`,
    })
    
    await page.waitForChanges()
    const el = await page.find('taro-checkbox-group-core')
    const inputList = await page.findAll('input')
    const onChange = await el.spyOnEvent('change')

    let value = await el.getProperty('value')
    expect(value).toHaveLength(1)
    expect(value.includes('China')).toBe(true)
    expect(await page.findAll('taro-checkbox-core[name=checkbox]')).toHaveLength(list.length)

    await inputList[inputList.length - 1].click()
    await page.waitForChanges()

    value = await el.getProperty('value')
    expect(value).toHaveLength(2)
    expect(value.includes('China')).toBe(true)
    expect(value.includes('French')).toBe(true)
    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange.firstEvent.detail.value).toEqual(value)
  })
})
