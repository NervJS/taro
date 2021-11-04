export default {
  props: [
    'id',
    'cls',
    'src',
    'alt'
  ],
  onLoad (e) {
    this.$trigger('load', { id: this.id, width: e.width, height: e.height })
  },
  onError () {
    this.$trigger('error', { id: this.id, errMsg: '图片加载异常' })
  }
}
