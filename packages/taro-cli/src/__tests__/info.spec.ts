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
import { run } from './utils'
import { getPkgVersion } from '../util'

jest.mock('envinfo', () => {
  const envinfo = jest.requireActual('envinfo')
  return {
    __esModule: true,
    async run (data, options) {
      const res = await envinfo.run(data, { ...options, json: true })
      return JSON.parse(res)
    }
  }
})

const runInfo = run('info')

describe('info', () => {
  it('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInfo('')
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log infomations', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    const appPath = path.resolve(__dirname, 'fixtures/default')
    await runInfo(appPath)

    expect(logSpy).toBeCalledTimes(1)
    const res = logSpy.mock.calls[0][0]
    const title = `Taro CLI ${getPkgVersion()} environment info`
    expect(res.hasOwnProperty(title)).toBeTruthy()
    const info = res[title]
    expect('System' in info).toBeTruthy()
    expect('Binaries' in info).toBeTruthy()
    expect('npmPackages' in info).toBeTruthy()
    expect(Object.keys(info.System)).toEqual(['OS', 'Shell'])
    expect(Object.keys(info.Binaries)).toEqual(['Node', 'Yarn', 'npm'])
    expect(info.npmPackages.hasOwnProperty('@tarojs/helper')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@tarojs/mini-runner')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@tarojs/service')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@tarojs/taro')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@tarojs/taroize')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@tarojs/webpack-runner')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('babel-plugin-transform-taroapi')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('eslint-config-taro')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('eslint-plugin-taro')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('postcss-pxtransform')).toBeTruthy()

    logSpy.mockRestore()
  })
})
