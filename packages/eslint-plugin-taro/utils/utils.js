function docsUrl (rule) {
  return 'https://github.com/NervJS/taro/tree/master/packages/eslint-plugin-taro/docs/' + rule + '.md'
}

function buildDocsMeta (description, rule) {
  return {
    description: '[Taro] ' + description,
    category: 'Taro',
    recommended: true,
    url: docsUrl(rule)
  }
}

function isTaroComponent (context, node) {
  let classDcl
  if (node.type === 'ClassDeclaration') {
    classDcl = node
  } else {
    const parents = context.getSourceCode().getAncestors(node)
    classDcl = parents.find(p => p.type === 'ClassDeclaration')
  }
  if (
    classDcl && classDcl.superClass
  ) {
    const superClass = classDcl.superClass
    if (superClass.type === 'Identifier' && superClass.name === 'Component') {
      return true
    }
    if (superClass.type === 'MemberExpression' && superClass.object.name === 'Taro' && superClass.property.name === 'Component') {
      return true
    }
  }
  return false
}

module.exports = {
  docsUrl,
  buildDocsMeta,
  isTaroComponent
}
