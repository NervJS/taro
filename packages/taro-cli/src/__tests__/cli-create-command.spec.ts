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
    name: 'create',
    opts: {
      _: ['create', ...(name ? [name] : [])],
      options: {
        build: true,
        check: true,
        'inject-global-style': true,
        type: undefined,
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

  it('creates a default project', async () => {
    setProcessArgv(`taro create page`)
    await cli.run()
    expectCommonInvocation({}, 'page')
  })

  it.each([
    {
      cmd: '--name page',
      options: { name: 'page' }
    },
    {
      cmd: '--name page --description=desc',
      options: { name: 'page', description: 'desc' }
    },
    {
      cmd: '--name page --type=plugin-command',
      options: { name: 'page', type: 'plugin-command' }
    },
    {
      cmd: '--name page --dir src',
      options: { name: 'page', dir: 'src' }
    },
    {
      cmd: '--name page --subpkg src',
      options: { name: 'page', subpkg: 'src' }
    },
  ])('creates a project with options: $cmd', async ({ cmd, options }) => {
    setProcessArgv(`taro create ${cmd}`)

    await cli.run()
    expectCommonInvocation(options)
  })
})
