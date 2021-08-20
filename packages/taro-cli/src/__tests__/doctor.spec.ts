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

jest.mock('../doctor', () => {
  return {
    __esModule: true,
    default: {
      validators: [() => ({
        desc: 'configValidator',
        lines: [{
          desc: 'A',
          valid: false
        }]
      }), () => ({
        desc: 'packageValidator',
        lines: [{
          desc: 'B',
          valid: true
        }, {
          desc: 'C',
          valid: true,
          solution: 'c'
        }]
      }), () => ({
        desc: 'recommandValidator',
        lines: []
      }), () => ({
        desc: 'eslintValidator',
        raw: 'eslint msg'
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

const runDoctor = run('doctor')

describe('doctor', () => {
  it('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runDoctor('')
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log reports', async () => {
    const NOTE_ALL_RIGHT = chalk.green('[✓] ')
    const NOTE_VALID = chalk.yellow('[!] ')
    const NOTE_INVALID = chalk.red('[✗] ')

    const titleChalk = chalk.hex('#aaa')
    const lineChalk = chalk.hex('#fff')
    const solutionChalk = chalk.hex('#999')

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runDoctor(path.join(__dirname, 'fixtures/default'))

    expect(logSpy).nthCalledWith(1, '\n' + titleChalk('configValidator'))
    expect(logSpy).nthCalledWith(2, '  ' + NOTE_INVALID + lineChalk('A'))

    expect(logSpy).nthCalledWith(3, '\n' + titleChalk('packageValidator'))
    expect(logSpy).nthCalledWith(4, '  ' + NOTE_VALID + lineChalk('B'))
    expect(logSpy).nthCalledWith(5, '  ' + NOTE_VALID + lineChalk('C'))
    expect(logSpy).nthCalledWith(6, '      ' + solutionChalk('c'))

    expect(logSpy).nthCalledWith(7, '\n' + titleChalk('recommandValidator'))
    expect(logSpy).nthCalledWith(8, `  ${NOTE_ALL_RIGHT}没有发现问题`)

    expect(logSpy).nthCalledWith(9, '\n' + titleChalk('eslintValidator'))
    expect(logSpy).nthCalledWith(10, 'eslint msg')

    logSpy.mockRestore()
  })
})
