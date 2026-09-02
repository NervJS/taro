import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { discoverWorkspace } from '../workspace-discovery'

describe('discoverWorkspace', () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-discovery-'))
  })

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('discovers pnpm members and applies negative globs', async () => {
    writeJson('package.json', { private: true })
    write('pnpm-workspace.yaml', "packages:\n  - 'apps/*'\n  - 'packages/*'\n  - '!apps/excluded'\n")
    writeJson('apps/app/package.json', { name: 'app' })
    writeJson('apps/excluded/package.json', { name: 'excluded' })
    writeJson('packages/lib/package.json', { name: 'lib' })

    const included = await discoverWorkspace(path.join(root, 'apps/app'))
    const excluded = await discoverWorkspace(path.join(root, 'apps/excluded'))

    expect(included).toMatchObject({ workspaceRoot: fs.realpathSync(root), kind: 'pnpm', issues: [] })
    expect(included.packages.map(pkg => pkg.relativePath)).toEqual(['apps/app', 'packages/lib'])
    expect(excluded.workspaceRoot).toBeUndefined()
  })

  it('supports package.json workspaces and selects the nearest valid root', async () => {
    writeJson('package.json', { private: true, workspaces: ['apps/*'] })
    writeJson('apps/inner/package.json', { private: true, workspaces: ['packages/*'] })
    writeJson('apps/inner/packages/app/package.json', { name: 'app' })

    const result = await discoverWorkspace(path.join(root, 'apps/inner/packages/app'))

    expect(result).toMatchObject({
      workspaceRoot: fs.realpathSync(path.join(root, 'apps/inner')),
      kind: 'workspaces',
      issues: [],
    })
  })

  it('rejects workspace patterns that escape the candidate root', async () => {
    writeJson('package.json', { private: true })
    write('pnpm-workspace.yaml', "packages:\n  - '../outside/*'\n")
    writeJson('apps/app/package.json', { name: 'app' })

    const result = await discoverWorkspace(path.join(root, 'apps/app'))

    expect(result.workspaceRoot).toBeUndefined()
    expect(result.issues).toEqual([expect.stringContaining('Workspace pattern escapes')])
  })

  it('keeps standalone projects standalone', async () => {
    writeJson('package.json', { name: 'standalone' })

    await expect(discoverWorkspace(root)).resolves.toEqual({
      projectRoot: fs.realpathSync(root),
      packages: [],
      declarationFiles: [],
      issues: [],
    })
  })

  it('skips malformed workspace members and reports a structured issue', async () => {
    writeJson('package.json', { private: true, workspaces: ['apps/*', 'packages/*'] })
    writeJson('apps/app/package.json', { name: 'app' })
    write('packages/broken/package.json', '{broken')

    const result = await discoverWorkspace(path.join(root, 'apps/app'))

    expect(result.workspaceRoot).toBe(fs.realpathSync(root))
    expect(result.packages.map(pkg => pkg.relativePath)).toEqual(['apps/app'])
    expect(result.issues).toEqual([
      expect.stringContaining('Cannot parse workspace member'),
    ])
    expect(result.issues[0]).toContain('packages/broken/package.json')
  })

  function write(relativePath: string, value: string): void {
    const target = path.join(root, relativePath)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, value)
  }

  function writeJson(relativePath: string, value: unknown): void {
    write(relativePath, `${JSON.stringify(value)}\n`)
  }
})
