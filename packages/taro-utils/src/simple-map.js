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

export default class SimpleMap {
  constructor () {
    this.cache = []
    this.size = 0
  }

  set (k, v) {
    const len = this.cache.length
    if (!len) {
      this.cache.push({ k, v })
      this.size += 1
      return
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        item.v = v
        return
      }
    }
    this.cache.push({ k, v })
    this.size += 1
  }

  get (k) {
    const len = this.cache.length
    if (!len) {
      return
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        return item.v
      }
    }
  }

  has (k) {
    const len = this.cache.length
    if (!len) {
      return false
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        return true
      }
    }
    return false
  }

  delete (k) {
    const len = this.cache.length
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        this.cache.splice(i, 1)
        this.size -= 1
        return true
      }
    }
    return false
  }

  clear () {
    let len = this.cache.length
    this.size = 0
    if (!len) {
      return
    }
    while (len) {
      this.cache.pop()
      len--
    }
  }
}
