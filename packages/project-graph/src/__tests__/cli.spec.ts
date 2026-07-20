import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { parseCliArgs, runCli } from '../cli'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-cli-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  return tmp
}

describe('parseCliArgs', () => {
  test('默认 root 为 cwd、json 为 false、无 route', () => {
    const opts = parseCliArgs([])
    expect(opts.root).toBe(process.cwd())
    expect(opts.json).toBe(false)
    expect(opts.route).toBeUndefined()
  })
  test('--json 置位', () => {
    expect(parseCliArgs(['--json']).json).toBe(true)
  })
  test('--route= 取值', () => {
    expect(parseCliArgs(['--route=/pages/detail/index']).route).toBe('/pages/detail/index')
  })
  test('--root= 覆盖 root', () => {
    expect(parseCliArgs(['--root=/tmp/x']).root).toBe('/tmp/x')
  })
  test('多参数组合', () => {
    const opts = parseCliArgs(['--json', '--root=/tmp/x', '--route=/a'])
    expect(opts).toEqual({ root: '/tmp/x', json: true, route: '/a' })
  })
})

describe('runCli（端到端，mini-app fixture）', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('概览输出含 framework / 页面 / 跳转', () => {
    const out = runCli([`--root=${root}`])
    expect(out).toContain('framework: react')
    expect(out).toContain('pages/index/index')
    expect(out).toContain('pages/detail/index')
    // 悬空跳转标注 broken
    expect(out).toContain('(broken)')
  })

  test('--json 输出可解析且为完整图', () => {
    const out = runCli([`--root=${root}`, '--json'])
    const graph = JSON.parse(out)
    expect(graph.schemaVersion).toBe('1.0.0')
    expect(graph.framework).toBe('react')
    expect(graph.pages.map((p: { id: string }) => p.id).sort()).toEqual([
      'pages/detail/index',
      'pages/index/index',
    ])
  })

  test('--route 命中：输出该页详情与被引用次数', () => {
    const out = runCli([`--root=${root}`, '--route=/pages/detail/index'])
    expect(out).toContain('route: /pages/detail/index')
    expect(out).toContain('被跳转引用: 1 处')
  })

  test('--route 未命中：明确提示', () => {
    const out = runCli([`--root=${root}`, '--route=/pages/nope/index'])
    expect(out).toContain('未找到对应页面')
  })
})
