import { Kernel } from '@tarojs/service'

import CLI from '../cli'

jest.mock('@tarojs/helper', () => ({
  __esModule: true,
  ...jest.requireActual('@tarojs/helper'),
}))
jest.mock('@tarojs/service')
const MockedKernel = (Kernel as unknown) as jest.MockedClass<typeof Kernel>

function setProcessArgv (cmd: string) {
  // @ts-ignore
  process.argv = [null, ...cmd.split(' ')]
}

// Common expectation setup
const expectCommonInvocation = (options: Record<string, any>, additionalArgs: Record<string, any>, name?: string) => {
  const ins = MockedKernel.mock.instances[0]
  expect(ins.run).toHaveBeenCalledWith({
    name: 'build',
    opts: {
      _: ['build', ...(name ? [name] : [])],
      options: {
        args: {
          _: ['build', ...(name ? [name] : [])],
          build: true,
          check: true,
          h: false,
          help: false,
          v: false,
          version: false,
          type: 'weapp',
          'disable-global-config': false,
          'inject-global-style': true,
          ...additionalArgs
        },
        assetsDest: undefined,
        blended: false,
        bundleOutput: undefined,
        deviceType: undefined,
        env: undefined,
        isBuildNativeComp: false,
        isWatch: false,
        newBlended: false,
        noCheck: false,
        noInjectGlobalStyle: false,
        platform: 'weapp',
        plugin: undefined,
        port: undefined,
        publicPath: undefined,
        qr: false,
        resetCache: false,
        sourceMapUrl: undefined,
        sourcemapOutput: undefined,
        sourcemapSourcesRoot: undefined,
        withoutBuild: false,
        ...options
      },
      isHelp: false,
    },
  })
}

const taroBuildScenarios = [
  {
    cmd: 'taro build --type weapp',
    options: {},
    additionalArgs: {}
  },
  {
    cmd: 'taro build --type weapp --watch',
    options: { isWatch: true },
    additionalArgs: { watch: true },
  },
  {
    cmd: 'taro build --type weapp --env production',
    options: { env: 'production' },
    additionalArgs: { env: 'production' }
  },
  {
    cmd: 'taro build --type weapp --blended',
    options: { blended: true },
    additionalArgs: { blended: true }
  },
  {
    cmd: 'taro build --type weapp --no-build',
    options: { withoutBuild: true },
    additionalArgs: { build: false }
  },
  {
    cmd: 'taro build --type weapp --new-blended',
    options: { newBlended: true },
    additionalArgs: { 'new-blended': true }
  },
  {
    cmd: 'taro build --type weapp -p 80',
    options: { port: 80 },
    additionalArgs: { port: 80, p: 80 }
  },
  {
    cmd: 'taro build --type weapp --no-check',
    options: { noCheck: true },
    additionalArgs: { check: false }
  },
  {
    cmd: 'taro build --type weapp --mode prepare --env-prefix TARO_APP_',
    options: {},
    additionalArgs: { mode: 'prepare', envPrefix: 'TARO_APP_', 'env-prefix': 'TARO_APP_' },
  },
  {
    cmd: 'taro build --plugin weapp',
    options: { platform: 'plugin', plugin: 'weapp' },
    additionalArgs: { type: undefined, plugin: 'weapp' },
  },
  {
    cmd: 'taro build --plugin weapp --watch',
    options: { platform: 'plugin', plugin: 'weapp', isWatch: true },
    additionalArgs: { type: undefined, plugin: 'weapp', watch: true },
  },
  {
    cmd: 'taro build native-components --type weapp',
    options: { isBuildNativeComp: true },
    additionalArgs: {},
    _name: 'native-components'
  },
  {
    cmd: 'taro build --type rn --platform ios',
    options: { platform: 'rn', deviceType: 'ios' },
    additionalArgs: { type: 'rn', platform: 'ios' },
  },
  {
    cmd: 'taro build --type rn --reset-cache',
    options: { platform: 'rn', resetCache: true },
    additionalArgs: { type: 'rn', 'reset-cache': true, resetCache: true },
  },
  {
    cmd: 'taro build --type rn --public-path',
    options: { platform: 'rn', publicPath: true },
    additionalArgs: { type: 'rn', 'public-path': true, publicPath: true },
  },
  {
    cmd: 'taro build --type rn --bundle-output',
    options: { platform: 'rn', bundleOutput: true },
    additionalArgs: { type: 'rn', 'bundle-output': true, bundleOutput: true },
  },
  {
    cmd: 'taro build --type rn --sourcemap-output',
    options: { platform: 'rn', sourcemapOutput: true },
    additionalArgs: { type: 'rn', 'sourcemap-output': true, sourcemapOutput: true },
  },
  {
    cmd: 'taro build --type rn --sourcemap-use-absolute-path',
    options: { platform: 'rn', sourceMapUrl: true },
    additionalArgs: { type: 'rn', 'sourcemap-use-absolute-path': true, sourceMapUrl: true },
  },
  {
    cmd: 'taro build --type rn --sourcemap-sources-root',
    options: { platform: 'rn', sourcemapSourcesRoot: true },
    additionalArgs: { type: 'rn', 'sourcemap-sources-root': true, sourcemapSourcesRoot: true },
  },
  {
    cmd: 'taro build --type rn --assets-dest',
    options: { platform: 'rn', assetsDest: true },
    additionalArgs: { type: 'rn', 'assets-dest': true, assetsDest: true },
  },
  {
    cmd: 'taro build --type rn --qr',
    options: { platform: 'rn', qr: true },
    additionalArgs: { type: 'rn', qr: true },
  },
  {
    cmd: 'taro build --type h5 --no-inject-global-style',
    options: { platform: 'h5', noInjectGlobalStyle: true },
    additionalArgs: { type: 'h5', 'inject-global-style': false },
  }
]

describe('create command', () => {
  let cli
  const appPath = '/'

  beforeAll(() => {
    cli = new CLI(appPath)
  })

  beforeEach(() => {
    MockedKernel.mockClear()
    process.argv = []
  })

  afterEach(() => {
    MockedKernel.mockClear()
    process.argv = []
  })


  it.each(taroBuildScenarios)(`should build the project for $cmd scenario`, async ({ cmd, options, additionalArgs, _name = undefined }) => {
    setProcessArgv(cmd)
    await cli.run()
    expectCommonInvocation(options, additionalArgs, _name)
  })
})
