export default {
  name (node) {
    if (node.parent && node.parent.name === 'div') {
      return 'text'
    }
    return node.name
  }
}
