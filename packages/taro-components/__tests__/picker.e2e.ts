import { AnyHTMLElement } from '@stencil/core/internal'
import { E2EPage, newE2EPage } from '@stencil/core/testing'

import { delay, getBoundingClientRect } from './utils'

describe('Picker', () => {
  let page: E2EPage
  async function scrollToNextItem (page: E2EPage, columnIndex = 0) {
    const column = (await page.findAll('.weui-picker__group'))[columnIndex] as unknown as AnyHTMLElement
    const cur = await page.find('.weui-picker__indicator') as unknown as AnyHTMLElement
    const curRect = await getBoundingClientRect(cur)
    const startY = curRect.top + curRect.height / 2
    const endY = curRect.top - curRect.height / 2

    const touchStart = {
      identifier: 0,
      target: column,
      clientY: startY
    }
    // Note: 当前无法在模拟事件参数
    // column.triggerEvent('touchstart', { changedTouches: [touchStart] })
    await column.callMethod('handleMoveStart', touchStart.clientY)
    await page.waitForChanges()

    const touchMove = {
      identifier: 0,
      target: column,
      clientY: endY
    }
    // column.triggerEvent('touchmove', { changedTouches: [touchMove] })
    await column.callMethod('handleMoving', touchMove.clientY)
    await page.waitForChanges()

    const touchEnd = {
      identifier: 0,
      target: column,
      clientY: endY
    }
    // column.triggerEvent('touchend', { changedTouches: [touchEnd] })
    await column.callMethod('handleMoveEnd', touchEnd.clientY)
    await page.waitForChanges()

    expect(page).toMatchSnapshot()
  }

  it('use mouse events', async () => {
    let selected = 1
    page = await newE2EPage({
      html: `<taro-picker-core>
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    el.setProperty('range', ['A', 'B', 'C', 'D'])
    el.setProperty('value', selected)
    await page.waitForChanges()

    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]
    const column = await page.find('.weui-picker__group')
    //  as unknown as AnyHTMLElement

    expect(await el.getProperty('value')).toEqual(selected)

    await picker?.click()
    await page.waitForChanges()

    const cur = await page.find('.weui-picker__indicator') as unknown as AnyHTMLElement
    const curRect = await getBoundingClientRect(cur)
    const startY = curRect.top + curRect.height / 2
    const endY = curRect.top - curRect.height / 2

    // Note: 当前无法在模拟事件参数
    // column.triggerEvent(new MouseEvent('mousedown', { clientY: startY }))
    await column.callMethod('handleMoveStart', startY)
    await page.waitForChanges()

    // column.dispatchEvent(new MouseEvent('mousemove', { clientY: endY }))
    await column.callMethod('handleMoving', endY)
    await page.waitForChanges()

    // column.triggerEvent(new MouseEvent('mouseup', { clientY: endY }))
    await column.callMethod('handleMoveEnd', endY)
    await page.waitForChanges()

    await confirm?.click()
    await page.waitForChanges()
    selected = 2

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)
  })

  it('should can be canceled', async () => {
    const selected = 1
    page = await newE2EPage({
      html: `<taro-picker-core>
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onCancel = await page.spyOnEvent('cancel')
    const el = await page.find('taro-picker-core')
    el.setProperty('range', ['葡萄', '橙子'])
    el.setProperty('value', selected)
    await page.waitForChanges()

    const picker = await page.find('taro-picker-core div div')
    const overlay = await page.find('.weui-picker__overlay')
    const mask = await page.find('.weui-mask')
    const cancel = (await page.findAll('.weui-picker__action'))[0]

    let overlayStyle = await overlay.getComputedStyle()
    expect(overlayStyle.display).toEqual('none')

    // 成功打开
    await picker.click()
    await page.waitForChanges()
    overlayStyle = await overlay.getComputedStyle()
    expect(overlayStyle.display).not.toEqual('none')

    // 点击蒙层可以关闭
    await mask.click()
    expect(onCancel).toHaveReceivedEventTimes(1)
    await delay(1000)
    await page.waitForChanges()
    overlayStyle = await overlay.getComputedStyle()
    expect(overlayStyle.display).toEqual('none')

    await picker.click()
    await page.waitForChanges()
    overlayStyle = await overlay.getComputedStyle()
    expect(overlayStyle.display).not.toEqual('none')

    // 点击取消按钮可以关闭
    await cancel.click()
    expect(onCancel).toHaveReceivedEventTimes(2)
    await delay(1000)
    await page.waitForChanges()
    overlayStyle = await overlay.getComputedStyle()
    expect(overlayStyle.display).toEqual('none')

    expect(page).toMatchSnapshot()
  })

  it('selector', async () => {
    const range = ['葡萄', '橙子', '苹果', '木瓜']
    let selected = 1
    page = await newE2EPage({
      html: `<taro-picker-core>
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    el.setProperty('range', range)
    el.setProperty('value', selected)
    await page.waitForChanges()

    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page)

    await confirm.click()
    await page.waitForChanges()
    selected = 2

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })

  it('multiSelector', async () => {
    const range = [[{
      id: 0,
      name: '饭'
    }, {
      id: 1,
      name: '粥'
    }, {
      id: 2,
      name: '粉'
    }], [{
      id: 0,
      name: '猪肉'
    }, {
      id: 1,
      name: '牛肉'
    }]]
    const selected = [0, 0]
    page = await newE2EPage({
      html: `<taro-picker-core mode="multiSelector">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const onColumnChange = await page.spyOnEvent('columnchange')
    const el = await page.find('taro-picker-core')
    el.setProperty('range', range)
    el.setProperty('rangeKey', 'name')
    el.setProperty('value', selected)
    await page.waitForChanges()

    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page)

    expect(onColumnChange).toHaveReceivedEventTimes(1)
    expect(onColumnChange).toHaveReceivedEventDetail({ column: 0, value: 1 })
    selected[0] = 1

    await confirm.click()
    await page.waitForChanges()

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)
  })

  it('time', async () => {
    let selected = '12:01'
    page = await newE2EPage({
      html: `<taro-picker-core mode="time" value="${selected}">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page)

    await confirm.click()
    await page.waitForChanges()
    selected = '13:01'

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })

  it('date', async () => {
    let selected = '2016-09-01'
    page = await newE2EPage({
      html: `<taro-picker-core mode="date" value="${selected}">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page, 1)

    await confirm.click()
    await page.waitForChanges()
    selected = '2016-10-01'

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })

  it('time range', async () => {
    const start = '9:00'
    const end = '12:00'
    const selected = '12:00'
    page = await newE2EPage({
      html: `<taro-picker-core mode="time" start="${start}" end="${end}" value="${selected}">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page)

    await confirm.click()
    await page.waitForChanges()

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })

  it('date range', async () => {
    const start = '2016-01-01'
    const end = '2016-09-30'
    const selected = '2016-09-01'
    page = await newE2EPage({
      html: `<taro-picker-core mode="date" start="${start}" end="${end}" value="${selected}">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page, 1)

    await confirm.click()
    await page.waitForChanges()

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })

  it('date fields month', async () => {
    let selected = '2016-09'
    page = await newE2EPage({
      html: `<taro-picker-core mode="date" fields="month" value="${selected}">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    selected = '2016-09'
    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page)

    await confirm.click()
    await page.waitForChanges()
    selected = '2017-09'

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })

  it('date fields year', async () => {
    let selected = '2016'
    page = await newE2EPage({
      html: `<taro-picker-core mode="date" fields="year" value="${selected}">
        <div>Picker</div>
      </taro-picker-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-picker-core')
    const picker = await page.find('taro-picker-core div div')
    const confirm = (await page.findAll('.weui-picker__action'))[1]

    selected = '2016'
    expect(await el.getProperty('value')).toEqual(selected)

    await picker.click()
    await page.waitForChanges()
    await scrollToNextItem(page)

    await confirm.click()
    await page.waitForChanges()
    selected = '2017'

    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange).toHaveReceivedEventDetail({ value: selected })
    expect(await el.getProperty('value')).toEqual(selected)

    expect(page).toMatchSnapshot()
  })
})
