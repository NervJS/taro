import ReactPlugin from '@tarojs/plugin-framework-react'

import { TaroPlatformBase, TaroPlatformWeb } from '../../packages/taro-service/src'

import type { IPluginContext, TConfig } from '../../packages/taro-service/src/utils/types'

class TestWebPlatform extends TaroPlatformWeb {
  platform = 'h5'
  runtimePath = ''

  public loadRunner () {
    return this.getRunner()
  }
}

class TestMiniPlatform extends TaroPlatformBase {
  platform = 'weapp'
  runtimePath = ''
  globalObject = 'wx'
  fileType = {
    config: '.json',
    script: '.js',
    style: '.wxss',
    templ: '.wxml',
  }

  template = {} as TestMiniPlatform['template']

  public loadRunner () {
    return this.getRunner()
  }
}

type TestPlatform = typeof TestWebPlatform | typeof TestMiniPlatform

function createPlatform (compiler: TConfig['compiler'], Platform: TestPlatform) {
  const runner = jest.fn()
  const getNpmPkg = jest.fn().mockResolvedValue(runner)
  const ctx = {
    helper: {
      npm: {
        getNpmPkg,
      },
    },
    paths: {
      appPath: '/app',
    },
  } as unknown as IPluginContext
  const config = { compiler } as TConfig

  return {
    config,
    getNpmPkg,
    platform: new Platform(ctx, config),
    runner,
  }
}

describe.each([
  ['web', TestWebPlatform, './runner/h5'],
  ['mini', TestMiniPlatform, './runner/weapp'],
] as const)('%s runner', (_, Platform, customRunner) => {
  test.each([
    ['webpack5', '@tarojs/webpack5-runner'],
    ['vite', '@tarojs/vite-runner'],
  ] as const)('uses the default runner for %s', async (compiler, expectedRunner) => {
    const { getNpmPkg, platform } = createPlatform(compiler, Platform)

    await platform.loadRunner()

    expect(getNpmPkg).toHaveBeenCalledWith(expectedRunner, '/app')
  })

  test('uses a custom Node.js module identifier', async () => {
    const { getNpmPkg, platform, runner } = createPlatform({
      type: 'webpack5',
      runner: customRunner,
    }, Platform)

    const loadRunner = await platform.loadRunner()
    await loadRunner({ mode: 'production' })

    expect(getNpmPkg).toHaveBeenCalledWith(customRunner, '/app')
    expect(runner).toHaveBeenCalledWith('/app', { mode: 'production' })
  })

  test.each([
    '',
    '   ',
    ' custom-runner',
    'custom-runner ',
    null,
    1,
  ])('rejects invalid custom runner %#', async (runner) => {
    const { platform } = createPlatform({
      type: 'webpack5',
      runner,
    } as unknown as TConfig['compiler'], Platform)

    await expect(platform.loadRunner()).rejects.toThrow('compiler.runner 必须是非空且不包含首尾空白的字符串')
  })

  test('uses the runner preserved by modifyRunnerOpts', async () => {
    let modifyRunnerOpts
    ReactPlugin({
      initialConfig: {
        framework: 'react',
      },
      modifyRunnerOpts: callback => {
        modifyRunnerOpts = callback
      },
      modifyWebpackChain: jest.fn(),
    } as unknown as IPluginContext)

    const { config, getNpmPkg, platform } = createPlatform({
      type: 'webpack5',
      runner: '@tarojs/rspack-runner',
      prebundle: {
        enable: false,
      },
    }, Platform)

    modifyRunnerOpts({ opts: config })
    await platform.loadRunner()

    expect(config.compiler).toMatchObject({
      type: 'webpack5',
      runner: '@tarojs/rspack-runner',
      prebundle: {
        enable: false,
      },
    })
    expect(getNpmPkg).toHaveBeenCalledWith('@tarojs/rspack-runner', '/app')
  })
})
