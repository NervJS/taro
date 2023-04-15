import { compile, getOutput } from './utils/compiler'

describe('framework', () => {
  describe('should build react app', () => {
    test('web', async () => {
      const { stats, config } = await compile('react', {
        platformType: 'web',
        framework: 'react'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('react', {
        platformType: 'mini',
        framework: 'react'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should build vue app', () => {
    test('web', async () => {
      const { stats, config } = await compile('vue', {
        platformType: 'web',
        framework: 'vue'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('vue', {
        platformType: 'mini',
        framework: 'vue',
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should build vue3 app', () => {
    test('web', async () => {
      const { stats, config } = await compile('vue3', {
        platformType: 'web',
        framework: 'vue3'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('vue3', {
        platformType: 'mini',
        framework: 'vue3'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should build nerv app', () => {
    test('web', async () => {
      const { stats, config } = await compile('nerv', {
        platformType: 'web',
        framework: 'nerv'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('nerv', {
        platformType: 'mini',
        framework: 'nerv'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
