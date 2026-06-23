import router from '@system.router'

import { covertHex3ToHex6 } from '../utils'

export default {
  props: {
    title: {
      default: '标题'
    },
    background: String,
    textStyle: String,
    st: String
  },
  data () {
    const pagesLen = Number(router.getLength())
    return {
      isShowReturn: pagesLen > 0
    }
  },
  computed: {
    bg () {
      return covertHex3ToHex6(this.background)
    }
  },
  goBack () {
    if (!this._data.isShowReturn) return

    router.back()
  }
}
