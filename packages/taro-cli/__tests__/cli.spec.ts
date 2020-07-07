import CLI from '../src/cli'
import { Kernel } from '@tarojs/service'
import { getPkgVersion } from '../src/util'

jest.mock('@tarojs/service')
const MockedKernel = (Kernel as unknown) as (jest.Mock<Kernel>)
const APP_PATH = '/a/b/c'

function setProcessArgv (cmd: string) {
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

  describe('build', () => {
    const baseOpts = {
      platform: undefined,
      isWatch: false,
      release: undefined,
      port: undefined,
      ui: undefined,
      uiIndex: undefined,
      page: undefined,
      component: undefined,
      envHasBeenSet: false,
      plugin: undefined,
      isHelp: false
    }

    it('should make configs', () => {
      const platform = 'weapp'
      const page = 'src/index'
      const component = 'components/my'
      setProcessArgv('taro build --type weapp --watch --port 8080 --page src/index --component components/my --release')
      cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'build',
        opts: Object.assign({}, baseOpts, {
          platform,
          isWatch: true,
          port: 8080,
          page,
          component,
          release: true
        })
      })
      expect(process.env.NODE_ENV).toEqual('development')
      expect(process.env.TARO_ENV).toEqual(platform)
    })

    it('should not set node env again', () => {
      process.env.NODE_ENV = 'development'
      setProcessArgv('taro build --type weapp')
      cli.run()
      expect(process.env.NODE_ENV).toEqual('development')
    })

    it('should make plugin config', () => {
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

    it('should make ui config', () => {
      setProcessArgv('taro build --ui --uiIndex=index')
      cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'build',
        opts: Object.assign({}, baseOpts, {
          platform: 'ui',
          ui: true,
          uiIndex: 'index'
        })
      })
    })
  })

  describe('init', () => {
    const baseOpts = {
      appPath: APP_PATH,
      projectName: undefined,
      typescript: undefined,
      templateSource: undefined,
      clone: false,
      template: undefined,
      css: undefined,
      isHelp: false
    }

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
        opts: Object.assign({}, baseOpts, {
          projectName,
          typescript: true,
          templateSource,
          clone: true,
          template,
          css
        })
      })
    })

    it('should set project name', () => {
      const projectName = 'demo'
      setProcessArgv('taro init --name demo')
      cli.run()
      const ins = MockedKernel.mock.instances[0]
      expect(ins.run).toHaveBeenCalledWith({
        name: 'init',
        opts: Object.assign({}, baseOpts, { projectName })
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
          appPath: APP_PATH,
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
      expect(spy).toBeCalledTimes(16)

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
