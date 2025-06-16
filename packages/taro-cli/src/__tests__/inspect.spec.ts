import * as path from 'node:path'

import { chalk, fs } from '@tarojs/helper'

import { run } from './utils'

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
      await runInspect(path.resolve(__dirname, 'fixtures/default'))
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
      const appPath = path.resolve(__dirname, 'fixtures/default')
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

  it('正例：打印特定日志', async () => {
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'info')
    const errorSpy = jest.spyOn(console, 'error')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    errorSpy.mockImplementation(() => {})

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await runInspect(appPath, {
        options: {
          type: 'h5'
        },
        args: ['resolve.mainFields.0']
      })
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('\'main:h5\'')

    exitSpy.mockRestore()
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('正例：输出日志', async () => {
    const exitSpy = jest.spyOn(process, 'exit')
    const writeFileSync = fs.writeFileSync as jest.Mock<any>
    const outputPath = 'project-config.js'

    exitSpy.mockImplementation(() => {
      throw new Error()
    })

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await runInspect(appPath, {
        options: {
          type: 'weapp',
          output: outputPath
        },
        args: ['resolve.mainFields.0']
      })
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(writeFileSync).toHaveBeenCalledWith(outputPath, '\'browser\'')

    exitSpy.mockRestore()
  })
})
