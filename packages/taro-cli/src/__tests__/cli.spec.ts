import { Kernel } from '@tarojs/service'
import { getPkgVersion } from '../util'
import CLI from '../cli'

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
        platform: undefined,
        isWatch: false,
        env: undefined,
        blended: false
      },
      isHelp: false
    }

    it('should make configs', () => {
      const platform = 'weapp'
      setProcessArgv('taro build --type weapp --watch --port 8080')
      cli.run()
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

    it('should not set node env again', () => {
      process.env.NODE_ENV = 'development'
      setProcessArgv('taro build --type weapp')
      cli.run()
      expect(process.env.NODE_ENV).toEqual('development')
    })

    it.skip('should make plugin config', () => {
      setProcessArgv('taro build --plugin')
      cli.run()
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
    it('should make configs', () => {
      const projectName = 'temp'
      const templateSource = 'https://url'
      const template = 'mobx'
      const css = 'sass'
      setProcessArgv('taro init temp --typescript --template-source=https://url --clone --template mobx --css sass')
      cli.run()
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

    it('should set project name', () => {
      const projectName = 'demo'
      setProcessArgv('taro init --name demo')
      cli.run()
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
    it('should make configs', () => {
      setProcessArgv('taro convert')
      cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'convert',
        opts: {
          _: ['convert'],
          options: {},
          isHelp: false
        }
      })
    })
  })

  describe('customCommand', () => {
    it('should make configs', () => {
      const cmd = 'inspect'
      const _ = [cmd, 'entry']
      const type = 'weapp'
      setProcessArgv('taro inspect entry --type weapp -h --version')
      cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: cmd,
        opts: {
          _,
          options: {
            type
          },
          isHelp: true
        }
      })
    })
  })

  describe('others', () => {
    it('should log helps', () => {
      const spy = jest.spyOn(console, 'log')
      spy.mockImplementation(() => {})

      setProcessArgv('taro -h')
      cli.run()
      expect(spy).toBeCalledTimes(17)

      spy.mockRestore()
    })

    it('should log version', () => {
      const spy = jest.spyOn(console, 'log')
      spy.mockImplementation(() => {})

      setProcessArgv('taro -v')
      cli.run()
      expect(spy).toBeCalledWith(getPkgVersion())

      spy.mockRestore()
    })
  })
})
