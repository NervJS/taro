export default {
  props: {
    id: String,
    cls: String,
    nodes: String || Array
  },
  computed: {
    nodeData () {
      if (this.nodes && Array.isArray(this.nodes)) {
        console.error('暂不支持节点列表参数')
        return ''
      }
      return this.nodes
    }
  }
}
