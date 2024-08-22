import * as path from 'node:path'

import { chalk, emptyDirectory } from '@tarojs/helper'

import { run } from './utils'

const runBuild = run('build', [
  'commands/build',
  require.resolve('@tarojs/plugin-platform-weapp'),
  require.resolve('@tarojs/plugin-platform-h5')
])

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  const fs = helper.fs
  return {
    __esModule: true,
    ...helper,
    emptyDirectory: jest.fn(),
    fs: {
      ...fs
    },
  }
})

const APP_PATH = path.join(__dirname, 'fixtures/default')
const OUTPUT_PATH = path.join(__dirname, 'fixtures/default/dist')

describe('构建配置测试', () => {
  const emptyDirectoryMocked = emptyDirectory as jest.Mock<any>

  beforeEach(() => {
    emptyDirectoryMocked.mockReset()
    process.argv = []
  })

  afterEach(() => {
    process.argv = []
    emptyDirectoryMocked.mockReset()
  })

  it("should exit because there isn't a Taro project", async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runBuild('')
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(1)
    expect(logSpy).toHaveBeenCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should Please enter the correct compilation type', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runBuild(path.resolve(__dirname, 'fixtures/default'))
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(logSpy).toHaveBeenCalledWith(chalk.red('请传入正确的编译类型！'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  describe('小程序', () => {
    it(`项目 output.clean = clean: { keep: ['project.config.json'] } ==> 清空dist文件夹但保留指定文件`, async () => {
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      const errorSpy = jest.spyOn(console, 'error')
      logSpy.mockImplementation(() => {})
      errorSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error()
      })

      try {
        await runBuild(APP_PATH, {
          options: {
            type: 'weapp',
            platform: 'weapp'
          }
        })
      } catch (error) {
        // no handler
      }
      expect(emptyDirectoryMocked).toHaveBeenCalledWith(OUTPUT_PATH, { excludes: ['project.config.json'] })

      exitSpy.mockRestore()
      logSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })

  describe('h5', () => {
    it('output.clean = false ==> 保留dist文件夹', async () => {
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      const errorSpy = jest.spyOn(console, 'error')
      logSpy.mockImplementation(() => {})
      errorSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error()
      })

      try {
        await runBuild(APP_PATH, {
          options: {
            type: 'h5',
            platform: 'h5'
          }
        })
      } catch (error) {
        // no handler
      }
      expect(emptyDirectoryMocked).not.toHaveBeenCalled()

      exitSpy.mockRestore()
      logSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })
})
