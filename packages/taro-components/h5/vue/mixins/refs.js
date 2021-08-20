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

export const refs = {
  mounted () {
    if (
      this.$parent &&
      typeof this.$parent.$refs === 'object' &&
      Object.keys(this.$parent.$refs).length
    ) {
      const refs = this.$parent.$refs

      if (this._refCacheKey) {
        refs[this._refCacheKey] = this.$el
      } else {
        for (const key in refs) {
          const ref = refs[key]
          if (ref === this) {
            this._refCacheKey = key
            refs[key] = this.$el
            break
          } else if (Array.isArray(ref)) {
            const index = ref.indexOf(this)
            if (index > -1) {
              ref[index] = this.$el
              break
            }
          }
        }
      }
    }
  },
  beforeDestroy () {
    if (
      this.$parent &&
      typeof this.$parent.$refs === 'object' &&
      Object.keys(this.$parent.$refs).length
    ) {
      const refs = this.$parent.$refs

      if (this._refCacheKey) {
        refs[this._refCacheKey] = this
      } else {
        for (const key in refs) {
          if (Array.isArray(refs[key])) {
            const index = refs[key].indexOf(this.$el)
            if (index > -1) {
              refs[key][index] = this
              break
            }
          }
        }
      }
    }
  }
}
