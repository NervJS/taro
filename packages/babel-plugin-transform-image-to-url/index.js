/**
 * Created by Wu Jian Ping on 2018/11/1.
 */

const pathUtils = require('path')
const utils = require('./utils')

module.exports = function ({types: t}) {
  return {
    visitor: {
      VariableDeclarator(path, state){
        let node = path.node
        if (node && node.init) {
          if (utils.isImage(node.init.value) && !utils.isUrl(node.init.value)) {
            let source = pathUtils.join(utils.getAppPath(), 'src', node.init.value)
            let target = pathUtils.join(utils.getAppPath(), state.opts.staticDirectory, utils.getFileNameWithHash(source))
            utils.createDirIfNotExists(pathUtils.dirname(target))
            utils.copyFile(source, target)
            node.init = t.stringLiteral(state.opts.publicPath + pathUtils.basename(target))
          }
        }
      }
    }
  }
}
