import build from '../src/index'
import { appPath, config, configNoWatch } from './mock/build_testdata'

const outputBundle = require('metro/src/shared/output/bundle')

describe('init', () => {
  jest.spyOn(outputBundle, 'build').mockImplementation(() => {
    return 'ok'
  })

  it('build', async () => {
    await build(appPath, config)
  })
  it('build_noWatch', async () => {
    await build(appPath, configNoWatch)
  })
})
