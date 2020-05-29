import * as npmCheck from 'npm-check'
import validator from '../src/doctor/packageValidator'

jest.mock('npm-check', () => jest.fn())

jest.mock('../src/util', () => {
  return {
    __esModule: true,
    getPkgVersion: jest.fn().mockReturnValue('3.0.0-rc.1')
  }
})

const cliVersion = '3.0.0-rc.1'

const baseModules = [
  {
    moduleName: '@tarojs/components',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  },
  {
    moduleName: '@tarojs/runtime',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  },
  {
    moduleName: '@tarojs/taro',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  },
  {
    moduleName: '@tarojs/mini-runner',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  },
  {
    moduleName: '@tarojs/webpack-runner',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  },
  {
    moduleName: 'babel-preset-taro',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  },
  {
    moduleName: 'eslint-config-taro',
    latest: cliVersion,
    installed: cliVersion,
    isInstalled: true
  }
]

describe('package validator of doctor', () => {
  const npmCheckMocked = npmCheck as jest.Mock<any>
  const getMocked = jest.fn()

  beforeAll(() => {
    npmCheckMocked.mockImplementation(() => {
      return Promise.resolve({
        get: getMocked
      })
    })
  })

  beforeEach(() => {
    getMocked.mockClear()
  })

  it('should report uninstalled modules', async () => {
    const moduleA = 'redux'
    const moduleB = 'react-native'
    getMocked.mockReturnValue([
      ...baseModules,
      {
        moduleName: moduleA,
        isInstalled: false
      },
      {
        moduleName: 'some-module',
        isInstalled: true
      },
      {
        moduleName: moduleB,
        isInstalled: false
      }
    ])
    const { lines } = await validator({ appPath: '' })

    expect(lines.length).toBe(2)
    expect(lines[0].desc).toBe(`使用到的依赖 ${moduleA} 还没有安装`)
    expect(lines[0].valid).toBe(false)
    expect(lines[1].desc).toBe(`使用到的依赖 ${moduleB} 还没有安装`)
    expect(lines[1].valid).toBe(false)
  })

  it('should report uninstalled modules', async () => {
    const latestTaro = '3.0.0-rc.3'
    const uninstalledTaroPkg = '@tarojs/components'
    const couldUpdateTaroPkg = '@tarojs/runtime'
    const inconsistentTaroPkg = '@tarojs/taro'

    getMocked.mockReturnValue([
      {
        moduleName: couldUpdateTaroPkg,
        latest: latestTaro,
        installed: cliVersion,
        isInstalled: true
      },
      {
        moduleName: inconsistentTaroPkg,
        latest: latestTaro,
        installed: latestTaro,
        isInstalled: true
      },
      ...baseModules.slice(3)
    ])

    const { lines } = await validator({ appPath: '' })

    expect(lines.length).toBe(3)

    expect(lines[0].desc).toBe(`请安装 Taro 依赖: ${uninstalledTaroPkg}`)
    expect(lines[0].valid).toBe(true)

    expect(lines[1].desc).toBe(`依赖 ${couldUpdateTaroPkg} 可更新到最新版本 ${latestTaro}，当前安装版本为 ${cliVersion}`)
    expect(lines[1].valid).toBe(true)

    expect(lines[2].desc).toBe(`依赖 ${inconsistentTaroPkg} (${latestTaro}) 与当前使用的 Taro CLI (${cliVersion}) 版本不一致, 请更新为统一的版本`)
    expect(lines[2].valid).toBe(false)
  })

  it('should report outdate taro modules', async () => {
    const moduleA = '@tarojs/components-rn'
    const moduleB = '@tarojs/components-qa'
    getMocked.mockReturnValue([
      ...baseModules,
      {
        moduleName: moduleA,
        isInstalled: true
      },
      {
        moduleName: moduleB,
        isInstalled: false
      }
    ])

    const { lines } = await validator({ appPath: '' })

    expect(lines.length).toBe(3)

    expect(lines[0].desc).toBe(`使用到的依赖 ${moduleB} 还没有安装`)
    expect(lines[0].valid).toBe(false)

    expect(lines[1].desc).toBe(`Taro 3 不再依赖 ${moduleA}，可以卸载`)
    expect(lines[1].valid).toBe(true)

    expect(lines[2].desc).toBe(`Taro 3 不再依赖 ${moduleB}，可以从 package.json 移除`)
    expect(lines[2].valid).toBe(true)
  })
})
