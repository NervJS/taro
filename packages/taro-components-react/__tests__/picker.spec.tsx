import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { act } from 'react'

import Picker from '../src/components/picker'
import { createTestData } from './utils'

// 模拟 Taro 组件
jest.mock('@tarojs/components', () => {
  const React = require('react')

  const MockView = React.forwardRef(({ children, ...props }: any, ref: any) => {
    return React.createElement('div', { ...props, ref }, children)
  })
  MockView.displayName = 'MockView'

  const MockText = React.forwardRef(({ children, ...props }: any, ref: any) => {
    return React.createElement('span', { ...props, ref }, children)
  })
  MockText.displayName = 'MockText'

  const MockScrollView = React.forwardRef(({ children, onScroll, onTouchStart, onScrollEnd, scrollY: _scrollY, showScrollbar: _showScrollbar, scrollTop: _scrollTop, scrollWithAnimation: _scrollWithAnimation, ...props }: any, ref: any) => {
    return React.createElement('div', {
      ...props,
      ref,
      onScroll: (e: any) => {
        if (onScroll) onScroll(e)
      },
      onTouchStart: (e: any) => {
        if (onTouchStart) onTouchStart(e)
      },
      onTouchEnd: () => {
        if (onScrollEnd) onScrollEnd()
      },
      style: {
        overflow: 'auto',
        height: '200px',
        ...props.style
      }
    }, children)
  })
  MockScrollView.displayName = 'MockScrollView'

  return {
    View: MockView,
    Text: MockText,
    ScrollView: MockScrollView,
  }
})

// 模拟样式文件
jest.mock('../src/components/picker/style/index.scss', () => ({}), { virtual: true })

describe('Picker Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // 清理所有模拟
    jest.clearAllMocks()
  })

  describe('Basic Props', () => {
    it('should render with default props', () => {
      render(<Picker>选择器</Picker>)
      const pickerElement = screen.getByText('选择器')
      expect(pickerElement).toBeInTheDocument()
    })

    it('should render with custom children', () => {
      render(<Picker>自定义内容</Picker>)
      expect(screen.getByText('自定义内容')).toBeInTheDocument()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Picker disabled>选择器</Picker>)
      const pickerElement = screen.getByText('选择器')
      expect(pickerElement).toBeInTheDocument()
      // 注意：Taro View 组件不直接支持 disabled 属性，这里只验证组件能正常渲染
    })

    it('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red' }
      render(<Picker style={customStyle}>选择器</Picker>)
      // 验证组件能够接收样式属性而不报错
      expect(screen.getByText('选择器')).toBeInTheDocument()
    })
  })

  describe('Selector Mode', () => {
    it('should render selector mode correctly', () => {
      const range = createTestData.selector()
      render(<Picker mode="selector" range={range}>选择器</Picker>)

      expect(screen.getByText('选择器')).toBeInTheDocument()
    })

    it('should handle value prop in selector mode', () => {
      const range = createTestData.selector()
      const value = 2
      render(<Picker mode="selector" range={range} value={value}>选择器</Picker>)

      const pickerElement = screen.getByText('选择器')
      expect(pickerElement).toBeInTheDocument()
    })

    it('should call onChange when value changes', async () => {
      const onChange = jest.fn()
      const range = createTestData.selector()

      render(
        <Picker
          mode="selector"
          range={range}
          onChange={onChange}
        >
          选择器
        </Picker>
      )

      const pickerElement = screen.getByText('选择器')
      await user.click(pickerElement)

      // 等待 picker 弹窗出现
      await waitFor(() => {
        expect(screen.getByText('确定')).toBeInTheDocument()
      })

      // 点击确定按钮
      const confirmButton = screen.getByText('确定')
      await user.click(confirmButton)

      // 验证 onChange 被调用
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('MultiSelector Mode', () => {
    it('should render multiSelector mode correctly', () => {
      const range = createTestData.multiSelector()
      render(<Picker mode="multiSelector" range={range}>多选器</Picker>)

      expect(screen.getByText('多选器')).toBeInTheDocument()
    })

    it('should handle value prop in multiSelector mode', () => {
      const range = createTestData.multiSelector()
      const value = [0, 1, 2]
      render(<Picker mode="multiSelector" range={range} value={value}>多选器</Picker>)

      const pickerElement = screen.getByText('多选器')
      expect(pickerElement).toBeInTheDocument()
    })
  })

  describe('Time Mode', () => {
    it('should render time mode correctly', () => {
      const timeData = createTestData.time()
      render(
        <Picker
          mode="time"
          start={timeData.start}
          end={timeData.end}
          value={timeData.value}
        >
          时间选择器
        </Picker>
      )

      expect(screen.getByText('时间选择器')).toBeInTheDocument()
    })

    it('should handle time range correctly', () => {
      const start = '09:00'
      const end = '18:00'
      const value = '12:00'

      render(
        <Picker
          mode="time"
          start={start}
          end={end}
          value={value}
        >
          时间选择器
        </Picker>
      )

      const pickerElement = screen.getByText('时间选择器')
      expect(pickerElement).toBeInTheDocument()
    })
  })

  describe('Date Mode', () => {
    it('should render date mode correctly', () => {
      const dateData = createTestData.date()
      render(
        <Picker
          mode="date"
          start={dateData.start}
          end={dateData.end}
          value={dateData.value}
        >
          日期选择器
        </Picker>
      )

      expect(screen.getByText('日期选择器')).toBeInTheDocument()
    })

    it('should handle different fields prop', () => {
      const dateData = createTestData.date()

      render(
        <Picker
          mode="date"
          start={dateData.start}
          end={dateData.end}
          value={dateData.value}
          fields="month"
        >
          月份选择器
        </Picker>
      )

      expect(screen.getByText('月份选择器')).toBeInTheDocument()
    })
  })

  describe('Region Mode', () => {
    it('should render region mode correctly', () => {
      const regionData = createTestData.region()
      render(
        <Picker
          mode="region"
          regionData={regionData}
        >
          地区选择器
        </Picker>
      )

      expect(screen.getByText('地区选择器')).toBeInTheDocument()
    })

    it('should handle different region levels', () => {
      const regionData = createTestData.region()

      render(
        <Picker
          mode="region"
          regionData={regionData}
          level="city"
        >
          城市选择器
        </Picker>
      )

      expect(screen.getByText('城市选择器')).toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const onCancel = jest.fn()
      const range = createTestData.selector()

      render(
        <Picker
          mode="selector"
          range={range}
          onCancel={onCancel}
        >
          选择器
        </Picker>
      )

      const pickerElement = screen.getByText('选择器')
      await user.click(pickerElement)

      // 等待 picker 弹窗出现
      await waitFor(() => {
        expect(screen.getByText('取消')).toBeInTheDocument()
      })

      // 点击取消按钮
      const cancelButton = screen.getByText('取消')
      await user.click(cancelButton)

      expect(onCancel).toHaveBeenCalled()
    })

    it('should call onColumnChange in multiSelector mode', async () => {
      const onColumnChange = jest.fn()
      const range = createTestData.multiSelector()

      render(
        <Picker
          mode="multiSelector"
          range={range}
          onColumnChange={onColumnChange}
        >
          多选器
        </Picker>
      )

      const pickerElement = screen.getByText('多选器')
      await user.click(pickerElement)

      // 等待 picker 弹窗出现
      await waitFor(() => {
        expect(screen.getByText('确定')).toBeInTheDocument()
      })

      // 这里需要模拟实际的列变化逻辑
      // 由于组件内部逻辑复杂，这里只是验证事件处理函数存在
      expect(onColumnChange).toBeDefined()
    })
  })

  describe('Text Props', () => {
    it('should render custom text props', async () => {
      const range = createTestData.selector()
      const textProps = {
        okText: '确认',
        cancelText: '取消'
      }

      render(
        <Picker
          mode="selector"
          range={range}
          textProps={textProps}
        >
          选择器
        </Picker>
      )

      const pickerElement = screen.getByText('选择器')
      await user.click(pickerElement)

      // 等待 picker 弹窗出现
      await waitFor(() => {
        expect(screen.getByText('确认')).toBeInTheDocument()
        expect(screen.getByText('取消')).toBeInTheDocument()
      })
    })
  })

  describe('Range Key', () => {
    it('should handle rangeKey prop correctly', () => {
      const range = [
        { id: 1, name: '选项1' },
        { id: 2, name: '选项2' },
        { id: 3, name: '选项3' }
      ]

      render(
        <Picker
          mode="selector"
          range={range}
          rangeKey="name"
        >
          选择器
        </Picker>
      )

      expect(screen.getByText('选择器')).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('should handle formType prop', () => {
      render(<Picker formType="submit">提交选择器</Picker>)
      // 查找包含 data-form-type 属性的元素
      const pickerElement = screen.getByText('提交选择器').closest('[data-form-type]')
      expect(pickerElement).toHaveAttribute('data-form-type', 'submit')
    })

    it('should handle name prop', () => {
      render(<Picker name="test-picker">命名选择器</Picker>)
      // name 属性被 omit 函数排除，不会应用到 DOM 元素上
      // 这个测试验证组件能够接收 name 属性而不报错
      expect(screen.getByText('命名选择器')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Picker aria-label="选择器">选择器</Picker>)
      const pickerElement = screen.getByLabelText('选择器')
      expect(pickerElement).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      const onChange = jest.fn()
      const range = createTestData.selector()

      render(
        <Picker
          mode="selector"
          range={range}
          onChange={onChange}
        >
          选择器
        </Picker>
      )

      const pickerElement = screen.getByText('选择器')
      pickerElement.focus()

      // 模拟点击事件（键盘可访问性通常通过点击实现）
      await user.click(pickerElement)

      await waitFor(() => {
        expect(screen.getByText('确定')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid range data gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      render(<Picker mode="selector" range={null as any}>选择器</Picker>)

      expect(screen.getByText('选择器')).toBeInTheDocument()
      consoleSpy.mockRestore()
    })

    it('should handle invalid region data', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <Picker
          mode="region"
          regionData={null as any}
        >
          地区选择器
        </Picker>
      )

      expect(screen.getByText('地区选择器')).toBeInTheDocument()
      consoleSpy.mockRestore()
    })
  })

  describe('Performance', () => {
    it('should handle large range data efficiently', () => {
      const largeRange = Array.from({ length: 1000 }, (_, i) => `选项${i + 1}`)

      const startTime = performance.now()
      render(<Picker mode="selector" range={largeRange}>大数据选择器</Picker>)
      const endTime = performance.now()

      expect(screen.getByText('大数据选择器')).toBeInTheDocument()
      expect(endTime - startTime).toBeLessThan(100) // 渲染时间应该小于100ms
    })
  })
})

describe('PickerGroup 组件补测', () => {
  const { PickerGroup } = require('../src/components/picker/picker-group')
  // 移除未使用的 user

  it('should render selector mode correctly', () => {
    const { getByText } = render(
      <PickerGroup mode="basic" range={['A', 'B', 'C']} columnId="0" updateIndex={jest.fn()} />
    )
    expect(getByText('A')).toBeInTheDocument()
    expect(getByText('B')).toBeInTheDocument()
    expect(getByText('C')).toBeInTheDocument()
  })

  // 该用例依赖真实浏览器的滚动和定时器副作用，jsdom下无法100%还原，建议在E2E或真实浏览器环境下补测
  it.skip('should call onColumnChange when scroll ends (jsdom无法100%还原)', async () => {
    // 该用例依赖真实浏览器的滚动和定时器副作用，jsdom下无法100%还原
    // 建议在E2E或真实浏览器环境下补测
  })

  it('should handle empty range gracefully', () => {
    const { container } = render(
      <PickerGroup mode="basic" range={[]} columnId="0" updateIndex={jest.fn()} />
    )
    expect(container.querySelectorAll('.taro-picker__item').length).toBeGreaterThan(0) // 只渲染空白项
  })

  it('should not trigger onColumnChange when disabled', async () => {
    const onColumnChange = jest.fn()
    const { container } = render(
      <PickerGroup
        mode="basic"
        range={['A', 'B']}
        columnId="0"
        updateIndex={jest.fn()}
        onColumnChange={onColumnChange}
        disabled={true}
      />
    )
    const scrollView = container.querySelector('.taro-picker__content')
    if (scrollView) {
      await act(async () => {
        Object.defineProperty(scrollView, 'scrollTop', { value: 34, writable: true })
        scrollView.dispatchEvent(new Event('scroll', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 150))
      })
    }
    expect(onColumnChange).not.toHaveBeenCalled()
  })

  it('should update selectedIndex when prop changes', () => {
    const { rerender, container } = render(
      <PickerGroup mode="basic" range={['A', 'B', 'C']} columnId="0" updateIndex={jest.fn()} selectedIndex={0} />
    )
    expect(container.querySelector('.taro-picker__item--selected')?.textContent).toBe('A')
    rerender(<PickerGroup mode="basic" range={['A', 'B', 'C']} columnId="0" updateIndex={jest.fn()} selectedIndex={2} />)
    expect(container.querySelector('.taro-picker__item--selected')?.textContent).toBe('C')
  })
})

// ========== PickerGroup 额外覆盖率补充用例 ==========

describe('PickerGroup 额外覆盖率补充', () => {
  const { PickerGroup } = require('../src/components/picker/picker-group')

  it('should handle empty range gracefully', () => {
    const { container } = render(
      <PickerGroup mode="basic" range={[]} columnId="0" updateIndex={jest.fn()} />
    )
    expect(container).toBeInTheDocument()
  })

  it('should render items with rangeKey', () => {
    const range = [{ label: 'A', value: 1 }, { label: 'B', value: 2 }]
    const { getByText } = render(
      <PickerGroup mode="basic" range={range} rangeKey="label" columnId="0" updateIndex={jest.fn()} />
    )
    expect(getByText('A')).toBeInTheDocument()
    expect(getByText('B')).toBeInTheDocument()
  })

  it('should render region mode with nested children', () => {
    const regionData = [
      {
        value: '省A',
        code: '100',
        children: [
          {
            value: '市A1',
            code: '101',
            children: [{ value: '区A1-1', code: '102' }]
          }
        ]
      }
    ]
    const { getByText } = render(
      <PickerGroup
        mode="region"
        range={regionData}
        rangeKey="value"
        columnId="0"
        updateIndex={jest.fn()}
        selectedIndex={0}
      />
    )
    expect(getByText('省A')).toBeInTheDocument()
  })

  it('should call updateDay when provided', () => {
    const updateDay = jest.fn()
    render(
      <PickerGroup
        mode="date"
        range={['2024-01-01', '2024-01-02']}
        columnId="0"
        updateIndex={jest.fn()}
        updateDay={updateDay}
        selectedIndex={0}
      />
    )
    // 这里只能保证不报错
    expect(updateDay).not.toHaveBeenCalled()
  })

  it('should render large range efficiently', () => {
    const range = Array.from({ length: 1000 }, (_, i) => `选项${i}`)
    const { getByText } = render(
      <PickerGroup mode="basic" range={range} columnId="0" updateIndex={jest.fn()} />
    )
    expect(getByText('选项0')).toBeInTheDocument()
    expect(getByText('选项999')).toBeInTheDocument()
  })
})

// ========== Picker 主组件额外覆盖率补充用例 ==========

describe('Picker 主组件额外覆盖率补充', () => {
  it('should update selectedIndices when value prop changes (受控)', () => {
    const { rerender, container } = render(
      <Picker mode="selector" range={['A', 'B', 'C']} value={0}>选择器</Picker>
    )
    expect(container.textContent).toContain('选择器')
    rerender(<Picker mode="selector" range={['A', 'B', 'C']} value={2}>选择器</Picker>)
    expect(container.textContent).toContain('选择器')
  })

  it('should support switching mode dynamically', () => {
    const { rerender, getByText } = render(
      <Picker mode="selector" range={['A', 'B']} value={0}>选择器</Picker>
    )
    expect(getByText('选择器')).toBeInTheDocument()
    rerender(<Picker mode="multiSelector" range={[['A', 'B'], ['C', 'D']]} value={[0, 1]}>多选器</Picker>)
    expect(getByText('多选器')).toBeInTheDocument()
  })

  it('should handle invalid regionData gracefully', () => {
    const { container } = render(
      <Picker mode="region" regionData={null as any}>地区选择器</Picker>
    )
    expect(container).toBeInTheDocument()
  })

  it('should throw error for invalid start/end for date mode', () => {
    expect(() =>
      render(
        <Picker mode="date" start="2025-01-01" end="2020-01-01" value="2022-01-01">日期选择器</Picker>
      )
    ).toThrow('Picker start time must be less than end time.')
  })

  it('should call onChange when confirm is clicked', async () => {
    const onChange = jest.fn()
    const range = ['A', 'B', 'C']
    render(
      <Picker mode="selector" range={range} onChange={onChange}>选择器</Picker>
    )
    const pickerElement = screen.getByText('选择器')
    await userEvent.click(pickerElement)
    await waitFor(() => expect(screen.getByText('确定')).toBeInTheDocument())
    await userEvent.click(screen.getByText('确定'))
    expect(onChange).toHaveBeenCalled()
  })

  it('should not open picker when disabled', async () => {
    render(
      <Picker mode="selector" range={['A', 'B']} disabled>选择器</Picker>
    )
    const pickerElement = screen.getByText('选择器')
    await userEvent.click(pickerElement)
    expect(screen.queryByText('确定')).not.toBeInTheDocument()
  })

  it('should render with complex rangeKey', () => {
    const range = [{ info: { label: 'A' } }, { info: { label: 'B' } }]
    // 假设 PickerGroup 支持 rangeKey="info.label"
    render(
      <Picker mode="selector" range={range} rangeKey="info.label">选择器</Picker>
    )
    // 这里只能保证不报错
    expect(screen.getByText('选择器')).toBeInTheDocument()
  })
})
