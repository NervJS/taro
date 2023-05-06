"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.serialize = exports.snapshotObject2String = exports.parseSnapshotByFilePath = exports.print = void 0;
const os = require("os");
// import type { Config, Refs, Printer } from 'pretty-format'
const print = (val) => {
    // Note: 对齐各平台的路径分隔符
    return val.replace(/\\*\*\sfilePath:\s(.*)\s\*\*\//g, (replaceValue) => replaceValue.replace(/\\/g, '/'));
};
exports.print = print;
const parseSnapshotByFilePath = (val) => {
    const arr = val.split(new RegExp(os.EOL + '|\n'));
    let key = '';
    return arr.reduce((acc, cur) => {
        if (cur.startsWith('/** filePath:')) {
            key = cur.replace(/\\/g, '/');
            acc[key] = '';
        }
        else {
            acc[key] || (acc[key] = '');
            if (acc[key] !== '') {
                acc[key] += '\n';
            }
            acc[key] += cur;
        }
        return acc;
    }, {});
};
exports.parseSnapshotByFilePath = parseSnapshotByFilePath;
const snapshotObject2String = (val) => {
    return `"\n${Object.entries(val)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .filter(([key]) => key !== '')
        .map(([key, value]) => `${key}\n${value}`)
        .join('\n')}"`;
};
exports.snapshotObject2String = snapshotObject2String;
const serialize = (val) => {
    if (typeof val === 'string') {
        return (0, exports.snapshotObject2String)((0, exports.parseSnapshotByFilePath)(val));
    }
    return val;
};
exports.serialize = serialize;
const test = (val) => typeof val === 'string';
exports.test = test;
exports.default = {
    // print,
    serialize: exports.serialize,
    test: exports.test,
};
