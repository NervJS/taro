import Portal from '@ant-design/react-native/lib/portal'
import { act, fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { Text } from 'react-native'

import DateSelector from '../components/Picker/date'
import TimeSelector from '../components/Picker/time'

function renderSelector(Component, props = {}) {
  const ref = React.createRef<any>()
  const result = render(<Portal.Host><Component ref={ref} {...props}><Text>选择</Text></Component></Portal.Host>)
  return { ...result, ref }
}

describe('Picker date and time compatibility', () => {
  it.each(['year', 'month', 'day'])('preserves date precision %s', fields => {
    const { ref } = renderSelector(DateSelector, { fields })
    expect(ref.current.render().props.precision).toBe(fields)
  })

  it('renders only hours and minutes within the time bounds', () => {
    const { ref } = renderSelector(TimeSelector, { start: '09:30', end: '11:15', value: '10:05' })
    const { data, value, cols } = ref.current.render().props
    expect(cols).toBe(2)
    expect(value).toEqual(['10', '05'])
    expect(data.map(hour => hour.value)).toEqual(['09', '10', '11'])
    expect(data[0].children.map(minute => minute.value)).toEqual(Array.from({ length: 30 }, (_, index) => String(index + 30)))
    expect(data[1].children).toHaveLength(60)
    expect(data[2].children).toHaveLength(16)
  })

  it.each([
    ['00:00', '23:59', 24, 60],
    ['09:30', '09:30', 1, 1],
  ])('supports time bounds %s to %s', (start, end, hours, minutes) => {
    const { ref } = renderSelector(TimeSelector, { start, end })
    const { data } = ref.current.render().props
    expect(data).toHaveLength(hours)
    expect(data[0].children).toHaveLength(minutes)
  })

  it.each([DateSelector, TimeSelector])('cancels through the popup for %p', Component => {
    const onCancel = jest.fn()
    const onChange = jest.fn()
    const { getByText } = renderSelector(Component, { onCancel, onChange })
    fireEvent.press(getByText('选择'))
    fireEvent.press(getByText('取消'))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })

  it.each([
    [DateSelector, '2026-09-20'],
    [TimeSelector, '09:05'],
  ])('confirms through the popup for %p', (Component, value) => {
    const onCancel = jest.fn()
    const onChange = jest.fn()
    const { getByText } = renderSelector(Component, { value, onCancel, onChange })
    fireEvent.press(getByText('选择'))
    fireEvent.press(getByText('确定'))
    expect(onChange).toHaveBeenCalledWith({ detail: { value } })
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('emits a formatted time only on confirmation', () => {
    const onChange = jest.fn()
    const onCancel = jest.fn()
    const { ref } = renderSelector(TimeSelector, { onChange, onCancel })
    expect(onChange).not.toHaveBeenCalled()
    act(() => ref.current.render().props.onChange(['09', '05']))
    expect(onChange).toHaveBeenCalledWith({ detail: { value: '09:05' } })
    expect(onCancel).not.toHaveBeenCalled()
  })

  it.each([DateSelector, TimeSelector])('keeps cancellation and disabled behavior for %p', Component => {
    const onCancel = jest.fn()
    const onChange = jest.fn()
    const { ref, getByText, queryByText } = renderSelector(Component, { disabled: true, onCancel, onChange })
    fireEvent.press(getByText('选择'))
    expect(onChange).not.toHaveBeenCalled()
    expect(queryByText('确定')).toBeNull()
    expect(ref.current.render().props.disabled).toBe(true)
    act(() => ref.current.render().props.onDismiss())
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })
})
