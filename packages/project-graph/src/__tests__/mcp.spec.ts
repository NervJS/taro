import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createMcpTools } from '../mcp'

import type { PageNode, ProjectGraph } from '../schema'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-mcp-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  return tmp
}

describe('createMcpTools', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('返回两个传输无关工具定义（name + inputSchema + handler）', () => {
    const tools = createMcpTools({ root })
    expect(tools.map((t) => t.name)).toEqual(['query_project_graph', 'find_page_by_route'])
    for (const t of tools) {
      expect(typeof t.description).toBe('string')
      expect(t.inputSchema.type).toBe('object')
      expect(typeof t.handler).toBe('function')
    }
  })

  test('find_page_by_route 的 inputSchema 要求 routePath', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_page_by_route')!
    expect(tool.inputSchema.required).toEqual(['routePath'])
  })

  test('query_project_graph handler 返回 summary + graph', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'query_project_graph')!
    const result = tool.handler({}) as { summary: Record<string, unknown>, graph: ProjectGraph }
    expect(result.summary.framework).toBe('react')
    expect(result.summary.pageCount).toBe(2)
    expect(result.graph.schemaVersion).toBe('1.0.0')
    // summary 计数钉死真实值（index→detail 命中 + index→ghost 悬空 = 2 条边），
    // 而非与 graph.edges.length 自比（那是同义反复）。
    expect(result.summary.edgeCount).toBe(2)
  })

  test('find_page_by_route handler 命中返回 PageNode', () => {
    const tool = createMcpTools({ root }).find((t) => t.name === 'find_page_by_route')!
    const page = tool.handler({ routePath: '/pages/detail/index' }) as PageNode | null
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
})
