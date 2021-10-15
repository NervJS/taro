export default {
  props: [
    'id',
    'cls',
    'src',
    'alt'
  ],
  onLoad (e) {
    this.$emit('complete', { id: this.id, width: e.width, height: e.height })
  },
  onError () {
    this.$emit('error', { id: this.id, errMsg: '图片加载异常' })
  }
}
