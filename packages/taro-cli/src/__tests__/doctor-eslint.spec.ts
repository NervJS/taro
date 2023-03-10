/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import * as path from 'path'

import validator from '../doctor/eslintValidator'

describe('eslint validator of doctor', () => {
  let cwd = ''
  beforeEach(() => {
    cwd = process.cwd()
  })

  afterEach(() => {
    process.chdir(cwd)
  })

  it('should lint for react', async () => {
    process.chdir(path.join(__dirname, 'fixtures/default'))
    const raw = await validator({
      projectConfig: {
        framework: 'react',
        sourceRoot: 'src'
      }
    }).then(e => e.raw)

    expect(raw).toBe('')
  })

  it('should lint for nerv', async () => {
    process.chdir(path.join(__dirname, 'fixtures/nerv'))
    const raw = await validator({
      projectConfig: {
        framework: 'nerv',
        sourceRoot: 'src'
      }
    }).then(e => e.raw)

    expect(raw.includes('\'a\' is assigned a value but never used'))
  })

  it('should lint for vue', async () => {
    process.chdir(path.join(__dirname, 'fixtures/vue'))
    const raw = await validator({
      projectConfig: {
        framework: 'vue',
        sourceRoot: 'src'
      }
    }).then(e => e.raw)

    expect(raw).toBe('')
  })
})
