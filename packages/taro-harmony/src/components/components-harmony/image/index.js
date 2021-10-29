const modeMap = {
  scaleToFill: 'fill',
  aspectFit: 'contain',
  aspectFill: 'cover'
}

export default {
  props: [
    'id',
    'cls',
    'mode',
    'src',
    'alt'
  ],
  computed: {
    objectFit () {
      return modeMap[this.mode] || ''
    }
  },
  onLoad (e) {
    this.$emit('load', { id: this.id, width: e.width, height: e.height })
  },
  onError () {
    this.$emit('error', { id: this.id, errMsg: '图片加载异常' })
  }
}
