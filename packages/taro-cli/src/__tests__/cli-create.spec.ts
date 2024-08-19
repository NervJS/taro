import { chalk } from '@tarojs/helper'

import { run } from './utils'

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  return {
    __esModule: true,
    ...helper
  }
})

const runConfig = run('create', ['commands/create'])

describe('create', () => {
  const appPath = '/'
  const pluginArr = ['plugin-command', 'plugin-build', 'plugin-template']

  it('should create project', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    await runConfig(appPath, {
      options: {
        page: 'test',
      }
    })
    expect(logSpy).toHaveBeenCalledWith(chalk.red('请输入需要创建的页面名称'))
    logSpy.mockRestore()
  })

  describe.each(pluginArr)('should display help for', (item) => {
    it(`should create project ${item}`, async () => {
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      await runConfig(appPath, {
        options: {
          type: item
        }
      })
      expect(logSpy).toHaveBeenCalledWith(chalk.red('请输入需要创建的插件名称'))
      logSpy.mockRestore()
    })
  })
})
