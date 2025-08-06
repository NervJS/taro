import '@testing-library/jest-dom'

/* eslint-disable react/display-name */

// 设置环境变量
process.env.TARO_ENV = 'h5'
process.env.TARO_PLATFORM = 'web'
process.env.SUPPORT_TARO_POLYFILL = 'disabled'

// Mock Taro 组件
// eslint-disable-next-line react/display-name
jest.mock('@tarojs/components', () => {
  const React = require('react')
  const MockView = React.forwardRef((props: any, ref: any) => {
    const { children, ...restProps } = props
    return React.createElement('div', { ...restProps, ref }, children)
  })
  MockView.displayName = 'MockView'

  const MockScrollView = React.forwardRef((props: any, ref: any) => {
    const {
      children,
      onScroll,
      onTouchStart,
      onScrollEnd,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scrollY,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      showScrollbar,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scrollTop,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scrollWithAnimation,
      ...restProps
    } = props
    return React.createElement('div', {
      ...restProps,
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
        ...restProps.style
      }
    }, children)
  })
  MockScrollView.displayName = 'MockScrollView'

  return {
    View: MockView,
    ScrollView: MockScrollView,
    Text: (() => {
      const MockText = React.forwardRef((props: any, ref: any) => {
        const { children, ...restProps } = props
        return React.createElement('span', { ...restProps, ref }, children)
      })
      MockText.displayName = 'MockText'
      return MockText
    })(),
    Button: (() => {
      const MockButton = React.forwardRef((props: any, ref: any) => {
        const { children, ...restProps } = props
        return React.createElement('button', { ...restProps, ref }, children)
      })
      MockButton.displayName = 'MockButton'
      return MockButton
    })(),
    Input: (() => {
      const MockInput = React.forwardRef((props: any, ref: any) => {
        const { ...restProps } = props
        return React.createElement('input', { ...restProps, ref })
      })
      MockInput.displayName = 'MockInput'
      return MockInput
    })(),
    Textarea: (() => {
      const MockTextarea = React.forwardRef((props: any, ref: any) => {
        const { children, ...restProps } = props
        return React.createElement('textarea', { ...restProps, ref }, children)
      })
      MockTextarea.displayName = 'MockTextarea'
      return MockTextarea
    })(),
    Image: (() => {
      const MockImage = React.forwardRef((props: any, ref: any) => {
        const { ...restProps } = props
        return React.createElement('img', { ...restProps, ref })
      })
      MockImage.displayName = 'MockImage'
      return MockImage
    })(),
    Form: (() => {
      const MockForm = React.forwardRef((props: any, ref: any) => {
        const { children, ...restProps } = props
        return React.createElement('form', { ...restProps, ref }, children)
      })
      MockForm.displayName = 'MockForm'
      return MockForm
    })(),
    Label: (() => {
      const MockLabel = React.forwardRef((props: any, ref: any) => {
        const { children, ...restProps } = props
        return React.createElement('label', { ...restProps, ref }, children)
      })
      MockLabel.displayName = 'MockLabel'
      return MockLabel
    })(),
    Picker: (() => {
      const MockPicker = React.forwardRef((props: any, ref: any) => {
        const { children, ...restProps } = props
        return React.createElement('div', { ...restProps, ref }, children)
      })
      MockPicker.displayName = 'MockPicker'
      return MockPicker
    })(),
    Switch: (() => {
      const MockSwitch = React.forwardRef((props: any, ref: any) => {
        const { ...restProps } = props
        return React.createElement('input', { type: 'checkbox', ...restProps, ref })
      })
      MockSwitch.displayName = 'MockSwitch'
      return MockSwitch
    })(),
    Slider: (() => {
      const MockSlider = React.forwardRef((props: any, ref: any) => {
        const { ...restProps } = props
        return React.createElement('input', { type: 'range', ...restProps, ref })
      })
      MockSlider.displayName = 'MockSlider'
      return MockSlider
    })(),
    Radio: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('input', { type: 'radio', ...restProps, ref }, children)
    }),
    RadioGroup: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Checkbox: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('input', { type: 'checkbox', ...restProps, ref }, children)
    }),
    CheckboxGroup: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Progress: React.forwardRef((props: any, ref: any) => {
      const { ...restProps } = props
      return React.createElement('progress', { ...restProps, ref })
    }),
    RichText: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    MovableArea: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    MovableView: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Swiper: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    SwiperItem: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Navigator: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('a', { ...restProps, ref }, children)
    }),
    Audio: React.forwardRef((props: any, ref: any) => {
      const { ...restProps } = props
      return React.createElement('audio', { ...restProps, ref })
    }),
    Video: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('video', { ...restProps, ref }, children)
    }),
    Camera: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    LivePlayer: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    LivePusher: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Map: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Canvas: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('canvas', { ...restProps, ref }, children)
    }),
    OpenData: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    WebView: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('iframe', { ...restProps, ref }, children)
    }),
    Ad: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    OfficialAccount: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    CoverView: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    CoverImage: React.forwardRef((props: any, ref: any) => {
      const { ...restProps } = props
      return React.createElement('img', { ...restProps, ref })
    }),
    FunctionalPageNavigator: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    AdContent: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    MatchMedia: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    PageContainer: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    ShareElement: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    KeyboardAccessory: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    RootPortal: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    PageMeta: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    NavigationBar: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Block: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Import: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Include: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Template: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Slot: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    NativeSlot: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    CustomWrapper: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    Editor: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    VoipRoom: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    }),
    AdCustom: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement('div', { ...restProps, ref }, children)
    })
  }
})

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
