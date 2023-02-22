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

import * as FileStore from 'metro-cache/src/stores/FileStore'

export class ConditionalFileStore<T> {
  ignoreEntryFileCache = false
  _fileStore: FileStore<T>
  entryName: string

  constructor (options: any, entryName?: string) {
    this._fileStore = new FileStore<T>(options)
    this.entryName = entryName || 'app'
  }

  isEntryCache (cacheItem): boolean {
    if (!cacheItem) return false
    const { dependencies } = cacheItem
    if (!dependencies || !dependencies.length) {
      return false
    }

    for (const d of dependencies) {
      if (d.name.includes(`${this.entryName}.config`)) {
        return true
      }
    }
    return false
  }

  async get (key: Buffer): Promise<T | null> {
    const result = await this._fileStore.get(key)
    if (result && this.ignoreEntryFileCache && this.isEntryCache(result)) {
      return null
    }
    return result
  }

  async set (key: Buffer, value: any): Promise<void> {
    // fix: 样式文件不写缓存
    if (value?.output?.[0]?.data?.functionMap?.names?.indexOf('ignoreStyleFileCache') > -1) {
      return
    }
    return await this._fileStore.set(key, value)
  }

  clear (): void {
    this._fileStore.clear()
  }
}
