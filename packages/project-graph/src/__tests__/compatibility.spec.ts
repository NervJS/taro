import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { collectProjectFacts } from '../collect-project-facts'
import { projectFactsToProjectProfile, projectFactsToStaticProjectGraph } from '../compatibility'

describe('Pilot fact compatibility projections', () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'facts-compatibility-'))
    fs.mkdirSync(path.join(root, 'src', 'pages', 'index'), { recursive: true })
    fs.mkdirSync(path.join(root, 'src', 'components', 'card'), { recursive: true })
    fs.mkdirSync(path.join(root, 'config'), { recursive: true })
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({
      name: 'projection-fixture',
      packageManager: 'pnpm@10.0.0',
      dependencies: { '@tarojs/taro': '4.2.2', react: '18.3.1' },
    }))
    fs.writeFileSync(path.join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n')
    fs.writeFileSync(path.join(root, 'config', 'index.ts'), "export default { sourceRoot: 'src', compiler: 'vite' }\n")
    fs.writeFileSync(path.join(root, 'src', 'app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
    fs.writeFileSync(path.join(root, 'src', 'pages', 'index', 'index.config.ts'), "export default { usingComponents: { Card: '../../components/card/index' } }\n")
    fs.writeFileSync(path.join(root, 'src', 'pages', 'index', 'index.tsx'), "import Card from '../../components/card/index'; export default () => <Card />\n")
    fs.writeFileSync(path.join(root, 'src', 'components', 'card', 'index.tsx'), 'export default () => null\n')
  })

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('projects the legacy profile and static graph without Pilot-owned analysis fields', async () => {
    const snapshot = await collectProjectFacts({ root })
    const profile = projectFactsToProjectProfile(snapshot)
    const staticGraph = projectFactsToStaticProjectGraph(snapshot)

    expect(profile).toMatchObject({
      root: path.resolve(root),
      framework: 'react',
      compiler: 'vite',
      taroVersion: '4.2.2',
      packageManager: 'pnpm',
      sourceRoot: 'src',
    })
    expect(staticGraph.summary.pageCount).toBe(1)
    expect(staticGraph.summary.componentCount).toBe(1)
    expect(staticGraph.pages[0]).toMatchObject({ route: 'pages/index/index' })
    expect(staticGraph.edges.some(edge => edge.kind === 'import')).toBe(true)
  })

  it('preserves all legacy target platforms and configured plugins', async () => {
    const packagePath = path.join(root, 'package.json')
    const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    manifest.scripts = {
      'build:weapp': 'taro build --type weapp',
      'build:jd': 'taro build --type jd',
      'build:tt': 'taro build --type tt',
      'build:swan': 'taro build --type swan',
      'build:alipay': 'taro build --type alipay',
      'build:qq': 'taro build --type qq',
    }
    fs.writeFileSync(packagePath, JSON.stringify(manifest))
    const configuredPlugins = [
      '@tarojs/plugin-platform-h5',
      '@tarojs/plugin-platform-dynamic',
      '@tarojs/plugin-platform-jdharmony',
      '@fixture/plugin-custom',
    ]
    fs.writeFileSync(path.join(root, 'config', 'index.ts'), [
      "export default { sourceRoot: 'src', compiler: 'vite',",
      `  plugins: ${JSON.stringify(configuredPlugins)}`,
      '}',
      '',
    ].join('\n'))

    const profile = projectFactsToProjectProfile(await collectProjectFacts({ root }))

    expect(profile.platforms).toEqual([
      'weapp',
      'jd',
      'tt',
      'swan',
      'alipay',
      'qq',
      'h5',
      'dynamic',
      'jdharmony_cpp',
    ])
    expect(profile.configuredPlugins).toEqual(configuredPlugins)
  })

  it('resolves a parent workspace lockfile from its captured root', async () => {
    const projectRoot = path.join(root, 'apps', 'demo')
    fs.mkdirSync(path.join(projectRoot, 'src'), { recursive: true })
    fs.writeFileSync(path.join(root, 'pnpm-workspace.yaml'), "packages:\n  - 'apps/*'\n")
    fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify({
      name: '@fixture/demo',
      private: true,
      dependencies: { '@tarojs/taro': '4.2.2' },
    }))
    fs.writeFileSync(path.join(projectRoot, 'src', 'app.config.ts'), 'export default { pages: [] }\n')

    const profile = projectFactsToProjectProfile(await collectProjectFacts({ root: projectRoot }))

    expect(profile.lockfiles).toContainEqual(expect.objectContaining({
      kind: 'pnpm',
      path: path.join(fs.realpathSync(root), 'pnpm-lock.yaml'),
    }))
  })
})
