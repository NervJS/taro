import { existsSync } from 'node:fs'
import { readFile, realpath } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'

const { load: parseYaml } = require('js-yaml') as { load(source: string): unknown }

const MAX_WORKSPACE_CONFIG_BYTES = 1024 * 1024
const IGNORED_PACKAGE_DIRECTORIES = ['**/.git/**', '**/.taro/**', '**/.taro-pilot/**', '**/node_modules/**']

export interface IWorkspacePackageDescriptor {
  root: string
  relativePath: string
  manifest: Record<string, unknown>
}

export interface IWorkspaceDiscovery {
  projectRoot: string
  workspaceRoot?: string
  kind?: 'pnpm' | 'workspaces'
  packages: IWorkspacePackageDescriptor[]
  declarationFiles: string[]
  issues: string[]
}

export async function discoverWorkspace(projectRoot: string): Promise<IWorkspaceDiscovery> {
  const normalizedProjectRoot = await realpath(projectRoot)

  for (const candidate of ancestors(normalizedProjectRoot)) {
    const definition = await readWorkspaceDefinition(candidate)
    if (!definition) continue
    if (definition.issue) {
      return {
        projectRoot: normalizedProjectRoot,
        packages: [],
        declarationFiles: definition.declarationFiles,
        issues: [definition.issue],
      }
    }

    const expanded = await expandWorkspacePackages(candidate, definition.patterns)
    const projectIsRoot = candidate === normalizedProjectRoot
    const projectIsMember = expanded.matchedRoots.has(normalizedProjectRoot)
    if (!projectIsRoot && !projectIsMember) continue

    return {
      projectRoot: normalizedProjectRoot,
      workspaceRoot: candidate,
      kind: definition.kind,
      packages: expanded.packages,
      declarationFiles: definition.declarationFiles,
      issues: expanded.issues,
    }
  }

  return {
    projectRoot: normalizedProjectRoot,
    packages: [],
    declarationFiles: [],
    issues: [],
  }
}

interface IWorkspaceDefinition {
  kind: 'pnpm' | 'workspaces'
  patterns: string[]
  declarationFiles: string[]
  issue?: string
}

async function readWorkspaceDefinition(root: string): Promise<IWorkspaceDefinition | undefined> {
  const pnpmWorkspacePath = path.join(root, 'pnpm-workspace.yaml')
  if (existsSync(pnpmWorkspacePath)) {
    try {
      const source = await readBoundedText(pnpmWorkspacePath)
      const parsed = parseYaml(source)
      const patterns = readStringArray(parsed, 'packages')
      if (!patterns) {
        return invalidDefinition('pnpm', ['pnpm-workspace.yaml'], `Invalid pnpm workspace packages in ${pnpmWorkspacePath}`)
      }
      return validatedDefinition('pnpm', patterns, ['pnpm-workspace.yaml'], root)
    } catch (error) {
      return invalidDefinition(
        'pnpm',
        ['pnpm-workspace.yaml'],
        `Cannot parse ${pnpmWorkspacePath}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  const packagePath = path.join(root, 'package.json')
  if (!existsSync(packagePath)) return undefined
  try {
    const manifest = JSON.parse(await readBoundedText(packagePath)) as { workspaces?: unknown }
    const patterns = Array.isArray(manifest.workspaces)
      ? stringArray(manifest.workspaces)
      : readStringArray(manifest.workspaces, 'packages')
    if (patterns === undefined) return undefined
    return validatedDefinition('workspaces', patterns, ['package.json'], root)
  } catch (error) {
    return invalidDefinition(
      'workspaces',
      ['package.json'],
      `Cannot parse ${packagePath}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

function validatedDefinition(
  kind: IWorkspaceDefinition['kind'],
  patterns: string[],
  declarationFiles: string[],
  root: string
): IWorkspaceDefinition {
  const invalidPattern = patterns.find(pattern => !isSafeWorkspacePattern(pattern))
  if (invalidPattern) {
    return invalidDefinition(kind, declarationFiles, `Workspace pattern escapes ${root}: ${invalidPattern}`)
  }
  return { kind, patterns, declarationFiles }
}

function invalidDefinition(
  kind: IWorkspaceDefinition['kind'],
  declarationFiles: string[],
  issue: string
): IWorkspaceDefinition {
  return { kind, patterns: [], declarationFiles, issue }
}

async function expandWorkspacePackages(root: string, patterns: string[]): Promise<{
  packages: IWorkspacePackageDescriptor[]
  matchedRoots: Set<string>
  issues: string[]
}> {
  const matches = await fg(patterns, {
    absolute: true,
    cwd: root,
    followSymbolicLinks: false,
    ignore: IGNORED_PACKAGE_DIRECTORIES,
    onlyDirectories: true,
    unique: true,
  })
  const packages: IWorkspacePackageDescriptor[] = []
  const matchedRoots = new Set<string>()
  const issues: string[] = []

  for (const match of matches.sort()) {
    const packagePath = path.join(match, 'package.json')
    if (!existsSync(packagePath)) continue
    const packageRoot = await realpath(match)
    if (!isInside(root, packageRoot)) continue
    matchedRoots.add(packageRoot)
    try {
      const manifest = JSON.parse(await readBoundedText(packagePath)) as Record<string, unknown>
      packages.push({
        root: packageRoot,
        relativePath: toPosixPath(path.relative(root, packageRoot)),
        manifest,
      })
    } catch (error) {
      issues.push(`Cannot parse workspace member ${packagePath}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return { packages, matchedRoots, issues }
}

async function readBoundedText(file: string): Promise<string> {
  const value = await readFile(file)
  if (value.byteLength > MAX_WORKSPACE_CONFIG_BYTES) {
    throw new Error(`Workspace config exceeds ${MAX_WORKSPACE_CONFIG_BYTES} bytes`)
  }
  return value.toString('utf8')
}

function readStringArray(value: unknown, key: string): string[] | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return stringArray((value as Record<string, unknown>)[key])
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) return undefined
  return value as string[]
}

function isSafeWorkspacePattern(pattern: string): boolean {
  const unsigned = pattern.startsWith('!') ? pattern.slice(1) : pattern
  if (!unsigned || path.isAbsolute(unsigned)) return false
  return !unsigned.split(/[\\/]+/).includes('..')
}

function ancestors(start: string): string[] {
  const result: string[] = []
  let current = start
  while (true) {
    result.push(current)
    const parent = path.dirname(current)
    if (parent === current) return result
    current = parent
  }
}

function isInside(root: string, candidate: string): boolean {
  const relativePath = path.relative(root, candidate)
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join(path.posix.sep)
}
