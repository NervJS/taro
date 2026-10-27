/* eslint-disable react/display-name -- lightweight native component mocks */
import Taro from '@tarojs/taro'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'

import Picker from '../src/components/picker'
import { PickerGroupDate as LegacyDate } from '../src/components/picker/picker-group-legacy'
import { PickerGroupDate as SliderDate } from '../src/components/picker/picker-group-slider'

// 明确控制动画途中的readback；不把目标scrollTop自动当成实际已落定的值。
jest.mock('@tarojs/components', () => {
  const React = require('react')
  return {
    View: React.forwardRef(({ children, className, id, onClick, onAriaAction }: any, ref: any) =>
      React.createElement('div', {
        ref,
        className,
        id,
        onClick,
        onKeyDown: (e: any) => onAriaAction?.({ detail: { actionName: e.key } })
      }, children)),
    ScrollView: React.forwardRef(({ children, scrollTop, onScroll, onTouchStart, onScrollEnd, onMouseDown, onWheel }: any, ref: any) =>
      React.createElement('div', {
        ref,
        'data-testid': 'wheel',
        'data-target': scrollTop,
        onScroll,
        onTouchStart,
        onMouseDown,
        onWheel,
        onTouchEnd: onScrollEnd
      }, children))
  }
})

const taro = Taro as any
const years = Array.from({ length: 127 }, (_, i) => `${1900 + i}年`)
const system = {
  platform: 'ios',
  version: '16.1.50',
  windowWidth: 867,
  windowHeight: 669,
  lengthScaleRatio: 1,
  designAppVersion: 15,
  foldState: 'fullyOpen'
}

beforeEach(() => {
  jest.useFakeTimers()
  process.env.TARO_ENV = 'dynamic'
  process.env.TARO_PLATFORM = 'ios'
  taro.getSystemInfo.mockImplementation(({ success }: any) => success(system))
  taro.getSystemInfoSync.mockReturnValue(system)
  taro.useResize.mockClear()
  taro.accessibilityAnnounce = jest.fn()
  taro.setAccessibilityFocus = jest.fn()
  taro.checkIsOpenAccessibility.mockReturnValue({ then: () => ({ catch: () => {} }) })
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => { cleanup(); jest.clearAllTimers(); jest.useRealTimers(); jest.restoreAllMocks() })

for (const [name, DateColumn] of [['slider', SliderDate], ['legacy', LegacyDate]] as const) {
  describe(name + ' date alignment', () => {
    function mount(extra: any = {}) {
      const updateDay = jest.fn()
      const props = { range: years, columnId: '0', selectedIndex: 126, updateDay, ...extra }
      const result = render(<DateColumn {...props} />)
      const wheel = result.getByTestId('wheel')
      Object.defineProperty(wheel, 'scrollHeight', { configurable: true, get: () => wheel.childNodes.length * 34 })
      const scroll = (index: number) => { wheel.scrollTop = index * 34; fireEvent.scroll(wheel) }
      const end = () => { fireEvent.touchEnd(wheel); act(() => jest.advanceTimersByTime(100)) }
      const resize = () => act(() => { const calls = taro.useResize.mock.calls; calls[calls.length - 1][0]() })
      const target = () => Number(wheel.getAttribute('data-target'))
      return { ...result, wheel, props, updateDay, scroll, end, resize, target }
    }
    it('200ms resize测量使用126而不是途中的37，程序化停滚不提交1937', () => {
      const x = mount(); x.scroll(37); x.resize()
      act(() => jest.advanceTimersByTime(200))
      expect(x.target()).toBeCloseTo(126 * 34, 2)
      x.end(); expect(x.updateDay).not.toHaveBeenCalled()
    })
    it('用户打断动画、惯性停稳提交一次，后续归中不重复', () => {
      const x = mount(); fireEvent.touchStart(x.wheel); x.scroll(70); x.resize()
      x.end(); expect(x.updateDay).toHaveBeenCalledWith(1970, 0)
      x.end(); expect(x.updateDay).toHaveBeenCalledTimes(1)
      x.resize(); expect(x.target()).toBeCloseTo(70 * 34, 2)
    })
    it('同内容range重建不取消拖动，真正props更新取消旧停滚', () => {
      const x = mount(); fireEvent.touchStart(x.wheel); x.scroll(70)
      x.rerender(<DateColumn {...x.props} range={[...years]} />)
      x.end(); expect(x.updateDay).toHaveBeenCalledWith(1970, 0)
      fireEvent.touchStart(x.wheel); x.scroll(20); fireEvent.touchEnd(x.wheel)
      x.rerender(<DateColumn {...x.props} selectedIndex={80} />)
      act(() => jest.advanceTimersByTime(200))
      expect(x.target()).toBeCloseTo(80 * 34, 2)
      expect(x.updateDay).toHaveBeenCalledTimes(1)
    })
    it('点击不依赖touch/scrollEnd；resize不拉回旧props，重复点击不重复提交', () => {
      const x = mount(); fireEvent.click(x.getByText('1985年'))
      expect(x.updateDay).toHaveBeenCalledWith(1985, 0)
      x.scroll(37); x.resize(); expect(x.target()).toBeCloseTo(85 * 34, 2)
      x.end(); fireEvent.click(x.getByText('1985年'))
      expect(x.updateDay).toHaveBeenCalledTimes(1)
    })
    it('索引0不被视觉索引回退；范围收窄/清空不提交0日期', () => {
      const x = mount({ selectedIndex: 0 }); x.scroll(37); x.resize()
      expect(x.target()).toBeCloseTo(0, 2)
      x.rerender(<DateColumn {...x.props} selectedIndex={126} range={years.slice(0, 10)} />)
      expect(x.target()).toBeCloseTo(9 * 34, 2)
      x.rerender(<DateColumn {...x.props} range={[]} />)
      fireEvent.touchStart(x.wheel); x.scroll(0); x.end()
      expect(x.updateDay).not.toHaveBeenCalled()
    })
    it('卸载清理停滚，重开回到父级值', () => {
      const x = mount(); fireEvent.touchStart(x.wheel); x.scroll(20); fireEvent.touchEnd(x.wheel)
      x.unmount(); act(() => jest.advanceTimersByTime(400))
      expect(x.updateDay).not.toHaveBeenCalled()
      const reopened = mount(); expect(reopened.target()).toBeCloseTo(126 * 34, 2)
    })
    it('异步系统信息读取最新目标，卸载后回调不得干扰新列', () => {
      const callbacks: any[] = []
      taro.getSystemInfo.mockImplementation((opts: any) => callbacks.push(opts))
      const x = mount(); x.rerender(<DateColumn {...x.props} selectedIndex={80} />)
      act(() => callbacks[0].success({ ...system, lengthScaleRatio: 0.5 }))
      expect(x.target()).toBeCloseTo(80 * 34 * 0.5, 2)
      x.unmount(); const y = mount()
      act(() => callbacks[0].success({ ...system, lengthScaleRatio: 2 }))
      expect(y.target()).toBeCloseTo(126 * 34, 2)
    })
    it('H5鼠标滚轮仍作为用户选择，不被程序化滚动过滤', () => {
      process.env.TARO_ENV = 'h5'
      const x = mount(); fireEvent.wheel(x.wheel); x.scroll(70); x.end()
      expect(x.updateDay).toHaveBeenCalledWith(1970, 0)
    })
    it('禁止点击选项时保持原选择', () => {
      const x = mount({ enableClickItemScroll: false }); fireEvent.click(x.getByText('1985年'))
      expect(x.updateDay).not.toHaveBeenCalled()
      expect(x.target()).toBeCloseTo(126 * 34, 2)
    })
    if (name === 'legacy') {
      it('旧版无障碍焦点等到点击目标实际落位，仅请求一次', () => {
        const x = mount(); fireEvent.click(x.getByText('1985年'))
        x.scroll(37); x.end(); expect(taro.setAccessibilityFocus).not.toHaveBeenCalled()
        x.scroll(85); x.end()
        expect(taro.setAccessibilityFocus).toHaveBeenCalledTimes(1)
        expect(taro.setAccessibilityFocus.mock.calls[0][0].viewRef.current.textContent).toBe('1985年')
        x.end(); expect(taro.setAccessibilityFocus).toHaveBeenCalledTimes(1)
      })
    }
    if (name === 'slider') {
      it('无障碍连续操作以最新选择意图累加，不用动画途中高亮', () => {
        const x = mount({ selectedIndex: 80 }); x.scroll(37)
        const mask = x.container.querySelector('.taro-picker__mask')!
        act(() => { fireEvent.keyDown(mask, { key: 'increment' }); fireEvent.keyDown(mask, { key: 'increment' }) })
        expect(x.updateDay.mock.calls).toEqual([[1981, 0], [1982, 0]])
        expect(taro.accessibilityAnnounce).toHaveBeenLastCalledWith({ announce: '1982年', delay: 300 })
        x.end(); expect(x.updateDay).toHaveBeenCalledTimes(2)
      })
    }
  })
}

describe('mounted Picker date confirm/cancel/reopen', () => {
  it.each(['year', 'month', 'day'])('%s初始化途经项不回写；取消恢复父值，确认新值后重开回显', (fields) => {
    const initial = fields === 'year' ? '2026' : fields === 'month' ? '2026-04' : '2026-04-15'
    const handle = React.createRef<any>()
    const confirmed = jest.fn()
    const cancelled = jest.fn()
    function Business() {
      const [value, setValue] = React.useState(initial)
      return <Picker ref={handle} mode='date' fields={fields as any} value={value}
        start='1900-01-01' end='2026-10-31' onCancel={cancelled}
        onChange={(e: any) => { confirmed(e.detail.value); setValue(e.detail.value) }}><div /></Picker>
    }
    const x = render(<Business />)
    const open = () => act(() => handle.current.showPicker())
    open()
    let wheel = x.getAllByTestId('wheel')[0]
    wheel.scrollTop = 37 * 34; fireEvent.scroll(wheel); fireEvent.touchEnd(wheel)
    act(() => jest.advanceTimersByTime(300))
    fireEvent.click(x.getByText('取消'))
    expect(cancelled).toHaveBeenCalledTimes(1)
    open(); wheel = x.getAllByTestId('wheel')[0]
    expect(Number(wheel.getAttribute('data-target'))).toBeCloseTo(126 * 34, 2)
    fireEvent.click(x.getByText('确定'))
    expect(confirmed).toHaveBeenLastCalledWith(initial)
    open(); fireEvent.click(x.getByText('2025年')); fireEvent.click(x.getByText('确定'))
    expect(confirmed).toHaveBeenLastCalledWith(initial.replace('2026', '2025'))
    open(); wheel = x.getAllByTestId('wheel')[0]
    expect(Number(wheel.getAttribute('data-target'))).toBeCloseTo(125 * 34, 2)
  })
})
