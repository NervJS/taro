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
const expectCommonInvocation = (name: string) => {
  const ins = MockedKernel.mock.instances[0]
  expect(ins.run).toHaveBeenCalledWith({
    name: 'update',
    opts: {
      _: ['update', name],
      options: {
        build: true,
        check: true,
        'inject-global-style': true,
        type: undefined,
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

  it('updates the Taro CLI to the latest version', async () => {
    setProcessArgv(`taro update self`)
    await cli.run()
    expectCommonInvocation('self')
  })

  it('updates the project dependencies to the latest version', async () => {
    setProcessArgv(`taro update project`)
    await cli.run()
    expectCommonInvocation('project')
  })
})
