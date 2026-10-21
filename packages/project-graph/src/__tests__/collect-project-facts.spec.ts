import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { collectProjectFacts, PROJECT_FACTS_COLLECTION_FEATURES } from '../collect-project-facts'
import { PROJECT_FACTS_COLLECTION_FEATURES as PUBLIC_COLLECTION_FEATURES } from '../facts-api'

describe('collectProjectFacts', () => {
  let root: string
  let localDependencyRoot: string | undefined

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'collect-project-facts-'))
    fs.mkdirSync(path.join(root, 'src', 'pages', 'index'), { recursive: true })
    fs.mkdirSync(path.join(root, 'config'), { recursive: true })
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({
      name: 'facts-fixture',
      private: true,
      packageManager: 'pnpm@10.0.0',
      scripts: { 'dev:h5': 'taro build --type h5 --watch' },
      dependencies: {
        '@tarojs/taro': '4.2.2',
        react: '18.3.1',
      },
      devDependencies: {
        '@tarojs/cli': '4.2.2',
      },
    }))
    fs.writeFileSync(path.join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n')
    fs.writeFileSync(path.join(root, 'config', 'index.ts'), "export default { sourceRoot: 'src', compiler: 'vite' }\n")
    fs.writeFileSync(path.join(root, 'src', 'app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
    fs.writeFileSync(path.join(root, 'src', 'pages', 'index', 'index.tsx'), 'export default function Index () { return null }\n')
  })

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
    if (localDependencyRoot) fs.rmSync(localDependencyRoot, { recursive: true, force: true })
    localDependencyRoot = undefined
  })

  it('collects a restorable project fact snapshot without Taro Kernel', async () => {
    fs.mkdirSync(path.join(root, 'dist'), { recursive: true })
    fs.writeFileSync(path.join(root, 'dist', 'generated.js'), 'generated')
    const snapshot = await collectProjectFacts({ root })

    expect(snapshot.schemaVersion).toBe(1)
    expect(snapshot.project).toMatchObject({
      root: path.resolve(root),
      name: 'facts-fixture',
      framework: 'react',
      compiler: 'vite',
      sourceRoot: 'src',
    })
    expect(snapshot.dependencies).toMatchObject({
      packageManager: 'pnpm',
      packageManagerVersion: '10.0.0',
      dependencies: { '@tarojs/taro': '4.2.2', react: '18.3.1' },
    })
    expect(snapshot.dependencies.lockfiles[0]).toMatchObject({
      relativePath: 'pnpm-lock.yaml',
      matchesPackageManager: true,
    })
    expect(snapshot.platform.configuredTargets).toContain('h5')
    expect(snapshot.capabilities.invocation.status).toBe('unsupported')
    expect(snapshot.capabilities.platform.status).toBe('degraded')
    expect(snapshot.workspaceManifest.entries.some(entry => entry.relativePath === 'src/pages/index/index.tsx')).toBe(true)
    expect(snapshot.workspaceManifest.entries.some(entry => entry.relativePath.startsWith('dist/'))).toBe(false)
  }, 30_000)

  it('exports the collection feature handshake through the public facts API', () => {
    expect(PROJECT_FACTS_COLLECTION_FEATURES).toEqual(['excludedPaths', 'excludedAbsolutePaths'])
    expect(PUBLIC_COLLECTION_FEATURES).toBe(PROJECT_FACTS_COLLECTION_FEATURES)
  })

  it('really excludes custom absolute directories before sending content to the sink', async () => {
    const owned = path.join(root, 'custom-pilot-data')
    for (const directory of [owned, path.join(root, 'custom-output'), path.join(root, 'dist')]) {
      fs.mkdirSync(directory)
      fs.writeFileSync(path.join(directory, 'data.txt'), 'generated')
    }
    fs.writeFileSync(path.join(root, 'config', 'index.ts'), "export default { sourceRoot: 'src', outputRoot: 'custom-output' }\n")
    const captured: string[] = []
    const snapshot = await collectProjectFacts({
      root,
      excludedAbsolutePaths: [owned, path.join(root, 'not-created-yet')],
      contentSink: {
        async begin(entry) {
          captured.push(entry.relativePath)
          return { async write() {}, async commit() {}, async abort() {} }
        },
      },
    })
    expect(snapshot.workspaceManifest.entries.some(entry => entry.relativePath.startsWith('custom-pilot-data/'))).toBe(false)
    expect(captured.some(value => /^(custom-pilot-data|custom-output|dist)\//.test(value))).toBe(false)
    expect(captured).toContain('src/pages/index/index.tsx')
  })

  it.each(['relative-external', 'absolute-external', 'relative-self', 'absolute-self', 'relative-internal', 'absolute-internal', 'dot-prefix-internal'])(
    'keeps metadata and source files with a %s generated output root', async kind => {
      const canonicalRoot = fs.realpathSync.native(root)
      const outputRoots: Record<string, string> = {
        'relative-external': '../dist',
        'absolute-external': path.join(path.dirname(canonicalRoot), 'external-output'),
        'relative-self': '.',
        'absolute-self': canonicalRoot,
        'relative-internal': 'custom-output',
        'absolute-internal': path.join(canonicalRoot, 'custom-output'),
        'dot-prefix-internal': '..foo',
      }
      const outputRoot = outputRoots[kind]
      for (const directory of ['dist', 'custom-output', '..foo']) {
        fs.mkdirSync(path.join(root, directory))
        fs.writeFileSync(path.join(root, directory, 'data.txt'), 'generated')
      }
      fs.writeFileSync(path.join(root, 'config', 'index.ts'), `export default { sourceRoot: 'src', outputRoot: '${outputRoot}' }\n`)

      const snapshot = await collectProjectFacts({ root })
      const paths = snapshot.workspaceManifest.entries.map(entry => entry.relativePath)
      expect(snapshot.project.outputRoot).toBe(outputRoot)
      expect(paths).toContain('src/pages/index/index.tsx')
      expect(paths).toContain('package.json')
      expect(paths).not.toContain('dist/data.txt')
      expect(paths.includes('custom-output/data.txt')).toBe(!['relative-internal', 'absolute-internal'].includes(kind))
      expect(paths.includes('..foo/data.txt')).toBe(kind !== 'dot-prefix-internal')
    }
  )

  it('excludes a native generated directory named ..foo without mistaking it for an ancestor', async () => {
    fs.mkdirSync(path.join(root, '..foo'))
    fs.writeFileSync(path.join(root, '..foo', 'data.txt'), 'generated')
    fs.writeFileSync(path.join(root, 'config', 'index.ts'), "export default { sourceRoot: 'src', projectPath: path.resolve(__dirname, '..foo') }\n")
    const snapshot = await collectProjectFacts({ root })
    expect(snapshot.workspaceManifest.entries.some(entry => entry.relativePath === '..foo/data.txt')).toBe(false)
    expect(snapshot.workspaceManifest.entries.some(entry => entry.relativePath === 'src/pages/index/index.tsx')).toBe(true)
  })

  it('combines caller relative exclusions with generated paths for every actual root', async () => {
    localDependencyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'collect-project-local-dependency-'))
    fs.writeFileSync(path.join(localDependencyRoot, 'package.json'), '{"name":"external"}')
    for (const directory of [root, localDependencyRoot]) {
      fs.mkdirSync(path.join(directory, 'taro-pilot-callback-workspaces'))
      fs.writeFileSync(path.join(directory, 'taro-pilot-callback-workspaces', 'data.txt'), 'owned')
    }
    fs.mkdirSync(path.join(root, 'dist'))
    fs.writeFileSync(path.join(root, 'dist', 'bundle.js'), 'generated')
    const snapshot = await collectProjectFacts({
      root,
      excludedPaths: ['taro-pilot-callback-workspaces'],
      captureContext: { workspaceRoots: [{ rootId: 'external', role: 'external-project', originalPath: localDependencyRoot }] },
    })
    expect(snapshot.workspaceManifest.entries.some(entry => /^(taro-pilot-callback-workspaces|dist)\//.test(entry.relativePath))).toBe(false)
    expect(snapshot.workspaceManifest.entries).toContainEqual(expect.objectContaining({ rootId: 'external', relativePath: 'package.json' }))
  })

  it.each(['absolute', 'ancestor'])('still rejects %s values in caller relative exclusions', async kind => {
    const excludedPath = kind === 'absolute' ? path.join(root, 'owned') : '../dist'
    await expect(collectProjectFacts({ root, excludedPaths: [excludedPath] }))
      .rejects.toThrow('Excluded path must stay inside its workspace root')
  })

  it('rejects relative exclusions rather than treating them as generated paths', async () => {
    await expect(collectProjectFacts({ root, excludedAbsolutePaths: ['custom-pilot-data'] }))
      .rejects.toThrow('Excluded path must be absolute')
  })

  it('preserves relative placement for a local dependency outside the project', async () => {
    localDependencyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'collect-project-local-dependency-'))
    fs.writeFileSync(path.join(localDependencyRoot, 'package.json'), JSON.stringify({ name: 'local-fixture' }))
    const manifestPath = path.join(root, 'package.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    manifest.dependencies['local-fixture'] = `file:${path.relative(root, localDependencyRoot)}`
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))

    const snapshot = await collectProjectFacts({ root })
    expect(snapshot.workspaceManifest.roots).toContainEqual(expect.objectContaining({
      role: 'local-dependency',
      originalPath: fs.realpathSync.native(localDependencyRoot),
      relativePlacement: path.relative(fs.realpathSync.native(root), fs.realpathSync.native(localDependencyRoot)).replaceAll(path.sep, '/'),
    }))
  })

  it.each(['file', 'link'] as const)('does not treat a local %s tarball as a workspace root', async protocol => {
    const packagePath = path.join(root, 'package.json')
    const tarballPath = path.join(root, 'local-plugin.tgz')
    const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    manifest.dependencies['@fixture/local-plugin'] = `${protocol}:./local-plugin.tgz`
    fs.writeFileSync(packagePath, JSON.stringify(manifest))
    fs.writeFileSync(tarballPath, 'fixture')

    const snapshot = await collectProjectFacts({ root })

    expect(snapshot.workspaceManifest.roots).not.toContainEqual(expect.objectContaining({
      originalPath: tarballPath,
    }))
  })

  it('captures a parent workspace and only the selected local dependency closure', async () => {
    const workspaceRoot = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'collect-monorepo-facts-')))
    try {
      const projectRoot = path.join(workspaceRoot, 'apps', 'demo')
      const sharedRoot = path.join(workspaceRoot, 'packages', 'shared')
      const unusedRoot = path.join(workspaceRoot, 'packages', 'unused')
      fs.mkdirSync(path.join(projectRoot, 'src'), { recursive: true })
      fs.mkdirSync(sharedRoot, { recursive: true })
      fs.mkdirSync(unusedRoot, { recursive: true })
      fs.writeFileSync(path.join(workspaceRoot, 'pnpm-workspace.yaml'), "packages:\n  - 'apps/*'\n  - 'packages/*'\n")
      fs.writeFileSync(path.join(workspaceRoot, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n')
      fs.writeFileSync(path.join(workspaceRoot, 'package.json'), JSON.stringify({
        name: '@fixture/root',
        private: true,
        packageManager: 'pnpm@10.0.0',
      }))
      fs.writeFileSync(path.join(workspaceRoot, 'root-only.txt'), 'must not be captured')
      fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify({
        name: '@fixture/demo',
        private: true,
        dependencies: { '@fixture/shared': 'workspace:*', '@tarojs/taro': '4.2.2' },
      }))
      fs.writeFileSync(path.join(projectRoot, 'src', 'app.config.ts'), 'export default { pages: [] }\n')
      fs.writeFileSync(path.join(sharedRoot, 'package.json'), JSON.stringify({ name: '@fixture/shared' }))
      fs.writeFileSync(path.join(sharedRoot, 'index.ts'), 'export const shared = true\n')
      fs.writeFileSync(path.join(unusedRoot, 'package.json'), JSON.stringify({ name: '@fixture/unused' }))
      fs.writeFileSync(path.join(unusedRoot, 'index.ts'), 'export const unused = true\n')

      const snapshot = await collectProjectFacts({ root: projectRoot })

      expect(snapshot.workspaces).toMatchObject({
        packageManagerWorkspace: true,
        workspaceRootId: 'workspace-root',
        workspaceKind: 'pnpm',
      })
      expect(snapshot.workspaces.packages.find(pkg => pkg.name === '@fixture/shared')?.selected).toBe(true)
      const unusedPackage = snapshot.workspaces.packages.find(pkg => pkg.name === '@fixture/unused')
      expect(unusedPackage?.selected).toBe(false)
      expect(snapshot.workspaceManifest.roots).toEqual(expect.arrayContaining([
        expect.objectContaining({ rootId: 'project', role: 'project', relativePlacement: 'apps/demo' }),
        expect.objectContaining({ rootId: 'workspace-root', role: 'workspace-root' }),
        expect.objectContaining({ role: 'workspace-package', originalPath: sharedRoot }),
      ]))
      expect(snapshot.workspaceManifest.entries).toEqual(expect.arrayContaining([
        expect.objectContaining({ rootId: 'workspace-root', relativePath: 'pnpm-workspace.yaml' }),
        expect.objectContaining({ rootId: 'workspace-root', relativePath: 'pnpm-lock.yaml' }),
        expect.objectContaining({ rootId: 'project', relativePath: 'src/app.config.ts' }),
        expect.objectContaining({ relativePath: 'index.ts' }),
      ]))
      expect(snapshot.workspaceManifest.entries.some(entry => (
        entry.rootId === 'workspace-root' && entry.relativePath === 'root-only.txt'
      ))).toBe(false)
      expect(snapshot.workspaceManifest.entries.some(entry => entry.rootId === unusedPackage?.rootId)).toBe(false)
      expect(snapshot.dependencies.lockfiles).toEqual([
        expect.objectContaining({ rootId: 'workspace-root', relativePath: 'pnpm-lock.yaml', kind: 'pnpm' }),
      ])
    } finally {
      fs.rmSync(workspaceRoot, { recursive: true, force: true })
    }
  })

  it('records cnpm as the actual installer without relabeling its npm lockfile', async () => {
    const packagePath = path.join(root, 'package.json')
    const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    manifest.packageManager = 'cnpm@9.4.0'
    fs.writeFileSync(packagePath, JSON.stringify(manifest))
    fs.rmSync(path.join(root, 'pnpm-lock.yaml'))
    fs.writeFileSync(path.join(root, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3 }))

    const snapshot = await collectProjectFacts({
      root,
      captureContext: {
        invocation: {
          launcher: { executable: 'cnpm', argv: ['run', 'dev:h5'], packageScript: 'dev:h5' },
          process: { executable: process.execPath, argv: ['taro', 'build', '--type', 'h5'], cwdRootId: 'project' },
          runOptions: { type: 'h5' },
          effectiveConfigDigest: `sha256:${'a'.repeat(64)}`,
          mode: 'build',
        },
      },
    })

    expect(snapshot.dependencies.packageManager).toBe('cnpm')
    expect(snapshot.dependencies.lockfiles).toEqual([
      expect.objectContaining({ kind: 'npm', matchesPackageManager: false }),
    ])
  })
})
