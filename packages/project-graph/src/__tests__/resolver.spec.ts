/**
 * resolver 形态分流与 protocol/external 终态测试（WP3.1）。
 *
 * WP3.1 只交付：specifier 形态分类（§4.4 先分流再看落点）+ protocol→external
 * 终态。local/npm/unresolved 分支归后续子任务，此处仅验证分流把它们各自路由到
 * 正确处理器（用「未实现」抛错间接证明路由正确）。
 */
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { classifySpecifier, resolveComponent, resolveMainFileWithPlatform, splitPackageSpecifier } from '../resolver'

import type { IResolveContext } from '../resolver'

const CTX: IResolveContext = {
  projectRoot: '/proj',
  alias: {},
  hasKernel: false,
}

const CTX_ALIAS: IResolveContext = {
  projectRoot: '/proj',
  alias: { '@': '/proj/src', '@comp': '/proj/src/components' },
  hasKernel: true,
}

describe('classifySpecifier — §4.4 形态分流', () => {
  test('scheme:// → protocol（plugin:// / plugin-private:// / 任意协议）', () => {
    expect(classifySpecifier('plugin://logManager/log', {})).toBe('protocol')
    expect(classifySpecifier('plugin-private://a/b', {})).toBe('protocol')
    expect(classifySpecifier('other+scheme://x', {})).toBe('protocol')
  })

  test('相对 / 绝对路径 → relative', () => {
    expect(classifySpecifier('./Foo', {})).toBe('relative')
    expect(classifySpecifier('../widgets/Bar', {})).toBe('relative')
    expect(classifySpecifier('/abs/path/Baz', {})).toBe('relative')
  })

  test('命中 alias 前缀 → alias（精确 key 或 <key>/ 开头）', () => {
    expect(classifySpecifier('@', CTX_ALIAS.alias)).toBe('alias')
    expect(classifySpecifier('@/components/Foo', CTX_ALIAS.alias)).toBe('alias')
    expect(classifySpecifier('@comp/Bar', CTX_ALIAS.alias)).toBe('alias')
  })

  test('裸包名 → bare（含 scope 包、子路径）', () => {
    expect(classifySpecifier('vant', {})).toBe('bare')
    expect(classifySpecifier('@myorg/ui', {})).toBe('bare')
    expect(classifySpecifier('@myorg/ui/button', {})).toBe('bare')
    expect(classifySpecifier('lodash/fp', {})).toBe('bare')
  })

  test('仅 `://` 触发 protocol：mailto: 与 Windows 盘符路径不误判', () => {
    // 有 ':' 无 '://' 不是本模块关心的组件协议 → 归 bare（对齐主仓 notNpmPkgReg 基准）。
    expect(classifySpecifier('mailto:x@y.com', {})).toBe('bare')
    // Windows 盘符 'C:\...'：':\' 非 '://' → 不判 protocol；'C:\' 首字符非 './\\' → bare。
    expect(classifySpecifier('C:\\comp\\Foo', {})).toBe('bare')
  })

  test('空 alias（含无 Kernel）→ alias 前缀恒不命中，@scope 归 bare 而非 alias', () => {
    // 关键回归：alias 为空时 '@myorg/ui' 不得被误判 alias（否则纯 CLI 下 npm 包
    // 被当相对路径解析）。
    expect(classifySpecifier('@myorg/ui', {})).toBe('bare')
    expect(classifySpecifier('@', {})).toBe('bare')
  })

  test('protocol 优先级最高：alias key 恰为协议名时，scheme:// 仍判 protocol', () => {
    // alias 里有 key 'plugin'，但 'plugin://x' 是协议引用，不得被当 alias。
    expect(classifySpecifier('plugin://x', { plugin: '/somewhere' })).toBe('protocol')
  })
})

describe('resolveComponent — protocol → external 终态', () => {
  test('plugin:// 判 external，身份为原始 specifier，不建本地文件', () => {
    const r = resolveComponent(
      { fromFilePath: '/proj/src/pages/index/index.tsx', rawSpecifier: 'plugin://logManager/log' },
      CTX,
    )
    expect(r.resolution).toBe('external')
    expect(r.sourceKind).toBe('external')
    expect(r.id).toBe('plugin://logManager/log')
    expect(r.rawSpecifier).toBe('plugin://logManager/log')
    expect(r.resolvedFilePath).toBeUndefined()
    expect(r.ownerPartial).toBe(false)
    expect(r.missingCandidates).toEqual([])
  })

  test('external（protocol）不受 exportName 影响（specifier 即整体身份）', () => {
    const r = resolveComponent(
      { fromFilePath: '/proj/src/a.tsx', rawSpecifier: 'plugin://x/y', exportName: 'Foo' },
      CTX,
    )
    expect(r.resolution).toBe('external')
    expect(r.id).toBe('plugin://x/y')
  })
})

// =============================================================================
// WP3.2：local 终态 + 平台后缀 env-入参 fork
// =============================================================================

describe('resolveMainFileWithPlatform — 平台后缀解析（env-入参 fork）', () => {
  let dir: string
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-resolver-'))
  })
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  test('无 platform：命中无后缀主文件', () => {
    fs.writeFileSync(path.join(dir, 'Foo.tsx'), 'export default 1')
    expect(resolveMainFileWithPlatform(path.join(dir, 'Foo'))).toBe(path.join(dir, 'Foo.tsx'))
  })

  test('无 platform：命中目录 index', () => {
    fs.mkdirSync(path.join(dir, 'Bar'))
    fs.writeFileSync(path.join(dir, 'Bar', 'index.ts'), 'export default 1')
    expect(resolveMainFileWithPlatform(path.join(dir, 'Bar'))).toBe(path.join(dir, 'Bar', 'index.ts'))
  })

  test('有 platform：平台后缀文件优先于无后缀', () => {
    fs.writeFileSync(path.join(dir, 'Foo.tsx'), 'plain')
    fs.writeFileSync(path.join(dir, 'Foo.weapp.tsx'), 'weapp')
    expect(resolveMainFileWithPlatform(path.join(dir, 'Foo'), 'weapp')).toBe(path.join(dir, 'Foo.weapp.tsx'))
  })

  test('有 platform：无平台后缀文件时回退无后缀主文件', () => {
    fs.writeFileSync(path.join(dir, 'Foo.tsx'), 'plain')
    expect(resolveMainFileWithPlatform(path.join(dir, 'Foo'), 'weapp')).toBe(path.join(dir, 'Foo.tsx'))
  })

  test('fork 验证：解析不读全局 process.env.TARO_ENV（污染 env 不改变结果）', () => {
    fs.writeFileSync(path.join(dir, 'Foo.tsx'), 'plain')
    fs.writeFileSync(path.join(dir, 'Foo.alipay.tsx'), 'alipay')
    const prev = process.env.TARO_ENV
    process.env.TARO_ENV = 'alipay'
    try {
      // 全局 env=alipay，但不传 platform 入参 → 只解析无后缀主文件，不受 env 影响。
      expect(resolveMainFileWithPlatform(path.join(dir, 'Foo'))).toBe(path.join(dir, 'Foo.tsx'))
      // 显式传 weapp（≠全局 env）→ 无 weapp 文件回退无后缀，也不受 env=alipay 影响。
      expect(resolveMainFileWithPlatform(path.join(dir, 'Foo'), 'weapp')).toBe(path.join(dir, 'Foo.tsx'))
    } finally {
      if (prev === undefined) delete process.env.TARO_ENV
      else process.env.TARO_ENV = prev
    }
  })

  test('全不存在 → undefined', () => {
    expect(resolveMainFileWithPlatform(path.join(dir, 'Ghost'))).toBeUndefined()
  })
})

describe('resolveComponent — local 终态（relative / alias）', () => {
  let root: string
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-local-'))
    fs.mkdirSync(path.join(root, 'src', 'components'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true })
  })
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  test('相对路径命中 → local，主键 realpath#default，默认 exportName=default', () => {
    const comp = path.join(root, 'src', 'components', 'Foo.tsx')
    fs.writeFileSync(comp, 'export default function Foo(){}')
    const from = path.join(root, 'src', 'pages', 'index.tsx')
    const r = resolveComponent({ fromFilePath: from, rawSpecifier: '../components/Foo' }, {
      projectRoot: root,
      alias: {},
      hasKernel: false,
    })
    expect(r.resolution).toBe('local')
    expect(r.sourceKind).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp))
    expect(r.id).toBe(`${fs.realpathSync(comp)}#default`)
    expect(r.exportName).toBe('default')
    expect(r.ownerPartial).toBe(false)
  })

  test('具名 exportName 拼进主键', () => {
    const comp = path.join(root, 'src', 'components', 'Bar.tsx')
    fs.writeFileSync(comp, 'export function Bar(){}')
    const from = path.join(root, 'src', 'pages', 'index.tsx')
    const r = resolveComponent(
      { fromFilePath: from, rawSpecifier: '../components/Bar', exportName: 'Bar' },
      { projectRoot: root, alias: {}, hasKernel: false },
    )
    expect(r.id).toBe(`${fs.realpathSync(comp)}#Bar`)
    expect(r.exportName).toBe('Bar')
  })

  test('alias 命中 → local（alias value 为绝对目录）', () => {
    const comp = path.join(root, 'src', 'components', 'Baz.tsx')
    fs.writeFileSync(comp, 'export default 1')
    const from = path.join(root, 'src', 'pages', 'index.tsx')
    const r = resolveComponent(
      { fromFilePath: from, rawSpecifier: '@comp/Baz' },
      { projectRoot: root, alias: { '@comp': path.join(root, 'src', 'components') }, hasKernel: true },
    )
    expect(r.resolution).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp))
  })

  test('alias 精确命中 key（value 直指文件所在目录的 index）', () => {
    const dir = path.join(root, 'src', 'ui')
    fs.mkdirSync(dir)
    fs.writeFileSync(path.join(dir, 'index.tsx'), 'export default 1')
    const from = path.join(root, 'src', 'pages', 'index.tsx')
    const r = resolveComponent(
      { fromFilePath: from, rawSpecifier: '@ui' },
      { projectRoot: root, alias: { '@ui': dir }, hasKernel: true },
    )
    expect(r.resolution).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(path.join(dir, 'index.tsx')))
  })

  test('platform 感知：alias 组件优先命中平台后缀文件', () => {
    const dir = path.join(root, 'src', 'components')
    fs.writeFileSync(path.join(dir, 'Plat.tsx'), 'plain')
    fs.writeFileSync(path.join(dir, 'Plat.weapp.tsx'), 'weapp')
    const from = path.join(root, 'src', 'pages', 'index.tsx')
    const r = resolveComponent(
      { fromFilePath: from, rawSpecifier: '@comp/Plat' },
      { projectRoot: root, alias: { '@comp': dir }, hasKernel: true, platform: 'weapp' },
    )
    expect(r.resolvedFilePath).toBe(fs.realpathSync(path.join(dir, 'Plat.weapp.tsx')))
  })
})

// =============================================================================
// WP3.3：npm 终态 + projectRoot 基址 fork
// =============================================================================

describe('splitPackageSpecifier — 包名/子路径拆分', () => {
  test('无 scope', () => {
    expect(splitPackageSpecifier('vant')).toEqual({ packageName: 'vant', subpath: '' })
    expect(splitPackageSpecifier('vant/es/button')).toEqual({ packageName: 'vant', subpath: 'es/button' })
  })
  test('scope 包', () => {
    expect(splitPackageSpecifier('@myorg/ui')).toEqual({ packageName: '@myorg/ui', subpath: '' })
    expect(splitPackageSpecifier('@myorg/ui/button')).toEqual({ packageName: '@myorg/ui', subpath: 'button' })
  })
})

describe('resolveComponent — npm 终态（projectRoot 基址 fork）', () => {
  let root: string
  /** 在 root/node_modules 下手搭一个最小包。 */
  function installPkg(pkgName: string, files: Record<string, string>, pkgJson: Record<string, unknown> = {}): void {
    const pkgDir = path.join(root, 'node_modules', pkgName)
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name: pkgName, version: '1.0.0', main: 'index.js', ...pkgJson }))
    for (const [rel, content] of Object.entries(files)) {
      const abs = path.join(pkgDir, rel)
      fs.mkdirSync(path.dirname(abs), { recursive: true })
      fs.writeFileSync(abs, content)
    }
  }
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-npm-'))
    fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true })
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  const from = () => path.join(root, 'src', 'pages', 'index.tsx')
  const ctx = () => ({ projectRoot: root, alias: {}, hasKernel: false })

  test('已安装裸包 → npm，主键 pkg#export，不用 realpath', () => {
    installPkg('vant', { 'index.js': 'module.exports = {}' })
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: 'vant', exportName: 'Button' }, ctx())
    expect(r.resolution).toBe('npm')
    expect(r.sourceKind).toBe('npm')
    expect(r.packageName).toBe('vant')
    expect(r.packageSubpath).toBeUndefined()
    expect(r.id).toBe('vant#Button')
    // resolvedFilePath 指向真实入口文件，但身份主键不含它（不用 realpath）。
    expect(r.resolvedFilePath).toContain('node_modules')
    expect(r.ownerPartial).toBe(false)
  })

  test('未安装裸包 → external（能识别为包名但无本地文件）', () => {
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: 'not-installed-pkg' }, ctx())
    expect(r.resolution).toBe('external')
    expect(r.sourceKind).toBe('external')
    expect(r.id).toBe('not-installed-pkg')
    expect(r.resolvedFilePath).toBeUndefined()
  })

  test('scope 包 + subpath → npm，主键含 subpath', () => {
    installPkg('@myorg/ui', {
      'index.js': 'module.exports = {}',
      'button/index.js': 'module.exports = {}',
    })
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '@myorg/ui/button' }, ctx())
    expect(r.resolution).toBe('npm')
    expect(r.packageName).toBe('@myorg/ui')
    expect(r.packageSubpath).toBe('button')
    expect(r.id).toBe('@myorg/ui/button#default')
  })

  test('包已装但 subpath 文件不存在 → external', () => {
    installPkg('@myorg/ui', { 'index.js': 'module.exports = {}' })
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '@myorg/ui/ghost' }, ctx())
    expect(r.resolution).toBe('external')
    expect(r.id).toBe('@myorg/ui/ghost')
  })

  test('fork 验证：包只装在 projectRoot 下、不在本模块可见路径 → 仍解析为 npm', () => {
    // 包名带随机唯一后缀，确保绝不可能被本模块自身的 node_modules 解析到——
    // 只有 {paths:[projectRoot]} 基址才能命中，证明 fork ① 生效。
    const uniq = `pg-fork-probe-${path.basename(root)}`
    installPkg(uniq, { 'index.js': 'module.exports = {}' })
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: uniq }, ctx())
    expect(r.resolution).toBe('npm')
    expect(r.packageName).toBe(uniq)
  })

  test('包根锚定 node_modules 边界：深 subpath 正确解析（非贪婪回归）', () => {
    // 包名恰好也作为包内目录名出现（entry 路径里包名多次出现），验证包根截取
    // 锚定到 node_modules/<pkg> 边界、不被贪婪吃到靠右的同名段。
    installPkg('kit', {
      'index.js': 'module.exports = {}',
      'es/kit/button.js': 'module.exports = {}', // 路径里 'kit' 再次出现
    })
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: 'kit/es/kit/button' }, ctx())
    expect(r.resolution).toBe('npm')
    expect(r.packageName).toBe('kit')
    expect(r.packageSubpath).toBe('es/kit/button')
    expect(r.id).toBe('kit/es/kit/button#default')
  })
})

// =============================================================================
// WP3.4：unresolved 终态 + 缺失候选 + 两降级面
// =============================================================================

describe('resolveComponent — unresolved 终态与降级面区分（§3.4 / §4.4）', () => {
  let root: string
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-unres-'))
    fs.mkdirSync(path.join(root, 'src', 'components'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true })
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  const from = () => path.join(root, 'src', 'pages', 'index.tsx')

  test('事实性 missing：拼错的相对路径 → unresolved，不建节点，ownerPartial=false', () => {
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '../components/Typo' },
      { projectRoot: root, alias: {}, hasKernel: false },
    )
    expect(r.resolution).toBe('unresolved')
    // 不建节点：无 id / sourceKind / resolvedFilePath
    expect(r.id).toBeUndefined()
    expect(r.sourceKind).toBeUndefined()
    expect(r.resolvedFilePath).toBeUndefined()
    // 拼错路径是事实性 missing，不降 owner 覆盖度（否则一个漏文件让全局误报 degraded）
    expect(r.ownerPartial).toBe(false)
    // 缺失候选非空，含尝试过的主文件候选
    expect(r.missingCandidates.length).toBeGreaterThan(0)
    expect(r.missingCandidates).toContain(path.join(root, 'src', 'components', 'Typo.tsx'))
    expect(r.rawSpecifier).toBe('../components/Typo')
  })

  test('工具限制类：无 platform 但存在平台后缀兄弟文件 → unresolved + ownerPartial=true', () => {
    // 只有 Only.weapp.tsx（后缀-only 组件），无无后缀主文件；无 platform 上下文下
    // 无法确定具体平台文件 → 属工具限制类降级，标 owner partial（§12① glob 判据）。
    fs.writeFileSync(path.join(root, 'src', 'components', 'Only.weapp.tsx'), 'weapp')
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '../components/Only' },
      { projectRoot: root, alias: {}, hasKernel: false }, // 无 platform
    )
    expect(r.resolution).toBe('unresolved')
    expect(r.ownerPartial).toBe(true)
  })

  test('对照：有 platform 时后缀-only 组件能解析 → local（不进 unresolved）', () => {
    fs.writeFileSync(path.join(root, 'src', 'components', 'Only.weapp.tsx'), 'weapp')
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '../components/Only' },
      { projectRoot: root, alias: {}, hasKernel: true, platform: 'weapp' },
    )
    expect(r.resolution).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(path.join(root, 'src', 'components', 'Only.weapp.tsx')))
  })

  test('工具限制类：alias 形态但 value 非字符串（展开不出）→ unresolved + ownerPartial=true', () => {
    // alias 前缀命中（classifySpecifier 判 alias），但 value 非 string 无法展开成
    // 有效路径 → alias 降级面，标 owner partial。
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '@bad/Foo' },
      { projectRoot: root, alias: { '@bad': ['not', 'a', 'string'] as unknown as string }, hasKernel: true },
    )
    expect(r.resolution).toBe('unresolved')
    expect(r.ownerPartial).toBe(true)
  })

  test('事实性 missing：alias 展开成功但目标文件不存在（拼错）→ ownerPartial=false', () => {
    // alias 能展开（value 是合法目录），但目标文件确实不存在 → 拼错的 alias 路径，
    // 属事实性 missing，不降 owner 覆盖度。
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '@comp/Ghost' },
      { projectRoot: root, alias: { '@comp': path.join(root, 'src', 'components') }, hasKernel: true },
    )
    expect(r.resolution).toBe('unresolved')
    expect(r.ownerPartial).toBe(false)
    expect(r.missingCandidates).toContain(path.join(root, 'src', 'components', 'Ghost.tsx'))
  })

  test('缺失候选随 platform 扩展：有 platform 时候选含平台后缀路径', () => {
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '../components/Nope' },
      { projectRoot: root, alias: {}, hasKernel: true, platform: 'weapp' },
    )
    expect(r.resolution).toBe('unresolved')
    expect(r.missingCandidates).toContain(path.join(root, 'src', 'components', 'Nope.weapp.tsx'))
    expect(r.missingCandidates).toContain(path.join(root, 'src', 'components', 'Nope.tsx'))
  })

  test('glob 判据不误判：仅有 .test/.spec/.d 等非平台中缀兄弟 → 事实性 missing（ownerPartial=false）', () => {
    // 只有 Widget.test.tsx / Widget.d.ts（非平台中缀），无无后缀主文件、无真平台后缀。
    // 不得把这类工具文件当平台兄弟而误标 partial（§3.4 反向误报防护）。
    fs.writeFileSync(path.join(root, 'src', 'components', 'Widget.test.tsx'), 'test')
    fs.writeFileSync(path.join(root, 'src', 'components', 'Widget.d.ts'), 'export type X = 1')
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '../components/Widget' },
      { projectRoot: root, alias: {}, hasKernel: false }, // 无 platform
    )
    expect(r.resolution).toBe('unresolved')
    expect(r.ownerPartial).toBe(false)
  })

  test('glob 判据仍识别真平台后缀：非黑名单中缀（weapp）兄弟 → partial', () => {
    // 对照上一条：真平台中缀 weapp 不在黑名单 → 仍正确判后缀-only 组件（partial）。
    fs.writeFileSync(path.join(root, 'src', 'components', 'Widget.weapp.tsx'), 'weapp')
    const r = resolveComponent(
      { fromFilePath: from(), rawSpecifier: '../components/Widget' },
      { projectRoot: root, alias: {}, hasKernel: false },
    )
    expect(r.resolution).toBe('unresolved')
    expect(r.ownerPartial).toBe(true)
  })
})

// =============================================================================
// WP3.5：barrel / re-export cycle-safe 穿透
// =============================================================================

describe('resolveComponent — barrel/re-export 穿透（§4.4 一跳非终态）', () => {
  let root: string
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-barrel-'))
    fs.mkdirSync(path.join(root, 'src', 'components'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src', 'pages'), { recursive: true })
  })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  const from = () => path.join(root, 'src', 'pages', 'index.tsx')
  const ctx = () => ({ projectRoot: root, alias: {}, hasKernel: false })
  const comp = (rel: string) => path.join(root, 'src', 'components', rel)

  test('具名 re-export 穿透到最终定义文件，身份取定义文件而非 barrel', () => {
    // barrel: index.ts 把 Button re-export 自 ./Button
    fs.writeFileSync(comp('index.ts'), `export { Button } from './Button'\n`)
    fs.writeFileSync(comp('Button.tsx'), 'export function Button(){}\n')
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Button' }, ctx())
    expect(r.resolution).toBe('local')
    // 身份穿透到 Button.tsx（定义文件），不是 index.ts（barrel）
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp('Button.tsx')))
    expect(r.id).toBe(`${fs.realpathSync(comp('Button.tsx'))}#Button`)
    // rawSpecifier 保留最初引用点
    expect(r.rawSpecifier).toBe('../components')
  })

  test('export { X as Y } 改名 re-export：来源名穿透正确', () => {
    fs.writeFileSync(comp('index.ts'), `export { Inner as Card } from './Card'\n`)
    fs.writeFileSync(comp('Card.tsx'), 'export function Inner(){}\n')
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Card' }, ctx())
    expect(r.resolution).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp('Card.tsx')))
    // 穿透后 exportName 收敛为来源名 Inner
    expect(r.id).toBe(`${fs.realpathSync(comp('Card.tsx'))}#Inner`)
  })

  test('export { default as X } from：穿透后 exportName=default', () => {
    fs.writeFileSync(comp('index.ts'), `export { default as Modal } from './Modal'\n`)
    fs.writeFileSync(comp('Modal.tsx'), 'export default function Modal(){}\n')
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Modal' }, ctx())
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp('Modal.tsx')))
    expect(r.id).toBe(`${fs.realpathSync(comp('Modal.tsx'))}#default`)
  })

  test('深链 barrel：多跳穿透到最终定义', () => {
    fs.writeFileSync(comp('index.ts'), `export { Deep } from './mid'\n`)
    fs.writeFileSync(comp('mid.ts'), `export { Deep } from './Deep'\n`)
    fs.writeFileSync(comp('Deep.tsx'), 'export function Deep(){}\n')
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Deep' }, ctx())
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp('Deep.tsx')))
  })

  test('re-export 到 npm 包：穿透后收敛 npm 终态', () => {
    // barrel 把 Button re-export 自 vant（裸包）→ 穿透后应收敛 npm
    const pkgDir = path.join(root, 'node_modules', 'vant')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name: 'vant', version: '1.0.0', main: 'index.js' }))
    fs.writeFileSync(path.join(pkgDir, 'index.js'), 'module.exports = {}')
    fs.writeFileSync(comp('index.ts'), `export { Button } from 'vant'\n`)
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Button' }, ctx())
    expect(r.resolution).toBe('npm')
    expect(r.packageName).toBe('vant')
    expect(r.id).toBe('vant#Button')
    expect(r.rawSpecifier).toBe('../components') // 保留最初引用点
  })

  test('export * from 透传同名 export', () => {
    fs.writeFileSync(comp('index.ts'), `export * from './widgets'\n`)
    fs.writeFileSync(comp('widgets.tsx'), 'export function Star(){}\n')
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Star' }, ctx())
    expect(r.resolution).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp('widgets.tsx')))
  })

  test('cycle-safe：自引用 barrel 不死循环（回退当前身份）', () => {
    // index.ts re-export 自己 → 环。穿透必须停，不死循环。
    fs.writeFileSync(comp('index.ts'), `export { Loop } from './index'\n`)
    expect(() =>
      resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Loop' }, ctx()),
    ).not.toThrow()
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components', exportName: 'Loop' }, ctx())
    // 环导致回退到 barrel 自身身份（local），关键是不崩、不死循环
    expect(r.resolution).toBe('local')
  })

  test('cycle-safe：A↔B 互引用 barrel 不死循环', () => {
    fs.writeFileSync(comp('A.ts'), `export { X } from './B'\n`)
    fs.writeFileSync(comp('B.ts'), `export { X } from './A'\n`)
    expect(() =>
      resolveComponent({ fromFilePath: from(), rawSpecifier: '../components/A', exportName: 'X' }, ctx()),
    ).not.toThrow()
  })

  test('普通组件文件（无 re-export）不受穿透影响，身份即自身', () => {
    fs.writeFileSync(comp('Plain.tsx'), 'export function Plain(){}\n')
    const r = resolveComponent({ fromFilePath: from(), rawSpecifier: '../components/Plain', exportName: 'Plain' }, ctx())
    expect(r.resolution).toBe('local')
    expect(r.resolvedFilePath).toBe(fs.realpathSync(comp('Plain.tsx')))
  })
})
