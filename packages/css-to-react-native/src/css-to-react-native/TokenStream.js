/* 
 * MIT License
 * 
 * Copyright (c) 2016 Jacob Parker and Maximilian Stoiber
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const SYMBOL_MATCH = 'SYMBOL_MATCH'

export default class TokenStream {
  constructor (nodes, parent) {
    this.index = 0
    this.nodes = nodes
    this.functionName = parent != null ? parent.value : null
    this.lastValue = null
    this.rewindIndex = -1
  }

  get node () {
    return this.nodes[this.index]
  }

  get length () {
    return this.nodes.length
  }

  hasTokens () {
    return this.index <= this.length - 1
  }

  [SYMBOL_MATCH] (...tokenDescriptors) {
    if (!this.hasTokens()) return null

    const node = this.node

    for (let i = 0; i < tokenDescriptors.length; i += 1) {
      const tokenDescriptor = tokenDescriptors[i]
      const value = tokenDescriptor(node)
      if (value !== null) {
        this.index += 1
        this.lastValue = value
        return value
      }
    }

    return null
  }

  matches (...tokenDescriptors) {
    return this[SYMBOL_MATCH](...tokenDescriptors) !== null
  }

  expect (...tokenDescriptors) {
    const value = this[SYMBOL_MATCH](...tokenDescriptors)
    return value !== null ? value : this.throw()
  }

  matchesFunction () {
    const node = this.node
    if (node.type !== 'function') return null
    const value = new TokenStream(node.nodes, node)
    this.index += 1
    this.lastValue = null
    return value
  }

  expectFunction () {
    const value = this.matchesFunction()
    return value !== null ? value : this.throw()
  }

  expectEmpty () {
    if (this.hasTokens()) this.throw()
  }

  throw () {
    throw new Error(`Unexpected token type: ${this.node?.type}`)
  }

  saveRewindPoint () {
    this.rewindIndex = this.index
  }

  rewind () {
    if (this.rewindIndex === -1) throw new Error('Internal error')
    this.index = this.rewindIndex
    this.lastValue = null
  }
}
