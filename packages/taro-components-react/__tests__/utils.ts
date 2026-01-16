import { render, RenderResult } from '@testing-library/react'
import React from 'react'

export const delay = (ms = 500) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function toCamelCase(s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function printUnimplementedWarning(node?: Node) {
  const name = node?.nodeName.slice(5).replace('-CORE', '').toLowerCase() || 'unknown'
  return `H5 暂不支持 ${capitalize(toCamelCase(name))} 组件！`
}

export function parsePx2Number(px: string) {
  return Number(px.replace('px', ''))
}

export function parseStyle2String(...styles: Record<string, string | number>[]) {
  const style = Object.assign({}, ...styles)
  return Object.entries(style).map(([key, value]) => `${key}: ${value};`).join('')
}

// React 测试工具函数
export function renderWithProviders(
  ui: React.ReactElement,
  options?: any
): RenderResult {
  return render(ui, {
    ...options,
  })
}

// 模拟事件工具
export const createMockEvent = (type: string, detail?: any) => ({
  type,
  detail: detail || {},
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
})

// 模拟 Taro 环境
export const mockTaroEnv = () => {
  // 模拟 Taro 的 View 组件
  jest.doMock('@tarojs/components', () => ({
    View: ({ children, ...props }: any) => React.createElement('div', props, children),
    Text: ({ children, ...props }: any) => React.createElement('span', props, children),
    Image: (props: any) => React.createElement('img', props),
    Button: ({ children, ...props }: any) => React.createElement('button', props, children),
  }))
}

// 测试数据生成器
export const createTestData = {
  // 创建选择器数据
  selector: (count = 5) => Array.from({ length: count }, (_, i) => `选项${i + 1}`),

  // 创建多选择器数据
  multiSelector: () => [
    ['早餐', '午餐', '晚餐'],
    ['米饭', '面条', '馒头'],
    ['青菜', '肉类', '海鲜']
  ],

  // 创建时间数据
  time: () => ({
    start: '00:00',
    end: '23:59',
    value: '12:00'
  }),

  // 创建日期数据
  date: () => ({
    start: '2020-01-01',
    end: '2030-12-31',
    value: '2024-01-01'
  }),

  // 创建地区数据
  region: () => [
    {
      value: '北京市',
      code: '110000',
      children: [
        {
          value: '北京市',
          code: '110100',
          children: [
            { value: '东城区', code: '110101' },
            { value: '西城区', code: '110102' }
          ]
        }
      ]
    }
  ]
}
