import { chalk } from '@tarojs/helper'

import { run } from './utils'

const runHelp = run('help', ['commands/help'])

describe('help', () => {
  const appPath = '/'
  const cmdArr = ['init', 'config', 'create', 'build', 'update', 'info', 'doctor', 'inspect']

  let logSpy

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('should enter taro help [cmd]', async () => {
    logSpy.mockImplementation(() => {})
    await runHelp(appPath)
    expect(logSpy).toHaveBeenCalledWith(chalk.yellow('用法：taro help [cmd]，cmd 不存在！请输入需要查看帮助的命令名称。'))
    logSpy.mockRestore()
  })

  describe.each(cmdArr)('should display help for', (cmd) => {
    it(`should taro help ${cmd}`, async () => {
      logSpy.mockImplementation(() => {})

      await runHelp(appPath, { args: [cmd] })

      expect(logSpy).toHaveBeenNthCalledWith(1, `Usage: taro ${cmd} [options]`)
      expect(logSpy).toHaveBeenNthCalledWith(2)
      expect(logSpy).toHaveBeenNthCalledWith(3, 'Options:')
      expect(logSpy).toHaveBeenNthCalledWith(4, '  -h, --help  output usage information')

      logSpy.mockRestore()
    })
  })
})
