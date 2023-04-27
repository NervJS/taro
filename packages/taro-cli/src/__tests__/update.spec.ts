import {
  chalk,
  fs,
  PROJECT_CONFIG,
  shouldUseCnpm,
  shouldUseYarn
} from '@tarojs/helper'
import { exec } from 'child_process'
import * as path from 'path'

import { getPkgVersion } from '../util'
import { run } from './utils'

const runUpdate = run('update', ['commands/update'])
const lastestVersion = getPkgVersion()

jest.mock('child_process', () => {
  const exec = jest.fn()
  exec.mockReturnValue({
    stdout: {
      on () {}
    },
    stderr: {
      on () {}
    }
  })
  return {
    __esModule: true,
    exec
  }
})

jest.mock('ora', () => {
  const ora = jest.fn()
  ora.mockReturnValue({
    start () {
      return {
        stop () {},
        warn () {},
        succeed (){}
      }
    }
  })
  return ora
})

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  const fs = helper.fs
  return {
    __esModule: true,
    ...helper,
    shouldUseCnpm: jest.fn(),
    shouldUseYarn: jest.fn(),
    chalk: {
      red: jest.fn(),
      green () {}
    },
    fs: {
      ...fs,
      writeJson: jest.fn()
    }
  }
})

jest.mock('latest-version', () => () => lastestVersion)

function updatePkg (pkgPath: string, version: string) {
  let packageMap = require(pkgPath)
  packageMap = {
    ...packageMap,
    dependencies: {
      ...packageMap.dependencies,
      '@tarojs/shared': version,
      '@tarojs/taro': version,
      '@tarojs/cli': version,
      '@tarojs/components': version,
      '@tarojs/api': version,
      '@tarojs/taro-h5': version,
      '@tarojs/helper': version,
      '@tarojs/taro-loader': version,
      '@tarojs/mini-runner': version,
      '@tarojs/react': version,
      '@tarojs/router': version,
      '@tarojs/runner-utils': version,
      '@tarojs/runtime': version,
      '@tarojs/service': version,
      '@tarojs/webpack-runner': version,
      '@tarojs/with-weapp': version,
      '@tarojs/taroize': version,
      '@tarojs/plugin-platform-weapp': version,
      '@tarojs/plugin-platform-alipay': version,
      '@tarojs/plugin-platform-swan': version,
      '@tarojs/plugin-platform-tt': version,
      '@tarojs/plugin-platform-jd': version,
      '@tarojs/plugin-platform-qq': version,
      '@tarojs/plugin-platform-h5': version
    },
    devDependencies: {
      ...packageMap.devDependencies,
      'babel-preset-taro': version,
      'eslint-config-taro': version,
      'babel-plugin-transform-taroapi': version,
      'postcss-plugin-constparse': version,
      'postcss-pxtransform': version
    }
  }
  return packageMap
}

describe('update', () => {
  const execMocked = (exec as unknown) as jest.Mock<any>
  const shouldUseCnpmMocked = shouldUseCnpm as jest.Mock<any>
  const shouldUseYarnMocked = shouldUseYarn as jest.Mock<any>
  const writeJson = fs.writeJson as jest.Mock<any>

  beforeEach(() => {
    shouldUseCnpmMocked.mockReturnValue(false)
    shouldUseYarnMocked.mockReturnValue(false)
  })

  afterEach(() => {
    execMocked.mockClear()
    shouldUseCnpmMocked.mockReset()
    shouldUseYarnMocked.mockReset()
    writeJson.mockClear()
  })

  it('should log errors', async () => {
    const spy = jest.spyOn(console, 'log')
    spy.mockImplementation(() => {})
    await runUpdate('', {
      options: {
        npm: 'npm',
        disableGlobalConfig: true
      }
    })
    expect(spy).toBeCalledTimes(3)
    spy.mockRestore()
  })

  it('should update self', async () => {
    await runUpdate('', {
      args: ['self'],
      options: {
        npm: 'npm',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith(`npm i -g @tarojs/cli@${lastestVersion}`)
  })

  it('should update self using yarn', async () => {
    shouldUseCnpmMocked.mockReturnValue(true)
    await runUpdate('', {
      args: ['self'],
      options: {
        npm: 'yarn',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith(`yarn global add @tarojs/cli@${lastestVersion}`)
  })

  it('should update self using pnpm', async () => {
    shouldUseCnpmMocked.mockReturnValue(true)
    await runUpdate('', {
      args: ['self'],
      options: {
        npm: 'pnpm',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith(`pnpm add -g @tarojs/cli@${lastestVersion}`)
  })

  it('should update self using cnpm', async () => {
    shouldUseCnpmMocked.mockReturnValue(true)
    await runUpdate('', {
      args: ['self'],
      options: {
        npm: 'cnpm',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith(`cnpm i -g @tarojs/cli@${lastestVersion}`)
  })

  it('should update self to specific version', async () => {
    const version = '3.0.0-beta.0'
    await runUpdate('', {
      args: ['self', version],
      options: {
        npm: 'npm',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith(`npm i -g @tarojs/cli@${version}`)
  })

  it('should throw when there isn\'t a Taro project', async () => {
    const chalkMocked = (chalk.red as unknown) as jest.Mock<any>
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'log')
    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    try {
      await runUpdate('', {
        args: ['project'],
        options: {
          npm: 'npm',
          disableGlobalConfig: true
        }
      })
    } catch (error) {} // eslint-disable-line no-empty
    expect(exitSpy).toBeCalledWith(1)
    expect(chalkMocked).toBeCalledWith(`找不到项目配置文件 ${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`)
    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should update project', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')
    const pkgPath = path.join(appPath, 'package.json')
    const packageMap = updatePkg(pkgPath, lastestVersion)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runUpdate(appPath, {
      args: ['project'],
      options: {
        npm: 'npm',
        disableGlobalConfig: true
      }
    })
    expect(writeJson.mock.calls[0][0]).toEqual(pkgPath)
    expect(writeJson.mock.calls[0][1]).toEqual(packageMap)
    expect(execMocked).toBeCalledWith('npm install')

    logSpy.mockRestore()
  })

  it('should update project to specific version', async () => {
    const version = '3.0.0-beta.4'
    const appPath = path.resolve(__dirname, 'fixtures/default')
    const pkgPath = path.join(appPath, 'package.json')
    const packageMap = updatePkg(pkgPath, version)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runUpdate(appPath, {
      args: ['project', version],
      options: {
        npm: 'npm',
        disableGlobalConfig: true
      }
    })
    expect(writeJson.mock.calls[0][0]).toEqual(pkgPath)
    expect(writeJson.mock.calls[0][1]).toEqual(packageMap)
    expect(execMocked).toBeCalledWith('npm install')

    logSpy.mockRestore()
  })

  it('should update project with yarn', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    shouldUseYarnMocked.mockReturnValue(true)

    await runUpdate(appPath, {
      args: ['project'],
      options: {
        npm: 'yarn',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith('yarn install')

    logSpy.mockRestore()
  })

  it('should update project with pnpm', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    shouldUseCnpmMocked.mockReturnValue(true)

    await runUpdate(appPath, {
      args: ['project'],
      options: {
        npm: 'pnpm',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith('pnpm install')

    logSpy.mockRestore()
  })

  it('should update project with cnpm', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    shouldUseCnpmMocked.mockReturnValue(true)

    await runUpdate(appPath, {
      args: ['project'],
      options: {
        npm: 'cnpm',
        disableGlobalConfig: true
      }
    })
    expect(execMocked).toBeCalledWith('cnpm install')

    logSpy.mockRestore()
  })
})
