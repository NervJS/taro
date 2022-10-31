import { HOOK_TYPE, TaroHook, TaroHooks } from '../src/runtime-hooks'
import { mergeReconciler } from '../src/utils'

describe('taro hooks', () => {
  let hook: TaroHooks

  beforeAll(() => {
    hook = new TaroHooks({
      hookA: TaroHook(HOOK_TYPE.SINGLE),
      hookAWithDefault: TaroHook(HOOK_TYPE.SINGLE, function (name) { return 'name: ' + name }),
      hookB: TaroHook(HOOK_TYPE.MULTI),
      hookC: TaroHook(HOOK_TYPE.WATERFALL)
    })
  })

  it('single', () => {
    hook.tap('hookA', () => {
      return 'first'
    })
    hook.tap('hookA', () => {
      return 'second'
    })
    const res = hook.call('hookA')
    expect(res).toBe('second')
  })

  it('single with default', () => {
    let res = hook.call('hookAWithDefault', 'Ben')
    expect(res).toBe('name: Ben')
    hook.tap('hookAWithDefault', (name) => {
      return name
    })
    res = hook.call('hookAWithDefault', 'JoJo')
    expect(res).toBe('JoJo')
  })

  it('multi', () => {
    const fnA = jest.fn()
    const fnB = jest.fn()
    hook.tap('hookB', fnA)
    hook.tap('hookB', fnB)
    hook.call('hookB')
    expect(fnA).toBeCalled()
    expect(fnB).toBeCalled()
  })

  it('multi default', () => {
    const fnA = jest.fn()
    const fnB = jest.fn()
    const fnC = jest.fn()
    const hook = new TaroHooks({
      hookBWithDefault: TaroHook(HOOK_TYPE.MULTI, fnA)
    })
    hook.tap('hookBWithDefault', fnB)
    hook.tap('hookBWithDefault', fnC)
    hook.call('hookBWithDefault')
    expect(fnA).toBeCalledTimes(0)
    expect(fnB).toBeCalled()
    expect(fnC).toBeCalled()
  })

  it('waterfall', () => {
    hook.tap('hookC', (obj) => {
      obj.num += 1
      return obj
    })
    hook.tap('hookC', (obj) => {
      obj.num += 2
      return obj
    })
    hook.tap('hookC', (obj) => {
      obj.num += 3
      return obj
    })
    const res = hook.call('hookC', { num: 10 })
    expect(res).toEqual({ num: 16 })
  })

  it('plugin', () => {
    // shared
    const hooks = new TaroHooks({
      hookA: TaroHook(HOOK_TYPE.SINGLE, () => 'default'),
      hookB: TaroHook(HOOK_TYPE.MULTI),
      hookC: TaroHook(HOOK_TYPE.WATERFALL)
    })

    // pluginA
    const fnA = jest.fn()
    const reconcilerA = {
      hookA: () => 'pluginA',
      hookB: fnA,
      hookC: [n => n + 1, n => n + 2]
    }
    mergeReconciler(reconcilerA, hooks)

    // pluginB
    const fnB = jest.fn()
    const reconcilerB = {
      hookA: () => 'pluginB',
      hookB: fnB,
      hookC: [n => n + 3, n => n + 4]
    }
    mergeReconciler(reconcilerB, hooks)

    // runtime
    const resA = hooks.call('hookA')
    hooks.call('hookB')
    const resC = hooks.call('hookC', 0)

    expect(resA).toBe('pluginB')
    expect(fnA).toBeCalled()
    expect(fnB).toBeCalled()
    expect(resC).toBe(10)
  })
})
