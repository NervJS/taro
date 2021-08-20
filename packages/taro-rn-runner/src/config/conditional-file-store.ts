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

import * as FileStore from 'metro-cache/src/stores/FileStore'

export default class ConditionalFileStore<T> {
  ignoreEntryFileCache = false
  _fileStore: FileStore<T>
  entryName: string

  constructor (options: any, entryName?: string) {
    this._fileStore = new FileStore<T>(options)
    this.entryName = entryName || 'app'
  }

  isEntryCache (cacheItem): boolean {
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

  get (key: Buffer): T | null {
    const result = this._fileStore.get(key)
    if (result && this.ignoreEntryFileCache && this.isEntryCache(result)) {
      return null
    }
    return result
  }

  set (key: Buffer, value: any): void {
    // fix: 样式文件不写缓存
    if (value?.output?.[0]?.data?.functionMap?.names?.indexOf('ignoreStyleFileCache') > -1) {
      return
    }
    this._fileStore.set(key, value)
  }

  clear (): void {
    this._fileStore.clear()
  }
}
