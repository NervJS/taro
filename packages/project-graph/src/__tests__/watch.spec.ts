/**
 * watch 层单元测试：mock chokidar，确定性驱动 add/change/ready/error 事件。
 *
 * 不依赖真实文件系统事件——那在 macOS 无 fsevents / jest 多进程下时序不可靠，
 * 且会变成「测 chokidar」而非测本库逻辑。本库在监听层的自有逻辑是：ready 门控、
 * 防抖合批、onChange 回调、close 清理、error 吞掉不崩。这些用假 watcher 精确验证。
 */
import { EventEmitter } from 'node:events'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createProjectGraph } from '../graph'
import { startWatch } from '../watch'

// 假 chokidar watcher：EventEmitter + close()，可手动 emit 事件。
class FakeWatcher extends EventEmitter {
  closed = false
  close = jest.fn(async () => {
    this.closed = true
  })
}

let fakeWatcher: FakeWatcher
const watchMock = jest.fn(() => fakeWatcher)

// 只覆盖 chokidar，保留 helper 其余真实导出（readConfig / resolveScriptPath 等，
// config/页面解析依赖它们）。否则 config 解析会因 readConfig 变 undefined 而全废。
jest.mock('@tarojs/helper', () => ({
  ...jest.requireActual('@tarojs/helper'),
  chokidar: { watch: (...args: unknown[]) => watchMock(...args) },
}))

describe('startWatch — 监听层逻辑（mock chokidar）', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    fakeWatcher = new FakeWatcher()
    watchMock.mockClear()
  })
  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  test('监听源码目录与 config/，屏蔽 node_modules', () => {
    startWatch('/proj', '/proj/src', () => {})
    expect(watchMock).toHaveBeenCalledTimes(1)
    const [paths, opts] = watchMock.mock.calls[0] as [string[], { ignoreInitial: boolean, ignored: RegExp }]
    expect(paths).toEqual(['/proj/src', '/proj/config'])
    expect(opts.ignoreInitial).toBe(true)
    expect(opts.ignored.test('/proj/src/node_modules/x')).toBe(true)
  })

  test('extraPaths（package/lock）追加在 src + config/ 之后', () => {
    startWatch('/proj', '/proj/src', () => {}, ['/proj/package.json', '/proj/pnpm-lock.yaml'])
    const [paths] = watchMock.mock.calls[0] as [string[]]
    // src + config/ 恒在前（既有契约），额外文件追加在后。
    expect(paths).toEqual(['/proj/src', '/proj/config', '/proj/package.json', '/proj/pnpm-lock.yaml'])
  })

  test('ready 前的变更被缓冲，ready 时冲洗（不丢首个事件）', () => {
    const onChange = jest.fn()
    startWatch('/proj', '/proj/src', onChange)
    // ready 之前发生变更
    fakeWatcher.emit('add', '/proj/src/pages/new/index.tsx')
    fakeWatcher.emit('change', '/proj/src/app.config.ts')
    // 关键：ready 前即便推进超过防抖窗口也不触发——证明未排期（仅缓冲）。
    // 这条断言能区分"ready 门控"与旧实现（旧实现此处已排期，推进 100ms 就会触发）。
    jest.advanceTimersByTime(100)
    expect(onChange).not.toHaveBeenCalled()
    // ready 到来 → 冲洗
    fakeWatcher.emit('ready')
    jest.advanceTimersByTime(100)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(['/proj/src/pages/new/index.tsx', '/proj/src/app.config.ts'])
  })

  test('ready 后的多次变更在防抖窗口内合批为一次回调', () => {
    const onChange = jest.fn()
    startWatch('/proj', '/proj/src', onChange)
    fakeWatcher.emit('ready')
    fakeWatcher.emit('change', '/proj/src/a.tsx')
    fakeWatcher.emit('change', '/proj/src/b.tsx')
    jest.advanceTimersByTime(50) // 未到防抖阈值
    expect(onChange).not.toHaveBeenCalled()
    jest.advanceTimersByTime(50) // 满 100ms
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(['/proj/src/a.tsx', '/proj/src/b.tsx'])
  })

  test('间隔超过防抖窗口的变更分批回调', () => {
    const onChange = jest.fn()
    startWatch('/proj', '/proj/src', onChange)
    fakeWatcher.emit('ready')
    fakeWatcher.emit('change', '/proj/src/a.tsx')
    jest.advanceTimersByTime(100)
    fakeWatcher.emit('change', '/proj/src/b.tsx')
    jest.advanceTimersByTime(100)
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(1, ['/proj/src/a.tsx'])
    expect(onChange).toHaveBeenNthCalledWith(2, ['/proj/src/b.tsx'])
  })

  test('unlink 事件也触发回调', () => {
    const onChange = jest.fn()
    startWatch('/proj', '/proj/src', onChange)
    fakeWatcher.emit('ready')
    fakeWatcher.emit('unlink', '/proj/src/pages/old/index.tsx')
    jest.advanceTimersByTime(100)
    expect(onChange).toHaveBeenCalledWith(['/proj/src/pages/old/index.tsx'])
  })

  test('error 事件被吞掉，不抛出/不崩溃宿主', () => {
    startWatch('/proj', '/proj/src', () => {})
    // 有 'error' 监听者 → emit 不会 throw（否则 EventEmitter 会抛）
    expect(() => fakeWatcher.emit('error', new Error('EMFILE'))).not.toThrow()
  })

  test('close 清理待定防抖计时器并关闭 watcher', () => {
    const onChange = jest.fn()
    const w = startWatch('/proj', '/proj/src', onChange)
    fakeWatcher.emit('ready')
    fakeWatcher.emit('change', '/proj/src/a.tsx')
    w.close() // 冲洗前关闭
    jest.advanceTimersByTime(200)
    expect(onChange).not.toHaveBeenCalled() // 计时器已清，回调不再来
    expect(fakeWatcher.close).toHaveBeenCalledTimes(1)
  })
})

describe('createProjectGraph — onGraphChange 集成（mock chokidar 驱动）', () => {
  const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')
  let root: string

  beforeEach(() => {
    jest.useFakeTimers()
    fakeWatcher = new FakeWatcher()
    watchMock.mockClear()
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-wi-'))
    fs.cpSync(path.join(FIXTURE, 'src'), path.join(root, 'src'), { recursive: true })
    fs.cpSync(path.join(FIXTURE, 'package.json'), path.join(root, 'package.json'))
  })
  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    fs.rmSync(root, { recursive: true, force: true })
  })

  /** 驱动一次文件变更 → 防抖冲洗 → rebuild。改真实文件后 emit 事件。 */
  function triggerChange(): void {
    fs.mkdirSync(path.join(root, 'src/pages/added'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/pages/added/index.tsx'), 'export default function A(){ return <view/> }\n')
    const appConfig = path.join(root, 'src/app.config.ts')
    fs.writeFileSync(appConfig, fs.readFileSync(appConfig, 'utf8').replace(/pages:\s*\[/, "pages: [\n    'pages/added/index',"))
    fakeWatcher.emit('ready')
    fakeWatcher.emit('change', path.join(root, 'src/app.config.ts'))
    jest.advanceTimersByTime(100)
  }

  test('首个订阅惰性启动监听；变更触发回调且图已重建', () => {
    const q = createProjectGraph({ root })
    const before = q.getProjectGraph().pages.length
    const beforeRev = q.getProjectGraph().revision
    const listener = jest.fn()
    q.onGraphChange(listener)
    expect(watchMock).toHaveBeenCalledTimes(1) // 惰性启动

    triggerChange()
    expect(listener).toHaveBeenCalledTimes(1)
    const change = listener.mock.calls[0][0]
    expect(change.ok).toBe(true)
    expect(change.changedFiles.length).toBeGreaterThan(0)
    // 图在回调前已重建，revision 单调递增
    expect(q.getProjectGraph().pages.length).toBe(before + 1)
    expect(q.getProjectGraph().revision).toBe(beforeRev + 1)
    expect(change.revision).toBe(q.getProjectGraph().revision)
  })

  test('多 listener 都收到通知；单个 listener 抛错不影响其余', () => {
    const q = createProjectGraph({ root })
    const good = jest.fn()
    const bad = jest.fn(() => { throw new Error('listener boom') })
    q.onGraphChange(bad)
    q.onGraphChange(good)
    triggerChange()
    expect(bad).toHaveBeenCalledTimes(1)
    expect(good).toHaveBeenCalledTimes(1) // 抛错被隔离
  })

  test('退订后不再收到通知；最后一个退订关闭 watcher', () => {
    const q = createProjectGraph({ root })
    const listener = jest.fn()
    const unsub = q.onGraphChange(listener)
    unsub()
    expect(fakeWatcher.close).toHaveBeenCalledTimes(1) // 无订阅者 → 关闭
    triggerChange()
    expect(listener).not.toHaveBeenCalled()
  })

  test('rebuild 遇编辑中间态坏 app.config：不崩宿主（config 解析失败降级为空图+告警）', () => {
    const q = createProjectGraph({ root })
    const listener = jest.fn()
    q.onGraphChange(listener)
    // app.config 写成语法坏（模拟保存中间态）。readConfig 会抛，但被 config-parser
    // catch 成 parse-failed issue、降级空图——rebuild 正常完成、不崩宿主。
    fs.writeFileSync(path.join(root, 'src/app.config.ts'), 'export default { pages: [\n')
    fakeWatcher.emit('ready')
    fakeWatcher.emit('change', path.join(root, 'src/app.config.ts'))
    // rebuild 跑在防抖回调里；关键是不抛出（否则崩长驻宿主）
    expect(() => jest.advanceTimersByTime(100)).not.toThrow()
    // 通知照常发出，消费方能从 issues 看到解析失败信号
    expect(listener).toHaveBeenCalledTimes(1)
    const g = q.getProjectGraph()
    expect(g.issues.some((w) => w.kind === 'parse-failed')).toBe(true)
  })

  test('rebuild 真抛错：保留旧快照、发 ok:false 失败事件、不崩、revision 不递增', () => {
    const q = createProjectGraph({ root })
    const before = q.getProjectGraph()
    expect(before.pages.length).toBeGreaterThan(0)
    const listener = jest.fn()
    q.onGraphChange(listener)
    // 首次构建已完成；对 rebuild 的下一次 buildProjectGraph 强制抛非预期错误。graph.ts
    // 以模块属性方式调用 parseAppConfig（CJS interop），spyOn 可拦截。真实构建高度容错
    // （坏 config 降级为 issue 而非抛），故用 spy 精确制造"非预期异常"这一防御分支。
    const configParser = require('../config-parser') as { parseAppConfig: unknown }
    const spy = jest.spyOn(configParser as { parseAppConfig: () => unknown }, 'parseAppConfig')
      .mockImplementationOnce(() => { throw new Error('boom') })
    try {
      fakeWatcher.emit('ready')
      fakeWatcher.emit('change', path.join(root, 'src/app.config.ts'))
      expect(() => jest.advanceTimersByTime(100)).not.toThrow()
    } finally {
      spy.mockRestore()
    }
    expect(listener).toHaveBeenCalledTimes(1)
    const change = listener.mock.calls[0][0]
    expect(change.ok).toBe(false)
    expect(change.error).toContain('boom')
    // 保留旧快照：图与 revision 不变、宿主不崩（不暴露半成品）。
    expect(q.getProjectGraph()).toBe(before)
    expect(q.getProjectGraph().revision).toBe(before.revision)
  })

  test('删 src 目录：优雅降级为空图（ok:true），非失败分支、不崩宿主', () => {
    const q = createProjectGraph({ root })
    const listener = jest.fn()
    q.onGraphChange(listener)
    // 删 src → parseAppConfig 找不到 app.config，降级空图（不抛）→ 成功重建。
    fs.rmSync(path.join(root, 'src'), { recursive: true, force: true })
    fakeWatcher.emit('ready')
    fakeWatcher.emit('change', path.join(root, 'src/app.config.ts'))
    expect(() => jest.advanceTimersByTime(100)).not.toThrow()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].ok).toBe(true) // 降级空图仍是成功重建
    expect(q.getProjectGraph().pages).toEqual([])
  })

  test('dispose：停 watcher、清订阅者，幂等', () => {
    const q = createProjectGraph({ root })
    const listener = jest.fn()
    q.onGraphChange(listener)
    expect(watchMock).toHaveBeenCalledTimes(1)
    q.dispose()
    expect(fakeWatcher.close).toHaveBeenCalledTimes(1) // watcher 关闭
    // dispose 后变更不再通知（订阅者已清）
    triggerChange()
    expect(listener).not.toHaveBeenCalled()
    // 幂等：再次 dispose 不抛、不重复关闭
    expect(() => q.dispose()).not.toThrow()
    expect(fakeWatcher.close).toHaveBeenCalledTimes(1)
  })

  test('监听目标含 root package.json（装包触发重建的前提）', () => {
    createProjectGraph({ root }).onGraphChange(() => {})
    const [paths] = watchMock.mock.calls[0] as [string[]]
    expect(paths).toContain(path.join(root, 'package.json'))
  })
})

