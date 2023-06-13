import type { Test } from 'jest-runner'

const Sequencer = require('@jest/test-sequencer').default

export default class CustomSequencer extends Sequencer {
  sort(tests: Test[]) {
    const copyTests = Array.from(tests)
    return copyTests.sort((testA, testB) => testA.path.localeCompare(testB.path))
  }
}
