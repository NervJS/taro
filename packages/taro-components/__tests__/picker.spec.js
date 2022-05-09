import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { Picker } from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'

const h = React.createElement

describe('Picker', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  async function srcollToNextItem (columnIndex = 0) {
    const content = document.querySelector('.weui-picker__content')
    const column = document.querySelectorAll('.weui-picker__group')[columnIndex]
    const cur = document.querySelector('.weui-picker__indicator')
    const curRect = cur.getBoundingClientRect()
    const startY = curRect.top + curRect.height / 2
    const endY = curRect.top - curRect.height / 2

    const touchStart = new Touch({
      identifier: 0,
      target: column,
      clientY: startY
    })
    simulant.fire(column, 'touchstart', { changedTouches: [touchStart] })

    const touchMove = new Touch({
      identifier: 0,
      target: column,
      clientY: endY
    })
    simulant.fire(column, 'touchmove', { changedTouches: [touchMove] })

    await waitForChange(content)

    const touchEnd = new Touch({
      identifier: 0,
      target: column,
      clientY: endY
    })
    simulant.fire(column, 'touchend', { changedTouches: [touchEnd] })

    await waitForChange(content)
  }

  it('use mouse events', async () => {
    const onChange = sinon.spy()
    const selected = 1
    const domRef = React.createRef()

    const app = (
      <Picker
        range={['A', 'B', 'C', 'D']}
        value={selected}
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]
    const content = document.querySelector('.weui-picker__content')
    const column = document.querySelector('.weui-picker__group')

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    const cur = document.querySelector('.weui-picker__indicator')
    const curRect = cur.getBoundingClientRect()
    const startY = curRect.top + curRect.height / 2
    const endY = curRect.top - curRect.height / 2

    simulant.fire(column, 'mousedown', new MouseEvent(column, { clientY: startY }))

    simulant.fire(column, 'mousemove', new MouseEvent(column, { clientY: endY }))
    await waitForChange(content)

    simulant.fire(column, 'mouseup', new MouseEvent(column, { clientY: endY }))
    await waitForChange(content)

    confirm.click()

    assert(node.value === 2)
    assert(onChange.calledOnceWith({ value: 2 }))
  })

  it('should can be canceled', async () => {
    const onCancel = sinon.spy()
    const domRef = React.createRef()

    const app = (
      <Picker
        range={['葡萄', '橙子']}
        value={1}
        onCancel={onCancel}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    await mount(app, scratch)
    const overlay = document.querySelector('.weui-picker__overlay')
    const mask = document.querySelector('.weui-mask')
    const cancel = document.querySelectorAll('.weui-picker__action')[0]

    assert(overlay.style.display === 'none')

    // 成功打开
    domRef.current.click()
    await waitForChange(overlay)
    assert(overlay.style.display !== 'none')

    // 点击蒙层可以关闭
    mask.click()
    await waitForChange(overlay)
    assert(overlay.style.display === 'none')
    assert(onCancel.callCount === 1)

    // 点击取消按钮可以关闭
    domRef.current.click()
    await waitForChange(overlay)
    cancel.click()
    await waitForChange(overlay)
    assert(overlay.style.display === 'none')
    assert(onCancel.callCount === 2)
  })

  it('selector', async () => {
    const onChange = sinon.spy()
    const range = ['葡萄', '橙子', '苹果', '木瓜']
    const selected = 1
    const domRef = React.createRef()

    const app = (
      <Picker
        range={range}
        value={selected}
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem()

    confirm.click()

    assert(node.value === 2)
    assert(onChange.calledOnceWith({ value: 2 }))
  })

  it('multiSelector', async () => {
    const onChange = sinon.spy()
    const onColumnChange = sinon.spy()
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
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='multiSelector'
        range={range}
        rangeKey='name'
        value={selected}
        onChange={e => onChange(e.detail)}
        onColumnChange={e => onColumnChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem()

    assert(onColumnChange.calledOnceWith({ column: 0, value: 1 }))

    confirm.click()

    assert.deepStrictEqual(node.value, [1, 0])
    assert(onChange.calledOnceWith({ value: [1, 0] }))
  })

  it('time', async () => {
    const onChange = sinon.spy()
    const selected = '12:01'
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='time'
        value={selected}
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem()

    confirm.click()

    assert(node.value === '13:01')
    assert(onChange.calledOnceWith({ value: '13:01' }))
  })

  it('date', async () => {
    const onChange = sinon.spy()
    const selected = '2016-09-01'
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='date'
        value={selected}
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem(1)

    confirm.click()

    assert(node.value === '2016-10-01')
    assert(onChange.calledOnceWith({ value: '2016-10-01' }))
  })

  it('time range', async () => {
    const start = '9:00'
    const end = '12:00'
    const onChange = sinon.spy()
    const selected = '12:00'
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='time'
        start={start}
        end={end}
        value={selected}
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem()

    confirm.click()

    assert(node.value === selected)
    assert(onChange.calledOnceWith({ value: selected }))
  })

  it('date range', async () => {
    const start = '2016-01-01'
    const end = '2016-09-30'
    const onChange = sinon.spy()
    const selected = '2016-09-01'
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='date'
        start={start}
        end={end}
        value={selected}
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === selected)

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem(1)

    confirm.click()

    assert(node.value === selected)
    assert(onChange.calledOnceWith({ value: selected }))
  })

  it('date fields month', async () => {
    const onChange = sinon.spy()
    const selected = '2016-09-01'
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='date'
        value={selected}
        fields='month'
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === '2016-09')

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem()

    confirm.click()

    assert(node.value === '2017-09')
    assert(onChange.calledOnceWith({ value: '2017-09' }))
  })

  it('date fields year', async () => {
    const onChange = sinon.spy()
    const selected = '2016-09-01'
    const domRef = React.createRef()

    const app = (
      <Picker
        mode='date'
        value={selected}
        fields='year'
        onChange={e => onChange(e.detail)}
      >
        <div ref={domRef}>Picker</div>
      </Picker>
    )
    const { node } = await mount(app, scratch)
    const slider = document.querySelector('.weui-picker')
    const confirm = document.querySelectorAll('.weui-picker__action')[1]

    assert(node.value === '2016')

    domRef.current.click()
    await waitForChange(slider)

    await srcollToNextItem()

    confirm.click()

    assert(node.value === '2017')
    assert(onChange.calledOnceWith({ value: '2017' }))
  })
})
