"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPathForConsistencyCheck = exports.resolveTestPath = exports.resolveSnapshotPath = void 0;
const path = require("path");
const TEST_DIR = '__tests__';
const SNAPSHOT_DIR = '__snapshots__';
const resolveSnapshotPath = (testPath, snapshotExtension) => {
    return testPath.replace(TEST_DIR, SNAPSHOT_DIR) + snapshotExtension;
};
exports.resolveSnapshotPath = resolveSnapshotPath;
const resolveTestPath = (snapshotPath, snapshotExtension) => {
    return snapshotPath.replace(snapshotExtension, '').replace(SNAPSHOT_DIR, TEST_DIR);
};
exports.resolveTestPath = resolveTestPath;
exports.testPathForConsistencyCheck = path.posix.join('consistency_check', TEST_DIR, 'example.test.js');
exports.default = {
    resolveSnapshotPath: exports.resolveSnapshotPath,
    resolveTestPath: exports.resolveTestPath,
    testPathForConsistencyCheck: exports.testPathForConsistencyCheck
};
