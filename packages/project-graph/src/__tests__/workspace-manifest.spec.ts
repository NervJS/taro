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

  it('resolves directories and symlinks without resolving every ordinary file during a walk', async () => {
    const canonicalRoot = fs.realpathSync.native(root)
    for (let index = 0; index < 200; index++) fs.writeFileSync(path.join(root, 'src', `source-${index}.ts`), 'source')
    const realpath = jest.spyOn(fsPromises, 'realpath')
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: ['dist'],
    })

    expect(manifest.entries).toHaveLength(203)
    expect(realpath.mock.calls.map(([value]) => String(value))).toEqual([
      root, canonicalRoot, path.join(canonicalRoot, 'src'), path.join(canonicalRoot, 'src', 'entry.ts'),
    ])
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

  it.each(['.', './'])('allows an explicit whole-root include %j while preserving exclusions', async includedPath => {
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      includedPathsByRoot: { project: [includedPath] },
      excludedPaths: ['src'],
    })

    expect(manifest.entries.map(entry => entry.relativePath)).toEqual(['package.json'])
  })

  it.each(['existing', 'missing'])('preserves symlink traversal before .. in an absolute %s exclusion', async kind => {
    const canonicalRoot = fs.realpathSync.native(root)
    fs.mkdirSync(path.join(root, 'nested', 'links'), { recursive: true })
    fs.mkdirSync(path.join(root, 'nested', 'owned'))
    fs.mkdirSync(path.join(root, 'owned'))
    fs.writeFileSync(path.join(root, 'nested', 'owned', 'private.txt'), 'owned')
    fs.writeFileSync(path.join(root, 'owned', 'safe.txt'), 'safe')
    fs.symlinkSync('nested/links', path.join(root, 'jump'))
    const suffix = kind === 'missing' ? '/not-created' : ''
    const excluded = `${canonicalRoot}/jump/../owned${suffix}${path.sep}`
    fs.symlinkSync(`nested/owned${suffix}`, path.join(root, 'owned-alias'))
    const begin = jest.fn(async (_entry: Omit<IWorkspaceContentEntry, 'digest'>) => ({
      async write() {}, async commit() {}, async abort() {},
    }))
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [excluded],
      contentSink: { begin },
    })

    const captured = begin.mock.calls.map(([entry]) => entry.relativePath)
    expect(manifest.entries.map(entry => entry.relativePath)).not.toContain('owned-alias')
    expect(captured).toContain('owned/safe.txt')
    expect(captured.includes('nested/owned/private.txt')).toBe(kind === 'missing')
  })

  const itPosix = path.sep === '/' ? it : it.skip

  itPosix('preserves literal backslashes in unexcluded POSIX filenames', async () => {
    fs.mkdirSync(path.join(root, 'owned'))
    fs.writeFileSync(path.join(root, 'owned', 'data.txt'), 'owned')
    fs.writeFileSync(path.join(root, 'owned\\source.txt'), 'safe')
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: ['owned'],
    })

    expect(manifest.entries.map(entry => entry.relativePath)).toContain('owned\\source.txt')
    expect(manifest.entries.map(entry => entry.relativePath)).not.toContain('owned/data.txt')
  })

  itPosix('does not treat a literal POSIX backslash in an absolute exclusion as a separator', async () => {
    fs.mkdirSync(path.join(root, 'a\\b'))
    fs.mkdirSync(path.join(root, 'a', 'b'), { recursive: true })
    fs.writeFileSync(path.join(root, 'a\\b', 'owned.txt'), 'owned')
    fs.writeFileSync(path.join(root, 'a', 'b', 'safe.txt'), 'safe')
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.join(root, 'a\\b')],
    })

    expect(manifest.entries.map(entry => entry.relativePath)).toContain('a/b/safe.txt')
    expect(manifest.entries.map(entry => entry.relativePath)).not.toContain('a\\b/owned.txt')
  })

  it.each(['../outside', ''])('rejects invalid selected paths: %j', async includedPath => {
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'workspace', role: 'workspace-root', originalPath: root }],
      includedPathsByRoot: { workspace: [includedPath] },
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

  it('does not capture symlinks into absolute excluded paths during a full scan', async () => {
    const owned = path.join(root, 'owned')
    fs.mkdirSync(owned)
    fs.writeFileSync(path.join(owned, 'data.txt'), 'owned')
    fs.symlinkSync(owned, path.join(root, 'owned-alias'))

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [owned],
    })

    expect(manifest.entries.map(entry => entry.relativePath)).not.toContain('owned-alias')
    expect(manifest.entries.some(entry => entry.relativePath.startsWith('owned/'))).toBe(false)
  })

  it.each(['full', 'directory', 'leaves'])('preserves unresolved symlink leaves during a %s scan', async mode => {
    fs.mkdirSync(path.join(root, 'patches'))
    fs.writeFileSync(path.join(root, 'patches', 'safe.patch'), 'safe')
    const targets = {
      'self-link': 'self-link',
      'absolute-loop': path.join(root, 'patches', 'absolute-loop'),
      'not-directory': 'safe.patch/child',
      missing: 'not-created/deeper',
    }
    for (const [name, target] of Object.entries(targets)) fs.symlinkSync(target, path.join(root, 'patches', name))
    const includedPaths = mode === 'directory' ? ['patches']
      : mode === 'leaves' ? Object.keys(targets).map(name => `patches/${name}`) : undefined

    for (const excludedPaths of [[], ['unrelated']]) {
      const manifest = await collectWorkspaceManifest({
        roots: [{ rootId: 'project', role: 'project', originalPath: root }],
        excludedPaths,
        ...(includedPaths ? { includedPathsByRoot: { project: includedPaths } } : {}),
      })
      for (const [name, target] of Object.entries(targets)) {
        expect(manifest.entries).toContainEqual(expect.objectContaining({
          relativePath: `patches/${name}`, kind: 'symlink', symlinkTarget: target,
        }))
      }
    }
  })

  it.each(['EACCES', 'EPERM'])('preserves symlink leaves with %s target errors without hiding other permission errors', async code => {
    const canonicalRoot = fs.realpathSync.native(root)
    const target = path.join(path.dirname(canonicalRoot), 'protected-target')
    const link = path.join(canonicalRoot, 'patches', 'protected-link')
    fs.mkdirSync(path.join(root, 'patches'))
    fs.symlinkSync(target, link)
    const blocked = new Set([link, target])
    const error = Object.assign(new Error('target permission denied'), { code })
    const originalRealpath = fsPromises.realpath
    jest.spyOn(fsPromises, 'realpath').mockImplementation(async value => {
      if (blocked.has(String(value))) throw error
      return originalRealpath(value)
    })

    for (const includedPaths of [undefined, ['patches'], ['patches/protected-link']]) {
      const manifest = await collectWorkspaceManifest({
        roots: [{ rootId: 'project', role: 'project', originalPath: root }],
        excludedPaths: ['unrelated'],
        ...(includedPaths ? { includedPathsByRoot: { project: includedPaths } } : {}),
      })
      expect(manifest.entries).toContainEqual(expect.objectContaining({
        relativePath: 'patches/protected-link', kind: 'symlink', symlinkTarget: target,
      }))
    }
    blocked.add(path.join(canonicalRoot, 'src', 'index.ts'))
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: ['unrelated'],
      includedPathsByRoot: { project: ['src/index.ts'] },
    })).rejects.toBe(error)
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [link],
    })).rejects.toBe(error)
  })

  const itWithFilePermissions = path.sep === '/' && process.getuid?.() !== 0 ? it : it.skip

  itWithFilePermissions('still rejects an unreadable ordinary file during a directory walk', async () => {
    const source = path.join(root, 'src', 'index.ts')
    const mode = fs.statSync(source).mode
    fs.chmodSync(source, 0)
    try {
      await expect(collectWorkspaceManifest({
        roots: [{ rootId: 'project', role: 'project', originalPath: root }],
        excludedPaths: ['dist'],
      })).rejects.toMatchObject({ code: 'EACCES' })
    } finally {
      fs.chmodSync(source, mode)
    }
  })

  it.each(['full', 'included'])('excludes dangling aliases and their missing descendants during a %s scan', async mode => {
    const owned = path.join(fs.realpathSync.native(root), 'owned')
    fs.mkdirSync(owned)
    fs.symlinkSync('owned/not-created', path.join(root, 'relative-alias'))
    fs.symlinkSync(path.join(owned, 'not-created'), path.join(root, 'absolute-alias'))
    fs.symlinkSync('relative-alias', path.join(root, 'chained-alias'))
    const includedPaths = ['relative-alias', 'relative-alias/deeper', 'absolute-alias', 'chained-alias', 'package.json']

    for (const targetExists of [false, true]) {
      if (targetExists) fs.mkdirSync(path.join(owned, 'not-created'))
      for (const exclusions of [{ excludedPaths: ['owned'] }, { excludedAbsolutePaths: [owned] }]) {
        const manifest = await collectWorkspaceManifest({
          roots: [{ rootId: 'project', role: 'project', originalPath: root }],
          ...exclusions,
          ...(mode === 'included' ? { includedPathsByRoot: { project: includedPaths } } : {}),
        })
        expect(manifest.entries.some(entry => entry.relativePath.includes('alias'))).toBe(false)
        expect(manifest.entries).toContainEqual(expect.objectContaining({ relativePath: 'package.json' }))
      }
    }
  })

  it('resolves dangling relative link targets against their canonical parent', async () => {
    fs.mkdirSync(path.join(root, 'nested', 'links'), { recursive: true })
    fs.mkdirSync(path.join(root, 'nested', 'owned'))
    fs.symlinkSync('nested/links', path.join(root, 'parent-alias'))
    fs.symlinkSync('../owned/not-created', path.join(root, 'nested', 'links', 'dangling'))
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.join(root, 'nested', 'owned')],
      includedPathsByRoot: { project: ['parent-alias/dangling', 'package.json'] },
    })
    expect(manifest.entries.map(entry => entry.relativePath)).toEqual(['package.json'])
  })

  it('preserves symlink traversal before .. inside a dangling target', async () => {
    fs.mkdirSync(path.join(root, 'nested', 'links'), { recursive: true })
    fs.mkdirSync(path.join(root, 'nested', 'owned'))
    fs.mkdirSync(path.join(root, 'owned'))
    fs.symlinkSync('nested/links', path.join(root, 'jump'))
    fs.symlinkSync('jump/../owned/not-created', path.join(root, 'dangling'))
    for (const excludedPath of ['nested/owned', 'owned']) {
      const manifest = await collectWorkspaceManifest({
        roots: [{ rootId: 'project', role: 'project', originalPath: root }],
        excludedPaths: [excludedPath],
        includedPathsByRoot: { project: ['dangling'] },
      })
      expect(manifest.entries.some(entry => entry.relativePath === 'dangling')).toBe(excludedPath === 'owned')
    }
  })

  it.each(['', path.sep, path.sep.repeat(3)])('canonicalizes a dangling absolute exclusion alias with trailing separators %j', async suffix => {
    fs.mkdirSync(path.join(root, 'owned'))
    fs.symlinkSync('owned/not-created', path.join(root, 'excluded-alias'))
    fs.symlinkSync('owned/not-created', path.join(root, 'other-alias'))
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.join(root, 'excluded-alias') + suffix],
    })
    expect(manifest.entries.some(entry => entry.relativePath.includes('alias'))).toBe(false)
    expect(manifest.entries).toContainEqual(expect.objectContaining({ relativePath: 'package.json' }))
  })

  it.each(['src/index.ts/child', 'loop/child'])('still rejects an invalid intermediate path: %s', async includedPath => {
    fs.symlinkSync('loop', path.join(root, 'loop'))
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedPaths: ['unrelated'],
      includedPathsByRoot: { project: [includedPath] },
    })).rejects.toMatchObject({ code: includedPath.startsWith('loop') ? 'ELOOP' : 'ENOTDIR' })
  })

  it('still rejects a cyclic absolute exclusion declaration', async () => {
    fs.symlinkSync('loop', path.join(root, 'loop'))
    await expect(collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.join(root, 'loop')],
    })).rejects.toMatchObject({ code: 'ELOOP' })
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

  it('preserves a filesystem-root exclusion with redundant trailing separators', async () => {
    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
      excludedAbsolutePaths: [path.parse(fs.realpathSync.native(root)).root + path.sep.repeat(2)],
    })
    expect(manifest.entries).toEqual([])
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
