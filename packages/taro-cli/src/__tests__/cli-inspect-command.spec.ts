import { Kernel } from '@tarojs/service'

import CLI from '../cli'

jest.mock('@tarojs/helper', () => ({
  __esModule: true,
  ...jest.requireActual('@tarojs/helper'),
}))
jest.mock('@tarojs/service')
const MockedKernel = (Kernel as unknown) as jest.MockedClass<typeof Kernel>

function setProcessArgv(cmd: string) {
  // @ts-ignore
  process.argv = [null, ...cmd.split(' ')]
}

// Common expectation setup
const expectCommonInvocation = (options?: Record<string, any>, name?: string) => {
  const ins = MockedKernel.mock.instances[0]
  expect(ins.run).toHaveBeenCalledWith({
    name: 'inspect',
    opts: {
      _: ['inspect', ...(name ? [name] : [])],
      options: {
        build: true,
        check: true,
        'inject-global-style': true,
        type: 'weapp',
        ...options
      },
      isHelp: false,
    },
  })
}

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

  it.each([
    ['weapp'],
    ['swan'],
    ['alipay'],
    ['tt'],
    ['h5'],
    ['quickapp'],
    ['rn'],
    ['qq'],
    ['jd'],
  ])('should inspect the project for %s platform', async (item) => {
    setProcessArgv(`taro inspect --type ${item}`)
    await cli.run()
    expectCommonInvocation({ type: item })
  })

  it.each([
    {
      cmd: 'taro inspect --type weapp',
      options: {}
    },
    {
      cmd: 'taro inspect --type weapp --output inspect.config.js',
      options: { output: 'inspect.config.js' }
    },
    {
      cmd: 'taro inspect --type weapp plugins',
      options: {},
      name: 'plugins'
    },
    {
      cmd: 'taro inspect --type weapp module.rules.0',
      options: {},
      name: 'module.rules.0'
    }
  ])('should inspect the project for $cmd', async ({ cmd, options, name = undefined }) => {
    setProcessArgv(`${cmd}`)
    await cli.run()
    expectCommonInvocation(options, name)
  })
})
