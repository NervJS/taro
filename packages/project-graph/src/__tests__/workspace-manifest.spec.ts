import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { collectWorkspaceManifest } from '../workspace-manifest'

import type { IContentSink, IContentWriter, IWorkspaceContentEntry } from '../facts'

describe('workspace manifest', () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'project-facts-'))
    fs.mkdirSync(path.join(root, 'src'), { recursive: true })
    fs.mkdirSync(path.join(root, 'node_modules', 'ignored'), { recursive: true })
    fs.mkdirSync(path.join(root, '.git'), { recursive: true })
    fs.writeFileSync(path.join(root, 'package.json'), '{"name":"fixture"}\n')
    fs.writeFileSync(path.join(root, 'src', 'index.ts'), 'export default 1\n')
    fs.writeFileSync(path.join(root, 'node_modules', 'ignored', 'index.js'), 'ignored')
    fs.writeFileSync(path.join(root, '.git', 'HEAD'), 'ignored')
    fs.symlinkSync('index.ts', path.join(root, 'src', 'entry.ts'))
  })

  afterEach(() => {
    jest.restoreAllMocks()
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('creates a deterministic manifest without dependency or git directories', async () => {
    const first = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
    })
    const second = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
    })

    expect(first.manifestDigest).toBe(second.manifestDigest)
    expect(first.entries.map(entry => entry.relativePath)).toEqual([
      'package.json',
      'src/entry.ts',
      'src/index.ts',
    ])
    expect(first.entries.find(entry => entry.relativePath === 'src/entry.ts')).toMatchObject({
      kind: 'symlink',
      symlinkTarget: 'index.ts',
    })
  })

  it('excludes dependency and git paths when they are symlinks', async () => {
    fs.rmSync(path.join(root, 'node_modules'), { recursive: true })
    fs.rmSync(path.join(root, '.git'), { recursive: true })
    fs.symlinkSync('src', path.join(root, 'node_modules'))
    fs.symlinkSync('src', path.join(root, '.git'))

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
    })

    expect(manifest.entries.map(entry => entry.relativePath)).toEqual([
      'package.json',
      'src/entry.ts',
      'src/index.ts',
    ])
  })

  it('streams the same captured bytes into the content sink', async () => {
    const blobs = new Map<string, Buffer[]>()
    const commits: Array<{ entry: Omit<IWorkspaceContentEntry, 'digest'>, digest: string, size: number }> = []
    const sink: IContentSink = {
      async begin(entry) {
        const chunks: Buffer[] = []
        blobs.set(`${entry.rootId}:${entry.relativePath}`, chunks)
        const writer: IContentWriter = {
          async write(chunk) { chunks.push(Buffer.from(chunk)) },
          async commit(result) { commits.push({ entry, ...result }) },
          async abort() { chunks.length = 0 },
        }
        return writer
      },
    }

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      contentSink: sink,
    })

    const source = manifest.entries.find(entry => entry.relativePath === 'src/index.ts')
    expect(Buffer.concat(blobs.get('project:src/index.ts') ?? []).toString()).toBe('export default 1\n')
    expect(commits.find(item => item.entry.relativePath === 'src/index.ts')).toMatchObject({
      digest: source?.digest,
      size: source?.size,
    })
    expect(blobs.has('project:src/entry.ts')).toBe(false)
  })

  it('supports explicit generated-path exclusions', async () => {
    fs.mkdirSync(path.join(root, 'dist'), { recursive: true })
    fs.writeFileSync(path.join(root, 'dist', 'bundle.js'), 'generated')

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: ['dist'],
    })

    expect(manifest.entries.some(entry => entry.relativePath.startsWith('dist/'))).toBe(false)
  })

  it('captures only selected paths for a workspace root', async () => {
    fs.writeFileSync(path.join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n')
    fs.writeFileSync(path.join(root, 'ignored.txt'), 'not selected')

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'workspace', role: 'workspace-root', originalPath: root }],
      includedPathsByRoot: {
        workspace: ['pnpm-lock.yaml', 'package.json', 'missing.yaml', './package.json'],
      },
    })

    expect(manifest.entries.map(entry => entry.relativePath)).toEqual([
      'package.json',
      'pnpm-lock.yaml',
    ])
  })

  it('rejects selected paths outside the workspace root', async () => {
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'workspace', role: 'workspace-root', originalPath: root }],
      includedPathsByRoot: { workspace: ['../outside'] },
    })).rejects.toThrow('Included path must stay inside its workspace root')
  })

  it('excludes absolute owned paths only in their actual roots and on path boundaries', async () => {
    for (const directory of ['first/owned', 'first/owned-other', 'second/owned']) {
      fs.mkdirSync(path.join(root, directory), { recursive: true })
      fs.writeFileSync(path.join(root, directory, 'data.txt'), directory)
    }
    const manifest = await collectWorkspaceManifest({
      roots: [
        { rootId: 'first', role: 'project', originalPath: path.join(root, 'first') },
        { rootId: 'second', role: 'external-project', originalPath: path.join(root, 'second') },
      ],
      excludedAbsolutePaths: [path.join(root, 'first', 'owned'), path.join(root, 'outside-owned')],
    })
    expect(manifest.entries.map(entry => `${entry.rootId}:${entry.relativePath}`)).toEqual([
      'first:owned-other/data.txt',
      'second:owned/data.txt',
    ])
  })

  it.each([undefined, ['owned', 'owned/nested/data.txt', 'package.json']])(
    'prunes excluded subtrees before opendir, lstat and sink.begin even with includes %j', async includedPaths => {
      const owned = path.join(fs.realpathSync.native(root), 'owned')
      fs.mkdirSync(path.join(owned, 'nested'), { recursive: true })
      fs.writeFileSync(path.join(owned, 'nested', 'data.txt'), 'volatile')
      const originalOpendir = fsPromises.opendir
      const originalLstat = fsPromises.lstat
      const forbidden = (value: unknown) => String(value) === owned || String(value).startsWith(`${owned}${path.sep}`)
      const opendir = jest.spyOn(fsPromises, 'opendir').mockImplementation((async (...args: Parameters<typeof originalOpendir>) => {
        if (forbidden(args[0])) throw Object.assign(new Error('excluded subtree entered'), { code: 'ENOENT' })
        return originalOpendir(...args)
      }) as typeof originalOpendir)
      const lstat = jest.spyOn(fsPromises, 'lstat').mockImplementation((async (...args: Parameters<typeof originalLstat>) => {
        if (forbidden(args[0])) throw Object.assign(new Error('excluded entry inspected'), { code: 'ENOENT' })
        return originalLstat(...args)
      }) as typeof originalLstat)
      const begin = jest.fn(async () => ({
        async write() {}, async commit() {}, async abort() {},
      }))
      const manifest = await collectWorkspaceManifest({
        roots: [{ rootId: 'project', role: 'project', originalPath: root }],
        excludedAbsolutePaths: [owned],
        ...(includedPaths ? { includedPathsByRoot: { project: includedPaths } } : {}),
        contentSink: { begin },
      })
      expect(manifest.entries.some(entry => entry.relativePath.startsWith('owned/'))).toBe(false)
      expect(manifest.entries.some(entry => entry.relativePath === 'package.json')).toBe(true)
      expect(opendir.mock.calls.some(args => forbidden(args[0]))).toBe(false)
      expect(lstat.mock.calls.some(args => forbidden(args[0]))).toBe(false)
      expect(begin.mock.calls.some(([entry]) => entry.relativePath.startsWith('owned/'))).toBe(false)
    }
  )

  it.each(['../owned', '/owned', 'src/../../owned', '', '.'])('rejects out-of-root relative exclusions: %j', async excludedPath => {
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: [excludedPath],
    })).rejects.toThrow('Excluded path must stay inside its workspace root')
  })

  it('does not let explicit includes override relative exclusions or inspect them', async () => {
    const lstat = jest.spyOn(fsPromises, 'lstat')
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: ['./src/'],
      includedPathsByRoot: { project: ['src', 'src/index.ts', 'package.json'] },
    })
    expect(manifest.entries.map(entry => entry.relativePath)).toEqual(['package.json'])
    expect(lstat.mock.calls.some(args => String(args[0]).includes(`${path.sep}src`))).toBe(false)
  })

  it.each(['internal', 'external', 'missing', 'external-descendant', 'relative'])(
    'prunes %s owners reached through an intermediate include alias before filesystem capture', async kind => {
      const canonicalRoot = fs.realpathSync.native(root)
      const externalBase = kind.startsWith('external')
        ? fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-external-owner-'))) : undefined
      const aliasTarget = externalBase ?? path.join(canonicalRoot, 'custom-capture')
      const owned = kind === 'external-descendant' ? path.join(aliasTarget, 'patches', 'custom-capture') : aliasTarget
      fs.mkdirSync(path.join(owned, 'patches'), { recursive: true })
      fs.writeFileSync(path.join(owned, 'patches', 'transient.txt'), 'volatile')
      fs.symlinkSync(aliasTarget, path.join(root, '.yarn'))
      if (kind === 'external-descendant') fs.writeFileSync(path.join(aliasTarget, 'patches', 'safe.txt'), 'safe')
      const aliasOwned = path.join(canonicalRoot, '.yarn', kind === 'external-descendant' ? 'patches/custom-capture' : 'patches')
      const forbidden = (value: unknown) => [owned, aliasOwned].some(prefix => String(value) === prefix || String(value).startsWith(`${prefix}${path.sep}`))
      const originalOpendir = fsPromises.opendir
      const originalLstat = fsPromises.lstat
      const opendir = jest.spyOn(fsPromises, 'opendir').mockImplementation((async (...args: Parameters<typeof originalOpendir>) => {
        if (forbidden(args[0])) throw Object.assign(new Error('owned alias opened'), { code: 'ENOENT' })
        return originalOpendir(...args)
      }) as typeof originalOpendir)
      const lstat = jest.spyOn(fsPromises, 'lstat').mockImplementation((async (...args: Parameters<typeof originalLstat>) => {
        if (forbidden(args[0])) throw Object.assign(new Error('owned alias inspected'), { code: 'ENOENT' })
        return originalLstat(...args)
      }) as typeof originalLstat)
      const begin = jest.fn(async () => ({ async write() {}, async commit() {}, async abort() {} }))
      try {
        const manifest = await collectWorkspaceManifest({
          roots: [{ rootId: 'project', role: 'project', originalPath: root }],
          ...(kind === 'relative' ? { excludedPaths: ['custom-capture'] } : { excludedAbsolutePaths: [owned] }),
          includedPathsByRoot: { project: [kind === 'missing' ? '.yarn/patches/not-created/deeper' : '.yarn/patches', 'package.json'] },
          contentSink: { begin },
        })
        expect(manifest.entries.map(entry => entry.relativePath)).toEqual(
          kind === 'external-descendant' ? ['.yarn/patches/safe.txt', 'package.json'] : ['package.json']
        )
        expect(opendir.mock.calls.some(args => forbidden(args[0]))).toBe(false)
        expect(lstat.mock.calls.some(args => forbidden(args[0]))).toBe(false)
        expect(begin.mock.calls.some(([entry]) => entry.relativePath.includes('transient'))).toBe(false)
      } finally {
        if (externalBase) fs.rmSync(externalBase, { recursive: true, force: true })
      }
    }
  )

  it.each(['owned', './owned', ''])('rejects non-absolute exclusions: %j', async excludedPath => {
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [excludedPath],
    })).rejects.toThrow('Excluded path must be absolute')
  })

  it.each(['alias', 'canonical', 'missing-alias'])('handles a symlink root with %s exclusions', async kind => {
    const canonicalRoot = fs.realpathSync.native(root)
    const alias = path.join(root, 'root-alias')
    fs.symlinkSync(canonicalRoot, alias)
    fs.mkdirSync(path.join(root, 'owned'), { recursive: true })
    fs.writeFileSync(path.join(root, 'owned', 'data.txt'), 'owned')
    const excluded = kind === 'canonical' ? path.join(canonicalRoot, 'owned')
      : path.join(alias, kind === 'missing-alias' ? 'owned/not-created/deeper' : 'owned')
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: alias }],
      excludedAbsolutePaths: [excluded],
    })
    expect(manifest.roots[0].originalPath).toBe(canonicalRoot)
    expect(manifest.entries.some(entry => entry.relativePath === 'owned/data.txt')).toBe(kind === 'missing-alias')
  })

  it.each(['self', 'ancestor', 'symlink-self'])('does not scan a root excluded by %s', async kind => {
    const childRoot = path.join(root, 'child')
    fs.mkdirSync(childRoot)
    fs.writeFileSync(path.join(childRoot, 'data.txt'), 'owned')
    const alias = path.join(root, 'child-alias')
    fs.symlinkSync(childRoot, alias)
    const opendir = jest.spyOn(fsPromises, 'opendir')
    const lstat = jest.spyOn(fsPromises, 'lstat')
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: childRoot }],
      excludedAbsolutePaths: [kind === 'ancestor' ? root : kind === 'symlink-self' ? alias : childRoot],
      includedPathsByRoot: { project: ['data.txt'] },
    })
    expect(manifest.entries).toEqual([])
    expect(manifest.roots).toHaveLength(1)
    expect(opendir).not.toHaveBeenCalled()
    expect(lstat).not.toHaveBeenCalled()
  })

  it('propagates non-ENOENT errors while resolving absolute exclusions', async () => {
    const excluded = path.join(root, 'owned')
    const originalRealpath = fsPromises.realpath
    const error = Object.assign(new Error('permission denied'), { code: 'EACCES' })
    jest.spyOn(fsPromises, 'realpath').mockImplementation(async value => {
      if (String(value) === excluded) throw error
      return originalRealpath(value)
    })
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [excluded],
    })).rejects.toBe(error)
  })

  it('still fails when an unexcluded file disappears before capture', async () => {
    const originalLstat = fsPromises.lstat
    const error = Object.assign(new Error('source disappeared'), { code: 'ENOENT' })
    jest.spyOn(fsPromises, 'lstat').mockImplementation((async (...args: Parameters<typeof originalLstat>) => {
      if (String(args[0]).endsWith(`${path.sep}index.ts`)) throw error
      return originalLstat(...args)
    }) as typeof originalLstat)
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.join(root, 'owned')],
    })).rejects.toBe(error)
  })

  it('still rejects an unexcluded file that changes throughout capture', async () => {
    const begin = jest.fn(async (entry: Omit<IWorkspaceContentEntry, 'digest'>) => {
      if (entry.relativePath === 'src/index.ts') fs.appendFileSync(path.join(root, entry.relativePath), 'changed\n')
      return { async write() {}, async commit() {}, async abort() {} }
    })
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.join(root, 'owned')],
      contentSink: { begin },
    })).rejects.toThrow('File changed while capturing')
    expect(begin.mock.calls.filter(([entry]) => entry.relativePath === 'src/index.ts')).toHaveLength(3)
  })

  it('canonicalizes existing absolute symlink targets', async () => {
    const target = path.join(root, 'src', 'index.ts')
    fs.symlinkSync(target, path.join(root, 'src', 'absolute-entry.ts'))

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
    })

    expect(manifest.entries.find(entry => entry.relativePath === 'src/absolute-entry.ts')).toMatchObject({
      kind: 'symlink',
      symlinkTarget: fs.realpathSync.native(target),
    })
  })
})
