import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { TaroWindow } from '../../src/bom/window'
import { CONTEXT_ACTIONS } from '../../src/constants'

// 模拟相关依赖
vi.mock('../../src/env', () => ({
  default: {
    document: {},
    window: globalThis
  }
}))

vi.mock('@tarojs/shared', () => ({
  isString: (val: any) => typeof val === 'string',
  Events: class Events {
    private events: { [key: string]: Array<{ callback: (...args: any[]) => any, ctx: any }> } = {}

    on(event: string, callback: (...args: any[]) => any, ctx: any) {
      if (!this.events[event]) this.events[event] = []
      this.events[event].push({ callback, ctx })
    }

    off(event: string, callback: (...args: any[]) => any, ctx: any) {
      if (!this.events[event]) return
      this.events[event] = this.events[event].filter(
        item => item.callback !== callback || item.ctx !== ctx
      )
    }

    trigger(event: string, ...args: any[]) {
      if (!this.events[event]) return
      this.events[event].forEach(({ callback, ctx }) => {
        callback.apply(ctx, args)
      })
    }
  },
  hooks: {
    call: vi.fn().mockReturnValue({})
  }
}))

vi.mock('../../src/bom/history', () => ({
  History: class MockHistory {
    trigger = vi.fn()
  }
}))

vi.mock('../../src/bom/location', () => ({
  Location: class MockLocation {
    trigger = vi.fn()
  }
}))

vi.mock('../../src/bom/navigator', () => ({
  nav: {
    userAgent: 'Taro'
  }
}))

vi.mock('../../src/bom/raf', () => ({
  raf: vi.fn(),
  caf: vi.fn()
}))

vi.mock('../../src/bom/getComputedStyle', () => ({
  taroGetComputedStyleProvider: vi.fn()
}))

describe('TaroWindow', () => {
  let window: TaroWindow

  beforeEach(() => {
    vi.clearAllMocks()
    window = new TaroWindow()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('应该正确初始化 TaroWindow 实例', () => {
    expect(window).toBeInstanceOf(TaroWindow)
    expect(window.navigator).toBeDefined()
    expect(window.location).toBeDefined()
    expect(window.history).toBeDefined()
  })

  test('应该包含必要的属性和方法', () => {
    expect(window.requestAnimationFrame).toBeDefined()
    expect(window.cancelAnimationFrame).toBeDefined()
    expect(window.getComputedStyle).toBeDefined()
    expect(window.Date).toBe(Date)
    expect(window.navigator).toEqual({ userAgent: 'Taro' })
  })

  test('应该正确处理 addEventListener', () => {
    const callback = vi.fn()
    const event = 'test-event'

    window.addEventListener(event, callback)

    // 触发事件验证监听器是否正确注册
    window.trigger(event, 'test-data')
    expect(callback).toHaveBeenCalledWith('test-data')
  })

  test('应该正确处理 removeEventListener', () => {
    const callback = vi.fn()
    const event = 'test-event'

    window.addEventListener(event, callback)
    window.removeEventListener(event, callback)

    // 触发事件验证监听器是否被移除
    window.trigger(event, 'test-data')
    expect(callback).not.toHaveBeenCalled()
  })

  test('addEventListener 应该忽略非字符串事件名', () => {
    const callback = vi.fn()

    // @ts-ignore 故意传入非字符串类型进行测试
    window.addEventListener(123, callback)
    // @ts-ignore 故意传入非字符串类型进行测试
    window.addEventListener(null, callback)
    // @ts-ignore 故意传入非字符串类型进行测试
    window.addEventListener(undefined, callback)

    expect(callback).not.toHaveBeenCalled()
  })

  test('removeEventListener 应该忽略非字符串事件名', () => {
    const callback = vi.fn()

    // @ts-ignore 故意传入非字符串类型进行测试
    window.removeEventListener(123, callback)
    // @ts-ignore 故意传入非字符串类型进行测试
    window.removeEventListener(null, callback)
    // @ts-ignore 故意传入非字符串类型进行测试
    window.removeEventListener(undefined, callback)

    expect(callback).not.toHaveBeenCalled()
  })

  test('应该正确处理 setTimeout', () => {
    // 验证 setTimeout 方法存在并可以调用
    expect(typeof window.setTimeout).toBe('function')

    const callback = vi.fn()
    const delay = 1000
    const result = window.setTimeout(callback, delay)

    // 验证返回值存在，在不同环境下可能是数字或对象
    expect(result).toBeDefined()
    expect(result).not.toBeNull()

    // 清理定时器
    clearTimeout(result)
  })

  test('应该正确处理 clearTimeout', () => {
    // 验证 clearTimeout 方法存在并可以调用
    expect(typeof window.clearTimeout).toBe('function')

    const callback = vi.fn()
    const timeoutId = window.setTimeout(callback, 1000)

    // 应该能够清除定时器而不抛出错误
    expect(() => window.clearTimeout(timeoutId)).not.toThrow()
  })

  test('应该正确处理 document 属性', () => {
    expect(window.document).toBeDefined()
  })

  test('应该正确初始化事件监听', () => {
    // 验证是否为各种页面上下文动作设置了事件监听
    const pageId = 'test-page-id'

    // 触发 INIT 事件
    window.trigger(CONTEXT_ACTIONS.INIT, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.INIT, pageId)

    // 触发 RECOVER 事件
    window.trigger(CONTEXT_ACTIONS.RECOVER, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RECOVER, pageId)
    expect(window.history.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RECOVER, pageId)

    // 触发 RESTORE 事件
    window.trigger(CONTEXT_ACTIONS.RESTORE, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RESTORE, pageId)
    expect(window.history.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RESTORE, pageId)

    // 触发 DESTROY 事件
    window.trigger(CONTEXT_ACTIONS.DESTROY, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.DESTROY, pageId)
    expect(window.history.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.DESTROY, pageId)
  })

  test('应该处理全局属性复制时的错误', () => {
    // 模拟 console.warn
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // 模拟一个会抛出错误的全局属性
    Object.defineProperty(globalThis, 'errorProperty', {
      get() {
        throw new Error('Test error')
      },
      configurable: true
    })

    // 创建新的 TaroWindow 实例来触发属性复制
    const testWindow = new TaroWindow()
    expect(testWindow).toBeInstanceOf(TaroWindow)

    // 在生产环境下不会打印警告
    if (process.env.NODE_ENV !== 'production') {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Taro warn] window.errorProperty 在赋值到 window 时报错')
      )
    }

    // 清理
    delete globalThis.errorProperty
    consoleSpy.mockRestore()
  })

  test('应该跳过特定的全局属性', () => {
    // 模拟包含 atob 和 document 属性的全局对象
    const originalAtob = globalThis.atob
    const originalDocument = globalThis.document

    globalThis.atob = vi.fn() as any
    globalThis.document = {} as any

    const newWindow = new TaroWindow()

    // 验证这些属性没有被复制到 window 上（除非已经存在）
    expect(newWindow.hasOwnProperty('atob')).toBe(false)
    // document 通过 getter 处理，所以应该有值
    expect(newWindow.document).toBeDefined()

    // 恢复原始值
    if (originalAtob !== undefined) {
      globalThis.atob = originalAtob
    } else {
      // @ts-ignore 删除属性
      delete globalThis.atob
    }
    if (originalDocument !== undefined) {
      globalThis.document = originalDocument
    } else {
      // @ts-ignore 删除属性
      delete globalThis.document
    }
  })

  test('应该正确设置 Date 构造函数', () => {
    expect(window.Date).toBe(Date)

    // 测试当 Date 不存在时的情况
    const newWindow = new TaroWindow()
    // @ts-ignore 删除属性进行测试
    delete newWindow.Date
    // 重新执行构造函数中的 Date 设置逻辑
    newWindow.Date ||= Date
    expect(newWindow.Date).toBe(Date)
  })

  test('应该支持链式事件监听', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    const event = 'chain-test'

    window.addEventListener(event, callback1)
    window.addEventListener(event, callback2)

    window.trigger(event, 'test-data')

    expect(callback1).toHaveBeenCalledWith('test-data')
    expect(callback2).toHaveBeenCalledWith('test-data')
  })

  test('应该正确处理 XMLHttpRequest 属性', () => {
    // XMLHttpRequest 是可选的
    expect(window.XMLHttpRequest).toBeUndefined()

    // 可以手动设置
    const mockXHR = {} as Partial<XMLHttpRequest>
    window.XMLHttpRequest = mockXHR
    expect(window.XMLHttpRequest).toBe(mockXHR)
  })

  test('应该正确复制全局属性', () => {
    // 在全局对象上设置一个测试属性
    const testProperty = 'testValue'
    globalThis.testGlobalProperty = testProperty

    // 创建新的 TaroWindow 实例
    const newWindow = new TaroWindow()

    // 验证属性被正确复制
    expect((newWindow as any).testGlobalProperty).toBe(testProperty)

    // 清理
    delete globalThis.testGlobalProperty
  })

  test('应该正确处理 Symbol 属性', () => {
    // 创建一个 Symbol 属性
    const testSymbol = Symbol('test')
    globalThis[testSymbol] = 'symbolValue'

    // 创建新的 TaroWindow 实例
    const newWindow = new TaroWindow()

    // 验证 Symbol 属性被处理
    expect((newWindow as any)[testSymbol]).toBe('symbolValue')

    // 清理
    delete globalThis[testSymbol]
  })

  test('应该正确处理事件上下文', () => {
    const callback = vi.fn()
    const context = { name: 'test-context' }

    // 使用自定义上下文添加监听器
    window.on('test-context-event', callback, context)

    // 触发事件
    window.trigger('test-context-event', 'data')

    // 验证回调被调用
    expect(callback).toHaveBeenCalledWith('data')
  })

  test('应该正确处理多个相同事件的监听器', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    const event = 'multi-listener-test'

    window.addEventListener(event, callback1)
    window.addEventListener(event, callback2)

    window.trigger(event, 'test-data')

    expect(callback1).toHaveBeenCalledWith('test-data')
    expect(callback2).toHaveBeenCalledWith('test-data')

    // 移除一个监听器
    window.removeEventListener(event, callback1)
    window.trigger(event, 'test-data-2')

    // 第一个监听器不应该再被调用
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(2)
  })

  test('应该正确处理页面生命周期事件的级联', () => {
    const pageId = 'test-lifecycle-page'

    // 测试完整的页面生命周期
    window.trigger(CONTEXT_ACTIONS.INIT, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.INIT, pageId)

    window.trigger(CONTEXT_ACTIONS.RECOVER, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RECOVER, pageId)
    expect(window.history.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RECOVER, pageId)

    window.trigger(CONTEXT_ACTIONS.RESTORE, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RESTORE, pageId)
    expect(window.history.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.RESTORE, pageId)

    window.trigger(CONTEXT_ACTIONS.DESTROY, pageId)
    expect(window.location.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.DESTROY, pageId)
    expect(window.history.trigger).toHaveBeenCalledWith(CONTEXT_ACTIONS.DESTROY, pageId)
  })

  test('应该继承 Events 类的所有方法', () => {
    // 验证 TaroWindow 具有 Events 类的方法
    expect(typeof window.on).toBe('function')
    expect(typeof window.off).toBe('function')
    expect(typeof window.trigger).toBe('function')
  })

  test('应该正确处理不存在的事件移除', () => {
    const callback = vi.fn()

    // 尝试移除不存在的事件监听器，应该不会抛出错误
    expect(() => {
      window.removeEventListener('non-existent-event', callback)
    }).not.toThrow()
  })
})
