import router from '@system.router'

function covertHex3ToHex6 (color) {
  return color.replace(/^#([a-zA-Z])([a-zA-Z])([a-zA-Z])$/, '#$1$1$2$2$3$3')
}

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
