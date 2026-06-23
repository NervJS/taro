# Taro Components React 测试体系

## 📋 概述

本项目为 `taro-components-react` 建立了完整的测试体系，采用 **Jest + React Testing Library** 技术栈，专门适配 React 组件测试环境，区别于 Stencil.js 的测试方式。

## 🏗️ 测试架构

### 技术栈
- **测试框架**: Jest + React Testing Library
- **组件框架**: React + TypeScript
- **测试环境**: jsdom (浏览器环境模拟)
- **测试类型**: Unit Tests (spec.tsx)

### 目录结构
```
__tests__/
├── setup.ts                    # 测试环境设置 (417行)
├── utils.ts                    # 测试工具函数 (117行)
├── README.md                   # 测试说明文档
└── picker.spec.tsx            # Picker 组件测试 (459行)
```

## ⚙️ 测试配置

### Jest 配置 (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js'
  },
  transformIgnorePatterns: ['/node_modules/(?!(swiper)/)'],
  // ... 其他配置
}
```

### 环境设置 (setup.ts)
- **Taro 环境变量**: `TARO_ENV=h5`, `TARO_PLATFORM=web`
- **Taro 组件 Mock**: 完整模拟 `@tarojs/components` 的所有组件
- **浏览器 API Mock**: MutationObserver, ResizeObserver
- **样式文件处理**: SCSS, CSS 文件 Mock

## 🛠️ 测试工具

### 核心工具函数 (utils.ts)

#### 基础工具
```typescript
// 延迟函数
export const delay = (ms = 500) => Promise<void>

// 字符串处理
export function toCamelCase(s: string): string
export function capitalize(s: string): string

// 样式处理
export function parsePx2Number(px: string): number
export function parseStyle2String(...styles: Record<string, string | number>[]): string
```

#### React 测试工具
```typescript
// 渲染工具
export function renderWithProviders(ui: React.ReactElement, options?: any): RenderResult

// 事件模拟
export const createMockEvent = (type: string, detail?: any) => ({...})

// Taro 环境模拟
export const mockTaroEnv = () => {...}
```

#### 测试数据生成器
```typescript
export const createTestData = {
  selector: (count = 5) => Array.from({ length: count }, (_, i) => `选项${i + 1}`),
  multiSelector: () => [['早餐', '午餐', '晚餐'], ['米饭', '面条', '馒头'], ['青菜', '肉类', '海鲜']],
  time: () => ({ start: '00:00', end: '23:59', value: '12:00' }),
  date: () => ({ start: '2020-01-01', end: '2030-12-31', value: '2024-01-01' }),
  region: () => [/* 地区数据 */]
}
```

## 📊 测试覆盖

### Picker 组件测试 (26个测试用例)

#### ✅ 基础功能 (4个)
- 默认属性渲染
- 自定义子元素
- 禁用状态
- 样式应用

#### ✅ 模式测试 (10个)
- **Selector 模式** (3个): 单选器功能测试
- **MultiSelector 模式** (2个): 多选器功能测试
- **Time 模式** (2个): 时间选择器功能测试
- **Date 模式** (2个): 日期选择器功能测试
- **Region 模式** (2个): 地区选择器功能测试

#### ✅ 事件处理 (2个)
- onCancel 回调测试
- onColumnChange 回调测试

#### ✅ 高级功能 (10个)
- 文本属性配置测试
- Range Key 处理测试
- 表单集成测试 (formType, name)
- 可访问性测试 (ARIA 属性, 键盘导航)
- 错误处理测试 (无效数据)
- 性能测试 (大数据量)

## 🧪 测试编写规范

### 1. 基本结构
```typescript
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Picker from '../src/components/picker'
import { createTestData } from './utils'

describe('Picker Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Props', () => {
    it('should render with default props', () => {
      // 测试逻辑
    })
  })
})
```

### 2. 组件 Mock 策略
```typescript
// 模拟 Taro 组件
jest.mock('@tarojs/components', () => {
  const React = require('react')
  return {
    View: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref }, props.children)),
    ScrollView: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref }, props.children)),
    Text: React.forwardRef((props, ref) => React.createElement('span', { ...props, ref }, props.children)),
    // ... 其他组件
  }
})

// 模拟样式文件
jest.mock('../src/components/picker/style/index.scss', () => ({}), { virtual: true })
```

### 3. 交互测试
```typescript
it('should handle user interactions', async () => {
  const onChange = jest.fn()
  render(<Picker onChange={onChange}>选择器</Picker>)
  
  const pickerElement = screen.getByText('选择器')
  await user.click(pickerElement)
  
  await waitFor(() => {
    expect(screen.getByText('确定')).toBeInTheDocument()
  })
})
```

### 4. 异步测试
```typescript
it('should handle async operations', async () => {
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('加载完成')).toBeInTheDocument()
  }, { timeout: 3000 })
})
```

## 🔄 与 Stencil 测试的差异

| 方面 | Stencil 测试 | React 测试 |
|------|-------------|------------|
| **测试环境** | `newSpecPage()`, `newE2EPage()` | `render()`, `screen` 查询 |
| **组件渲染** | JSX 模板 + Web Components | React 组件 + DOM 元素 |
| **事件处理** | `spyOnEvent()`, `triggerEvent()` | `fireEvent`, `userEvent` |
| **断言方式** | `expect(page.root?.prop).toEqual(value)` | `expect(screen.getByText('text')).toBeInTheDocument()` |
| **Mock 策略** | 组件级别 Mock | 模块级别 Mock |

## 🚀 测试命令

```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 运行特定组件测试
npm test -- --testPathPattern=picker.spec.tsx

# 生成覆盖率报告
npm test -- --coverage

# 详细输出
npm test -- --verbose
```

## 📈 测试结果

```
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        1.384 s
```

## 🎯 最佳实践

### 1. 测试组织
- ✅ 按功能模块分组测试
- ✅ 使用描述性的测试用例名称
- ✅ 保持测试用例独立
- ✅ 使用 `beforeEach` 清理状态

### 2. Mock 策略
- ✅ 模拟外部依赖 (Taro 组件、样式文件)
- ✅ 使用 `jest.mock()` 进行模块模拟
- ✅ 提供合理的默认值
- ✅ 避免过度 Mock

### 3. 异步处理
- ✅ 使用 `waitFor()` 等待异步操作
- ✅ 正确处理 Promise 和回调
- ✅ 避免使用 `setTimeout` 进行等待
- ✅ 设置合理的超时时间

### 4. 错误处理
- ✅ 测试边界情况和错误状态
- ✅ 模拟错误场景
- ✅ 验证错误处理逻辑
- ✅ 测试异常数据输入

## 🔧 扩展指南

### 添加新组件测试

1. **创建测试文件**: `__tests__/{component-name}.spec.tsx`
2. **编写测试用例**: 参考 `picker.spec.tsx` 结构
3. **添加测试数据**: 在 `utils.ts` 中添加数据生成函数
4. **配置 Mock**: 根据需要添加组件 Mock
5. **运行测试**: 确保所有测试通过

### 测试模板

```typescript
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Component from '../src/components/component'
import { createTestData } from './utils'

describe('Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Props', () => {
    it('should render with default props', () => {
      render(<Component />)
      expect(screen.getByText('默认文本')).toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    it('should handle click event', async () => {
      const onClick = jest.fn()
      render(<Component onClick={onClick}>点击</Component>)
      
      const element = screen.getByText('点击')
      await user.click(element)
      
      expect(onClick).toHaveBeenCalled()
    })
  })
})
```

## ⚠️ 注意事项

1. **依赖安装**: 确保已安装所有测试依赖
2. **类型声明**: 可能需要安装额外的类型声明包
3. **环境兼容**: 确保测试环境与目标环境兼容
4. **性能考虑**: 避免在测试中执行耗时的操作
5. **Mock 维护**: 定期更新 Mock 以匹配实际组件行为

## 📚 参考资源

- [Jest 官方文档](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/user-event](https://github.com/testing-library/user-event)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) 