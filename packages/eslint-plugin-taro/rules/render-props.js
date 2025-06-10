const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '从 this.props 而来的函数名必须要以 `on` 开头'

const renderRE = /^render[A-Z]/

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'render-props')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        if (parents.some(p => p.type === 'JSXElement')) {
          return
        }
        const attr = parents.find(p => p.type === 'JSXAttribute')
        if (!attr) {
          return
        }
        if (!renderRE.test(attr.name.name)) {
          context.report({
            message: '传入 JSX 元素的 props 必须以 render 开头，遵守驼峰式命名法',
            node: attr
          })
        }
      },
      JSXAttribute (node) {
        if (renderRE.test(node.name.name)) {
          if (node.value && node.value.type !== 'JSXExpressionContainer') {
            context.report({
              message: '以 render 开头命名的 props 只能传入单个 JSX 元素或箭头函数',
              node
            })
            return
          }
          if (node.value.expression.type !== 'JSXElement' && node.value.expression.type !== 'ArrowFunctionExpression') {
            context.report({
              message: '以 render 开头命名的 props 只能传入单个 JSX 元素或箭头函数',
              node
            })
          }
        }
      },
      MemberExpression (node) {
        const { object, property, parent } = node
        if (
          parent.type !== 'JSXExpressionContainer' &&
          parent.type !== 'ConditionalExpression' &&
          parent.type !== 'LogicalExpression' &&
          object.type === 'MemberExpression' &&
          object.object.type === 'ThisExpression' &&
          object.property.name === 'props' &&
          property.type === 'Identifier'
        ) {
          if (renderRE.test(property.name)) {
            context.report({
              message: `无法操作 this.props.${property.name}`,
              node
            })
          }
          if (property.name === 'children') {
            context.report({
              message: `无法操作 this.props.children`,
              node
            })
          }
        }
      }
    }
  }
}
