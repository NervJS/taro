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
 *  SOFTWARE.
 */

describe('eventSource', () => {
  process.env.FRAMEWORK = 'react'
  const runtime = require('../../dist/runtime.esm')
  const eventSource = runtime.eventSource
  global.document = runtime.document

  beforeEach(() => {
    eventSource.clear()
  })

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  function createDiv (id) {
    const div = document.createElement('div')
    if (id) div.id = id
    return div
  }

  /**
   * <div id='target' />
   */
  it('eventSource.removeNode should remove node\' sid & uid', () => {
    const node = createDiv('target')

    const { sid, uid } = node

    expect(eventSource.has(sid)).toBeTruthy()
    expect(eventSource.has(uid)).toBeTruthy()

    eventSource.removeNode(node)

    expect(eventSource.has(sid)).toBeFalsy()
    expect(eventSource.has(uid)).toBeFalsy()
  })

  /**
   * div
   *   div
   *   div#list
   *     div
   *     div
   *       div#target
   *     div
   *   div
   */
  it('eventSource.removeNodeTree should remove entire node tree', () => {
    const container = createDiv()
    const list = createDiv('list')
    const target = createDiv()
    target.appendChild(createDiv('target'))
    list.appendChild(createDiv())
    list.appendChild(target)
    list.appendChild(createDiv())
    container.appendChild(createDiv())
    container.appendChild(list)
    container.appendChild(createDiv())

    expect(eventSource.size).toBe(10)

    eventSource.removeNodeTree(list)

    expect(eventSource.size).toBe(3)

    expect(eventSource.has(list.sid)).toBeFalsy()
    expect(eventSource.has(list.uid)).toBeFalsy()
    expect(eventSource.has(target.sid)).toBeFalsy()
    expect(eventSource.has('target')).toBeFalsy()
  })
})
