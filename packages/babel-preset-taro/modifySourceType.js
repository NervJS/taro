module.exports = function () {
  return {
    name: 'modify-source-type',
    pre (file) {
      file.path.node.sourceType = 'module'
    }
  }
}