import * as path from 'path'

const TEST_DIR = '__tests__'
const SNAPSHOT_DIR = '__snapshots__'

export const resolveSnapshotPath = (testPath: string, snapshotExtension: string) => {
  return testPath.replace(TEST_DIR, SNAPSHOT_DIR) + snapshotExtension
}

export const resolveTestPath = (snapshotPath: string, snapshotExtension: string) => {
  return snapshotPath.replace(snapshotExtension, '').replace(SNAPSHOT_DIR, TEST_DIR)
}

export const testPathForConsistencyCheck = path.posix.join('consistency_check', TEST_DIR, 'example.test.js')

export default {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck,
}
