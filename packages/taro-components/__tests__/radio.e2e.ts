import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Radio', () => {
  let page: E2EPage

  it('radio', async () => {
    const value = 'taro'
    page = await newE2EPage({
      html: `<taro-radio-core value="${value}"></taro-radio-core>`,
    })
    await page.waitForChanges()
    const el = await page.find('taro-radio-core')
    const input = await el.find('input')

    expect(el.getAttribute('value')).toBe(value)
    expect(await el.getProperty('checked')).toBe(false)
    expect(await input.getProperty('checked')).toBe(false)

    await el.click()
    await page.waitForChanges()
    expect(await el.getProperty('checked')).toBe(true)
    expect(await input.getProperty('checked')).toBe(true)
  })

  it('radio-group', async () => {
    const list = [
      { value: 'America' },
      { value: 'China', checked: 'true' },
      { value: 'Brazil' },
      { value: 'Japan' },
      { value: 'Britain' },
      { value: 'French' }
    ]
    page = await newE2EPage({
      html: `<taro-radio-group-core name="radio">
        ${list.map(item => `<taro-radio-core
          key="${item.value}"
          value="${item.value}"
          ${item.checked ? 'checked' : ''}
        />`).join('')}
      </taro-radio-group-core>`,
    })
    
    await page.waitForChanges()
    const el = await page.find('taro-radio-group-core')
    const inputList = await page.findAll('taro-radio-core')
    const onChange = await el.spyOnEvent('change')

    let value = await el.getProperty('value')
    expect(value.includes('China')).toBe(true)
    expect(inputList[1]).toHaveAttribute('checked')
    expect(await page.findAll('taro-radio-core[name=radio]')).toHaveLength(list.length)

    await inputList[inputList.length - 1].click()
    await page.waitForChanges()

    value = await el.getProperty('value')
    expect(inputList[1]).not.toEqualAttribute('checked', true)
    expect(inputList[inputList.length - 1]).toHaveAttribute('checked')
    expect(value.includes('French')).toBe(true)
    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange.firstEvent.detail.value).toEqual(value)
  })
})
