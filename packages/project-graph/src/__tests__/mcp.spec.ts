import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createMcpTools } from '../mcp'

import * as graphModule from '../graph'

import type { IPageNode, IProjectGraph } from '../schema'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-mcp-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  fs.cpSync(path.join(FIXTURE, 'package.json'), path.join(tmp, 'package.json'))
  return tmp
}

describe('createMcpTools', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('返回传输无关工具定义（name + inputSchema + handler）', () => {
    const tools = createMcpTools({ root })
    expect(tools.map((t) => t.name)).toEqual([
      'query_project_graph',
      'find_page_by_route',
      'get_graph_summary',
      'find_component_dependencies',
      'find_using_components',
      'find_references_to_component',
      'find_component_reference_at',
      'list_component_references',
    ])
    for (const t of tools) {
      expect(typeof t.description).toBe('string')
      expect(t.inputSchema.type).toBe('object')
      expect(typeof t.handler).toBe('function')
    }
  })

  test('§5.2 共享单实例：createMcpTools 零副作用，多 handler 调用只构建一次 Query', () => {
    const spy = jest.spyOn(graphModule, 'createProjectGraph')
    try {
      const tools = createMcpTools({ root })
      // 注册阶段不得解析（惰性）：此刻尚未构建任何 Query。
      expect(spy).toHaveBeenCalledTimes(0)

      const summary = tools.find((t) => t.name === 'get_graph_summary')!
      const byRoute = tools.find((t) => t.name === 'find_page_by_route')!
      const s1 = summary.handler({}) as { snapshotId: string }
      byRoute.handler({ routePath: '/pages/index/index' })
      const s2 = summary.handler({}) as { snapshotId: string }

      // 跨多个 handler、多次调用，Query 只构建一次（共享实例，不每调用重解析）。
      expect(spy).toHaveBeenCalledTimes(1)
      // 同实例快照稳定（snapshotId 一致）——为 WP8c 跨通道一致性打底。
      expect(s1.snapshotId).toBe(s2.snapshotId)
    } finally {
      spy.mockRestore()
    }
  })

  test('find_page_by_route 的 inputSchema 要求 routePath', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_page_by_route')!
    expect(tool.inputSchema.required).toEqual(['routePath'])
  })

  test('query_project_graph handler 返回 summary + graph', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'query_project_graph')!
    const result = tool.handler({}) as { summary: Record<string, unknown>, graph: IProjectGraph }
    expect(result.summary.framework).toBe('react')
    expect(result.summary.pageCount).toBe(2)
    expect(result.graph.schemaVersion).toBe('2.0.0')
    // summary 计数钉死真实值（index→detail 命中 + index→ghost 悬空 = 2 条边），
    // 而非与 graph.edges.length 自比（那是同义反复）。
    expect(result.summary.edgeCount).toBe(2)
  })

  test('find_page_by_route handler 命中返回 PageNode', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_page_by_route')!
    const page = tool.handler({ routePath: '/pages/detail/index' }) as IPageNode | null
    expect(page).not.toBeNull()
    expect(page!.id).toBe('pages/detail/index')
  })

  test('find_page_by_route handler 未命中返回 null', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_page_by_route')!
    expect(tool.handler({ routePath: '/pages/nope/index' })).toBeNull()
  })

  test('find_page_by_route handler 缺 routePath 参数不抛错、返回 null', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_page_by_route')!
    expect(tool.handler({})).toBeNull()
  })

  test('get_graph_summary handler 返回 envelope（版本/快照/root/上下文/计数），不含完整图', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'get_graph_summary')!
    const env = tool.handler({}) as Record<string, unknown>
    expect(env.schemaVersion).toBe('2.0.0')
    expect(typeof env.snapshotId).toBe('string')
    expect((env.snapshotId as string).length).toBeGreaterThan(0)
    expect(env.root).toBe(root)
    expect((env.counts as { pages: number }).pages).toBe(2)
    expect(env.analysisContext).toBeDefined()
    // 轻量摘要工具：不得夹带完整图（区别于 query_project_graph）。
    expect(env.graph).toBeUndefined()
    expect(env.pages).toBeUndefined()
    expect(env.edges).toBeUndefined()
  })

  test('get_graph_summary：非 git 工作区（tmp fixture）repo provenance 优雅降级为缺省', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'get_graph_summary')!
    const env = tool.handler({}) as { repo: { commit?: string, branch?: string } }
    // tmpdir 复制出的 fixture 不是 git 仓库；探测应静默失败、字段缺省，而非抛错。
    expect(env.repo).toBeDefined()
    expect(env.repo.commit).toBeUndefined()
  })

  test('find_component_dependencies handler 缺 selector 抛错（不静默误命中）', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_component_dependencies')!
    expect(() => tool.handler({})).toThrow(/选择器缺失/)
  })

  test('find_component_dependencies handler 未命中组件抛错（选择器无对应节点）', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_component_dependencies')!
    expect(() => tool.handler({ byId: '不存在的组件#default' })).toThrow(/未命中/)
  })

  test('find_using_components handler 缺 owner 抛错', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_using_components')!
    expect(() => tool.handler({})).toThrow(/owner 缺失/)
  })

  test('find_using_components handler app owner 返回带 envelope 的边数组', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_using_components')!
    const out = tool.handler({ app: true }) as { snapshotId: string, result: unknown[] }
    expect(typeof out.snapshotId).toBe('string')
    expect(Array.isArray(out.result)).toBe(true)
  })

  test('find_references_to_component handler 缺 selector 抛错', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_references_to_component')!
    expect(() => tool.handler({})).toThrow(/选择器缺失/)
  })

  test('find_component_reference_at handler 未命中返回 result=null（带 envelope）', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_component_reference_at')!
    const out = tool.handler({ filePath: '/nope.tsx', line: 1, column: 1 }) as { snapshotId: string, result: unknown }
    expect(typeof out.snapshotId).toBe('string')
    expect(out.result).toBeNull()
  })

  test('list_component_references handler 返回带 envelope 的边数组（空 filter）', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'list_component_references')!
    const out = tool.handler({}) as { snapshotId: string, result: unknown[] }
    expect(typeof out.snapshotId).toBe('string')
    expect(Array.isArray(out.result)).toBe(true)
  })
})
