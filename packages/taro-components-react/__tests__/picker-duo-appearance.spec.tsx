import Taro from '@tarojs/taro'
import { act, cleanup, renderHook } from '@testing-library/react'

import { acquireAppearance, useDuoSheetLayout } from '../src/components/picker/duo-layout'

interface SharedAppearanceState {
  stack: Array<{ id: number, color: string }>
  seq: number
  applied: boolean
  restoreTimer?: ReturnType<typeof setTimeout>
  restoreAttempts?: number
}

const shared = (globalThis as any).__JD_DUO_DIALOG_APPEARANCE__ as SharedAppearanceState
const nativeApi = jest.fn()
const taro = Taro as any
const info = {
  platform: 'ios',
  foldState: 'fullyOpen',
  deviceOrientation: 'landscape',
  windowWidth: 800,
  windowHeight: 600,
  screenWidth: 800,
  lengthScaleRatio: 1
}

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(0)
  shared.stack.length = 0
  shared.seq = 0
  shared.applied = false
  shared.restoreTimer = undefined
  shared.restoreAttempts = 0
  nativeApi.mockReset().mockReturnValue(true)
  taro.JDNavigationBar = { setIOSDialogAppearanceSync: nativeApi }
  taro.getSystemInfoSync.mockReset().mockReturnValue({ ...info })
  taro.useResize.mockClear()
})

afterEach(() => {
  cleanup()
  jest.clearAllTimers()
  jest.useRealTimers()
  delete taro.JDNavigationBar
})

describe('Picker shared native appearance recovery', () => {
  it.each(['false', 'truthy', 'throw', 'missing'])('首次开启%s不恢复，也不重试 active:true；release 幂等', (failure) => {
    if (failure === 'missing') delete taro.JDNavigationBar
    else if (failure === 'throw') nativeApi.mockImplementation(() => { throw new Error('native failure') })
    else nativeApi.mockReturnValue(failure === 'truthy' ? 1 : false)
    const handle = acquireAppearance('#00000099')
    expect(shared.applied).toBe(false)
    handle.release()
    handle.release()
    jest.advanceTimersByTime(1000)
    expect(nativeApi).toHaveBeenCalledTimes(failure === 'missing' ? 0 : 1)
    expect(shared.restoreTimer).toBeUndefined()
  })

  it.each(['false', 'throw'])('改色%s后保留成功标记，最后关闭仍恢复', (failure) => {
    const handle = acquireAppearance('#00000099')
    if (failure === 'throw') nativeApi.mockImplementationOnce(() => { throw new Error('native failure') })
    else nativeApi.mockReturnValueOnce(false)
    handle.update('#141414B3')
    expect(shared.applied).toBe(true)
    expect(shared.restoreTimer).toBeUndefined()
    jest.advanceTimersByTime(1000)
    expect(nativeApi).toHaveBeenCalledTimes(2)
    handle.release()
    expect(nativeApi).toHaveBeenLastCalledWith({ active: false })
    expect(shared.applied).toBe(false)
    expect(shared.restoreAttempts).toBe(0)
  })

  it('恢复失败后250ms重试成功；成功才清applied与重试计数', () => {
    const handle = acquireAppearance('#00000099')
    nativeApi.mockReturnValueOnce(false)
    handle.release()
    expect(shared.applied).toBe(true)
    expect(shared.restoreAttempts).toBe(1)
    expect(shared.restoreTimer).toBeDefined()
    jest.advanceTimersByTime(249)
    expect(nativeApi).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(1)
    expect(nativeApi).toHaveBeenCalledTimes(3)
    expect(nativeApi).toHaveBeenLastCalledWith({ active: false })
    expect(shared.applied).toBe(false)
    expect(shared.restoreAttempts).toBe(0)
    expect(shared.restoreTimer).toBeUndefined()
    jest.advanceTimersByTime(1000)
    expect(nativeApi).toHaveBeenCalledTimes(3)
  })

  it.each(['false', 'throw', 'missing'])('恢复%s最多安排3次重试，耗尽保留applied', (failure) => {
    const handle = acquireAppearance('#00000099')
    if (failure === 'missing') delete taro.JDNavigationBar
    else if (failure === 'throw') nativeApi.mockImplementation(() => { throw new Error('native failure') })
    else nativeApi.mockReturnValue(false)
    handle.release()
    expect(shared.restoreAttempts).toBe(1)
    jest.advanceTimersByTime(1000)
    expect(shared.restoreAttempts).toBe(3)
    expect(shared.restoreTimer).toBeUndefined()
    expect(shared.applied).toBe(true)
    expect(nativeApi).toHaveBeenCalledTimes(failure === 'missing' ? 1 : 5)
    jest.advanceTimersByTime(1000)
    expect(nativeApi).toHaveBeenCalledTimes(failure === 'missing' ? 1 : 5)
    handle.release()
    expect(shared.restoreTimer).toBeUndefined()
  })

  it('API暂时缺失时仍重试，重新出现后恢复', () => {
    const handle = acquireAppearance('#00000099')
    delete taro.JDNavigationBar
    handle.release()
    expect(shared.restoreAttempts).toBe(1)
    taro.JDNavigationBar = { setIOSDialogAppearanceSync: nativeApi }
    jest.advanceTimersByTime(250)
    expect(nativeApi).toHaveBeenLastCalledWith({ active: false })
    expect(shared.applied).toBe(false)
  })

  it('新acquire取消已有恢复timer，重置次数，不恢复新浮层', () => {
    const first = acquireAppearance('#00000099')
    nativeApi.mockReturnValueOnce(false)
    first.release()
    expect(shared.restoreAttempts).toBe(1)
    const second = acquireAppearance('#141414B3')
    expect(shared.restoreTimer).toBeUndefined()
    expect(shared.restoreAttempts).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(nativeApi).toHaveBeenCalledTimes(3)
    expect(nativeApi).toHaveBeenLastCalledWith({ active: true, viewBackgroundColor: '#141414B3' })
    expect(shared.applied).toBe(true)
    second.release()
    expect(nativeApi).toHaveBeenLastCalledWith({ active: false })
    expect(shared.applied).toBe(false)
  })

  it('兼容旧共享状态缺少可选计数，恢复重试仍从1开始', () => {
    const handle = acquireAppearance('#00000099')
    delete shared.restoreAttempts
    nativeApi.mockReturnValueOnce(false)
    handle.release()
    expect(shared.restoreAttempts).toBe(1)
    jest.advanceTimersByTime(250)
    expect(shared.applied).toBe(false)
    expect(shared.restoreAttempts).toBe(0)
  })

  it('任何flush先取消其他包安排的恢复timer，栈非空时不恢复', () => {
    const handle = acquireAppearance('#00000099')
    const restore = jest.fn()
    shared.restoreTimer = setTimeout(restore, 250)
    handle.update('#141414B3')
    expect(shared.restoreTimer).toBeUndefined()
    jest.advanceTimersByTime(250)
    expect(restore).not.toHaveBeenCalled()
    expect(nativeApi).toHaveBeenLastCalledWith({ active: true, viewBackgroundColor: '#141414B3' })
    handle.release()
  })

  it('重试回调重新检查共享栈，其他包已加入时不调用恢复', () => {
    const handle = acquireAppearance('#00000099')
    nativeApi.mockReturnValueOnce(false)
    handle.release()
    shared.stack.push({ id: ++shared.seq, color: '#000000B3' })
    jest.advanceTimersByTime(250)
    expect(nativeApi).toHaveBeenCalledTimes(2)
    expect(shared.applied).toBe(true)
    expect(shared.restoreTimer).toBeUndefined()
  })

  it('共享栈叠加取栈顶，非最后一层关闭不恢复', () => {
    const picker = acquireAppearance('#00000099')
    // 模拟另一包以相同共享协议加入一层，不另建私有栈。
    const uiEntry = { id: ++shared.seq, color: '#000000B3' }
    shared.stack.push(uiEntry)
    picker.update('#141414B3')
    expect(nativeApi).toHaveBeenLastCalledWith({ active: true, viewBackgroundColor: '#000000B3' })
    picker.release()
    picker.release()
    expect(nativeApi).toHaveBeenCalledTimes(3)
    expect(shared.stack).toEqual([uiEntry])
    expect(shared.applied).toBe(true)
    expect(nativeApi.mock.calls.some(([options]) => options.active === false)).toBe(false)
  })
})

describe('Picker appearance settle polling', () => {
  it('125ms复读后窗口迟变且无resize，250ms巡检直接落位', () => {
    const { result } = renderHook(() => useDuoSheetLayout(true, '#00000099'))
    expect(result.current).toEqual({ left: '73.5px', width: '653px' })
    act(() => { jest.advanceTimersByTime(125) })
    taro.getSystemInfoSync.mockReturnValue({ ...info, windowWidth: 1000 })
    act(() => { jest.advanceTimersByTime(124) })
    expect(result.current?.left).toBe('73.5px')
    act(() => { jest.advanceTimersByTime(1) })
    expect(result.current).toEqual({ left: '173.5px', width: '653px' })
    expect(nativeApi).toHaveBeenCalledTimes(1)
  })

  it('500ms落定窗口结束后，巡检恢复正常250ms插值', () => {
    const { result } = renderHook(() => useDuoSheetLayout(true, '#00000099'))
    act(() => { jest.advanceTimersByTime(500) })
    taro.getSystemInfoSync.mockReturnValue({ ...info, windowWidth: 1000 })
    act(() => { jest.advanceTimersByTime(250) })
    expect(result.current?.left).toBe('73.5px')
    act(() => { jest.advanceTimersByTime(125) })
    const intermediate = parseFloat(result.current!.left as string)
    expect(intermediate).toBeGreaterThan(73.5)
    expect(intermediate).toBeLessThan(173.5)
    act(() => { jest.advanceTimersByTime(150) })
    expect(result.current?.left).toBe('173.5px')
  })

  it('卸载释放最后一层并清理布局巡检和125ms复读', () => {
    const { unmount } = renderHook(() => useDuoSheetLayout(true, '#00000099'))
    unmount()
    const reads = taro.getSystemInfoSync.mock.calls.length
    act(() => { jest.advanceTimersByTime(1000) })
    expect(taro.getSystemInfoSync).toHaveBeenCalledTimes(reads)
    expect(nativeApi).toHaveBeenLastCalledWith({ active: false })
    expect(shared.applied).toBe(false)
    expect(jest.getTimerCount()).toBe(0)
  })
})

describe('Picker native appearance does not expand interactive panel', () => {
  const screenInfo = { ...info, windowWidth: 867, screenWidth: 951, lengthScaleRatio: 0.929 }

  it('first frame and settling center on the business window, independent of native coverage', () => {
    taro.getSystemInfoSync.mockReturnValue(screenInfo)
    const { result } = renderHook(() => useDuoSheetLayout(true, '#00000099'))
    const center = () => parseFloat(result.current!.left as string) + parseFloat(result.current!.width as string) / 2
    expect(center()).toBeCloseTo(867 / 0.929 / 2)
    act(() => { jest.advanceTimersByTime(125) })
    expect(center()).toBeCloseTo(867 / 0.929 / 2)
    taro.getSystemInfoSync.mockReturnValue({ ...screenInfo, foldState: 'halfOpen' })
    act(() => { jest.advanceTimersByTime(125) })
    expect(result.current).toEqual({ left: '0px', width: '511px' })
    act(() => { jest.advanceTimersByTime(500) })
    taro.getSystemInfoSync.mockReturnValue(screenInfo)
    act(() => { jest.advanceTimersByTime(250) })
    act(() => { jest.advanceTimersByTime(300) })
    expect(center()).toBeCloseTo(867 / 0.929 / 2)
  })

  it('API failure leaves original window center unchanged', () => {
    taro.getSystemInfoSync.mockReturnValue(screenInfo)
    nativeApi.mockReturnValue(false)
    const { result } = renderHook(() => useDuoSheetLayout(true, '#00000099'))
    expect(parseFloat(result.current!.left as string) + parseFloat(result.current!.width as string) / 2).toBeCloseTo(867 / 0.929 / 2)
  })

  it('reopen uses current business center directly instead of old half-open location', () => {
    taro.getSystemInfoSync.mockReturnValue({ ...screenInfo, foldState: 'halfOpen' })
    const { result, rerender } = renderHook(({ active }) => useDuoSheetLayout(active, '#00000099'), { initialProps: { active: true } })
    expect(result.current?.width).toBe('511px')
    rerender({ active: false })
    taro.getSystemInfoSync.mockReturnValue(screenInfo)
    rerender({ active: true })
    expect(parseFloat(result.current!.left as string) + parseFloat(result.current!.width as string) / 2).toBeCloseTo(867 / 0.929 / 2)
  })
})

describe('Picker native mask and business panel are independent', () => {
  it.each(['closed', 'fullyOpen', 'halfOpen'])('%s窄窗口即使覆盖成功，也不扩宽面板', (foldState) => {
    taro.getSystemInfoSync.mockReturnValue({ ...info, foldState, windowWidth: 400, screenWidth: 951, lengthScaleRatio: 0.929 })
    const { result } = renderHook(() => useDuoSheetLayout(true, '#00000099'))
    expect(nativeApi).toHaveBeenCalledWith({ active: true, viewBackgroundColor: '#00000099' })
    expect(parseFloat(result.current!.left as string)).toBe(0)
    expect(parseFloat(result.current!.width as string)).toBeCloseTo(400 / 0.929)
    act(() => jest.advanceTimersByTime(500))
    expect(parseFloat(result.current!.width as string)).toBeCloseTo(400 / 0.929)
  })
})
