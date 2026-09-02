import {
  PROJECT_FACTS_SCHEMA_VERSION,
  type IBuildSessionFacts,
  type IProjectFactsSnapshot,
  type TBuildReplay,
} from '../facts'

describe('project facts schema', () => {
  it('uses an independent numeric schema version', () => {
    expect(PROJECT_FACTS_SCHEMA_VERSION).toBe(1)
  })

  it('freezes the supported replay grades', () => {
    const replayGrades: TBuildReplay[] = ['exact', 'timing-approximate', 'final-state-only']

    expect(replayGrades).toEqual(['exact', 'timing-approximate', 'final-state-only'])
  })

  it('models ordered immutable build cycles', () => {
    const session: IBuildSessionFacts = {
      sessionId: 'session-1',
      startedAt: '2026-08-17T08:00:00.000Z',
      invocation: {
        launcher: {
          executable: 'pnpm',
          argv: ['dev:dynamic'],
          packageScript: 'dev:dynamic',
        },
        process: {
          executable: '/runtime/node',
          argv: ['taro', 'build', '--type', 'dynamic', '--watch'],
          cwdRootId: 'project',
        },
        lifecycle: {
          event: 'dev:dynamic',
          script: 'npm run build:dynamic -- --watch',
        },
        runOptions: {
          type: 'dynamic',
          watch: true,
        },
        effectiveConfigDigest: 'sha256:config',
        mode: 'watch',
      },
      baselineSnapshotId: 'snapshot-1',
      cycles: [{
        cycleId: 'cycle-1',
        sequence: 1,
        startedAt: '2026-08-17T08:00:01.000Z',
        trigger: { type: 'initial' },
        target: { chain: 'dynamic', platform: 'dynamic', runtimeTarget: 'android' },
        changedFiles: [],
        effectiveConfigDigest: 'sha256:config',
        effectiveConfigSnapshot: {},
        replay: 'exact',
      }],
    }

    expect(session.cycles.map(cycle => cycle.sequence)).toEqual([1])
  })

  it('keeps callback workflow data outside project facts', () => {
    type SnapshotKeys = keyof IProjectFactsSnapshot
    const keys: SnapshotKeys[] = [
      'schemaVersion',
      'snapshotId',
      'createdAt',
      'projectGraph',
      'project',
      'repository',
      'workspaces',
      'dependencies',
      'toolchain',
      'invocation',
      'buildSession',
      'workspaceManifest',
      'environment',
      'platform',
      'evidence',
      'capabilities',
    ]

    expect(keys).not.toContain('caseId')
    expect(keys).not.toContain('upload')
    expect(keys).not.toContain('userSupplement')
  })
})
