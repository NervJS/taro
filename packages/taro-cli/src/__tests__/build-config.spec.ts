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
const VUE3_APP_PATH = path.join(__dirname, 'fixtures/vue3-framework')

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

  describe('共享运行时 flag 校验', () => {
    it('--shared-runtime-mode 非 split ==> fail-fast 退出', async () => {
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error('exit')
      })

      let exited = false
      try {
        await runBuild(APP_PATH, {
          options: {
            type: 'weapp',
            platform: 'weapp',
            sharedRuntime: true,
            sharedRuntimeMode: 'host'
          }
        })
      } catch (error) {
        exited = true
      }
      expect(exited).toBe(true)
      expect(exitSpy).toBeCalledWith(1)

      exitSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('--shared-runtime-mode 未配 --shared-runtime ==> fail-fast 退出', async () => {
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error('exit')
      })

      let exited = false
      try {
        await runBuild(APP_PATH, {
          options: {
            type: 'weapp',
            platform: 'weapp',
            sharedRuntimeMode: 'split'
          }
        })
      } catch (error) {
        exited = true
      }
      expect(exited).toBe(true)
      expect(exitSpy).toBeCalledWith(1)

      exitSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('非小程序端 (h5) --shared-runtime ==> fail-fast 退出', async () => {
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error('exit')
      })

      let exited = false
      try {
        await runBuild(APP_PATH, {
          options: {
            type: 'h5',
            platform: 'h5',
            sharedRuntime: true
          }
        })
      } catch (error) {
        exited = true
      }
      expect(exited).toBe(true)
      expect(exitSpy).toBeCalledWith(1)
      // 精确断言是"平台白名单"守卫触发,而非其它 exit
      expect(logSpy.mock.calls.some(call => /仅支持小程序端/.test(String(call[0])))).toBe(true)

      exitSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('native-components 模式 --shared-runtime 不再被 fail-fast(允许放行)', async () => {
      // 早期曾拒此组合;native-components 共享运行时支持(引入 isNativeShared 分支)后允许放行。
      // 此测试断言:即使 build 因 fixture 配置不完整而失败,也不应看到 "native-components 模式不适用共享运行时" 错误消息。
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error('exit')
      })

      try {
        await runBuild(APP_PATH, {
          args: ['native-components'],
          options: {
            type: 'weapp',
            platform: 'weapp',
            sharedRuntime: true
          }
        })
      } catch (error) {
        // build 可能因 fixture 无 components 配置或其它编译问题失败,与本测试焦点无关
      }
      // 关键:早期的 native-components 守卫消息不应再出现
      expect(logSpy.mock.calls.some(call => /native-components 模式不适用共享运行时/.test(String(call[0])))).toBe(false)

      exitSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('--plugin --shared-runtime ==> fail-fast 退出', async () => {
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error('exit')
      })

      let exited = false
      try {
        await runBuild(APP_PATH, {
          options: {
            // 单元测试焦点：build fn 内的 --plugin 守卫。真实 CLI (cli.ts:161) 会把
            // platform 重写为 'plugin'，但 kernel 无 plugin platform handler,fn 不被调用——
            // 故测试里保留 platform:'weapp' 让 kernel 正常分发，args.plugin 触发守卫。
            type: 'weapp',
            platform: 'weapp',
            sharedRuntime: true,
            args: { plugin: 'weapp' } as any
          }
        })
      } catch (error) {
        exited = true
      }
      expect(exited).toBe(true)
      expect(exitSpy).toBeCalledWith(1)
      expect(logSpy.mock.calls.some(call => /小程序插件.*不适用共享运行时/.test(String(call[0])))).toBe(true)

      exitSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('framework 非 react (vue3) --shared-runtime ==> fail-fast 退出', async () => {
      // 共享运行时模板硬编码 framework-react;vue3/solid 会崩,故 framework 白名单只放行 react。
      const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
      const logSpy = jest.spyOn(console, 'log')
      logSpy.mockImplementation(() => {})
      exitSpy.mockImplementation(() => {
        throw new Error('exit')
      })

      let exited = false
      try {
        await runBuild(VUE3_APP_PATH, {
          options: {
            type: 'weapp',
            platform: 'weapp',
            sharedRuntime: true
          }
        })
      } catch (error) {
        exited = true
      }
      expect(exited).toBe(true)
      expect(exitSpy).toBeCalledWith(1)
      // 精确断言是"framework 白名单"守卫触发
      expect(logSpy.mock.calls.some(call => /仅支持 framework: 'react'/.test(String(call[0])))).toBe(true)

      exitSpy.mockRestore()
      logSpy.mockRestore()
    })

    // 注:independent(独立分包)拒绝的守卫放在 build fn 的 modifyAppConfig 回调里
    // (真实构建中 getAppConfig→getPages 之前触发,早于任何分包编译)。该回调由 MiniPlugin 在 webpack
    // 编译期调用,本单测 harness 不启动真实 webpack 编译(config 校验即失败),故无法在此覆盖——
    // independent 分包拒绝靠 Example 端 independent 分包声明手动验证 fail-fast。
  })
})
