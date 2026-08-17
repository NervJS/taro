/**
 * jsx-graph JSX 扫描测试（WP5a.1）。
 *
 * WP5a.1 只交付：建 import binding + 找 JSX 标签使用 → 组件引用候选（取交集）。
 * 解析成边/建节点/递归归 WP5a.2。
 */
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { buildJsxComponentGraph, scanJsxComponentRefs } from '../jsx-graph'

import type { IResolveContext } from '../resolver'

describe('scanJsxComponentRefs — JSX import binding × 标签使用取交集（§4.3）', () => {
  test('JSX 标签命中 import binding → 组件引用', () => {
    const src = `
      import Foo from './Foo'
      import { Bar } from './bar'
      export default function P() {
        return <view><Foo /><Bar /></view>
      }
    `
    const { refs, hasJsx } = scanJsxComponentRefs(src, 'p.tsx')
    expect(hasJsx).toBe(true)
    const byName = Object.fromEntries(refs.map((r) => [r.localName, r]))
    expect(byName.Foo).toMatchObject({ rawSpecifier: './Foo', importedName: 'default', isNamespace: false })
    expect(byName.Bar).toMatchObject({ rawSpecifier: './bar', importedName: 'Bar', isNamespace: false })
  })

  test('原生标签（view/text）无 binding → 不产引用', () => {
    const src = `export default function P(){ return <view><text>hi</text></view> }`
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    expect(refs).toEqual([])
  })

  test('import 了但未当 JSX 标签用（普通模块/工具函数）→ 排除', () => {
    const src = `
      import { helper } from './util'
      import Foo from './Foo'
      export default function P(){ helper(); return <view><Foo /></view> }
    `
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    // helper 被 import 且被调用，但没当 JSX 标签用 → 不算组件引用
    expect(refs.map((r) => r.localName)).toEqual(['Foo'])
  })

  test('未使用的 import → 排除', () => {
    const src = `
      import Unused from './Unused'
      import Foo from './Foo'
      export default function P(){ return <Foo /> }
    `
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    expect(refs.map((r) => r.localName)).toEqual(['Foo'])
  })

  test('具名别名 import：本地名 → 引用，importedName 取原名', () => {
    const src = `
      import { Inner as Card } from './card'
      export default function P(){ return <Card /> }
    `
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    expect(refs[0]).toMatchObject({ localName: 'Card', rawSpecifier: './card', importedName: 'Inner' })
  })

  test('成员标签 <Foo.Bar>：根标识符 Foo 匹配 namespace import，isNamespace=true', () => {
    const src = `
      import * as UI from 'ui-lib'
      export default function P(){ return <UI.Button /> }
    `
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    expect(refs).toHaveLength(1)
    expect(refs[0]).toMatchObject({ localName: 'UI', rawSpecifier: 'ui-lib', isNamespace: true })
    expect(refs[0].importedName).toBeUndefined()
  })

  test('import type / 具名 type-only → 排除（非运行时值）', () => {
    const src = `
      import type Props from './Props'
      import { type T, Real } from './mod'
      export default function P(){ return <view><Real /></view> }
    `
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    // Props / T 是 type-only，不产 binding；即便当标签用也不该命中（此处仅 Real 用作标签）
    expect(refs.map((r) => r.localName)).toEqual(['Real'])
  })

  test('无 JSX 的纯逻辑模块：hasJsx=false，refs 空', () => {
    const src = `import { x } from './x'\nexport const y = x + 1\n`
    const { refs, hasJsx } = scanJsxComponentRefs(src, 'x.ts')
    expect(hasJsx).toBe(false)
    expect(refs).toEqual([])
  })

  test('同一组件多次当标签用 → 去重为一条引用', () => {
    const src = `
      import Foo from './Foo'
      export default function P(){ return <view><Foo /><Foo /><Foo /></view> }
    `
    const { refs } = scanJsxComponentRefs(src, 'p.tsx')
    expect(refs.filter((r) => r.localName === 'Foo')).toHaveLength(1)
  })
})

// =============================================================================
// WP5a.2：componentUsage 边 + ComponentNode 建图 + 递归
// =============================================================================

describe('buildJsxComponentGraph — 建边/建节点/递归（§4.3 / §2.1）', () => {
  let root: string
  const comp = (rel: string) => path.join(root, 'src', 'components', rel)
  const page = (rel: string) => path.join(root, 'src', 'pages', rel)
  const ctx = (): IResolveContext => ({ projectRoot: root, alias: {}, hasKernel: false })
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-jsx-'))
    fs.mkdirSync(path.join(root, 'src', 'components'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true })
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('JSX 用 local 组件 → componentUsage 边 + local ComponentNode', () => {
    fs.writeFileSync(comp('Foo.tsx'), 'export default function Foo(){ return null }')
    fs.writeFileSync(page('index.tsx'), `import Foo from '../components/Foo'\nexport default function P(){ return <view><Foo /></view> }\n`)
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())
    expect(g.edges).toHaveLength(1)
    expect(g.edges[0]).toMatchObject({ kind: 'componentUsage', from: 'pages/index/index', resolution: 'local', localName: 'Foo' })
    expect(g.edges[0].to).toBe(`${fs.realpathSync(comp('Foo.tsx'))}#default`)
    expect(g.components).toHaveLength(1)
    expect(g.components[0].sourceKind).toBe('local')
    expect(g.partialOwners.size).toBe(0)
  })

  test('unresolved（拼错路径）→ 只留边不建节点，事实性 missing 不降 owner', () => {
    fs.writeFileSync(page('index.tsx'), `import Foo from '../components/Nope'\nexport default function P(){ return <Foo /> }\n`)
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())
    expect(g.edges[0].resolution).toBe('unresolved')
    expect(g.edges[0].to).toBeUndefined()
    expect(g.components).toHaveLength(0)
    expect(g.partialOwners.has('pages/index/index')).toBe(false)
  })

  test('import * as X 命名空间用法 → owner jsxAnalyzer partial，不建具体边身份', () => {
    fs.writeFileSync(page('index.tsx'), `import * as UI from 'ui-lib'\nexport default function P(){ return <UI.Button /> }\n`)
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())
    expect(g.partialOwners.has('pages/index/index')).toBe(true)
    // 命名空间用法不建具体组件边（无法静态定 export）
    expect(g.edges).toHaveLength(0)
  })

  test('递归浅纳入：local 组件的 JSX 继续展开', () => {
    // Parent 组件 JSX 用 Child；应递归建出 Parent→Child 边与 Child 节点。
    fs.writeFileSync(comp('Parent.tsx'), `import Child from './Child'\nexport default function Parent(){ return <Child /> }\n`)
    fs.writeFileSync(comp('Child.tsx'), 'export default function Child(){ return null }')
    fs.writeFileSync(page('index.tsx'), `import Parent from '../components/Parent'\nexport default function P(){ return <Parent /> }\n`)
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())
    expect(g.edges).toHaveLength(2) // Page→Parent, Parent→Child
    expect(g.components).toHaveLength(2)
  })

  test('cycle-safe：组件 JSX 循环引用（A→B→A）不死循环', () => {
    fs.writeFileSync(comp('A.tsx'), `import B from './B'\nexport default function A(){ return <B /> }\n`)
    fs.writeFileSync(comp('B.tsx'), `import A from './A'\nexport default function B(){ return <A /> }\n`)
    fs.writeFileSync(page('index.tsx'), `import A from '../components/A'\nexport default function P(){ return <A /> }\n`)
    expect(() => buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())).not.toThrow()
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())
    expect(g.components).toHaveLength(2) // A、B 各建一次
  })

  test('npm 组件为递归终点：不展开其内部 JSX', () => {
    const pkgDir = path.join(root, 'node_modules', 'ui-kit')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name: 'ui-kit', version: '1.0.0', main: 'index.js' }))
    fs.writeFileSync(path.join(pkgDir, 'index.js'), 'module.exports={}')
    fs.writeFileSync(page('index.tsx'), `import { Btn } from 'ui-kit'\nexport default function P(){ return <Btn /> }\n`)
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/index/index', filePath: page('index.tsx') }], ctx())
    expect(g.edges[0].resolution).toBe('npm')
    expect(g.components).toHaveLength(1)
  })

  test('读不到源文件 → 不崩、空结果', () => {
    const g = buildJsxComponentGraph([{ ownerNodeId: 'pages/x/x', filePath: page('missing.tsx') }], ctx())
    expect(g.edges).toEqual([])
    expect(g.components).toEqual([])
  })
})
