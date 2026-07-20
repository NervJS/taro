import * as path from 'node:path'

import { buildNavigationEdges, parsePageFile, urlToRouteId } from '../page-parser'

const PAGES = path.join(__dirname, '__mocks__', 'pages')

describe('urlToRouteId', () => {
  test('剥离 query', () => {
    expect(urlToRouteId('/pages/detail/index?id=1')).toBe('pages/detail/index')
  })
  test('剥离 hash', () => {
    expect(urlToRouteId('pages/detail/index#top')).toBe('pages/detail/index')
  })
  test('归一化斜杠并去首斜杠', () => {
    expect(urlToRouteId('//pages//detail/')).toBe('pages/detail')
  })
})

describe('buildNavigationEdges', () => {
  const known = new Set(['pages/index/index', 'pages/detail/index'])

  test('命中已知页面 → resolved:true', () => {
    const edges = buildNavigationEdges('pages/index/index', [{ via: 'navigateTo', url: '/pages/detail/index' }], known)
    expect(edges).toEqual([
      { kind: 'navigation', from: 'pages/index/index', to: 'pages/detail/index', via: 'navigateTo', resolved: true },
    ])
  })

  test('目标不存在 → resolved:false（悬空跳转）', () => {
    const edges = buildNavigationEdges('pages/index/index', [{ via: 'redirectTo', url: '/pages/ghost/index' }], known)
    expect(edges[0].resolved).toBe(false)
  })

  test('同页对同一目标同类跳转去重', () => {
    const edges = buildNavigationEdges(
      'pages/index/index',
      [
        { via: 'navigateTo', url: '/pages/detail/index' },
        { via: 'navigateTo', url: '/pages/detail/index?x=1' },
      ],
      known,
    )
    expect(edges).toHaveLength(1)
  })

  test('via 不同则不去重', () => {
    const edges = buildNavigationEdges(
      'pages/index/index',
      [
        { via: 'navigateTo', url: '/pages/detail/index' },
        { via: 'redirectTo', url: '/pages/detail/index' },
      ],
      known,
    )
    expect(edges).toHaveLength(2)
  })
})

describe('parsePageFile — React 识别', () => {
  test('含 JSX 的 tsx → isReactPage:true', () => {
    const p = parsePageFile(path.join(PAGES, 'react-page.tsx'), 'pages/react/index')
    expect(p.isReactPage).toBe(true)
    expect(p.readFailed).toBe(false)
  })

  test('无 JSX 的纯逻辑文件 → isReactPage:false', () => {
    const p = parsePageFile(path.join(PAGES, 'no-jsx.ts'), 'pages/plain/index')
    expect(p.isReactPage).toBe(false)
  })

  test('文件不存在 → readFailed 且告警', () => {
    const p = parsePageFile(path.join(PAGES, 'nope.tsx'), 'pages/nope/index')
    expect(p.readFailed).toBe(true)
    expect(p.warnings).toHaveLength(1)
  })
})

describe('parsePageFile — 调用识别（收紧规则）', () => {
  test('具名导入 + 别名 + 全局 Taro 命名空间都识别', () => {
    const p = parsePageFile(path.join(PAGES, 'nav-variants.tsx'), 'pages/nav/index')
    const vias = p.navigations.map((n) => `${n.via}:${n.url}`)
    expect(vias).toContain('navigateTo:/pages/a/index') // 具名导入
    expect(vias).toContain('redirectTo:/pages/b/index') // 别名 rd → redirectTo
    expect(vias).toContain('switchTab:/pages/c/index') // 全局 Taro.switchTab
  })

  test('this.navigateTo / router.navigateTo 不误报', () => {
    const p = parsePageFile(path.join(PAGES, 'nav-false-positive.tsx'), 'pages/fp/index')
    expect(p.navigations).toEqual([])
  })

  test('url 非静态字符串（变量/模板串）→ 跳过并告警', () => {
    const p = parsePageFile(path.join(PAGES, 'nav-dynamic-url.tsx'), 'pages/dyn/index')
    expect(p.navigations).toEqual([])
    expect(p.warnings.some((w) => w.kind === 'unresolved')).toBe(true)
  })
})
