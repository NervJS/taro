export default {
  props: [
    'id',
    'cls',
    'groupId'
  ],

  computed: {
    ref () {
      return 'ref_' + this.groupId
    }
  }
}
