import * as fs from 'fs-extra'
import * as path from 'path'

let compile
let getOutput

describe('mini-split-chunks', () => {
  beforeAll(() => {
    jest.unmock('webpack')
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      const compiler = require('./utils/compiler')
      compile = compiler.compile
      getOutput = compiler.getOutput
    })
  })

  test('should process mini-split-chunks', async () => {
    const { stats, config } = await compile('mini-split-chunks', {
      optimizeMainPackage: {
        enable: true,
        exclude: [
          path.resolve(__dirname, './fixtures/mini-split-chunks/src/utils/testExcludeString.js'),
          (module) => module.resource.indexOf('testExcludeFunction') >= 0
        ]
      }
    })

    const assets = stats.toJson().assets || []
    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })
})
