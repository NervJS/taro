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
