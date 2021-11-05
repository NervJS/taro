import { createOption } from '../utils'

const modeMap = {
  scaleToFill: 'fill',
  aspectFit: 'contain',
  aspectFill: 'cover'
}

export default createOption({
  props: [
    'id',
    'mode',
    'src',
    'alt',
    'style'
  ],
  computed: {
    objectFit () {
      return modeMap[this.mode] || ''
    }
  },
  onLoad (e) {
    this.$trigger('load', { width: e.width, height: e.height })
  },
  onError () {
    this.$trigger('error', { errMsg: '图片加载异常' })
  }
})
