import * as fs from 'fs-extra'

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
      optimizeMainPackage: true
    })

    const assets = stats.toJson().assets || []
    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })
})
