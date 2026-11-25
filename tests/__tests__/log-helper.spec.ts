import { chalk } from '@tarojs/helper'
import { bindDevLogger, bindProdLogger } from '@tarojs/webpack5-runner/dist/utils/logHelper'

const webpack = jest.requireActual('webpack')

describe('logHelper printBuildError via webpack failed hook', () => {
  let logSpy: jest.SpyInstance

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  test('prints file path, line, and column for UglifyJs minify errors via prod failed hook', () => {
    const compiler = webpack({})
    bindProdLogger(compiler)
    logSpy.mockClear()

    const err = new Error('bundle.js from UglifyJs')
    err.stack = 'Unexpected token: punc (}) [src/broken.js:7,9][bundle.js:1,0]'

    compiler.hooks.failed.call(err)

    expect(logSpy).toHaveBeenCalledWith(
      'Failed to minify the code from this file: \n\n',
      chalk.yellow('\tsrc/broken.js:7:9'),
      '\n'
    )
    const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n')
    expect(output).toContain('Failed to minify the code from this file:')
    expect(output).toContain('src/broken.js:7:9')
  })

  test('omits column when UglifyJs minify error column is 0 via dev failed hook', () => {
    const compiler = webpack({})
    bindDevLogger(compiler)
    logSpy.mockClear()

    const err = new Error('bundle.js from UglifyJs')
    err.stack = 'Unexpected token: punc (}) [src/broken.js:7,0][bundle.js:1,0]'

    compiler.hooks.failed.call(err)

    expect(logSpy).toHaveBeenCalledWith(
      'Failed to minify the code from this file: \n\n',
      chalk.yellow('\tsrc/broken.js:7'),
      '\n'
    )
    const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n')
    expect(output).toContain('src/broken.js:7')
    expect(output).not.toContain('src/broken.js:7:0')
  })

  test('falls back to generic minify error message when UglifyJs stack has no location match', () => {
    const compiler = webpack({})
    bindProdLogger(compiler)
    logSpy.mockClear()

    const err = new Error('bundle.js from UglifyJs')
    err.stack = 'Error: bundle.js from UglifyJs\n    at minify'

    compiler.hooks.failed.call(err)

    expect(logSpy).toHaveBeenCalledWith('Failed to minify the bundle.', err)
  })

  test('prints error message directly for regular build errors', () => {
    const compiler = webpack({})
    bindProdLogger(compiler)
    logSpy.mockClear()

    const err = new Error('Build failed')

    compiler.hooks.failed.call(err)

    expect(logSpy).toHaveBeenCalledWith('Build failed\n')
  })
})
