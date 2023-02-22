/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { chalk } from '@tarojs/helper'
import * as path from 'path'

import { getPkgVersion } from '../util'
import { run } from './utils'

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

const runInfo = run('info', ['commands/info'])

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
    } catch (error) {} // eslint-disable-line no-empty

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log information', async () => {
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
    // envinfo 还不支持 yarn workspace
    // expect('npmPackages' in info).toBeTruthy()
    expect(Object.keys(info.System)).toEqual(['OS', 'Shell'])
    expect(Object.keys(info.Binaries)).toEqual(['Node', 'Yarn', 'npm'])
    // expect(info.npmPackages.hasOwnProperty('@tarojs/helper')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('@tarojs/mini-runner')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('@tarojs/service')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('@tarojs/taro')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('@tarojs/taroize')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('@tarojs/webpack-runner')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('babel-plugin-transform-taroapi')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('eslint-config-taro')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('eslint-plugin-taro')).toBeTruthy()
    // expect(info.npmPackages.hasOwnProperty('postcss-pxtransform')).toBeTruthy()

    logSpy.mockRestore()
  })
})
