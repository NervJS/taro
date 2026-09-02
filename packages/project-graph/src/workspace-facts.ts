import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, realpath } from 'node:fs/promises'
import path from 'node:path'
import type {
  IInvocationFacts,
  IWorkspacePackageFacts,
  IWorkspaceRoot,
  IWorkspaceTopologyFacts,
} from './facts'
import type { IWorkspaceDiscovery, IWorkspacePackageDescriptor } from './workspace-discovery'

export interface IWorkspacePackageManifest extends Record<string, unknown> {
  name?: string
  version?: string
  packageManager?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

export interface IDiscoveredWorkspaceState {
  roots: IWorkspaceRoot[]
  topology: IWorkspaceTopologyFacts
  includedPathsByRoot?: Record<string, string[]>
  packageManagerRoot: string
  packageManagerRootId: string
  packageManagerManifest: IWorkspacePackageManifest
  issues: string[]
}

interface IWorkspacePackageState {
  descriptor: IWorkspacePackageDescriptor
  rootId: string
  manifest: IWorkspacePackageManifest
  reasons: Set<string>
}

const WORKSPACE_CONSTRAINT_FILES = [
  '.npmrc',
  '.pnpmfile.cjs',
  '.yarn/patches',
  '.yarn/plugins',
  '.yarn/releases',
  '.yarnrc',
  '.yarnrc.yml',
  'npm-shrinkwrap.json',
  'package-lock.json',
  'package.json',
  'patches',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'pnpmfile.js',
  'yarn.lock',
]

export async function buildDiscoveredWorkspaceState(
  discovery: IWorkspaceDiscovery,
  projectManifest: IWorkspacePackageManifest,
  invocation?: IInvocationFacts,
  captureRoots: IWorkspaceRoot[] = []
): Promise<IDiscoveredWorkspaceState | undefined> {
  if (!discovery.workspaceRoot || !discovery.kind) return undefined

  const workspaceRoot = discovery.workspaceRoot
  const projectRoot = discovery.projectRoot
  const projectIsWorkspaceRoot = projectRoot === workspaceRoot
  const workspaceRootId = projectIsWorkspaceRoot ? 'project' : 'workspace-root'
  const workspaceManifest = projectIsWorkspaceRoot
    ? projectManifest
    : await readManifest(path.join(workspaceRoot, 'package.json'))
  const descriptors = projectIsWorkspaceRoot
    ? discovery.packages
    : [{ root: workspaceRoot, relativePath: '.', manifest: workspaceManifest }, ...discovery.packages]
  const packageStates = descriptors.map(descriptor => createPackageState(descriptor, projectRoot, workspaceRootId))
  const byName = new Map(packageStates.flatMap(state => state.manifest.name ? [[state.manifest.name, state] as const] : []))
  const byRoot = new Map(packageStates.map(state => [state.descriptor.root, state]))

  selectPackage(byRoot.get(projectRoot), 'project')
  await selectInvocationPackages(packageStates, invocation)
  expandLocalDependencyClosure(packageStates, byName)
  selectPackage(byRoot.get(workspaceRoot), 'workspace-root-importer')

  const roots: IWorkspaceRoot[] = [{
    rootId: 'project',
    role: 'project',
    originalPath: projectRoot,
    ...(projectIsWorkspaceRoot ? {} : { relativePlacement: toPosixPath(path.relative(workspaceRoot, projectRoot)) }),
  }]
  if (!projectIsWorkspaceRoot) {
    roots.push({
      rootId: workspaceRootId,
      role: 'workspace-root',
      originalPath: workspaceRoot,
      relativePlacement: '.',
    })
  }

  for (const state of packageStates) {
    if (state.reasons.size === 0 || state.descriptor.root === projectRoot || state.descriptor.root === workspaceRoot) continue
    roots.push({
      rootId: state.rootId,
      role: 'workspace-package',
      originalPath: state.descriptor.root,
      relativePlacement: state.descriptor.relativePath,
    })
  }

  const unresolvedLocalDependencies = collectUnresolvedLocalDependencies(packageStates, byName)
  addExternalLocalDependencies(roots, packageStates, workspaceRoot)
  appendCaptureRoots(roots, captureRoots)

  const packages: IWorkspacePackageFacts[] = packageStates.map(state => ({
    rootId: state.rootId,
    ...(state.manifest.name ? { name: state.manifest.name } : {}),
    ...(state.manifest.version ? { version: state.manifest.version } : {}),
    relativePath: state.descriptor.relativePath,
    dependencies: Object.keys(allDependencies(state.manifest)).sort(),
    selected: state.reasons.size > 0,
    ...(state.reasons.size > 0 ? { selectionReasons: [...state.reasons].sort() } : {}),
  })).sort((left, right) => left.relativePath.localeCompare(right.relativePath))

  return {
    roots,
    topology: {
      packageManagerWorkspace: true,
      workspaceRootId,
      workspaceKind: discovery.kind,
      packages,
      ...(unresolvedLocalDependencies.length > 0 ? { unresolvedLocalDependencies } : {}),
    },
    ...(!projectIsWorkspaceRoot ? { includedPathsByRoot: { [workspaceRootId]: WORKSPACE_CONSTRAINT_FILES } } : {}),
    packageManagerRoot: workspaceRoot,
    packageManagerRootId: workspaceRootId,
    packageManagerManifest: workspaceManifest,
    issues: discovery.issues,
  }
}

function createPackageState(
  descriptor: IWorkspacePackageDescriptor,
  projectRoot: string,
  workspaceRootId: string
): IWorkspacePackageState {
  return {
    descriptor,
    rootId: descriptor.root === projectRoot
      ? 'project'
      : descriptor.relativePath === '.'
        ? workspaceRootId
        : `workspace:${digestText(descriptor.relativePath).slice(7, 19)}`,
    manifest: descriptor.manifest as IWorkspacePackageManifest,
    reasons: new Set<string>(),
  }
}

function expandLocalDependencyClosure(
  packageStates: IWorkspacePackageState[],
  byName: Map<string, IWorkspacePackageState>
): void {
  const queue = packageStates.filter(state => state.reasons.size > 0)
  const visited = new Set<IWorkspacePackageState>()
  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current)) continue
    visited.add(current)
    for (const name of Object.keys(allDependencies(current.manifest))) {
      const dependency = byName.get(name)
      if (!dependency) continue
      const wasSelected = dependency.reasons.size > 0
      dependency.reasons.add(`local-dependency:${current.manifest.name ?? current.descriptor.relativePath}`)
      if (!wasSelected) queue.push(dependency)
    }
  }
}

async function selectInvocationPackages(
  packageStates: IWorkspacePackageState[],
  invocation?: IInvocationFacts
): Promise<void> {
  if (!invocation) return
  const candidates = [
    invocation.launcher?.executable,
    ...(invocation.launcher?.argv ?? []),
    invocation.process.executable,
    ...invocation.process.argv,
  ].filter((value): value is string => Boolean(value && path.isAbsolute(value) && existsSync(value)))

  for (const candidate of candidates) {
    const resolved = await realpath(candidate).catch(() => candidate)
    const owner = packageStates
      .filter(state => isInside(state.descriptor.root, resolved))
      .sort((left, right) => right.descriptor.root.length - left.descriptor.root.length)[0]
    selectPackage(owner, 'invocation-tool')
  }
}

function collectUnresolvedLocalDependencies(
  packageStates: IWorkspacePackageState[],
  byName: Map<string, IWorkspacePackageState>
): NonNullable<IWorkspaceTopologyFacts['unresolvedLocalDependencies']> {
  const unresolved: NonNullable<IWorkspaceTopologyFacts['unresolvedLocalDependencies']> = []
  for (const state of packageStates.filter(participatesInSourceClosure)) {
    for (const [name, specifier] of Object.entries(allDependencies(state.manifest))) {
      if (specifier.startsWith('workspace:') && !byName.has(name)) {
        unresolved.push({
          fromRootId: state.rootId,
          name,
          specifier,
          reason: 'Workspace dependency is not declared by any discovered package.',
        })
      }
    }
  }
  return unresolved.sort((left, right) => `${left.fromRootId}:${left.name}`.localeCompare(`${right.fromRootId}:${right.name}`))
}

function addExternalLocalDependencies(
  roots: IWorkspaceRoot[],
  packageStates: IWorkspacePackageState[],
  workspaceRoot: string
): void {
  for (const state of packageStates.filter(participatesInSourceClosure)) {
    for (const [name, specifier] of Object.entries(allDependencies(state.manifest))) {
      if (!/^(file|link):/.test(specifier)) continue
      const dependencyRoot = path.resolve(state.descriptor.root, specifier.replace(/^(file|link):/, ''))
      if (!existsSync(dependencyRoot) || roots.some(root => root.originalPath === dependencyRoot)) continue
      roots.push({
        rootId: `local:${digestText(`${name}:${dependencyRoot}`).slice(7, 19)}`,
        role: 'local-dependency',
        originalPath: dependencyRoot,
        relativePlacement: toPosixPath(path.relative(workspaceRoot, dependencyRoot)),
      })
    }
  }
}

function participatesInSourceClosure(state: IWorkspacePackageState): boolean {
  return [...state.reasons].some(reason => reason !== 'workspace-root-importer')
}

function appendCaptureRoots(roots: IWorkspaceRoot[], captureRoots: IWorkspaceRoot[]): void {
  for (const captureRoot of captureRoots) {
    if (!roots.some(root => root.rootId === captureRoot.rootId || root.originalPath === captureRoot.originalPath)) {
      roots.push(captureRoot)
    }
  }
}

function allDependencies(manifest: IWorkspacePackageManifest): Record<string, string> {
  return {
    ...(manifest.dependencies ?? {}),
    ...(manifest.devDependencies ?? {}),
    ...(manifest.optionalDependencies ?? {}),
    ...(manifest.peerDependencies ?? {}),
  }
}

function selectPackage(state: IWorkspacePackageState | undefined, reason: string): void {
  state?.reasons.add(reason)
}

async function readManifest(file: string): Promise<IWorkspacePackageManifest> {
  return JSON.parse(await readFile(file, 'utf8')) as IWorkspacePackageManifest
}

function isInside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function digestText(value: string): string {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join(path.posix.sep)
}
