/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as path from 'path'
import chalk from 'chalk'
import { fs } from '@tarojs/helper'
import { run } from './utils'

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
  const fs = jest.requireActual('fs-extra')
  return {
    __esModule: true,
    ...helper,
    fs: {
      ...fs,
      writeFileSync: jest.fn()
    }
  }
})

const runInspect = run('inspect')

describe('inspect', () => {
  it('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInspect('')
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should exit when user haven\'t pass correct type', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInspect(path.resolve(__dirname, 'fixtures/default'))
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(logSpy).toBeCalledWith(chalk.red('请传入正确的编译类型！'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log config', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await runInspect(appPath, {
        options: {
          type: 'weapp'
        }
      })
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(logSpy).toBeCalledTimes(1)

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log specific config', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')
    const errorSpy = jest.spyOn(console, 'error')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    errorSpy.mockImplementation(() => {})

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await runInspect(appPath, {
        options: {
          type: 'h5'
        },
        args: ['resolve.mainFields.0']
      })
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(logSpy).toBeCalledTimes(1)
    expect(logSpy).toBeCalledWith('\'main:h5\'')

    exitSpy.mockRestore()
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('should output config', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const writeFileSync = fs.writeFileSync as jest.Mock<any>
    const outputPath = 'project-config.js'

    exitSpy.mockImplementation(() => {
      throw new Error()
    })

    try {
      const appPath = path.resolve(__dirname, 'fixtures/default')
      await runInspect(appPath, {
        options: {
          type: 'alipay',
          output: outputPath
        },
        args: ['resolve.mainFields.0']
      })
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(0)
    expect(writeFileSync).toBeCalledWith(outputPath, '\'browser\'')

    exitSpy.mockRestore()
  })
})
