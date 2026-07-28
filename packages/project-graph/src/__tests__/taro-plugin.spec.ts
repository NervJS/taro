/**
 * @tarojs/project-graph — Taro 插件入口测试
 *
 * 用最小 fake ctx 模拟 Taro 注入的插件上下文(捕获 onBuildStart 回调与
 * registerCommand),配 mini-app fixture 走真实 createProjectGraph 解析。
 * 不 mock createProjectGraph——验证插件确实建出真实图。
 *
 * Kernel 由 fake 提供:ctx 是 Plugin 层,ctx.ctx 是 Kernel。fixture 无平台
 * 插件,故 platforms 为 []、pages 由静态解析得到(验证图真实产出,而非平台注入)。
 */

import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import projectGraphPlugin, { PROJECT_GRAPH_KERNEL_KEY } from '../taro-plugin'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

/** 命令定义的最小形状(对齐 Taro ICommand 本测试用到的字段)。 */
interface ICommandLike {
  name: string
  optionsMap?: Record<string, string>
  synopsisList?: string[]
  fn: () => void
}

/** fake 插件 ctx 的最小形状。 */
interface IFakeCtx {
  appPath: string
  ctx: Record<string, unknown>
  runOpts: { options: Record<string, unknown> }
  onBuildStart: (fn: () => void) => void
  registerCommand: (cmd: ICommandLike) => void
}

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-plugin-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  return tmp
}

/**
 * 构造最小 fake 插件 ctx。模拟 Taro Plugin 层:
 *  - onBuildStart(fn):存回调,测试手动触发
 *  - registerCommand(cmd):存命令
 *  - appPath / ctx(Kernel)/ runOpts 经 Proxy 白名单直达,这里直接平铺
 */
function makeFakeCtx(root: string, runOptions: Record<string, unknown> = {}) {
  const buildStartCallbacks: Array<() => void> = []
  const commands: ICommandLike[] = []
  // fake Kernel:fixture 无平台插件,注册表留空,createProjectGraph 仍可注入(platforms=[])
  const kernel: Record<string, unknown> = {
    appPath: root,
    initialConfig: { sourceRoot: 'src', alias: {} },
    plugins: new Map(),
    hooks: new Map(),
    commands: new Map(),
    platforms: new Map(),
    runOpts: { options: runOptions },
  }
  const ctx: IFakeCtx = {
    appPath: root,
    ctx: kernel,
    runOpts: { options: runOptions },
    onBuildStart: (fn: () => void) => { buildStartCallbacks.push(fn) },
    registerCommand: (cmd: ICommandLike) => { commands.push(cmd) },
  }
  return { ctx, kernel, buildStartCallbacks, commands }
}

describe('projectGraphPlugin（Taro 插件入口）', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('插件函数正常调用、不抛,注册 onBuildStart 与 graph 命令', () => {
    const { ctx, buildStartCallbacks, commands } = makeFakeCtx(root)
    expect(() => projectGraphPlugin(ctx)).not.toThrow()
    expect(buildStartCallbacks.length).toBe(1)
    expect(commands.map((c) => c.name)).toEqual(['graph'])
  })

  test('graph 命令带 optionsMap 与 synopsisList', () => {
    const { ctx, commands } = makeFakeCtx(root)
    projectGraphPlugin(ctx)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    expect(graphCmd.optionsMap).toHaveProperty('--json')
    expect(graphCmd.optionsMap).toHaveProperty('--route')
    expect(Array.isArray(graphCmd.synopsisList)).toBe(true)
  })

  test('onBuildStart 触发后 kernel 上挂载了图实例', () => {
    const { ctx, kernel, buildStartCallbacks } = makeFakeCtx(root)
    projectGraphPlugin(ctx)
    expect(kernel[PROJECT_GRAPH_KERNEL_KEY]).toBeUndefined()
    // 手动触发 build 钩子
    buildStartCallbacks[0]()
    const query = kernel[PROJECT_GRAPH_KERNEL_KEY] as { getProjectGraph: () => { pages: unknown[] } }
    expect(query).toBeDefined()
    const graph = query.getProjectGraph()
    // mini-app fixture 有 2 个页面 —— 验证真实建图,而非空壳
    expect(graph.pages.length).toBe(2)
  })

  test('graph 命令 --json 输出可解析的完整图', () => {
    const { ctx, commands } = makeFakeCtx(root, { json: true })
    projectGraphPlugin(ctx)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn()
    expect(spy).toHaveBeenCalledTimes(1)
    const printed = spy.mock.calls[0][0] as string
    const graph = JSON.parse(printed)
    expect(graph.schemaVersion).toBe('1.0.0')
    expect(graph.pages.map((p: { id: string }) => p.id).sort()).toEqual([
      'pages/detail/index',
      'pages/index/index',
    ])
    spy.mockRestore()
  })

  test('graph 命令 --route 命中输出页面详情', () => {
    const { ctx, commands } = makeFakeCtx(root, { route: '/pages/detail/index' })
    projectGraphPlugin(ctx)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn()
    const printed = spy.mock.calls[0][0] as string
    expect(printed).toContain('pages/detail/index')
    spy.mockRestore()
  })

  test('graph 命令无参数输出概览文本', () => {
    const { ctx, commands } = makeFakeCtx(root)
    projectGraphPlugin(ctx)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn()
    const printed = spy.mock.calls[0][0] as string
    expect(printed).toContain('framework: react')
    expect(printed).toContain('pages/index/index')
    spy.mockRestore()
  })

  test('graph 命令 --route 未命中:明确提示', () => {
    const { ctx, commands } = makeFakeCtx(root, { route: '/pages/nope/index' })
    projectGraphPlugin(ctx)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn()
    const printed = spy.mock.calls[0][0] as string
    expect(printed).toContain('未找到对应页面')
    spy.mockRestore()
  })

  test('onBuildStart 已建图后,命令 fn 复用同一实例(不重复建图)', () => {
    const { ctx, kernel, buildStartCallbacks, commands } = makeFakeCtx(root)
    projectGraphPlugin(ctx)
    buildStartCallbacks[0]() // build 先建图并挂载
    const built = kernel[PROJECT_GRAPH_KERNEL_KEY]
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn() // 命令复用闭包里的 query,不新建
    spy.mockRestore()
    // 复用后 kernel 上仍是同一实例(命令未覆盖)
    expect(kernel[PROJECT_GRAPH_KERNEL_KEY]).toBe(built)
  })

  test('命令 fn 首次建图时也回挂 kernel(与 onBuildStart 分支对称)', () => {
    const { ctx, kernel, commands } = makeFakeCtx(root, { json: true })
    projectGraphPlugin(ctx)
    expect(kernel[PROJECT_GRAPH_KERNEL_KEY]).toBeUndefined()
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn() // onBuildStart 未触发,命令 fn 首次建图
    spy.mockRestore()
    expect(kernel[PROJECT_GRAPH_KERNEL_KEY]).toBeDefined()
  })

  test('onBuildStart 建图抛异常时不冒泡(不拖垮 build),降级 warn', () => {
    const { ctx, buildStartCallbacks } = makeFakeCtx(root)
    // 污染 ctx.appPath 为非法值,诱发 createProjectGraph 内部异常路径
    ctx.appPath = null as unknown as string
    projectGraphPlugin(ctx)
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    // 关键:回调不应抛
    expect(() => buildStartCallbacks[0]()).not.toThrow()
    warnSpy.mockRestore()
  })

  test('opts.output:build 后把完整图写到指定文件', () => {
    const { ctx, buildStartCallbacks } = makeFakeCtx(root)
    const outRel = '.taro/project-graph.json'
    projectGraphPlugin(ctx, { output: outRel })
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    buildStartCallbacks[0]()
    logSpy.mockRestore()
    const outAbs = path.join(root, outRel)
    expect(fs.existsSync(outAbs)).toBe(true)
    const written = JSON.parse(fs.readFileSync(outAbs, 'utf8'))
    expect(written.schemaVersion).toBe('1.0.0')
    expect(written.pages.map((p: { id: string }) => p.id).sort()).toEqual([
      'pages/detail/index',
      'pages/index/index',
    ])
  })

  test('不给 output 时,build 不写任何文件', () => {
    const { ctx, buildStartCallbacks } = makeFakeCtx(root)
    projectGraphPlugin(ctx)
    buildStartCallbacks[0]()
    // 默认不产出文件(.taro 下只可能有核心库缓存,但无 project-graph.json 结果文件)
    expect(fs.existsSync(path.join(root, '.taro/project-graph.json'))).toBe(false)
  })

  test('命令 --output 覆盖 opts.output,写到命令行指定路径', () => {
    const { ctx, commands } = makeFakeCtx(root, { output: 'custom/g.json' })
    projectGraphPlugin(ctx, { output: '.taro/default.json' })
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    graphCmd.fn()
    logSpy.mockRestore()
    // 命令行 --output 生效
    expect(fs.existsSync(path.join(root, 'custom/g.json'))).toBe(true)
    // opts.output 未被命令执行覆盖使用(命令行优先)
    expect(fs.existsSync(path.join(root, '.taro/default.json'))).toBe(false)
  })

  test('graph 命令 optionsMap 含 --output', () => {
    const { ctx, commands } = makeFakeCtx(root)
    projectGraphPlugin(ctx)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    expect(graphCmd.optionsMap).toHaveProperty('--output')
  })
})
