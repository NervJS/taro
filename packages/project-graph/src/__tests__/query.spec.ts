/**
 * Query API 测试（WP6a：selector/反查/filter/summary/pageToFileUrl/reference-at）。
 *
 * 用 createProjectGraph 建真实图后验证查询方法（消费方视角，不读内部）。
 */
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createProjectGraph } from '../graph'

import type { IProjectGraphQuery } from '../query'
import type { IComponentUsageEdge, IUsingComponentEdge } from '../schema'

/** 建一个含 config 声明 + JSX 使用 + npm + unresolved 的丰富工程。 */
function buildRichProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-query-'))
  fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
  fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
  // package.json → react
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ devDependencies: { '@tarojs/plugin-framework-react': '*' } }))
  // npm 包 vant
  const vant = path.join(root, 'node_modules/vant')
  fs.mkdirSync(vant, { recursive: true })
  fs.writeFileSync(path.join(vant, 'package.json'), JSON.stringify({ name: 'vant', version: '1.0.0', main: 'index.js' }))
  fs.writeFileSync(path.join(vant, 'index.js'), 'module.exports={}')
  // 组件
  fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
  // app.config
  fs.writeFileSync(path.join(root, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
  // page config：声明 Card（local）+ Btn（npm）+ Ghost（unresolved 拼错）
  fs.writeFileSync(
    path.join(root, 'src/pages/index/index.config.ts'),
    "export default {\n  usingComponents: {\n    Card: '../../components/Card',\n    Btn: 'vant',\n    Ghost: '../../components/Nope',\n  },\n}\n",
  )
  // page JSX：使用 Card（componentUsage，与 config 声明同一 local 组件 → 去重）
  fs.writeFileSync(
    path.join(root, 'src/pages/index/index.tsx'),
    `import Card from '../../components/Card'\nexport default function Index(){ return <view><Card /></view> }\n`,
  )
  return root
}

describe('Query API — WP6a（selector / 反查 / filter / summary / pageToFileUrl）', () => {
  let root: string
  let q: IProjectGraphQuery
  beforeEach(() => { root = buildRichProject(); q = createProjectGraph({ root }) })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('findReferencesToComponent(byFilePath)：反查指向 Card 的边（config + JSX 两类）', () => {
    const cardFile = fs.realpathSync(path.join(root, 'src/components/Card.tsx'))
    const refs = q.findReferencesToComponent({ byFilePath: cardFile })
    // config usingComponent + JSX componentUsage 都指向同一 Card 节点
    expect(refs.some((e) => e.kind === 'usingComponent')).toBe(true)
    expect(refs.some((e) => e.kind === 'componentUsage')).toBe(true)
  })

  test('findReferencesToComponent(bySpecifier)：npm 包按包名反查', () => {
    const refs = q.findReferencesToComponent({ bySpecifier: 'vant' })
    expect(refs).toHaveLength(1)
    expect((refs[0] as IUsingComponentEdge).resolution).toBe('npm')
  })

  test('findUsingComponents({pageId})：列出页面 config 声明的 usingComponent 边', () => {
    const edges = q.findUsingComponents({ pageId: 'pages/index/index' })
    // Card / Btn / Ghost 三条 config 声明
    expect(edges).toHaveLength(3)
    expect(edges.every((e) => e.kind === 'usingComponent')).toBe(true)
    const names = edges.map((e) => (e as IUsingComponentEdge).localName).sort()
    expect(names).toEqual(['Btn', 'Card', 'Ghost'])
  })

  test('listComponentReferences(resolutions:[unresolved])：批量列 unresolved 引用', () => {
    const refs = q.listComponentReferences({ resolutions: ['unresolved'] })
    // Ghost 拼错 → unresolved（config 通道）
    expect(refs.length).toBeGreaterThanOrEqual(1)
    expect(refs.every((e) => (e as IUsingComponentEdge).resolution === 'unresolved')).toBe(true)
  })

  test('listComponentReferences(relationKinds:[componentUsage])：只列 JSX 边', () => {
    const refs = q.listComponentReferences({ relationKinds: ['componentUsage'] })
    expect(refs.every((e) => e.kind === 'componentUsage')).toBe(true)
    expect(refs.length).toBeGreaterThanOrEqual(1)
  })

  test('listComponentReferences(targetKinds:[npm])：只列指向 npm 组件的边', () => {
    const refs = q.listComponentReferences({ targetKinds: ['npm'] })
    expect(refs).toHaveLength(1)
    expect((refs[0] as IUsingComponentEdge).resolution).toBe('npm')
  })

  test('listComponentReferences(limit)：截断生效', () => {
    const all = q.listComponentReferences()
    expect(all.length).toBeGreaterThan(1)
    const limited = q.listComponentReferences({ limit: 1 })
    expect(limited).toHaveLength(1)
  })

  test('listComponentReferences 稳定排序：多次调用结果顺序一致', () => {
    const a = q.listComponentReferences().map((e) => `${e.from}|${e.kind}|${(e as IUsingComponentEdge).rawSpecifier}`)
    const b = q.listComponentReferences().map((e) => `${e.from}|${e.kind}|${(e as IUsingComponentEdge).rawSpecifier}`)
    expect(a).toEqual(b)
  })

  test('pageToFileUrl：命中页面返回 file://绝对路径:1:1', () => {
    const url = q.pageToFileUrl('pages/index/index')
    expect(url).toMatch(/^file:\/\/.*\/pages\/index\/index\.tsx:1:1$/)
  })

  test('pageToFileUrl：页面不存在抛错', () => {
    expect(() => q.pageToFileUrl('pages/ghost/index')).toThrow()
  })

  test('findComponentReferenceAt：按 config span 位置命中 usingComponent 边', () => {
    const cfgPath = path.join(root, 'src/pages/index/index.config.ts')
    // Card 声明在第 3 行（export default {\n usingComponents: {\n Card: ...）
    const edge = q.findComponentReferenceAt(cfgPath, { line: 3, column: 5 })
    expect(edge).toBeDefined()
    expect((edge as IUsingComponentEdge).localName).toBe('Card')
  })

  test('findComponentReferenceAt：无命中返回 undefined', () => {
    const edge = q.findComponentReferenceAt('/nonexistent/file.ts', { line: 1, column: 1 })
    expect(edge).toBeUndefined()
  })

  test('getGraphSummary：counts 正确、含 envelope 字段', () => {
    const s = q.getGraphSummary()
    expect(s.schemaVersion).toBe('2.0.0')
    expect(s.counts.pages).toBe(1)
    // Card(local) + vant(npm) = 2 组件节点（Ghost unresolved 不建节点）
    expect(s.counts.components).toBe(2)
    expect(s.counts.usingComponentEdges).toBe(3) // Card/Btn/Ghost
    expect(s.counts.componentUsageEdges).toBe(1) // JSX Card
    expect(s.analysisContext.framework).toBe('react')
  })
})

// =============================================================================
// WP6b：findComponentDependencies（direct / transitive）
// =============================================================================

/** 建 A→B→C 传递依赖链（config 声明），A 被页面引用。 */
function buildChainProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-dep-'))
  fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
  fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ devDependencies: { '@tarojs/plugin-framework-react': '*' } }))
  const comp = (n: string, using?: string) => {
    fs.writeFileSync(path.join(root, `src/components/${n}.tsx`), `export default function ${n}(){ return null }\n`)
    if (using != null) {
      fs.writeFileSync(path.join(root, `src/components/${n}.config.ts`), `export default { usingComponents: { ${using}: './${using}' } }\n`)
    }
  }
  comp('A', 'B'); comp('B', 'C'); comp('C')
  fs.writeFileSync(path.join(root, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
  fs.writeFileSync(path.join(root, 'src/pages/index/index.config.ts'), "export default { usingComponents: { A: '../../components/A' } }\n")
  fs.writeFileSync(path.join(root, 'src/pages/index/index.tsx'), 'export default function I(){ return <view/> }\n')
  return root
}

describe('findComponentDependencies — direct / transitive（§5.1）', () => {
  let root: string
  let q: IProjectGraphQuery
  let aId: string
  beforeEach(() => {
    root = buildChainProject()
    q = createProjectGraph({ root })
    aId = `${fs.realpathSync(path.join(root, 'src/components/A.tsx'))}#default`
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('direct（默认）：只返回 A 的直接依赖 B', () => {
    const r = q.findComponentDependencies({ byId: aId })
    expect(r.root.id).toBe(aId)
    expect(r.edges).toHaveLength(1)
    expect(r.components.map((c) => c.resolvedFilePath?.endsWith('B.tsx'))).toContain(true)
    // direct 不含 C
    expect(r.components.some((c) => c.resolvedFilePath?.endsWith('C.tsx'))).toBe(false)
    expect(r.truncated).toBe(false)
  })

  test('transitive：沿 local 边展开到 B、C', () => {
    const r = q.findComponentDependencies({ byId: aId }, { mode: 'transitive' })
    const files = r.components.map((c) => path.basename(c.resolvedFilePath ?? ''))
    expect(files).toContain('B.tsx')
    expect(files).toContain('C.tsx')
  })

  test('transitive maxDepth=1：只到 B（等价 direct 深度）', () => {
    const r = q.findComponentDependencies({ byId: aId }, { mode: 'transitive', maxDepth: 1 })
    expect(r.components.some((c) => c.resolvedFilePath?.endsWith('B.tsx'))).toBe(true)
    expect(r.components.some((c) => c.resolvedFilePath?.endsWith('C.tsx'))).toBe(false)
  })

  test('limit：截断并置 truncated=true', () => {
    const r = q.findComponentDependencies({ byId: aId }, { mode: 'transitive', limit: 1 })
    expect(r.edges).toHaveLength(1)
    expect(r.truncated).toBe(true)
  })

  test('selector 未命中 → 抛错', () => {
    expect(() => q.findComponentDependencies({ byId: 'no-such-id' })).toThrow()
  })
})

// =============================================================================
// WP6b 复核补强：npm 终点 / reference-at 文件级证据 / degradedOnly
// =============================================================================

describe('Query 复核补强用例', () => {
  test('transitive：npm 组件是终点，不展开其内部（rich 工程 Btn=vant）', () => {
    const root = buildRichProject()
    try {
      const q = createProjectGraph({ root })
      // 从页面出发不便，直接验证：npm 节点在 components 里但无从它发出的边
      const g = q.getProjectGraph()
      const vant = g.components.find((c) => c.sourceKind === 'npm')
      expect(vant).toBeDefined()
      // 没有任何边的 from 是 npm 组件 id（npm 为递归终点，不展开）
      expect(g.edges.some((e) => e.from === vant!.id)).toBe(false)
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  test('findComponentReferenceAt：仅文件级证据（无精确行列）不命中到点', () => {
    // 造一个 config 项经 spread 动态拼接 → 只有文件级证据（sourceSpan 无行列）
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-filelevel-'))
    try {
      fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
      fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
      fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ devDependencies: { '@tarojs/plugin-framework-react': '*' } }))
      fs.writeFileSync(path.join(root, 'src/components/Dyn.tsx'), 'export default function D(){ return null }\n')
      fs.writeFileSync(path.join(root, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
      const cfg = path.join(root, 'src/pages/index/index.config.ts')
      // Dyn 来自 spread → 求值后有该项，但源码 AST 无字面量 key → 仅文件级证据
      fs.writeFileSync(cfg, `const extra = { Dyn: '../../components/Dyn' }\nexport default { usingComponents: { ...extra } }\n`)
      fs.writeFileSync(path.join(root, 'src/pages/index/index.tsx'), 'export default function I(){ return <view/> }\n')
      const q = createProjectGraph({ root })
      // 该 Dyn 边只有文件级证据 → 任何行列都不该命中到点
      expect(q.findComponentReferenceAt(cfg, { line: 2, column: 10 })).toBeUndefined()
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  test('listComponentReferences(degradedOnly)：只返回 owner analyzer 非 complete 的边', () => {
    // 后缀-only 组件 + 无 platform → 页面 config analyzer partial（degraded owner）
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-degraded-'))
    try {
      fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
      fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
      fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ devDependencies: { '@tarojs/plugin-framework-react': '*' } }))
      fs.writeFileSync(path.join(root, 'src/components/Only.weapp.tsx'), 'export default function O(){ return null }\n')
      fs.writeFileSync(path.join(root, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
      fs.writeFileSync(path.join(root, 'src/pages/index/index.config.ts'), "export default { usingComponents: { Only: '../../components/Only' } }\n")
      fs.writeFileSync(path.join(root, 'src/pages/index/index.tsx'), 'export default function I(){ return <view/> }\n')
      const q = createProjectGraph({ root })
      const degraded = q.listComponentReferences({ degradedOnly: true })
      // Only 的 config 边 owner（页面）configAnalyzer partial → 命中
      expect(degraded.length).toBeGreaterThanOrEqual(1)
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })
})
