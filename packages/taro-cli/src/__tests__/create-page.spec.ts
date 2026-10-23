import * as os from 'node:os'
import * as path from 'node:path'

import { babelKit, fs } from '@tarojs/helper'

import Page, { ConfigModificationState } from '../create/page'
import { modifyPagesOrSubPackages } from '../util/createPage'

// Config updates do not use the native template generator.
jest.mock('@tarojs/binding', () => ({
  CompilerType: { Webpack5: 'webpack5' },
  CSSType: { None: 'none' },
  FrameworkType: { React: 'react' }
}))

function updateConfig (source: string, subPkgRootPath?: string) {
  const ast = babelKit.parse(source, { sourceType: 'module' })!
  const originalCode = babelKit.generate(ast, { compact: true }).code
  const callback = jest.fn()
  babelKit.traverse(ast, {
    ExportDefaultDeclaration (path) {
      modifyPagesOrSubPackages({
        path,
        fullPagePath: subPkgRootPath ? `${subPkgRootPath}/new/index` : 'pages/new/index',
        subPkgRootPath,
        callback
      })
    }
  })
  expect(callback).toHaveBeenCalledTimes(1)
  return {
    state: callback.mock.calls[0][0],
    code: babelKit.generate(ast, { compact: true }).code,
    originalCode
  }
}

describe.each(['object', 'defineAppConfig'])('create page config: %s', (format) => {
  const wrap = (config: string) => `export default ${format === 'object' ? config : `defineAppConfig(${config})`}`

  it.each([
    'pages: ["pages/home/index"]',
    '"pages": ["pages/home/index"]',
    '...baseConfig, pages: ["pages/home/index"]',
    '...baseConfig, "pages": ["pages/home/index"]',
    'get pages() { return [] }, "pages": ["pages/home/index"]',
    '[pages]: [], "pages": ["pages/home/index"]'
  ])('appends to explicit pages: %s', (properties) => {
    const result = updateConfig(wrap(`{ ${properties} }`))
    expect(result.state).toBe(ConfigModificationState.Success)
    expect(result.code).toContain('["pages/home/index","pages/new/index"]')
    if (properties.includes('...baseConfig')) expect(result.code).toContain('...baseConfig')
    if (properties.includes('[pages]')) expect(result.code).toContain('[pages]:[]')
  })

  it.each(['pages', '"pages"'])('does not duplicate an existing page: %s', (key) => {
    const result = updateConfig(wrap(`{ ${key}: ["pages/new/index"] }`))
    expect(result.state).toBe(ConfigModificationState.NeedLess)
    expect(result.code).toBe(result.originalCode)
  })

  it.each([
    ['"pages"', 'pages'],
    ['pages', '"pages"'],
    ['pages', 'pages'],
    ['"pages"', '"pages"']
  ])('updates the last pages property: %s followed by %s', (firstKey, lastKey) => {
    const result = updateConfig(wrap(`{ ${firstKey}: ["ignored"], ${lastKey}: ["pages/home/index"] }`))
    expect(result.state).toBe(ConfigModificationState.Success)
    expect(result.code).toContain(`${firstKey}:["ignored"]`)
    expect(result.code).toContain(`${lastKey}:["pages/home/index","pages/new/index"]`)
  })

  it('checks duplicates in the last pages property', () => {
    const result = updateConfig(wrap('{ "pages": [], pages: ["pages/new/index"] }'))
    expect(result.state).toBe(ConfigModificationState.NeedLess)
    expect(result.code).toBe(result.originalCode)
  })

  it('leaves a nonliteral last pages property unchanged', () => {
    const result = updateConfig(wrap('{ "pages": [], pages: pageList }'))
    expect(result.state).toBe(ConfigModificationState.Fail)
    expect(result.code).toBe(result.originalCode)
  })

  it.each([
    '{}',
    '{ ...baseConfig }',
    '{ pages: pageList }',
    '{ [pages]: [] }',
    '{ ["pages"]: [] }',
    '{ pages() { return [] } }'
  ])('leaves unsupported pages config unchanged: %s', (config) => {
    const result = updateConfig(wrap(config))
    expect(result.state).toBe(ConfigModificationState.Fail)
    expect(result.code).toBe(result.originalCode)
  })

  it.each([
    'subPackages: [{ root: "pkg/", pages: ["home/index"] }]',
    '"subPackages": [{ "root": "pkg/", "pages": ["home/index"] }]',
    '...baseConfig, "subPackages": [{ ...subConfig, "root": "pkg/", "pages": ["home/index"] }]',
    'subPackages: [{ root() {}, root: "pkg/", pages() {}, pages: ["home/index"] }]'
  ])('updates an existing subpackage: %s', (properties) => {
    const result = updateConfig(wrap(`{ ${properties} }`), 'pkg')
    expect(result.state).toBe(ConfigModificationState.Success)
    expect(result.code).toContain('["home/index","new/index"]')
    expect(result.code.match(/"pkg\/"/g)).toHaveLength(1)
  })

  it('does not duplicate a page in a quoted subpackage config', () => {
    const result = updateConfig(wrap('{ "subPackages": [{ "root": "pkg/", "pages": ["new/index"] }] }'), 'pkg')
    expect(result.state).toBe(ConfigModificationState.NeedLess)
    expect(result.code).toBe(result.originalCode)
  })

  it.each([
    '{ "subPackages": [{ root: "ignored/", pages: [] }], subPackages: [{ root: "pkg/", pages: ["home/index"] }] }',
    '{ subPackages: [{ "root": "ignored/", root: "pkg/", pages: ["home/index"] }] }',
    '{ subPackages: [{ root: "pkg/", "pages": ["ignored"], pages: ["home/index"] }] }'
  ])('updates the effective subpackage properties: %s', (config) => {
    const result = updateConfig(wrap(config), 'pkg')
    expect(result.state).toBe(ConfigModificationState.Success)
    expect(result.code).toContain('pages:["home/index","new/index"]')
    expect(result.code).toContain('"ignored')
    expect(result.code.match(/"pkg\/"/g)).toHaveLength(1)
  })

  it('matches the root property instead of an unrelated string value', () => {
    const result = updateConfig(wrap('{ subPackages: [{ name: "pkg/", root: "other/", pages: [] }, { "root": "pkg/", "pages": ["home/index"] }] }'), 'pkg')
    expect(result.state).toBe(ConfigModificationState.Success)
    expect(result.code).toContain('root:"other/",pages:[]')
    expect(result.code).toContain('"root":"pkg/","pages":["home/index","new/index"]')
  })

  it('adds a missing subPackages property after a spread', () => {
    const result = updateConfig(wrap('{ ...baseConfig, pages: [] }'), 'pkg')
    expect(result.state).toBe(ConfigModificationState.Success)
    expect(result.code).toContain('...baseConfig')
    expect(result.code).toContain('subPackages:[{root:"pkg/",pages:["new/index"]}]')
  })

  it.each([
    '{ "subPackages": subPackages }',
    '{ "subPackages": [{ "root": "pkg/", "pages": pageList }] }'
  ])('leaves nonliteral subpackage configs unchanged: %s', (config) => {
    const result = updateConfig(wrap(config), 'pkg')
    expect(result.state).toBe(ConfigModificationState.Fail)
    expect(result.code).toBe(result.originalCode)
  })
})

it.each(['defineAppConfig()', 'defineAppConfig(config)', 'defineAppConfig(null)'])(
  'leaves a non-object config unchanged: %s', (config) => {
    for (const subPkgRootPath of [undefined, 'pkg']) {
      const result = updateConfig(`export default ${config}`, subPkgRootPath)
      expect(result.state).toBe(ConfigModificationState.Fail)
      expect(result.code).toBe(result.originalCode)
    }
  }
)

describe('create page config file updates', () => {
  let projectDir: string

  beforeEach(() => {
    projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taro-create-page-'))
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    fs.removeSync(projectDir)
    jest.restoreAllMocks()
  })

  it.each(['js', 'ts'])('writes the new page to app.config.%s', (extension) => {
    const configPath = path.join(projectDir, 'src', `app.config.${extension}`)
    const baseConfig = extension === 'ts' ? 'const baseConfig: { window?: object } = {}' : 'const baseConfig = {}'
    fs.outputFileSync(configPath, `${baseConfig}\nexport default defineAppConfig({ ...baseConfig, "pages": ["pages/home/index"] })`)
    const page = Object.create(Page.prototype)
    page.conf = { projectDir, typescript: extension === 'ts' }
    page.pageEntryPath = '/src/pages/new/index'

    page.updateAppConfig()
    const updated = fs.readFileSync(configPath, 'utf8')
    expect(updated).toContain('pages/home/index')
    expect(updated).toContain('pages/new/index')
    expect(updated).toContain('...baseConfig')

    page.updateAppConfig()
    expect(fs.readFileSync(configPath, 'utf8')).toBe(updated)
  })
})
