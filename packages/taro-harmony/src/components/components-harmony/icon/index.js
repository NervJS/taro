import { covertHex3ToHex6 } from '../utils'

export default {
  props: {
    size: {
      default: 23
    },
    type: String,
    id: String,
    color: String
  },
  computed: {
    iconColor () {
      return covertHex3ToHex6(this.color)
    }
  }
}
