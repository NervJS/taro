import { Kernel } from '@tarojs/service'

import CLI from '../cli'

jest.mock('@tarojs/service')
const MockedKernel = (Kernel as unknown) as jest.MockedClass<typeof Kernel>
const APP_PATH = '/a/b/c'
const projectName = 'test'

function setProcessArgv(cmd: string) {
  // @ts-ignore
  process.argv = [null, ...cmd.split(' ')]
}

function expectKernelRunCalledWith(options, name?: string) {
  const ins = MockedKernel.mock.instances[0]
  expect(ins.run).toHaveBeenCalledWith({
    name: 'init',
    opts: {
      _: ['init', ...(name ? [name] : [])],
      options: {
        appPath: APP_PATH,
        projectName: undefined,
        description: undefined,
        framework: undefined,
        typescript: undefined,
        npm: undefined,
        templateSource: undefined,
        clone: false,
        compiler: undefined,
        template: undefined,
        css: undefined,
        autoInstall: undefined,
        ...options
      },
      isHelp: false
    }
  })
}

describe('CLI init', () => {
  let cli: CLI

  beforeAll(() => {
    cli = new CLI(APP_PATH)
  })

  beforeEach(() => {
    MockedKernel.mockClear()
    process.argv = []
  })

  afterEach(() => {
    MockedKernel.mockClear()
    process.argv = []
  })

  it('should set init', async () => {
    setProcessArgv(`taro init ${projectName}`)
    await cli.run()
    expectKernelRunCalledWith({ projectName }, projectName)
  })

  it.each([
    ['name', `--name ${projectName}`, { projectName }],
    ['description', `--description test`, { description: 'test' }],
    ['typescript', `--typescript`, { typescript: true }],
    ['npm', `--npm npm`, { npm: 'npm' }],
    ['template-source', `--template-source default`, { templateSource: 'default' }],
    ['clone', `--clone`, { clone: true }],
    ['template', `--template default`, { template: 'default' }],
    ['css', `--css sass`, { css: 'sass' }],
    ['autoInstall', `--autoInstall`, { autoInstall: true }],
    ['compiler', `--compiler vite`, { compiler: 'vite' }],
    ['framework', `--framework react`, { framework: 'react' }]
  ])('should set %s', async (_, cmd, options) => {
    setProcessArgv(`taro init ${cmd}`)
    await cli.run()
    expectKernelRunCalledWith(options)
  })

  it('should set multiple options', async () => {
    const options = {
      projectName,
      templateSource: 'default',
      template: 'redux',
      description: 'test',
      typescript: true,
      npm: 'pnpm',
      clone: true,
      css: 'sass',
      autoInstall: true,
      compiler: 'vite',
      framework: 'react'
    }
    setProcessArgv(
      `taro init --name test --description test --typescript --npm pnpm --template-source default --clone --template redux --css sass --autoInstall --compiler vite --framework react`
    )
    await cli.run()
    expectKernelRunCalledWith(options)
  })
})
