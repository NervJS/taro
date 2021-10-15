export default {
  props: [
    'id',
    'cls',
    'flash',
    'devicePosition'
  ],
  onError () {
    this.$emit('error', { errMsg: '用户不允许使用摄像头时触发' })
  }
}
