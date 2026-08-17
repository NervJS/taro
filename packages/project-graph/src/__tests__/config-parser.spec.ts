import * as path from 'node:path'

import { normalizeRoute, parseAppConfig } from '../config-parser'

const MOCKS = path.join(__dirname, '__mocks__')

describe('normalizeRoute', () => {
  test('统一反斜杠为正斜杠', () => {
    expect(normalizeRoute('pages\\index\\index')).toBe('pages/index/index')
  })
  test('折叠重复斜杠', () => {
    expect(normalizeRoute('pages//index///index')).toBe('pages/index/index')
  })
  test('去首尾斜杠', () => {
    expect(normalizeRoute('/pages/index/')).toBe('pages/index')
  })
  test('空串返回空串', () => {
    expect(normalizeRoute('')).toBe('')
  })
})

describe('parseAppConfig', () => {
  test('普通 config：主包 pages 全部解析为路由', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-basic'))
    expect(parsed.app.filePath).toContain('app.config.ts')
    expect(parsed.app.id).toBe('app')
    expect(parsed.app.configAnalyzerStatus).toBe('complete')
    expect(parsed.pageRoutes.map((r) => r.id)).toEqual([
      'pages/index/index',
      'pages/detail/index',
    ])
    expect(parsed.issues).toEqual([])
  })

  test('defineAppConfig 包裹：等价于直接对象', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-define'))
    expect(parsed.pageRoutes.map((r) => r.id)).toContain('pages/index/index')
    expect(parsed.issues).toEqual([])
  })

  test('分包：加 root 前缀并标 inSubpackage', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-subpackage'))
    const sub = parsed.pageRoutes.find((r) => r.inSubpackage != null)
    expect(sub).toBeDefined()
    expect(sub!.id).toBe('pkgA/pages/foo')
    expect(sub!.inSubpackage).toBe('pkgA')
  })

  test('tabBar.pagePath 不在 pages 内 → empty-route issue', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-tabbar-broken'))
    const issue = parsed.issues.find((i) => i.kind === 'empty-route')
    expect(issue).toBeDefined()
    expect(issue!.message).toContain('tabBar')
    expect(issue!.routePath).toBe('pages/ghost/index')
    // 事实性 missing，非工具限制：不降级 configAnalyzerStatus。
    expect(parsed.app.configAnalyzerStatus).toBe('complete')
  })

  test('pages 为空 → parse-failed issue（不静默产出空清单）', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-empty-pages'))
    expect(parsed.pageRoutes).toEqual([])
    expect(parsed.issues.some((i) => i.kind === 'parse-failed')).toBe(true)
    expect(parsed.app.configAnalyzerStatus).toBe('failed')
  })

  test('非字符串 / 空串页面项被丢弃，降级 configAnalyzerStatus（不误判为合法页面）', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-dirty-pages'))
    // 只有合法字符串页面进清单
    expect(parsed.pageRoutes.map((r) => r.id)).toEqual(['pages/index/index'])
    // 丢弃项不产 issue，只降级 status（事实性丢弃，非工具限制）
    expect(parsed.issues).toEqual([])
    expect(parsed.app.configAnalyzerStatus).toBe('partial')
  })

  test('找不到 app.config → parse-failed 且返回空 IAppNode', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'does-not-exist'))
    expect(parsed.app.filePath).toBe('')
    expect(parsed.app.id).toBe('app')
    expect(parsed.app.configAnalyzerStatus).toBe('failed')
    expect(parsed.pageRoutes).toEqual([])
    expect(parsed.issues[0]?.kind).toBe('parse-failed')
  })

  test('app.config 语法错误 → parse-failed（不静默当空配置）', () => {
    const parsed = parseAppConfig(path.join(MOCKS, 'app-broken-syntax'))
    // 找到了文件但解析抛错：filePath 指向该文件、pageRoutes 空、带解析失败 issue
    expect(parsed.app.filePath).toContain('app.config.ts')
    expect(parsed.app.configAnalyzerStatus).toBe('failed')
    expect(parsed.pageRoutes).toEqual([])
    expect(parsed.issues.some((i) => i.kind === 'parse-failed')).toBe(true)
  })
})
