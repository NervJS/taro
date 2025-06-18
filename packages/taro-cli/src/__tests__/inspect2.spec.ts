import { resolve } from 'node:path'

import { run } from './utils'

const appPath = resolve(__dirname, 'fixtures/default')

jest.mock('cli-highlight', () => {
  return {
    __esModule: true,
    default (str) {
      return str
    }
  }
})

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  const fs = helper.fs
  return {
    __esModule: true,
    ...helper,
    fs: {
      ...fs,
      writeFileSync: jest.fn()
    }
  }
})

const runInspect = run('inspect', [
  'commands/build',
  'commands/inspect',
  require.resolve('@tarojs/plugin-platform-weapp')
])

describe('inspect', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('正例：打印特定日志', async () => {
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'info')
    const errorSpy = jest.spyOn(console, 'error')

    exitSpy.mockImplementation(() => {
      throw new Error('EXIT')
    })
    logSpy.mockImplementation(() => {})
    errorSpy.mockImplementation(() => {})

    try {
      await runInspect(appPath, {
        options: {
          type: 'h5'
        },
        args: ['resolve.mainFields.0']
      })
    } catch (error) {
      if (!(error instanceof Error && error.message === 'EXIT')) {
        throw error
      }
    }

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('\'main:h5\'')

    exitSpy.mockRestore()
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })
})
