/**
 * config-graph 声明抽取测试（WP4.1）。
 *
 * WP4.1 只交付：从 config 对象抽取 usingComponents 声明项（规范化 string /
 * [path,...opts] 形态）。解析成边/建节点归 WP4.2，span 归 WP4.3。
 */
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { buildConfigComponentGraph, extractUsingComponents, extractUsingComponentSpans } from '../config-graph'

import type { IResolveContext } from '../resolver'

describe('extractUsingComponents — 声明抽取（§4.2）', () => {
  test('string 形态：rawSpecifier 取值，无 usingOptions', () => {
    const decls = extractUsingComponents(
      { usingComponents: { Foo: './components/Foo', Bar: '@myorg/ui' } },
      'pages/index/index',
    )
    expect(decls).toEqual([
      { ownerNodeId: 'pages/index/index', localName: 'Foo', rawSpecifier: './components/Foo', usingOptions: undefined },
      { ownerNodeId: 'pages/index/index', localName: 'Bar', rawSpecifier: '@myorg/ui', usingOptions: undefined },
    ])
  })

  test('数组形态 [path, ...opts]：rawSpecifier=value[0]，opts=其余（对齐主仓 value[0] 语义）', () => {
    const decls = extractUsingComponents(
      { usingComponents: { Widget: ['./Widget', { prop: 1 }] } },
      'app',
    )
    expect(decls).toHaveLength(1)
    expect(decls[0].rawSpecifier).toBe('./Widget')
    expect(decls[0].usingOptions).toEqual([{ prop: 1 }])
    expect(decls[0].localName).toBe('Widget')
  })

  test('数组形态仅 [path]（无 opts）：不带 usingOptions', () => {
    const decls = extractUsingComponents({ usingComponents: { W: ['./W'] } }, 'app')
    expect(decls[0].rawSpecifier).toBe('./W')
    expect(decls[0].usingOptions).toBeUndefined()
  })

  test('app 级全局组件：owner=app', () => {
    const decls = extractUsingComponents({ usingComponents: { Global: './g' } }, 'app')
    expect(decls[0].ownerNodeId).toBe('app')
  })

  test('缺 usingComponents / 空 map → 空列表（正常态，非错误）', () => {
    expect(extractUsingComponents({ navigationBarTitleText: 'x' }, 'app')).toEqual([])
    expect(extractUsingComponents({ usingComponents: {} }, 'app')).toEqual([])
  })

  test('脏项丢弃：空串 specifier / 非 string 非数组 value / 数组首项非串', () => {
    const decls = extractUsingComponents(
      {
        usingComponents: {
          Empty: '',
          NumVal: 123,
          BadArr: [42, 'x'],
          Good: './ok',
        },
      },
      'app',
    )
    expect(decls).toHaveLength(1)
    expect(decls[0].localName).toBe('Good')
  })

  test('config 非对象 / null → 空列表（不崩）', () => {
    expect(extractUsingComponents(null, 'app')).toEqual([])
    expect(extractUsingComponents(undefined, 'app')).toEqual([])
    expect(extractUsingComponents('str', 'app')).toEqual([])
  })

  test('usingComponents 为数组（非法形态）→ 空列表', () => {
    expect(extractUsingComponents({ usingComponents: ['./a', './b'] }, 'app')).toEqual([])
  })
})

// =============================================================================
// WP4.2：usingComponent 边 + ComponentNode 建图 + 递归浅纳入
// =============================================================================

describe('buildConfigComponentGraph — 建边/建节点/递归（§4.2 / §2.1）', () => {
  let root: string
  const comp = (rel: string) => path.join(root, 'src', 'components', rel)
  const ctx = (): IResolveContext => ({ projectRoot: root, alias: {}, hasKernel: false })

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-cfggraph-'))
    fs.mkdirSync(path.join(root, 'src', 'components'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true })
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('local 声明 → usingComponent 边 + local ComponentNode', () => {
    fs.writeFileSync(comp('Foo.tsx'), 'export default function Foo(){}')
    const owners = [{
      ownerNodeId: 'pages/index/index',
      config: { usingComponents: { Foo: '../components/Foo' } },
      configFilePath: path.join(root, 'src', 'pages', 'index.config.ts'),
    }]
    const g = buildConfigComponentGraph(owners, ctx())
    expect(g.edges).toHaveLength(1)
    expect(g.edges[0]).toMatchObject({ kind: 'usingComponent', from: 'pages/index/index', resolution: 'local', localName: 'Foo', rawSpecifier: '../components/Foo' })
    // config usingComponents 指向默认导出 → id 用 #default（localName 仅作边上 owner 本地符号）
    expect(g.edges[0].to).toBe(`${fs.realpathSync(comp('Foo.tsx'))}#default`)
    expect(g.components).toHaveLength(1)
    expect(g.components[0].sourceKind).toBe('local')
    expect(g.partialOwners.size).toBe(0)
  })

  test('npm 声明 → npm ComponentNode（浅纳入）', () => {
    const pkgDir = path.join(root, 'node_modules', 'vant')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name: 'vant', version: '1.0.0', main: 'index.js' }))
    fs.writeFileSync(path.join(pkgDir, 'index.js'), 'module.exports={}')
    const owners = [{
      ownerNodeId: 'app',
      config: { usingComponents: { Btn: 'vant' } },
      configFilePath: path.join(root, 'src', 'app.config.ts'),
    }]
    const g = buildConfigComponentGraph(owners, ctx())
    expect(g.edges[0].resolution).toBe('npm')
    expect(g.components[0].sourceKind).toBe('npm')
    expect(g.components[0].packageName).toBe('vant')
  })

  test('unresolved（拼错路径）→ 只留边不建节点，to 缺省，事实性 missing 不降 owner', () => {
    const owners = [{
      ownerNodeId: 'pages/index/index',
      config: { usingComponents: { Typo: '../components/Nope' } },
      configFilePath: path.join(root, 'src', 'pages', 'index.config.ts'),
    }]
    const g = buildConfigComponentGraph(owners, ctx())
    expect(g.edges[0].resolution).toBe('unresolved')
    expect(g.edges[0].to).toBeUndefined()
    expect(g.components).toHaveLength(0) // 不建节点
    expect(g.partialOwners.has('pages/index/index')).toBe(false) // 拼错是事实性 missing
  })

  test('工具限制类 unresolved（后缀-only 无 platform）→ owner 标 partial', () => {
    fs.writeFileSync(comp('Only.weapp.tsx'), 'weapp') // 仅平台后缀，无 platform 解析不到
    const owners = [{
      ownerNodeId: 'pages/index/index',
      config: { usingComponents: { Only: '../components/Only' } },
      configFilePath: path.join(root, 'src', 'pages', 'index.config.ts'),
    }]
    const g = buildConfigComponentGraph(owners, ctx()) // 无 platform
    expect(g.edges[0].resolution).toBe('unresolved')
    expect(g.partialOwners.has('pages/index/index')).toBe(true)
  })

  test('递归浅纳入：local 组件的 component config 继续展开 usingComponents', () => {
    // Parent 组件的 config 声明 Child；应递归建出 Child 节点与 Parent→Child 边。
    fs.writeFileSync(comp('Parent.tsx'), 'export default function Parent(){}')
    fs.writeFileSync(comp('Parent.config.ts'), `export default { usingComponents: { Child: './Child' } }\n`)
    fs.writeFileSync(comp('Child.tsx'), 'export default function Child(){}')
    const owners = [{
      ownerNodeId: 'pages/index/index',
      config: { usingComponents: { Parent: '../components/Parent' } },
      configFilePath: path.join(root, 'src', 'pages', 'index.config.ts'),
    }]
    const g = buildConfigComponentGraph(owners, ctx())
    // 边：Page→Parent, Parent→Child
    expect(g.edges).toHaveLength(2)
    const froms = g.edges.map((e) => e.from).sort()
    expect(froms).toContain('pages/index/index')
    expect(froms).toContain(`${fs.realpathSync(comp('Parent.tsx'))}#default`)
    // 节点：Parent + Child
    expect(g.components).toHaveLength(2)
  })

  test('cycle-safe：组件 config 循环引用（A→B→A）不死循环', () => {
    fs.writeFileSync(comp('A.tsx'), 'export default function A(){}')
    fs.writeFileSync(comp('A.config.ts'), `export default { usingComponents: { B: './B' } }\n`)
    fs.writeFileSync(comp('B.tsx'), 'export default function B(){}')
    fs.writeFileSync(comp('B.config.ts'), `export default { usingComponents: { A: './A' } }\n`)
    const owners = [{
      ownerNodeId: 'pages/index/index',
      config: { usingComponents: { A: '../components/A' } },
      configFilePath: path.join(root, 'src', 'pages', 'index.config.ts'),
    }]
    expect(() => buildConfigComponentGraph(owners, ctx())).not.toThrow()
    const g = buildConfigComponentGraph(owners, ctx())
    // A、B 各建一次节点（去重），不无限展开
    expect(g.components).toHaveLength(2)
  })

  test('npm 组件为递归终点：不读其内部 config/子依赖', () => {
    const pkgDir = path.join(root, 'node_modules', 'ui-kit')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name: 'ui-kit', version: '1.0.0', main: 'index.js' }))
    fs.writeFileSync(path.join(pkgDir, 'index.js'), 'module.exports={}')
    // 即便 npm 包内有 config 声明子组件，也不应被展开
    fs.writeFileSync(path.join(pkgDir, 'index.config.ts'), `export default { usingComponents: { Sub: './sub' } }\n`)
    const owners = [{
      ownerNodeId: 'app',
      config: { usingComponents: { Kit: 'ui-kit' } },
      configFilePath: path.join(root, 'src', 'app.config.ts'),
    }]
    const g = buildConfigComponentGraph(owners, ctx())
    expect(g.components).toHaveLength(1) // 只有 ui-kit 自身，不含 Sub
    expect(g.edges).toHaveLength(1)
  })
})

// =============================================================================
// WP4.3：config source evidence（span 定位 + 缺 span 标 partial）
// =============================================================================

describe('extractUsingComponentSpans — 源码 span 定位（§4.2）', () => {
  let root: string
  const cfg = (name: string) => path.join(root, name)
  beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-span-')) })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('字面量 key 命中精确 span（1-based 行列）', () => {
    const p = cfg('index.config.ts')
    fs.writeFileSync(p, `export default {\n  usingComponents: {\n    Foo: './Foo',\n    Bar: '@ui/bar',\n  },\n}\n`)
    const { fileParsed, spans } = extractUsingComponentSpans(p)
    expect(fileParsed).toBe(true)
    expect(spans.has('Foo')).toBe(true)
    const foo = spans.get('Foo')!
    expect(foo.filePath).toBe(p)
    expect(foo.startLine).toBe(3) // 第 3 行 Foo: './Foo'
    expect(foo.startColumn).toBeGreaterThan(0)
    expect(spans.has('Bar')).toBe(true)
    expect(spans.get('Bar')!.startLine).toBe(4)
  })

  test('字符串字面量 key（引号 key）也命中', () => {
    const p = cfg('index.config.ts')
    fs.writeFileSync(p, `export default {\n  usingComponents: {\n    'my-comp': './MyComp',\n  },\n}\n`)
    const { spans } = extractUsingComponentSpans(p)
    expect(spans.has('my-comp')).toBe(true)
  })

  test('文件不存在 → fileParsed=false，空 spans', () => {
    const { fileParsed, spans } = extractUsingComponentSpans(cfg('nope.config.ts'))
    expect(fileParsed).toBe(false)
    expect(spans.size).toBe(0)
  })

  test('无 usingComponents → fileParsed=true 但空 spans', () => {
    const p = cfg('index.config.ts')
    fs.writeFileSync(p, `export default { navigationBarTitleText: 'x' }\n`)
    const { fileParsed, spans } = extractUsingComponentSpans(p)
    expect(fileParsed).toBe(true)
    expect(spans.size).toBe(0)
  })
})

describe('buildConfigComponentGraph — source evidence 接入（§4.2 缺 span 标 partial）', () => {
  let root: string
  const comp = (rel: string) => path.join(root, 'src', 'components', rel)
  const ctx = (): IResolveContext => ({ projectRoot: root, alias: {}, hasKernel: false })
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-span2-'))
    fs.mkdirSync(path.join(root, 'src', 'components'), { recursive: true })
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('真实 config 文件字面量项 → 边带精确 span，不标 partial', () => {
    fs.writeFileSync(comp('Foo.tsx'), 'export default function Foo(){}')
    const cfgPath = path.join(root, 'src', 'app.config.ts')
    fs.writeFileSync(cfgPath, `export default {\n  usingComponents: {\n    Foo: './components/Foo',\n  },\n}\n`)
    const owners = [{ ownerNodeId: 'app', config: { usingComponents: { Foo: './components/Foo' } }, configFilePath: cfgPath }]
    const g = buildConfigComponentGraph(owners, ctx())
    const edge = g.edges[0]
    expect(edge.sourceSpan?.startLine).toBe(3)
    expect(edge.sourceSpan?.filePath).toBe(cfgPath)
    expect(g.partialOwners.has('app')).toBe(false)
  })

  test('spread 动态拼接项：源码 AST 无字面量 key → 文件级证据 + owner partial', () => {
    fs.writeFileSync(comp('Foo.tsx'), 'export default function Foo(){}')
    const cfgPath = path.join(root, 'src', 'app.config.ts')
    // Foo 是字面量（有 span），Dyn 来自 spread（无字面量 key，运行时求值才有）。
    fs.writeFileSync(
      cfgPath,
      `const extra = { Dyn: './components/Foo' }\nexport default {\n  usingComponents: {\n    Foo: './components/Foo',\n    ...extra,\n  },\n}\n`,
    )
    // 求值后对象含 Foo 与 Dyn 两项（模拟 readConfig 结果）。
    const owners = [{
      ownerNodeId: 'app',
      config: { usingComponents: { Foo: './components/Foo', Dyn: './components/Foo' } },
      configFilePath: cfgPath,
    }]
    const g = buildConfigComponentGraph(owners, ctx())
    const fooEdge = g.edges.find((e) => e.localName === 'Foo')!
    const dynEdge = g.edges.find((e) => e.localName === 'Dyn')!
    // Foo 有精确 span
    expect(fooEdge.sourceSpan?.startLine).toBeGreaterThan(0)
    // Dyn 无字面量 → 仅文件级证据（无行列）
    expect(dynEdge.sourceSpan?.filePath).toBe(cfgPath)
    expect(dynEdge.sourceSpan?.startLine).toBeUndefined()
    // 存在缺 span 的字面量项 → owner 标 partial
    expect(g.partialOwners.has('app')).toBe(true)
  })
})
