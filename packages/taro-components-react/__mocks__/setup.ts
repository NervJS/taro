import '@testing-library/jest-dom'

// 设置环境变量
process.env.TARO_ENV = 'h5'
process.env.TARO_PLATFORM = 'web'
process.env.SUPPORT_TARO_POLYFILL = 'disabled'

// 模拟 MutationObserver
// @ts-ignore
global.MutationObserver = class {
  disconnect() {}
  observe(_element: any, _initObject: any) {}
  takeRecords() { return [] }
}

// 模拟 IntersectionObserver
// @ts-ignore
global.IntersectionObserver = class {
  constructor(fn: (args: any[]) => void) {
    setTimeout(() => {
      fn([{ isIntersecting: true }])
    }, 1000)
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
  root: null = null
  rootMargin: string = ''
  thresholds: number[] = []
}

// 模拟 ResizeObserver
// @ts-ignore
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// 模拟 getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: string) => {
      return {
        'font-size': '16px',
        'font-family': 'Arial',
        color: 'rgb(0, 0, 0)',
        'background-color': 'rgb(255, 255, 255)',
        width: '100px',
        height: '100px',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        x: '0px',
        y: '0px'
      }[prop] || ''
    }
  })
})

// 模拟 Element.prototype.getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0
  })
}))
