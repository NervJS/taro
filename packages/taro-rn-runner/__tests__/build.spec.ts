import build from '../dist/index'
import { appPath, config, configNoWatch } from './mock/build_testdata'
const Metro = require('metro')

describe('init', () => {
  jest.spyOn(Metro, 'runBuild').mockImplementation(() => {
    return 'ok'
  })

  it('build', async () => {
    await build(appPath, config)
  })
  it('build_noWatch', async () => {
    await build(appPath, configNoWatch)
  })
})
