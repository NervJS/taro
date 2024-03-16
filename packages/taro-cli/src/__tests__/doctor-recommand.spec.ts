import { chalk, fs } from '@tarojs/helper'
import * as path from 'path'

import doctor from '../doctor'

const validator = doctor.validators[3]

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  const fs = helper.fs
  return {
    __esModule: true,
    ...helper,
    fs: {
      ...fs,
      readdirSync: jest.fn(),
      existsSync: jest.fn()
    }
  }
})

describe('recommand validator of doctor', () => {
  const existsSyncMocked = fs.existsSync as jest.Mock<any>
  const readdirSyncMocked = fs.readdirSync as jest.Mock<any>

  beforeEach(() => {
    jest.resetModules()
    existsSyncMocked.mockReset()
    readdirSyncMocked.mockReset()
    existsSyncMocked.mockReturnValue(true)
  })

  it.skip('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    existsSyncMocked.mockReturnValue(false)

    validator({ appPath: 'src/' })

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到src/package.json，请确定当前目录是Taro项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it.skip('should warn when test framework not found', async () => {
    jest.doMock('./fixtures/default/package.json', () => ({
      devDependencies: {
        eslint: 1
      }
    }))
    readdirSyncMocked.mockReturnValue(['readme', '.gitignore', '.editorconfig'])

    const { lines } = await validator({ appPath: path.join(__dirname, './fixtures/default') })

    expect(lines.length).toBe(1)
    expect(lines[0].desc).toBe('没有检查到常见的测试依赖(jest/mocha/ava/tape/jesmine/karma), 配置测试可以帮助提升项目质量')
    expect(lines[0].valid).toBe(true)
    expect(lines[0].solution).toBe('可以参考 https://github.com/NervJS/taro-ui-sample 项目, 其中已经包含了完整的测试配置与范例')

    jest.dontMock('./fixtures/default/package.json')
  })

  it.skip('should warn when linters not found', async () => {
    jest.doMock('./fixtures/default/package.json', () => ({
      devDependencies: {
        jest: 1
      }
    }))
    readdirSyncMocked.mockReturnValue(['readme.md', '.gitignore', '.editorconfig'])

    const { lines } = await validator({ appPath: path.join(__dirname, './fixtures/default') })

    expect(lines.length).toBe(1)
    expect(lines[0].desc).toBe('没有检查到常见的 linter (eslint/jslint/jshint/tslint), 配置 linter 可以帮助提升项目质量')
    expect(lines[0].valid).toBe(true)
    expect(lines[0].solution).toBe('Taro 还提供了定制的 ESLint 规则, 可以帮助开发者避免一些常见的问题. 使用 taro cli 创建新项目即可体验')

    jest.dontMock('./fixtures/default/package.json')
  })

  it.skip('should warn when Readme not found', async () => {
    jest.doMock('./fixtures/default/package.json', () => ({
      devDependencies: {
        mocha: 1,
        jslint: 1
      }
    }))
    readdirSyncMocked.mockReturnValue(['.gitignore', '.editorconfig'])

    const { lines } = await validator({ appPath: path.join(__dirname, './fixtures/default') })

    expect(lines.length).toBe(1)
    expect(lines[0].desc).toBe('没有检查到 Readme (readme/readme.md/readme.markdown), 编写 Readme 可以方便其他人了解项目')
    expect(lines[0].valid).toBe(true)

    jest.dontMock('./fixtures/default/package.json')
  })

  it.skip('should warn when .gitignore not found', async () => {
    jest.doMock('./fixtures/default/package.json', () => ({
      devDependencies: {
        jesmine: 1,
        tslint: 1
      }
    }))
    readdirSyncMocked.mockReturnValue(['readme.markdown', '.editorconfig'])

    const { lines } = await validator({ appPath: path.join(__dirname, './fixtures/default') })

    expect(lines.length).toBe(1)
    expect(lines[0].desc).toBe('没有检查到 .gitignore 配置, 配置 .gitignore 以避免将敏感信息或不必要的内容提交到代码仓库')
    expect(lines[0].valid).toBe(true)

    jest.dontMock('./fixtures/default/package.json')
  })

  it.skip('should warn when .editorconfig not found', async () => {
    jest.doMock('./fixtures/default/package.json', () => ({
      devDependencies: {
        karma: 1,
        jshint: 1
      }
    }))
    readdirSyncMocked.mockReturnValue(['readme', '.gitignore'])

    const { lines } = await validator({ appPath: path.join(__dirname, './fixtures/default') })

    expect(lines.length).toBe(1)
    expect(lines[0].desc).toBe('没有检查到 .editconfig 配置, 配置 editconfig 以统一项目成员编辑器的代码风格')
    expect(lines[0].valid).toBe(true)

    jest.dontMock('./fixtures/default/package.json')
  })
})
