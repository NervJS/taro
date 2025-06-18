import { resolve } from 'node:path'

import { chalk } from '@tarojs/helper'

import { run } from './utils'

const appPath = resolve(__dirname, 'fixtures/default')

jest.mock('cli-highlight', () => {
  return {
    __esModule: true,
    default (str) {
      return str
    }
  }
})

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  const fs = helper.fs
  return {
    __esModule: true,
    ...helper,
    fs: {
      ...fs,
      writeFileSync: jest.fn()
    }
  }
})

const runInspect = run('inspect', [
  'commands/build',
  'commands/inspect',
  require.resolve('@tarojs/plugin-platform-weapp')
])

describe('inspect', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('反例：非 taro 项目', async () => {
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInspect('')
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(1)
    expect(logSpy).toHaveBeenCalledWith(chalk.red('找不到项目配置文件 config/index，请确定当前目录是 Taro 项目根目录！'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('反例：未指定编译类型', async () => {
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInspect(appPath)
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(logSpy).toHaveBeenCalledWith(chalk.red('请传入正确的编译类型！'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('正例：打印日志', async () => {
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'info')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInspect(appPath, {
        options: {
          type: 'weapp'
        }
      })
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(logSpy).toHaveBeenCalledTimes(1)

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })
})
