import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { collectProjectFacts } from '../collect-project-facts'

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
      originalPath: fs.realpathSync(localDependencyRoot),
      relativePlacement: path.relative(fs.realpathSync(root), fs.realpathSync(localDependencyRoot)).replaceAll(path.sep, '/'),
    }))
  })

  it('captures a parent workspace and only the selected local dependency closure', async () => {
    const workspaceRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'collect-monorepo-facts-')))
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
      fs.writeFileSync(path.join(projectRoot, 'src', 'app.config.ts'), "export default { pages: [] }\n")
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
