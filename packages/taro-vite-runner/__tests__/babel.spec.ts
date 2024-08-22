import { describe, expect, test } from 'vitest'

import { compile, getOutput } from './utils/compiler'

describe('babel', () => {
  describe('should convert do expressions', async () => {
    test('web', async () => {
      const { stats, config } = await compile('babel', { platformType: 'web' })
      const assets = stats?.toJson().assets || []

      // expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('babel', { platformType: 'mini' })
      // const assets = stats?.toJson().assets || []
      // console.log('stats222222222222', stats)
      // expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
