import * as path from 'path'
import { Kernel } from '@tarojs/service'
import chalk from 'chalk'
import { fs } from '@tarojs/helper'

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
  const fs = jest.requireActual('fs-extra')
  return {
    __esModule: true,
    ...helper,
    fs: {
      ...fs,
      writeFileSync: jest.fn()
    }
  }
})

async function run (appPath: string, options: Record<string, string> = {}, args: string[] = []) {
  const kernel = new Kernel({
    appPath: appPath,
    presets: [
      path.resolve(__dirname, '__mocks__', 'presets.ts')
    ]
  })

  await kernel.run({
    name: 'inspect',
    opts: {
      _: ['inspect', ...args],
      options,
      isHelp: false
    }
  })

  return kernel
}

describe('inspect', () => {
  it('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await run('')
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should exit when user haven\'t pass correct type', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await run(path.resolve(__dirname, 'fixtures/default'))
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(logSpy).toBeCalledWith(chalk.red('请传入正确的编译类型！'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log config', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await run(appPath, {
        type: 'weapp'
      })
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(logSpy).toBeCalledTimes(1)

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log specific config', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')
    const errorSpy = jest.spyOn(console, 'error')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    errorSpy.mockImplementation(() => {})

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await run(appPath, {
        type: 'h5'
      }, ['resolve.mainFields.0'])
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(logSpy).toBeCalledTimes(1)
    expect(logSpy).toBeCalledWith('\'main:h5\'')

    exitSpy.mockRestore()
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('should output config', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const writeFileSync = fs.writeFileSync as jest.Mock<any>
    const outputPath = 'project-config.js'

    exitSpy.mockImplementation(() => {
      throw new Error()
    })

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await run(appPath, {
        type: 'alipay',
        output: outputPath
      }, ['resolve.mainFields.0'])
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(writeFileSync).toBeCalledWith(outputPath, '\'browser\'')

    exitSpy.mockRestore()
  })
})
