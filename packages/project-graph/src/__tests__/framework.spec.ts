/**
 * framework 六值判定测试（WP5b.1，§4.1）。
 */
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { resolveFramework } from '../framework'

function tmpRootWithPkg(pkg: Record<string, unknown> | null): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-fw-'))
  if (pkg != null) fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg))
  return root
}

describe('resolveFramework — 六值判定与来源优先级（§4.1）', () => {
  let root: string
  afterEach(() => { if (root) fs.rmSync(root, { recursive: true, force: true }) })

  test('优先级 1：显式 options 最高，压过 kernel 与静态', () => {
    root = tmpRootWithPkg({ dependencies: { vue: '*' } })
    const r = resolveFramework({ explicit: 'solid', kernelFramework: 'react', projectRoot: root })
    expect(r).toEqual({ framework: 'solid', frameworkSource: 'options' })
  })

  test('优先级 2：kernel.initialConfig.framework 压过静态 package.json', () => {
    root = tmpRootWithPkg({ dependencies: { vue: '*' } })
    const r = resolveFramework({ kernelFramework: 'react', projectRoot: root })
    expect(r).toEqual({ framework: 'react', frameworkSource: 'kernel' })
  })

  test('优先级 3：静态 package.json —— Taro 框架插件（最强信号）', () => {
    root = tmpRootWithPkg({ devDependencies: { '@tarojs/plugin-framework-vue3': '*' } })
    const r = resolveFramework({ projectRoot: root })
    expect(r).toEqual({ framework: 'vue3', frameworkSource: 'static-config' })
  })

  test('静态：react 插件 → react', () => {
    root = tmpRootWithPkg({ devDependencies: { '@tarojs/plugin-framework-react': '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('react')
  })

  test('静态：solid 插件 → solid', () => {
    root = tmpRootWithPkg({ devDependencies: { '@tarojs/plugin-framework-solid': '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('solid')
  })

  test('静态：preact 依赖 → preact（先于 react 判定）', () => {
    // preact 工程常同时带 react 兼容依赖；preact 优先，避免误报 react。
    root = tmpRootWithPkg({ dependencies: { preact: '*', react: '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('preact')
  })

  test('静态：solid-js 依赖 → solid', () => {
    root = tmpRootWithPkg({ dependencies: { 'solid-js': '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('solid')
  })

  test('静态：vue 依赖 → vue3（Taro4 只支持 Vue3）', () => {
    root = tmpRootWithPkg({ dependencies: { vue: '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('vue3')
  })

  test('静态：react 依赖 → react', () => {
    root = tmpRootWithPkg({ dependencies: { react: '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('react')
  })

  test('降级：无 package.json → unknown / default（不回退 none 或 react）', () => {
    root = tmpRootWithPkg(null)
    const r = resolveFramework({ projectRoot: root })
    expect(r).toEqual({ framework: 'unknown', frameworkSource: 'default' })
  })

  test('降级：有 package.json 但无任何已知框架依赖 → unknown（诚实，不臆造 none）', () => {
    root = tmpRootWithPkg({ dependencies: { lodash: '*' } })
    expect(resolveFramework({ projectRoot: root }).framework).toBe('unknown')
  })

  test('kernel framework=vue 归一化为 vue3', () => {
    root = tmpRootWithPkg(null)
    expect(resolveFramework({ kernelFramework: 'vue', projectRoot: root }).framework).toBe('vue3')
  })

  test('kernel framework 非法值 → 落到静态/降级（不认的值不采纳）', () => {
    root = tmpRootWithPkg(null)
    // kernel 给了不认识的 framework 字符串 → 视为无效，落到降级 unknown
    expect(resolveFramework({ kernelFramework: 'angular', projectRoot: root }).framework).toBe('unknown')
  })

  test('kernel 显式 none → none（确为无框架工程）', () => {
    root = tmpRootWithPkg(null)
    expect(resolveFramework({ kernelFramework: 'none', projectRoot: root })).toEqual({
      framework: 'none',
      frameworkSource: 'kernel',
    })
  })

  test('损坏 package.json → 静态推断失败 → unknown（不崩）', () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-fw-'))
    fs.writeFileSync(path.join(root, 'package.json'), '{ broken json')
    expect(resolveFramework({ projectRoot: root }).framework).toBe('unknown')
  })
})
