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

import { PageInstance } from '@tarojs/runtime'

class Stacks {
  stacks: PageInstance[] = []

  backDelta = 0
  tabs = {}
  methodName = ''

  set delta (delta: number) {
    if (delta > 0) {
      this.backDelta = delta
    } else if (this.backDelta > 0) {
      --this.backDelta
    } else {
      this.backDelta = 0
    }
  }

  get delta () {
    return this.backDelta
  }

  set method (methodName: string) {
    this.methodName = methodName
  }

  get method () {
    return this.methodName
  }

  get length () {
    return this.stacks.length
  }

  get last () {
    return this.stacks[this.length - 1]
  }

  get () {
    return this.stacks
  }

  getItem (index: number) {
    return this.stacks[index]
  }

  getLastIndex (pathname: string, stateWith = 1) {
    const list = [...this.stacks].reverse()
    return list.findIndex((page, i) => i >= stateWith && page.path?.replace(/\?.*/g, '') === pathname)
  }

  getDelta (pathname: string) {
    if (this.backDelta >= 1) {
      return this.backDelta
    }
    const index = this.getLastIndex(pathname)
    // NOTE: 此处为了修复浏览器后退多级页面，在大量重复路由状况下可能出现判断错误的情况 （增强判断能力只能考虑在 query 中新增参数来判断，暂时搁置）
    return index > 0 ? index : 1
  }

  getPrevIndex (pathname: string, stateWith = 1) {
    const lastIndex = this.getLastIndex(pathname, stateWith)
    if (lastIndex < 0) {
      return -1
    }
    return this.length - 1 - lastIndex
  }

  pop () {
    return this.stacks.pop()
  }

  push (page: PageInstance) {
    return this.stacks.push(page)
  }

  getTabs () {
    return this.tabs
  }

  pushTab (path: string) {
    this.tabs[path] = this.last
    this.pop()
  }

  popTab (path: string) {
    this.push(this.tabs[path])
    delete this.tabs[path]
  }

  removeTab (path: string) {
    delete this.tabs[path]
  }
}

const stacks = new Stacks()

export default stacks
