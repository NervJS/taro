import type { IProjectGraph, TFrameworkKind } from './schema'
import type { KernelLike } from './query'

export const PROJECT_FACTS_SCHEMA_VERSION = 1 as const

export type TProjectFactsSchemaVersion = typeof PROJECT_FACTS_SCHEMA_VERSION

export type TJsonPrimitive = boolean | null | number | string

export type TJsonValue = TJsonPrimitive | TJsonValue[] | { [key: string]: TJsonValue }

export type TPackageManagerKind = 'cnpm' | 'npm' | 'pnpm' | 'yarn' | 'unknown'

export type TLockfileKind = 'npm' | 'pnpm' | 'yarn'

export type TBuildChain = 'dynamic' | 'h5' | 'jdharmony' | 'weapp' | 'unknown'

export type TBuildReplay = 'exact' | 'timing-approximate' | 'final-state-only'

export type TWorkspaceRootRole = 'project' | 'workspace-root' | 'workspace-package' | 'external-project' | 'local-dependency'

export interface IWorkspaceRoot {
  rootId: string
  role: TWorkspaceRootRole
  originalPath: string
  relativePlacement?: string
}

export interface IWorkspaceContentEntry {
  rootId: string
  relativePath: string
  digest: string
  size: number
  mode: number
  mtimeMs?: number
  kind: 'file' | 'symlink'
  symlinkTarget?: string
}

export interface IWorkspaceContentManifest {
  roots: IWorkspaceRoot[]
  entries: IWorkspaceContentEntry[]
  /** Exact capture identity including root locations and file metadata; not a cross-machine content hash. */
  manifestDigest: string
}

export interface IContentWriter {
  write(chunk: Uint8Array): Promise<void>
  commit(result: { digest: string, size: number }): Promise<void>
  abort(): Promise<void>
}

export interface IContentSink {
  begin(entry: Omit<IWorkspaceContentEntry, 'digest'>): Promise<IContentWriter>
}

export interface IProjectFacts {
  root: string
  name?: string
  version?: string
  private?: boolean
  framework: TFrameworkKind
  compiler: 'vite' | 'webpack5' | 'unknown'
  sourceRoot?: string
  outputRoot?: string
  configFiles: string[]
  plugins: string[]
}

export interface IRepositoryChangedFileFacts {
  path: string
  status: string
  staged: boolean
}

export interface IRepositoryFacts {
  root: string
  branch?: string
  head?: string
  remote?: string
  dirty: boolean
  changedFiles: IRepositoryChangedFileFacts[]
}

export interface IWorkspacePackageFacts {
  rootId: string
  name?: string
  version?: string
  relativePath: string
  dependencies: string[]
  selected?: boolean
  selectionReasons?: string[]
}

export interface IWorkspaceTopologyFacts {
  packageManagerWorkspace: boolean
  workspaceRootId?: string
  workspaceKind?: 'pnpm' | 'workspaces'
  packages: IWorkspacePackageFacts[]
  unresolvedLocalDependencies?: Array<{
    fromRootId: string
    name: string
    specifier: string
    reason: string
  }>
}

export interface ILockfileFacts {
  rootId: string
  relativePath: string
  kind: TLockfileKind
  digest: string
  matchesPackageManager: boolean
}

export interface ILocalDependencyFacts {
  name: string
  specifier: string
  rootId?: string
  resolvedPath?: string
}

export interface IDependencyFacts {
  packageManager: TPackageManagerKind
  packageManagerVersion?: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  installedDependencies: Record<string, string>
  lockfiles: ILockfileFacts[]
  localDependencies: ILocalDependencyFacts[]
}

export interface IToolVersionFacts {
  name: string
  version?: string
  path?: string
}

export interface IToolchainFacts {
  node: IToolVersionFacts
  packageManager: IToolVersionFacts
  taroCli?: IToolVersionFacts
  compiler?: IToolVersionFacts
  runner?: IToolVersionFacts
  platformPlugins: IToolVersionFacts[]
  operatingSystem: {
    platform: string
    release: string
    architecture: string
  }
}

export interface IInvocationFacts {
  launcher?: {
    executable: string
    argv: string[]
    packageScript?: string
  }
  process: {
    executable: string
    argv: string[]
    cwdRootId: string
  }
  lifecycle?: {
    event?: string
    script?: string
  }
  runOptions: Record<string, TJsonValue>
  effectiveConfigDigest: string
  mode: 'build' | 'dev' | 'watch'
}

export interface IBuildTargetFacts {
  chain: TBuildChain
  platform: string
  runtimeTarget?: 'android' | 'ios' | string
  pages?: string[]
  components?: string[]
}

export interface IFileVersionReference {
  rootId: string
  path: string
  version: number
  kind: 'created' | 'modified' | 'deleted'
  contentKind?: 'file' | 'symlink'
  contentDigest?: string
  size?: number
  mode?: number
  mtimeMs?: number
  symlinkTarget?: string
}

export type TBuildCycleTrigger =
  | { type: 'initial' }
  | { type: 'file-change', files: Array<{ rootId: string, path: string, offsetMs: number }> }
  | { type: 'manual-rebuild' }
  | { type: 'page-target', page: string, component?: string }
  | { type: 'platform-target', platform: 'android' | 'ios' | string }
  | { type: 'unknown', source?: string }

export interface IBuildResultFacts {
  status: 'success' | 'failure' | 'cancelled'
  durationMs: number
  errorName?: string
  errorMessage?: string
  outputFiles?: Array<{ rootId: string, path: string, digest?: string }>
  evidenceRefs: string[]
}

export interface IBuildCycleFacts {
  cycleId: string
  sequence: number
  startedAt: string
  finishedAt?: string
  trigger: TBuildCycleTrigger
  target?: IBuildTargetFacts
  changedFiles: IFileVersionReference[]
  effectiveConfigDigest: string
  effectiveConfigSnapshot: TJsonValue
  replay: TBuildReplay
  result?: IBuildResultFacts
}

export interface IBuildSessionFacts {
  sessionId: string
  startedAt: string
  finishedAt?: string
  invocation: IInvocationFacts
  baselineSnapshotId: string
  journalSequence?: number
  predecessor?: {
    sessionId: string
    gapStartedAt: string
    resumedAt: string
    reason: string
  }
  cycles: IBuildCycleFacts[]
}

export interface IEnvironmentFacts {
  variables: IEnvironmentVariableFacts[]
  files: Array<{ rootId: string, path: string, digest: string }>
}

export type TEnvironmentVariableKind = 'restorable' | 'path' | 'host-volatile'

export interface IEnvironmentVariableFacts {
  name: string
  kind: TEnvironmentVariableKind
  value?: string
  pathValue?: {
    rootId: string
    relativePath: string
  }
}

export interface IPlatformFacts {
  configuredTargets: string[]
  observedTargets: IBuildTargetFacts[]
  deviceInfo?: Record<string, TJsonValue>
}

export interface IEvidenceReferenceFacts {
  evidenceId: string
  kind: string
  digest?: string
  rootId?: string
  path?: string
  createdAt: string
}

export type TFactsCapabilityStatus = 'supported' | 'degraded' | 'unsupported'

export interface IFactsCapabilityEntry {
  status: TFactsCapabilityStatus
  reason?: string
}

export interface IFactsCapabilities {
  projectGraph: IFactsCapabilityEntry
  repository: IFactsCapabilityEntry
  workspace: IFactsCapabilityEntry
  dependencies: IFactsCapabilityEntry
  toolchain: IFactsCapabilityEntry
  invocation: IFactsCapabilityEntry
  buildSession: IFactsCapabilityEntry
  workspaceContent: IFactsCapabilityEntry
  environment: IFactsCapabilityEntry
  platform: IFactsCapabilityEntry
}

export interface IProjectFactsSnapshot {
  schemaVersion: TProjectFactsSchemaVersion
  snapshotId: string
  createdAt: string
  projectGraph: IProjectGraph
  project: IProjectFacts
  repository?: IRepositoryFacts
  workspaces: IWorkspaceTopologyFacts
  dependencies: IDependencyFacts
  toolchain: IToolchainFacts
  invocation?: IInvocationFacts
  buildSession?: IBuildSessionFacts
  workspaceManifest: IWorkspaceContentManifest
  environment: IEnvironmentFacts
  platform: IPlatformFacts
  evidence: IEvidenceReferenceFacts[]
  capabilities: IFactsCapabilities
}

export interface ITaroCaptureContext {
  kernel?: KernelLike
  invocation?: IInvocationFacts
  buildSession?: IBuildSessionFacts
  effectiveConfig?: TJsonValue
  target?: IBuildTargetFacts
  environment?: IEnvironmentFacts
  workspaceRoots?: IWorkspaceRoot[]
}

export interface ICollectProjectFactsOptions {
  root: string
  captureContext?: ITaroCaptureContext
  contentSink?: IContentSink
}
