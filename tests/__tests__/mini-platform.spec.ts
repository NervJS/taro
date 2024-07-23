import * as helper from '@tarojs/helper'
import { Alipay } from '@tarojs/plugin-platform-alipay'
import { JD } from '@tarojs/plugin-platform-jd'
import { QQ } from '@tarojs/plugin-platform-qq'
import { Swan } from '@tarojs/plugin-platform-swan'
import { TT } from '@tarojs/plugin-platform-tt'

import { compile, getOutput } from './utils/compiler'

describe('mini-platform', () => {
  describe('alipay', () => {
    test('should build alipay app', async () => {
      const program = new Alipay({ helper } as any, {})

      const { stats, config } = await compile('react', {
        platformType: 'mini',
        buildAdapter: 'alipay',
        globalObject: program.globalObject,
        fileType: program.fileType,
        template: program.template,
        runtimePath: program.runtimePath
      })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('bytedance', () => {
    test('should build bytedance app', async () => {
      const program = new TT({ helper } as any, {})

      const { stats, config } = await compile('react', {
        platformType: 'mini',
        buildAdapter: 'tt',
        globalObject: program.globalObject,
        fileType: program.fileType,
        template: program.template,
        runtimePath: program.runtimePath
      })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('jd', () => {
    test('should build jd app', async () => {
      const program = new JD({ helper } as any, {})

      const { stats, config } = await compile('react', {
        platformType: 'mini',
        buildAdapter: 'jd',
        globalObject: program.globalObject,
        fileType: program.fileType,
        template: program.template,
        runtimePath: program.runtimePath
      })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('qq', () => {
    const program = new QQ({ helper } as any, {})
    const customConfig = {
      buildAdapter: 'qq',
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath
    }

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

  describe('swan', () => {
    test('should build swan app', async () => {
      const program = new Swan({ helper } as any, {})

      const { stats, config } = await compile('react', {
        buildAdapter: 'swan',
        globalObject: program.globalObject,
        fileType: program.fileType,
        template: program.template,
        runtimePath: program.runtimePath
      })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
