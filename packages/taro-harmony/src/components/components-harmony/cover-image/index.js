export default {
  props: [
    'id',
    'cls',
    'src',
    'alt'
  ],
  onLoad (e) {
    this.$emit('complete', { width: e.width, height: e.height })
  },
  onError () {
    this.$emit('error', { errMsg: '图片加载异常' })
  }
}
