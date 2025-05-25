import { compile, getOutput } from './utils/compiler'

import type { IH5BuildConfig, IMiniBuildConfig } from '../../packages/taro-webpack5-runner/src/utils/types'

describe('framework', () => {
  describe('should build react app', () => {
    test('web', async () => {
      const { stats, config } = await compile<IH5BuildConfig>('react', {
        platformType: 'web',
        framework: 'react'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile<IMiniBuildConfig>('react', {
        platformType: 'mini',
        framework: 'react'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should build vue3 app', () => {
    test('web', async () => {
      const { stats, config } = await compile<IH5BuildConfig>('vue3', {
        platformType: 'web',
        framework: 'vue3'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile<IMiniBuildConfig>('vue3', {
        platformType: 'mini',
        framework: 'vue3'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
