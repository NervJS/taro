import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { IContentSink, IContentWriter, IWorkspaceContentEntry } from '../facts'
import { collectWorkspaceManifest } from '../workspace-manifest'

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

  it('canonicalizes existing absolute symlink targets', async () => {
    const target = path.join(root, 'src', 'index.ts')
    fs.symlinkSync(target, path.join(root, 'src', 'absolute-entry.ts'))

    const manifest = await collectWorkspaceManifest({
      roots: [{ rootId: 'project', role: 'project', originalPath: root }],
    })

    expect(manifest.entries.find(entry => entry.relativePath === 'src/absolute-entry.ts')).toMatchObject({
      kind: 'symlink',
      symlinkTarget: fs.realpathSync(target),
    })
  })
})
