
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
  data () {
    return {
      objectFit: modeMap[this.props.mode]
    }
  },
  onLoad (e) {
    this.$emit('complete', { width: e.width, height: e.height })
  },
  onError () {
    this.$emit('error', { errMsg: '图片加载异常' })
  }
}
