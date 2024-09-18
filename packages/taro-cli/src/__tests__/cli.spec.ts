import { Kernel } from '@tarojs/service'

import CLI from '../cli'
import { getPkgVersion } from '../util'

jest.mock('@tarojs/service')
const MockedKernel = (Kernel as unknown) as (jest.Mock<Kernel>)
const APP_PATH = '/a/b/c'

function setProcessArgv (cmd: string) {
  // @ts-ignore
  process.argv = [null, ...cmd.split(' ')]
}

describe('inspect', () => {
  let cli: CLI

  beforeAll(() => {
    cli = new CLI(APP_PATH)
  })

  beforeEach(() => {
    MockedKernel.mockClear()
    process.argv = []
    delete process.env.NODE_ENV
    delete process.env.TARO_ENV
  })

  afterEach(() => {
    MockedKernel.mockClear()
    process.argv = []
    delete process.env.NODE_ENV
    delete process.env.TARO_ENV
  })

  describe('build', () => {
    const baseOpts = {
      _: [
        'build'
      ],
      options: {
        args: expect.any(Object),
        platform: undefined,
        publicPath: undefined,
        isWatch: false,
        withoutBuild: false,
        env: undefined,
        blended: false,
        assetsDest: undefined,
        bundleOutput: undefined,
        plugin: undefined,
        isBuildNativeComp: false,
        newBlended: false,
        noInjectGlobalStyle: false,
        noCheck: false,
        sourceMapUrl: undefined,
        sourcemapOutput: undefined,
        sourcemapSourcesRoot: undefined,
      },
      isHelp: false
    }

    it('should make configs', async () => {
      const platform = 'weapp'
      setProcessArgv('taro build --type weapp --watch --port 8080')
      await cli.run()
      const ins = MockedKernel.mock.instances[0]

      const opts = Object.assign({}, baseOpts)
      opts.options = Object.assign({}, baseOpts.options, {
        platform,
        isWatch: true,
        port: 8080,
        deviceType: undefined,
        resetCache: false,
        qr: false
      })

      expect(ins.run).toHaveBeenCalledWith({
        name: 'build',
        opts
      })
    })

    it('should not set node env again', async () => {
      process.env.NODE_ENV = 'development'
      setProcessArgv('taro build --type weapp')
      await cli.run()
      expect(process.env.NODE_ENV).toEqual('development')
    })

    it.skip('should make plugin config', async () => {
      setProcessArgv('taro build --plugin')
      await cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'build',
        opts: Object.assign({}, baseOpts, {
          platform: 'plugin',
          plugin: 'weapp'
        })
      })
      expect(process.env.NODE_ENV).toEqual('production')
      expect(process.env.TARO_ENV).toEqual('plugin')
    })
  })

  describe('init', () => {
    it('should make configs', async () => {
      const projectName = 'temp'
      const templateSource = 'https://url'
      const template = 'mobx'
      const css = 'sass'
      setProcessArgv('taro init temp --typescript --template-source=https://url --clone --template mobx --css sass')
      await cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'init',
        opts: {
          _: [
            'init',
            'temp'
          ],
          options: {
            appPath: APP_PATH,
            projectName,
            typescript: true,
            templateSource,
            description: undefined,
            clone: true,
            template,
            css
          },
          isHelp: false
        }
      })
    })

    it('should set project name', async () => {
      const projectName = 'demo'
      setProcessArgv('taro init --name demo')
      await cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'init',
        opts: {
          _: [
            'init'
          ],
          options: {
            appPath: APP_PATH,
            projectName,
            typescript: undefined,
            templateSource: undefined,
            description: undefined,
            clone: false,
            template: undefined,
            css: undefined
          },
          isHelp: false
        }
      })
    })
  })

  describe('convert', () => {
    it('should make configs', async () => {
      setProcessArgv('taro convert')
      await cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'convert',
        opts: {
          _: ['convert'],
          options: {
            build: true,
            check: true,
            'inject-global-style': true,
          },
          isHelp: false
        }
      })
    })
  })

  describe('customCommand', () => {
    it('should make configs', async () => {
      const cmd = 'inspect'
      const _ = [cmd, 'entry']
      const type = 'weapp'
      setProcessArgv('taro inspect entry --type weapp -h --version')
      await cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: cmd,
        opts: {
          _,
          options: {
            build: true,
            check: true,
            'inject-global-style': true,
            type
          },
          isHelp: true
        }
      })
    })
  })

  describe('others', () => {
    it('should log helps', async () => {
      const spy = jest.spyOn(console, 'log')
      spy.mockImplementation(() => {})

      setProcessArgv('taro -h')
      await cli.run()
      expect(spy).toBeCalledTimes(16)

      spy.mockRestore()
    })

    it('should log version', async () => {
      const spy = jest.spyOn(console, 'log')
      spy.mockImplementation(() => {})

      setProcessArgv('taro -v')
      await cli.run()
      expect(spy).toBeCalledWith(getPkgVersion())

      spy.mockRestore()
    })
  })
})
