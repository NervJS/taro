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
