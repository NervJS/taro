import path from 'node:path'
import {
  PROJECT_FACTS_SCHEMA_VERSION,
  type IBuildCycleFacts,
  type IProjectFactsSnapshot,
  type IWorkspaceContentEntry,
} from './facts'

const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/

export class ProjectFactsValidationError extends Error {
  readonly issues: string[]

  constructor(issues: string[]) {
    super(`Invalid project facts snapshot:\n${issues.map(issue => `- ${issue}`).join('\n')}`)
    this.name = 'ProjectFactsValidationError'
    this.issues = issues
  }
}

export function serializeProjectFacts(snapshot: IProjectFactsSnapshot): string {
  assertProjectFactsSnapshot(snapshot)
  return `${JSON.stringify(snapshot)}\n`
}

export function parseProjectFacts(value: string | Uint8Array): IProjectFactsSnapshot {
  let parsed: unknown
  try {
    parsed = JSON.parse(typeof value === 'string' ? value : Buffer.from(value).toString('utf8'))
  } catch (error) {
    throw new ProjectFactsValidationError([
      `Snapshot is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    ])
  }
 const migrated = migrateProjectFactsSnapshot(parsed)
 assertProjectFactsSnapshot(migrated)
 return migrated
}

type ProjectFactsMigration = (value: Record<string, unknown>) => Record<string, unknown>

const PROJECT_FACTS_MIGRATIONS: Partial<Record<number, ProjectFactsMigration>> = {}

function migrateProjectFactsSnapshot(value: unknown): unknown {
 if (!isRecord(value) || !Number.isSafeInteger(value.schemaVersion)) return value
 if (Number(value.schemaVersion) > PROJECT_FACTS_SCHEMA_VERSION) {
 throw new ProjectFactsValidationError([
 `schemaVersion ${value.schemaVersion} is newer than supported version ${PROJECT_FACTS_SCHEMA_VERSION}.`,
 ])
 }

 let migrated = value
 let version = Number(value.schemaVersion)
 while (version < PROJECT_FACTS_SCHEMA_VERSION) {
 const migration = PROJECT_FACTS_MIGRATIONS[version]
 if (!migration) {
 throw new ProjectFactsValidationError([
 `schemaVersion ${version} has no migration to ${version + 1}.`,
 ])
 }
 migrated = migration(migrated)
 const nextVersion = Number(migrated.schemaVersion)
 if (nextVersion !== version + 1) {
 throw new ProjectFactsValidationError([
 `schemaVersion migration ${version} must produce version ${version + 1}.`,
 ])
 }
 version = nextVersion
 }
 return migrated
}

export function assertProjectFactsSnapshot(value: unknown): asserts value is IProjectFactsSnapshot {
  const issues = validateProjectFactsSnapshot(value)
  if (issues.length > 0) throw new ProjectFactsValidationError(issues)
}

export function validateProjectFactsSnapshot(value: unknown): string[] {
  if (!isRecord(value)) return ['Snapshot must be an object.']
  const issues: string[] = []

  if (value.schemaVersion !== PROJECT_FACTS_SCHEMA_VERSION) {
    issues.push(`schemaVersion must be ${PROJECT_FACTS_SCHEMA_VERSION}.`)
  }
  requireString(value, 'snapshotId', issues)
  requireIsoDate(value, 'createdAt', issues)
  requireRecord(value, 'projectGraph', issues)
  requireRecord(value, 'project', issues)
  requireRecord(value, 'workspaces', issues)
  requireRecord(value, 'dependencies', issues)
  requireRecord(value, 'toolchain', issues)
  requireRecord(value, 'environment', issues)
  requireRecord(value, 'platform', issues)
  requireRecord(value, 'capabilities', issues)
  if (!Array.isArray(value.evidence)) issues.push('evidence must be an array.')

  validateWorkspaceManifest(value.workspaceManifest, issues)
  if (value.buildSession !== undefined) validateBuildSession(value.buildSession, issues)
  return issues
}

function validateWorkspaceManifest(value: unknown, issues: string[]): void {
  if (!isRecord(value)) {
    issues.push('workspaceManifest must be an object.')
    return
  }
  if (!Array.isArray(value.roots)) issues.push('workspaceManifest.roots must be an array.')
  if (!Array.isArray(value.entries)) {
    issues.push('workspaceManifest.entries must be an array.')
    return
  }
  if (!isDigest(value.manifestDigest)) issues.push('workspaceManifest.manifestDigest must be a SHA-256 digest.')

  const identities = new Set<string>()
  for (const [index, entry] of value.entries.entries()) {
    validateWorkspaceEntry(entry, index, identities, issues)
  }
}

function validateWorkspaceEntry(
  value: unknown,
  index: number,
  identities: Set<string>,
  issues: string[]
): void {
  const prefix = `workspaceManifest.entries[${index}]`
  if (!isRecord(value)) {
    issues.push(`${prefix} must be an object.`)
    return
  }
  const rootId = typeof value.rootId === 'string' ? value.rootId : ''
  const relativePath = typeof value.relativePath === 'string' ? value.relativePath : ''
  if (!rootId) issues.push(`${prefix}.rootId must be a non-empty string.`)
  if (!isSafeRelativePath(relativePath)) issues.push(`${prefix}.relativePath must be a safe relative path.`)
  if (!isDigest(value.digest)) issues.push(`${prefix}.digest must be a SHA-256 digest.`)
  if (!Number.isSafeInteger(value.size) || Number(value.size) < 0) issues.push(`${prefix}.size must be a non-negative safe integer.`)
  if (!Number.isSafeInteger(value.mode) || Number(value.mode) < 0) issues.push(`${prefix}.mode must be a non-negative safe integer.`)
  if (value.mtimeMs !== undefined && (typeof value.mtimeMs !== 'number' || !Number.isFinite(value.mtimeMs))) {
    issues.push(`${prefix}.mtimeMs must be a finite number.`)
  }
  if (value.kind !== 'file' && value.kind !== 'symlink') issues.push(`${prefix}.kind must be file or symlink.`)
  if (value.kind === 'symlink' && typeof value.symlinkTarget !== 'string') issues.push(`${prefix}.symlinkTarget is required for symlinks.`)

  const identity = `${rootId}:${relativePath}`
  if (identities.has(identity)) issues.push(`${prefix} duplicates ${identity}.`)
  identities.add(identity)
}

function validateBuildSession(value: unknown, issues: string[]): void {
  if (!isRecord(value)) {
    issues.push('buildSession must be an object.')
    return
  }
  requireString(value, 'sessionId', issues, 'buildSession')
  requireIsoDate(value, 'startedAt', issues, 'buildSession')
  if (value.finishedAt !== undefined) requireIsoDate(value, 'finishedAt', issues, 'buildSession')
  requireRecord(value, 'invocation', issues, 'buildSession')
  requireString(value, 'baselineSnapshotId', issues, 'buildSession')
  if (value.journalSequence !== undefined && (!Number.isSafeInteger(value.journalSequence) || Number(value.journalSequence) < 0)) {
    issues.push('buildSession.journalSequence must be a non-negative safe integer.')
  }
  if (value.predecessor !== undefined) validateBuildSessionPredecessor(value.predecessor, issues)
  if (!Array.isArray(value.cycles)) {
    issues.push('buildSession.cycles must be an array.')
    return
  }

  const cycleIds = new Set<string>()
  let previousSequence = 0
  for (const [index, cycle] of value.cycles.entries()) {
    const sequence = validateBuildCycle(cycle, index, cycleIds, issues)
    if (sequence <= previousSequence) issues.push(`buildSession.cycles[${index}].sequence must be strictly increasing.`)
    previousSequence = sequence
  }
}

function validateBuildSessionPredecessor(value: unknown, issues: string[]): void {
  if (!isRecord(value)) {
    issues.push('buildSession.predecessor must be an object.')
    return
  }
  requireString(value, 'sessionId', issues, 'buildSession.predecessor')
  requireIsoDate(value, 'gapStartedAt', issues, 'buildSession.predecessor')
  requireIsoDate(value, 'resumedAt', issues, 'buildSession.predecessor')
  requireString(value, 'reason', issues, 'buildSession.predecessor')
  if (
    typeof value.gapStartedAt === 'string'
    && typeof value.resumedAt === 'string'
    && Date.parse(value.resumedAt) < Date.parse(value.gapStartedAt)
  ) {
    issues.push('buildSession.predecessor.resumedAt must not precede gapStartedAt.')
  }
}

function validateBuildCycle(
  value: unknown,
  index: number,
  cycleIds: Set<string>,
  issues: string[]
): number {
  const prefix = `buildSession.cycles[${index}]`
  if (!isRecord(value)) {
    issues.push(`${prefix} must be an object.`)
    return 0
  }
  const cycle = value as unknown as Partial<IBuildCycleFacts>
  if (typeof cycle.cycleId !== 'string' || !cycle.cycleId) issues.push(`${prefix}.cycleId must be a non-empty string.`)
  else if (cycleIds.has(cycle.cycleId)) issues.push(`${prefix}.cycleId must be unique.`)
  else cycleIds.add(cycle.cycleId)
  if (!Number.isSafeInteger(cycle.sequence) || Number(cycle.sequence) < 1) issues.push(`${prefix}.sequence must be a positive safe integer.`)
  if (typeof cycle.startedAt !== 'string' || !isIsoDate(cycle.startedAt)) issues.push(`${prefix}.startedAt must be an ISO date.`)
  if (cycle.finishedAt !== undefined && !isIsoDate(cycle.finishedAt)) issues.push(`${prefix}.finishedAt must be an ISO date.`)
  if (!isRecord(cycle.trigger) || typeof cycle.trigger.type !== 'string') issues.push(`${prefix}.trigger must be a typed object.`)
  if (!isDigest(cycle.effectiveConfigDigest)) issues.push(`${prefix}.effectiveConfigDigest must be a SHA-256 digest.`)
  if (!['exact', 'timing-approximate', 'final-state-only'].includes(cycle.replay ?? '')) issues.push(`${prefix}.replay is invalid.`)
  if (!Array.isArray(cycle.changedFiles)) issues.push(`${prefix}.changedFiles must be an array.`)
  else cycle.changedFiles.forEach((file, fileIndex) => validateFileVersion(file, `${prefix}.changedFiles[${fileIndex}]`, issues))
  return Number.isSafeInteger(cycle.sequence) ? Number(cycle.sequence) : 0
}

function validateFileVersion(value: unknown, prefix: string, issues: string[]): void {
  if (!isRecord(value)) {
    issues.push(`${prefix} must be an object.`)
    return
  }
  if (typeof value.rootId !== 'string' || !value.rootId) issues.push(`${prefix}.rootId must be a non-empty string.`)
  if (typeof value.path !== 'string' || !isSafeRelativePath(value.path)) issues.push(`${prefix}.path must be a safe relative path.`)
  if (!Number.isSafeInteger(value.version) || Number(value.version) < 1) issues.push(`${prefix}.version must be a positive safe integer.`)
  if (!['created', 'modified', 'deleted'].includes(String(value.kind))) issues.push(`${prefix}.kind is invalid.`)
  if (value.kind === 'deleted' && value.contentDigest !== undefined) issues.push(`${prefix}.contentDigest must be absent for deleted files.`)
  if (value.kind !== 'deleted' && value.contentDigest !== undefined && !isDigest(value.contentDigest)) {
    issues.push(`${prefix}.contentDigest must be a SHA-256 digest.`)
  }
  if (value.contentKind !== undefined && value.contentKind !== 'file' && value.contentKind !== 'symlink') {
    issues.push(`${prefix}.contentKind is invalid.`)
  }
  if (value.size !== undefined && (!Number.isSafeInteger(value.size) || Number(value.size) < 0)) {
    issues.push(`${prefix}.size must be a non-negative safe integer.`)
  }
  if (value.mode !== undefined && (!Number.isSafeInteger(value.mode) || Number(value.mode) < 0)) {
    issues.push(`${prefix}.mode must be a non-negative safe integer.`)
  }
  if (value.mtimeMs !== undefined && (typeof value.mtimeMs !== 'number' || !Number.isFinite(value.mtimeMs))) {
    issues.push(`${prefix}.mtimeMs must be a finite number.`)
  }
  if (value.symlinkTarget !== undefined && typeof value.symlinkTarget !== 'string') {
    issues.push(`${prefix}.symlinkTarget must be a string.`)
  }
  if (value.kind === 'deleted' && ['contentKind', 'size', 'mode', 'mtimeMs', 'symlinkTarget'].some(key => value[key] !== undefined)) {
    issues.push(`${prefix} deleted files must not carry content metadata.`)
  }
  if (value.contentKind === 'symlink' && typeof value.symlinkTarget !== 'string') {
    issues.push(`${prefix}.symlinkTarget is required for symlink content.`)
  }
}

function requireString(value: Record<string, unknown>, key: string, issues: string[], parent?: string): void {
  if (typeof value[key] !== 'string' || !value[key]) issues.push(`${parent ? `${parent}.` : ''}${key} must be a non-empty string.`)
}

function requireIsoDate(value: Record<string, unknown>, key: string, issues: string[], parent?: string): void {
  const candidate = value[key]
  if (typeof candidate !== 'string' || !isIsoDate(candidate)) issues.push(`${parent ? `${parent}.` : ''}${key} must be an ISO date.`)
}

function requireRecord(value: Record<string, unknown>, key: string, issues: string[], parent?: string): void {
  if (!isRecord(value[key])) issues.push(`${parent ? `${parent}.` : ''}${key} must be an object.`)
}

function isSafeRelativePath(value: string): boolean {
  if (!value || path.posix.isAbsolute(value) || path.win32.isAbsolute(value)) return false
  const normalized = path.posix.normalize(value.replaceAll('\\', '/'))
  return normalized !== '..' && !normalized.startsWith('../')
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_PATTERN.test(value)
}

function isIsoDate(value: string): boolean {
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString() === value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export type { IWorkspaceContentEntry }
