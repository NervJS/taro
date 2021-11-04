import { createOption } from '../utils'

export default createOption({
  props: [
    'id',
    'cls',
    'src',
    'alt'
  ],
  onLoad (e) {
    this.$trigger('load', { width: e.width, height: e.height })
  },
  onError () {
    this.$trigger('error', { errMsg: '图片加载异常' })
  }
})
