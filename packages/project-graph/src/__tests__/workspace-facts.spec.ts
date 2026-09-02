import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { IInvocationFacts } from '../facts'
import type { IWorkspaceDiscovery, IWorkspacePackageDescriptor } from '../workspace-discovery'
import { buildDiscoveredWorkspaceState } from '../workspace-facts'

describe('workspace facts', () => {
  let fixtureRoot: string
  let workspaceRoot: string

  beforeEach(() => {
    fixtureRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-facts-')))
    workspaceRoot = path.join(fixtureRoot, 'workspace')
    fs.mkdirSync(workspaceRoot)
  })

  afterEach(() => {
    fs.rmSync(fixtureRoot, { recursive: true, force: true })
  })

  it('selects the project, root importer, transitive local dependencies, and invocation tool', async () => {
    const projectRoot = createPackage('apps/demo', {
      name: '@fixture/demo',
      dependencies: { '@fixture/shared': 'workspace:*', '@fixture/missing': 'workspace:*' },
    })
    createPackage('packages/shared', {
      name: '@fixture/shared',
      dependencies: { '@fixture/deep': '^1.0.0' },
    })
    createPackage('packages/deep', { name: '@fixture/deep' })
    const toolRoot = createPackage('packages/tool', { name: '@fixture/tool' })
    createPackage('packages/unrelated', { name: '@fixture/unrelated' })
    fs.writeFileSync(path.join(workspaceRoot, 'package.json'), JSON.stringify({
      name: '@fixture/root',
      private: true,
      packageManager: 'pnpm@10.0.0',
      devDependencies: {
        '@fixture/root-missing': 'workspace:*',
        '@fixture/unrelated': 'workspace:*',
      },
    }))
    const toolExecutable = path.join(toolRoot, 'bin.js')
    fs.writeFileSync(toolExecutable, '')

    const discovery: IWorkspaceDiscovery = {
      projectRoot,
      workspaceRoot,
      kind: 'pnpm',
      packages: packageDescriptors(),
      declarationFiles: ['pnpm-workspace.yaml'],
      issues: [],
    }
    const invocation: IInvocationFacts = {
      process: { executable: process.execPath, argv: [toolExecutable], cwdRootId: 'project' },
      runOptions: {},
      effectiveConfigDigest: 'sha256:fixture',
      mode: 'build',
    }

    const state = await buildDiscoveredWorkspaceState(
      discovery,
      JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')),
      invocation
    )

    expect(state).toBeDefined()
    expect(state?.roots).toEqual(expect.arrayContaining([
      expect.objectContaining({ rootId: 'workspace-root', role: 'workspace-root', originalPath: workspaceRoot }),
      expect.objectContaining({ rootId: 'project', role: 'project', originalPath: projectRoot, relativePlacement: 'apps/demo' }),
      expect.objectContaining({ role: 'workspace-package', originalPath: path.join(workspaceRoot, 'packages/shared') }),
      expect.objectContaining({ role: 'workspace-package', originalPath: path.join(workspaceRoot, 'packages/deep') }),
      expect.objectContaining({ role: 'workspace-package', originalPath: toolRoot }),
    ]))
    expect(state?.roots.some(root => root.originalPath.endsWith('packages/unrelated'))).toBe(false)
    expect(state?.topology.packages.find(pkg => pkg.name === '@fixture/unrelated')?.selected).toBe(false)
    expect(state?.topology.packages.find(pkg => pkg.name === '@fixture/tool')?.selectionReasons).toContain('invocation-tool')
    expect(state?.topology.unresolvedLocalDependencies).toEqual([
      expect.objectContaining({ fromRootId: 'project', name: '@fixture/missing' }),
    ])
    expect(state?.includedPathsByRoot?.['workspace-root']).toEqual(expect.arrayContaining([
      '.yarn/plugins',
      '.yarn/releases',
      'package.json',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
    ]))
  })

  it.each(['file', 'link'] as const)('places external %s dependencies relative to the workspace root', async protocol => {
    const externalRoot = path.join(fixtureRoot, 'external-library')
    fs.mkdirSync(externalRoot)
    fs.writeFileSync(path.join(externalRoot, 'package.json'), JSON.stringify({ name: '@fixture/external' }))
    const projectRoot = createPackage('apps/demo', {
      name: '@fixture/demo',
      dependencies: { '@fixture/external': `${protocol}:../../../external-library` },
    })
    fs.writeFileSync(path.join(workspaceRoot, 'package.json'), JSON.stringify({
      name: '@fixture/root',
      private: true,
      packageManager: 'pnpm@10.0.0',
    }))

    const discovery: IWorkspaceDiscovery = {
      projectRoot,
      workspaceRoot,
      kind: 'pnpm',
      packages: [{
        root: projectRoot,
        relativePath: 'apps/demo',
        manifest: JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')),
      }],
      declarationFiles: ['pnpm-workspace.yaml'],
      issues: [],
    }

    const state = await buildDiscoveredWorkspaceState(
      discovery,
      JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
    )

    expect(state?.roots).toContainEqual(expect.objectContaining({
      role: 'local-dependency',
      originalPath: externalRoot,
      relativePlacement: '../external-library',
    }))
  })

  function createPackage(relativePath: string, manifest: Record<string, unknown>): string {
    const root = path.join(workspaceRoot, relativePath)
    fs.mkdirSync(root, { recursive: true })
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(manifest))
    return root
  }

  function packageDescriptors(): IWorkspacePackageDescriptor[] {
    return ['apps/demo', 'packages/shared', 'packages/deep', 'packages/tool', 'packages/unrelated'].map(relativePath => ({
      root: path.join(workspaceRoot, relativePath),
      relativePath,
      manifest: JSON.parse(fs.readFileSync(path.join(workspaceRoot, relativePath, 'package.json'), 'utf8')),
    }))
  }
})
