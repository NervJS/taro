import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { lstat, opendir, readlink, realpath } from 'node:fs/promises'
import path from 'node:path'

import type { Dirent } from 'node:fs'
import type {
  IContentSink,
  IWorkspaceContentEntry,
  IWorkspaceContentManifest,
  IWorkspaceRoot,
} from './facts'

const EXCLUDED_DIRECTORIES = new Set(['.git', '.taro', '.taro-pilot', 'node_modules'])
const MAX_CAPTURE_ATTEMPTS = 3
const CAPTURE_CONCURRENCY = 16

export interface ICollectWorkspaceManifestOptions {
  roots: IWorkspaceRoot[]
  contentSink?: IContentSink
  /** Relative paths excluded in every root. */
  excludedPaths?: string[]
  /** Absolute paths excluded only in roots that overlap them, including canonical aliases. */
  excludedAbsolutePaths?: string[]
  includedPathsByRoot?: Record<string, string[]>
}

export async function collectWorkspaceManifest(
  options: ICollectWorkspaceManifestOptions
): Promise<IWorkspaceContentManifest> {
  const excludedPaths = normalizeRootPaths(options.excludedPaths ?? [], 'Excluded')
  const absoluteExclusions = await normalizeAbsoluteExclusions(options.excludedAbsolutePaths ?? [])
  const roots = await normalizeRoots(options.roots)
  const entries: IWorkspaceContentEntry[] = []

  for (const root of roots) {
    if (absoluteExclusions.some(excluded => isInsidePath(excluded, root.originalPath))) continue
    const rootExclusions = absoluteExclusions
      .filter(excluded => isInsidePath(root.originalPath, excluded))
      .map(excluded => normalizeRelativePath(path.relative(root.originalPath, excluded)))
    const rootEntries = await collectRootEntries(
      root,
      options.contentSink,
      [...excludedPaths, ...rootExclusions],
      absoluteExclusions,
      options.includedPathsByRoot?.[root.rootId]
    )
    for (const entry of rootEntries) entries.push(entry)
  }

  entries.sort(compareEntries)
  const manifestDigest = digestJson({ roots, entries })

  return { roots, entries, manifestDigest }
}

async function normalizeRoots(roots: IWorkspaceRoot[]): Promise<IWorkspaceRoot[]> {
  const normalized = await Promise.all(roots.map(async root => ({
    ...root,
    originalPath: await realpath(root.originalPath),
  })))

  normalized.sort((left, right) => left.rootId.localeCompare(right.rootId))
  return normalized
}

async function collectRootEntries(
  root: IWorkspaceRoot,
  contentSink: IContentSink | undefined,
  excludedPaths: string[],
  absoluteExclusions: string[],
  includedPaths?: string[]
): Promise<IWorkspaceContentEntry[]> {
  const relativePaths = new Set<string>()
  if (includedPaths === undefined) {
    await walkDirectory(root.originalPath, '', async relativePath => { relativePaths.add(relativePath) }, excludedPaths)
  } else {
    for (const includedPath of normalizeRootPaths(includedPaths, 'Included')) {
      if (isExcluded(includedPath, excludedPaths)) continue
      if (await isCanonicalExcluded(root.originalPath, includedPath, excludedPaths, absoluteExclusions)) continue
      const absolutePath = path.join(root.originalPath, includedPath)
      const entry = await lstat(absolutePath).catch(error => {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
        throw error
      })
      if (!entry) continue

      if (entry.isDirectory() && !entry.isSymbolicLink()) {
        await walkDirectory(root.originalPath, includedPath, async relativePath => { relativePaths.add(relativePath) }, excludedPaths, absoluteExclusions)
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        relativePaths.add(includedPath)
      }
    }
  }

  const entries: IWorkspaceContentEntry[] = []
  const sortedRelativePaths = [...relativePaths].sort()
  for (let index = 0; index < sortedRelativePaths.length; index += CAPTURE_CONCURRENCY) {
    const batch = sortedRelativePaths.slice(index, index + CAPTURE_CONCURRENCY)
    const captured = await Promise.all(batch.map(relativePath => captureEntry(root, relativePath, contentSink)))
    for (const entry of captured) entries.push(entry)
  }
  return entries
}

function normalizeRootPaths(paths: string[], label: 'Included' | 'Excluded'): string[] {
  return [...new Set(paths.map(value => {
    const normalized = typeof value === 'string' ? path.posix.normalize(normalizeRelativePath(value)) : ''
    if (!normalized || normalized === '.' || path.posix.isAbsolute(normalized) || path.isAbsolute(value) ||
      normalized === '..' || normalized.startsWith('../')) {
      throw new Error(`${label} path must stay inside its workspace root: ${value}`)
    }
    return normalized
  }))].sort()
}

async function normalizeAbsoluteExclusions(paths: string[]): Promise<string[]> {
  for (const value of paths) {
    if (typeof value !== 'string' || !path.isAbsolute(value)) throw new Error(`Excluded path must be absolute: ${value}`)
  }
  const exclusions = await Promise.all(paths.map(async value => {
    const absolutePath = path.resolve(value)
    return [absolutePath, await canonicalizeDeclaredPath(absolutePath)]
  }))
  return [...new Set(exclusions.flat())]
}

async function canonicalizeDeclaredPath(value: string): Promise<string> {
  try {
    return await realpath(value)
  } catch (error) {
    const parent = path.dirname(value)
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || parent === value) throw error
    return path.join(await canonicalizeDeclaredPath(parent), path.basename(value))
  }
}

function isInsidePath(parent: string, value: string): boolean {
  const relativePath = path.relative(parent, value)
  return relativePath !== '..' && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath)
}

async function isCanonicalExcluded(root: string, relativePath: string, excludedPaths: string[], absoluteExclusions: string[]): Promise<boolean> {
  const canonicalPath = await canonicalizeDeclaredPath(path.join(root, relativePath))
  return absoluteExclusions.some(excluded => isInsidePath(excluded, canonicalPath)) ||
    (isInsidePath(root, canonicalPath) && isExcluded(normalizeRelativePath(path.relative(root, canonicalPath)), excludedPaths))
}

async function walkDirectory(
  root: string,
  relativeDirectory: string,
  onEntry: (relativePath: string) => Promise<void>,
  excludedPaths: string[],
  absoluteExclusions?: string[]
): Promise<void> {
  const absoluteDirectory = path.join(root, relativeDirectory)
  const directory = await opendir(absoluteDirectory)
  const children: Dirent[] = []

  for await (const child of directory) children.push(child)
  children.sort((left, right) => left.name.localeCompare(right.name))

  for (const child of children) {
    const relativePath = path.posix.join(relativeDirectory.split(path.sep).join(path.posix.sep), child.name)
    if (isExcluded(relativePath, excludedPaths)) continue
    if (EXCLUDED_DIRECTORIES.has(child.name)) continue
    if (absoluteExclusions !== undefined && await isCanonicalExcluded(root, relativePath, excludedPaths, absoluteExclusions)) continue
    if (child.isDirectory() && !child.isSymbolicLink()) {
      await walkDirectory(root, relativePath, onEntry, excludedPaths, absoluteExclusions)
      continue
    }
    if (child.isFile() || child.isSymbolicLink()) await onEntry(relativePath)
  }
}

async function captureEntry(
  root: IWorkspaceRoot,
  relativePath: string,
  contentSink?: IContentSink
): Promise<IWorkspaceContentEntry> {
  const absolutePath = path.join(root.originalPath, relativePath)
  const initial = await lstat(absolutePath)

  if (initial.isSymbolicLink()) {
    const rawTarget = await readlink(absolutePath)
    const symlinkTarget = path.isAbsolute(rawTarget)
      ? await realpath(rawTarget).catch(() => rawTarget)
      : rawTarget
    return {
      rootId: root.rootId,
      relativePath,
      digest: digestBytes(Buffer.from(symlinkTarget)),
      size: Buffer.byteLength(symlinkTarget),
      mode: initial.mode,
      mtimeMs: initial.mtimeMs,
      kind: 'symlink',
      symlinkTarget,
    }
  }

  for (let attempt = 1; attempt <= MAX_CAPTURE_ATTEMPTS; attempt++) {
    const before = attempt === 1 ? initial : await lstat(absolutePath)
    const entryWithoutDigest: Omit<IWorkspaceContentEntry, 'digest'> = {
      rootId: root.rootId,
      relativePath,
      size: before.size,
      mode: before.mode,
      mtimeMs: before.mtimeMs,
      kind: 'file',
    }
    const writer = contentSink ? await contentSink.begin(entryWithoutDigest) : undefined

    try {
      const hash = createHash('sha256')
      let size = 0
      for await (const chunk of createReadStream(absolutePath)) {
        const bytes = chunk as Buffer
        hash.update(bytes)
        size += bytes.byteLength
        await writer?.write(bytes)
      }

      const after = await lstat(absolutePath)
      if (!isStable(before, after, size)) {
        if (attempt === MAX_CAPTURE_ATTEMPTS) throw new Error(`File changed while capturing: ${absolutePath}`)
        await writer?.abort()
        continue
      }

      const digest = `sha256:${hash.digest('hex')}`
      await writer?.commit({ digest, size })
      return { ...entryWithoutDigest, digest, size }
    } catch (error) {
      await writer?.abort()
      throw error
    }
  }

  throw new Error(`Unable to capture file: ${absolutePath}`)
}

function isStable(before: Awaited<ReturnType<typeof lstat>>, after: Awaited<ReturnType<typeof lstat>>, size: number): boolean {
  return before.dev === after.dev &&
    before.ino === after.ino &&
    before.mtimeMs === after.mtimeMs &&
    before.size === after.size &&
    after.size === size
}

function compareEntries(left: IWorkspaceContentEntry, right: IWorkspaceContentEntry): number {
  return left.rootId.localeCompare(right.rootId) || left.relativePath.localeCompare(right.relativePath)
}

function isExcluded(relativePath: string, excludedPaths: string[]): boolean {
  return excludedPaths.some(excludedPath => relativePath === excludedPath || relativePath.startsWith(`${excludedPath}/`))
}

function normalizeRelativePath(value: string): string {
  return value.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '')
}

function digestJson(value: unknown): string {
  return digestBytes(Buffer.from(JSON.stringify(value)))
}

function digestBytes(value: Uint8Array): string {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}
