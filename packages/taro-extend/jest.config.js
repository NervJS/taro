/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jsWithTs: tsjPreset } = require('ts-jest/presets')
const path = require('path')

module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform
  },
  testURL: 'http://localhost/',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'nerv.js',
    'vue.js',
    'utils.js'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: {
        jsx: 'react',
        allowJs: true,
        target: 'ES6'
      }
    }
  },
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  moduleNameMapper: {
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@tarojs/runtime': path.resolve(__dirname, '..', '..', 'packages/taro-runtime/dist/runtime.esm.js')
  },
  // setupFiles: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
}
