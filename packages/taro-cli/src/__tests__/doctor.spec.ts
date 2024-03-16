import { chalk } from '@tarojs/helper'

import { run } from './utils'

jest.mock('../doctor', () => {
  return {
    __esModule: true,
    default: {
      validators: [() => ({
        isValid: true,
        messgaes: [{
          kind: 2,
          content: 'Env Success'
        }]
      }), () => Promise.resolve({
        isValid: false,
        messgaes: [{
          kind: 1,
          content: 'Config Error'
        }]
      }), () => ({
        isValid: true,
        messgaes: [{
          kind: 2,
          content: 'Package Success'
        }]
      }), () => ({
        isValid: true,
        messgaes: [{
          kind: 2,
          content: 'recommend Success'
        }]
      }), async () => ({
        isValid: true,
        messgaes: [{
          kind: 2,
          content: 'eslint Success'
        }]
      })]
    }
  }
})

jest.mock('ora', () => {
  const ora = jest.fn()
  ora.mockReturnValue({
    start () {
      return {
        succeed () {}
      }
    }
  })
  return ora
})

const runDoctor = run('doctor', [require.resolve('@tarojs/plugin-doctor')])

describe('doctor', () => {
  it('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    try {
      await runDoctor('', { options: { disableGlobalConfig: true } })
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })
})
