"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequencer = require('@jest/test-sequencer').default;
class CustomSequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => testA.path.localeCompare(testB.path));
    }
}
exports.default = CustomSequencer;
