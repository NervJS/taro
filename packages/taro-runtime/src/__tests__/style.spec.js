/*
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

let Style

describe('style', () => {
  const runtime = require('../../dist/runtime.esm')
  Style = runtime.Style
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('works', () => {
    const root = document.createElement('root')
    const style = new Style(root)
    style.color = 'red'
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.getPropertyValue('color')).toBe('red')
    style.fontSize = '16'
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.getPropertyValue('font-size')).toBe('16')
    style.removeProperty('font-size')
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.fontSize).toBe('')
    style.setProperty('font-weight', 'bold')
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.fontWeight).toBe('bold')
    expect(style.cssText).toBe('color: red;font-weight: bold;')
    style.cssText = ''
    expect(style.cssText).toBe('')
    expect(style._usedStyleProp.size).toBe(0)
    expect(style.color).toBe('')
    expect(style.fontWeight).toBe('')
    style.textAlign = 'center'
    expect(style.cssText).toBe('text-align: center;')
    style.cssText = 'color: red;font-weight: bold;'
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.fontWeight).toBe('bold')
    expect(style.color).toBe('red')
  })
})
