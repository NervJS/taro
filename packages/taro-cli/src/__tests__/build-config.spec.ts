import * as path from 'node:path'

import { emptyDirectory } from '@tarojs/helper'

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
      expect(emptyDirectoryMocked).toBeCalledWith(OUTPUT_PATH, { excludes: ['project.config.json'] })

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
      expect(emptyDirectoryMocked).toBeCalledTimes(0)

      exitSpy.mockRestore()
      logSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })
})
