import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { collectProjectFacts } from '../collect-project-facts'
import {
  parseProjectFacts,
  ProjectFactsValidationError,
  serializeProjectFacts,
} from '../facts-serialization'

describe('project facts serialization', () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'facts-serialization-'))
    fs.mkdirSync(path.join(root, 'src', 'pages', 'index'), { recursive: true })
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'serialization-fixture' }))
    fs.writeFileSync(path.join(root, 'src', 'app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
    fs.writeFileSync(path.join(root, 'src', 'pages', 'index', 'index.tsx'), 'export default () => null\n')
  })

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('round trips a collected snapshot', async () => {
    const snapshot = await collectProjectFacts({ root })
    const restored = parseProjectFacts(serializeProjectFacts(snapshot))

    expect(restored).toEqual(snapshot)
  })

 it('rejects old schema versions without an explicit migration', async () => {
 const snapshot = await collectProjectFacts({ root })
 const legacy = { ...snapshot, schemaVersion: 0 }

    expect(() => parseProjectFacts(JSON.stringify(legacy))).toThrow('schemaVersion 0 has no migration to 1')
  })

  it('rejects schema versions newer than the current reader', async () => {
    const snapshot = await collectProjectFacts({ root })
    const future = { ...snapshot, schemaVersion: 2 }

    expect(() => parseProjectFacts(JSON.stringify(future))).toThrow('newer than supported version 1')
 })

 it('rejects unsafe manifest paths', async () => {
    const snapshot = await collectProjectFacts({ root })
    snapshot.workspaceManifest.entries[0].relativePath = '../outside'

    expect(() => serializeProjectFacts(snapshot)).toThrow(ProjectFactsValidationError)
    expect(() => serializeProjectFacts(snapshot)).toThrow('safe relative path')
  })

  it('rejects non-monotonic build cycles', async () => {
    const snapshot = await collectProjectFacts({ root })
    const invocation = {
      process: { executable: '/node', argv: ['taro', 'build'], cwdRootId: 'project' },
      runOptions: {},
      effectiveConfigDigest: `sha256:${'a'.repeat(64)}`,
      mode: 'watch' as const,
    }
    snapshot.buildSession = {
      sessionId: 'session-1',
      startedAt: '2026-08-17T08:00:00.000Z',
      invocation,
      baselineSnapshotId: snapshot.snapshotId,
      cycles: [1, 1].map((sequence, index) => ({
        cycleId: `cycle-${index}`,
        sequence,
        startedAt: `2026-08-17T08:00:0${index + 1}.000Z`,
        trigger: { type: 'initial' as const },
        changedFiles: [],
        effectiveConfigDigest: `sha256:${'a'.repeat(64)}`,
        effectiveConfigSnapshot: {},
        replay: 'exact' as const,
      })),
    }

    expect(() => serializeProjectFacts(snapshot)).toThrow('strictly increasing')
  })

  it('rejects invalid workspace metadata', async () => {
    const snapshot = await collectProjectFacts({ root })
    snapshot.workspaceManifest.entries[0].mtimeMs = Number.NaN

    expect(() => serializeProjectFacts(snapshot)).toThrow('mtimeMs must be a finite number')
  })

  it('validates build Session persistence and predecessor facts', async () => {
    const snapshot = await collectProjectFacts({ root })
    const invocation = {
      process: { executable: '/node', argv: ['taro', 'build'], cwdRootId: 'project' },
      runOptions: {},
      effectiveConfigDigest: `sha256:${'a'.repeat(64)}`,
      mode: 'watch' as const,
    }
    snapshot.buildSession = {
      sessionId: 'session-2',
      startedAt: '2026-09-01T08:00:00.000Z',
      invocation,
      baselineSnapshotId: snapshot.snapshotId,
      journalSequence: 1,
      predecessor: {
        sessionId: 'session-1',
        gapStartedAt: '2026-09-01T07:59:00.000Z',
        resumedAt: '2026-09-01T08:00:00.000Z',
        reason: 'Persistence buffer was lost.',
      },
      cycles: [],
    }

    expect(parseProjectFacts(serializeProjectFacts(snapshot)).buildSession).toEqual(snapshot.buildSession)

    snapshot.buildSession.journalSequence = -1
    expect(() => serializeProjectFacts(snapshot)).toThrow('journalSequence must be a non-negative safe integer')
  })

  it('rejects invalid deleted and symlink file-version metadata', async () => {
    const snapshot = await collectProjectFacts({ root })
    const invocation = {
      process: { executable: '/node', argv: ['taro', 'build'], cwdRootId: 'project' },
      runOptions: {},
      effectiveConfigDigest: `sha256:${'a'.repeat(64)}`,
      mode: 'watch' as const,
    }
    snapshot.buildSession = {
      sessionId: 'session-invalid-file',
      startedAt: '2026-09-01T08:00:00.000Z',
      invocation,
      baselineSnapshotId: snapshot.snapshotId,
      cycles: [{
        cycleId: 'cycle-invalid-file',
        sequence: 1,
        startedAt: '2026-09-01T08:00:01.000Z',
        trigger: { type: 'file-change', files: [] },
        changedFiles: [{
          rootId: 'project',
          path: 'src/index.ts',
          version: 1,
          kind: 'deleted',
          contentKind: 'symlink',
          contentDigest: `sha256:${'b'.repeat(64)}`,
          size: -1,
          mode: -1,
          symlinkTarget: 42,
        } as never],
        effectiveConfigDigest: `sha256:${'a'.repeat(64)}`,
        effectiveConfigSnapshot: {},
        replay: 'exact',
      }],
    }

    expect(() => serializeProjectFacts(snapshot)).toThrow('deleted files must not carry content metadata')
    expect(() => serializeProjectFacts(snapshot)).toThrow('size must be a non-negative safe integer')
    expect(() => serializeProjectFacts(snapshot)).toThrow('mode must be a non-negative safe integer')
    expect(() => serializeProjectFacts(snapshot)).toThrow('symlinkTarget must be a string')

    const changedFile = snapshot.buildSession.cycles[0]!.changedFiles[0]! as unknown as Record<string, unknown>
    changedFile.kind = 'modified'
    changedFile.contentDigest = `sha256:${'b'.repeat(64)}`
    changedFile.size = 1
    changedFile.mode = 0o644
    changedFile.mtimeMs = Number.NaN
    delete changedFile.symlinkTarget
    expect(() => serializeProjectFacts(snapshot)).toThrow('mtimeMs must be a finite number')
    expect(() => serializeProjectFacts(snapshot)).toThrow('symlinkTarget is required for symlink content')
  })
})
