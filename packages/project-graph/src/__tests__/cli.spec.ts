import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { parseCliArgs, parseComponentSelector, runCli } from '../cli'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-cli-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  fs.cpSync(path.join(FIXTURE, 'package.json'), path.join(tmp, 'package.json'))
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
  test('WP8a 新增项缺省为 undefined（非 false，保持与既有 toEqual 断言兼容）', () => {
    const opts = parseCliArgs([])
    expect(opts.component).toBeUndefined()
    expect(opts.recursive).toBeUndefined()
    expect(opts.maxDepth).toBeUndefined()
    expect(opts.limit).toBeUndefined()
    expect(opts.link).toBeUndefined()
    expect(opts.lint).toBeUndefined()
  })
  test('--component= 取值', () => {
    expect(parseCliArgs(['--component=file:/tmp/x']).component).toBe('file:/tmp/x')
  })
  test('--recursive 置位', () => {
    expect(parseCliArgs(['--recursive']).recursive).toBe(true)
  })
  test('--max-depth= 取值（数值）', () => {
    expect(parseCliArgs(['--max-depth=3']).maxDepth).toBe(3)
  })
  test('--limit= 取值（数值）', () => {
    expect(parseCliArgs(['--limit=5']).limit).toBe(5)
  })
  test('--link / --lint 置位', () => {
    const opts = parseCliArgs(['--link', '--lint'])
    expect(opts.link).toBe(true)
    expect(opts.lint).toBe(true)
  })
  test('--root= 规整为绝对路径（相对路径场景）', () => {
    expect(path.isAbsolute(parseCliArgs(['--root=./x']).root)).toBe(true)
  })
})

describe('parseComponentSelector（三分支编码 → TComponentSelector）', () => {
  test('id: 前缀 → byId', () => {
    expect(parseComponentSelector('id:pages/index/index#default')).toEqual({ byId: 'pages/index/index#default' })
  })
  test('file: 前缀 → byFilePath', () => {
    expect(parseComponentSelector('file:/abs/components/Card.tsx')).toEqual({ byFilePath: '/abs/components/Card.tsx' })
  })
  test('裸值（无前缀）→ bySpecifier', () => {
    expect(parseComponentSelector('@jdtaro/ui')).toEqual({ bySpecifier: '@jdtaro/ui' })
  })
  test('bySpecifier 保留含 : 的裸值（仅剥离已知前缀，不误伤 scope/协议）', () => {
    expect(parseComponentSelector('plugin://foo:bar')).toEqual({ bySpecifier: 'plugin://foo:bar' })
  })
})

describe('runCli（端到端，mini-app fixture）', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
    process.exitCode = undefined
  })

  test('概览输出含 framework / 页面 / 跳转', () => {
    const out = runCli([`--root=${root}`])
    expect(out).toContain('framework: react')
    expect(out).toContain('pages/index/index')
    expect(out).toContain('pages/detail/index')
    // 悬空跳转标注 broken
    expect(out).toContain('(broken)')
  })

  test('概览尾部叠加 summary envelope（schemaVersion/snapshotId），不替换既有详情', () => {
    const out = runCli([`--root=${root}`])
    expect(out).toContain('schemaVersion: 2.0.0')
    expect(out).toContain('snapshotId:')
    // 既有详情仍在（叠加而非替换）
    expect(out).toContain('Pages:')
  })

  test('--json 输出可解析且为完整图', () => {
    const out = runCli([`--root=${root}`, '--json'])
    const graph = JSON.parse(out)
    expect(graph.schemaVersion).toBe('2.0.0')
    expect(graph.framework).toBe('react')
    expect(graph.pages.map((p: { id: string }) => p.id).sort()).toEqual([
      'pages/detail/index',
      'pages/index/index',
    ])
  })

  test('--route 命中：输出该页详情与被引用次数，退出码 0', () => {
    const out = runCli([`--root=${root}`, '--route=/pages/detail/index'])
    expect(out).toContain('route: /pages/detail/index')
    expect(out).toContain('被跳转引用: 1 处')
    expect(process.exitCode).toBe(0)
  })

  test('--route 未命中：明确提示，退出码 1', () => {
    const out = runCli([`--root=${root}`, '--route=/pages/nope/index'])
    expect(out).toContain('未找到对应页面')
    expect(process.exitCode).toBe(1)
  })

  test('--route --link：file 行渲染为 file://<绝对路径>:1:1', () => {
    const out = runCli([`--root=${root}`, '--route=/pages/detail/index', '--link'])
    const fileLine = out.split('\n').find((l) => l.startsWith('file: '))!
    expect(fileLine).toMatch(/^file: file:\/\/.+:1:1$/)
    expect(path.isAbsolute(fileLine.slice('file: file://'.length, -':1:1'.length))).toBe(true)
  })

  test('--lint：无 issue 时明确提示', () => {
    const out = runCli([`--root=${root}`, '--lint'])
    expect(out).toBe('(无 issue)')
    expect(process.exitCode).toBe(0)
  })
})

describe('runCli — --component（direct / transitive / max-depth / limit）', () => {
  let root: string

  beforeEach(() => {
    root = copyFixture()
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
    fs.writeFileSync(path.join(root, 'src/components/Card.config.ts'), "export default { usingComponents: { Sub: './Sub' } }\n")
    fs.writeFileSync(path.join(root, 'src/components/Sub.tsx'), 'export default function Sub(){ return null }\n')
    fs.writeFileSync(path.join(root, 'src/components/Sub.config.ts'), "export default { usingComponents: { Leaf: './Leaf' } }\n")
    fs.writeFileSync(path.join(root, 'src/components/Leaf.tsx'), 'export default function Leaf(){ return null }\n')
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.config.ts'),
      "export default {\n  navigationBarTitleText: '首页',\n  usingComponents: {\n    Card: '../../components/Card',\n  },\n}\n",
    )
  })
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
    process.exitCode = undefined
  })

  function cardSelector(): string {
    return `file:${fs.realpathSync(path.join(root, 'src/components/Card.tsx'))}`
  }

  test('direct：只列 Card 的直接依赖 Sub', () => {
    const out = runCli([`--root=${root}`, `--component=${cardSelector()}`])
    expect(out).toContain('components: 1')
    expect(out).toContain('Sub.tsx')
    expect(out).not.toContain('Leaf.tsx')
    expect(process.exitCode).toBe(0)
  })

  test('--recursive：传递依赖展开到 Leaf', () => {
    const out = runCli([`--root=${root}`, `--component=${cardSelector()}`, '--recursive'])
    expect(out).toContain('components: 2')
    expect(out).toContain('Sub.tsx')
    expect(out).toContain('Leaf.tsx')
  })

  test('--recursive --max-depth=1：不展开到 Leaf', () => {
    const out = runCli([`--root=${root}`, `--component=${cardSelector()}`, '--recursive', '--max-depth=1'])
    expect(out).toContain('Sub.tsx')
    expect(out).not.toContain('Leaf.tsx')
  })

  test('--recursive --limit=1：截断并标注 truncated', () => {
    const out = runCli([`--root=${root}`, `--component=${cardSelector()}`, '--recursive', '--limit=1'])
    expect(out).toContain('(truncated)')
  })

  test('--component 未命中：提示查询失败，退出码 1', () => {
    const out = runCli([`--root=${root}`, '--component=file:/no/such/file.tsx'])
    expect(out).toContain('查询失败')
    expect(process.exitCode).toBe(1)
  })
})

describe('runCli — --lint（empty-route fixture 变体）', () => {
  let root: string

  beforeEach(() => {
    root = copyFixture()
    fs.writeFileSync(
      path.join(root, 'src/app.config.ts'),
      "export default {\n  pages: [\n    'pages/index/index',\n    'pages/detail/index',\n    'pages/missing/index',\n  ],\n  window: {\n    navigationBarTitleText: 'mini-app',\n  },\n}\n",
    )
  })
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
    process.exitCode = undefined
  })

  test('--lint：输出 empty-route 且退出码 1', () => {
    const out = runCli([`--root=${root}`, '--lint'])
    expect(out).toContain('[empty-route]')
    expect(out).toContain('页面 pages/missing/index 未找到对应文件')
    expect(process.exitCode).toBe(1)
  })
})
