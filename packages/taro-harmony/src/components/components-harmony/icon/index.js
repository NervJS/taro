export default {
  data () {
    return {
      iconSize: this.size || 23
    }
  },
  props: [
    'type',
    'id',
    'cls',
    'color',
    'size'
  ]
}
