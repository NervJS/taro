import * as helper from '@tarojs/helper'
import { QQ } from '@tarojs/plugin-platform-qq'

import { compile, getOutput } from './utils/compiler'

const program = new QQ({ helper } as any, {})
const customConfig = {
  buildAdapter: 'qq',
  globalObject: program.globalObject,
  fileType: program.fileType,
  template: program.template,
  runtimePath: program.runtimePath
}

describe('qq', () => {
  test('should build qq app', async () => {
    const { stats, config } = await compile('react', customConfig)
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should base template loop 10 times', async () => {
    const { stats, config } = await compile('react', customConfig)
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
