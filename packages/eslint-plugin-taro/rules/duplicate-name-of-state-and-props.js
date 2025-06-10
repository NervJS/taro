const { buildDocsMeta } = require('../utils/utils')

module.exports = {
  meta: {
    docs: buildDocsMeta('state 与 props 的命名不能重复', 'duplicate-name-of-state-and-props')
  },

  create (context) {
    const stateNameFields = new Set()
    const propsNameFields = new Set()

    function addStateFields (node) {
      for (const property of node.properties) {
        if ((property.type === 'ObjectProperty' || property.type === 'Property') && property.key.type === 'Identifier') {
          stateNameFields.add(property)
        }
      }
    }

    return {
      ObjectExpression (node) {
        if (node.parent.type !== 'ClassProperty') {
          return
        }
        if (!node.parent.key) {
          return
        }
        if (node.parent.key.type !== 'Identifier' || node.parent.key.name !== 'state') {
          return
        }
        if (!node.properties) {
          return
        }

        addStateFields(node)
      },
      AssignmentExpression (node) {
        const { left, right } = node
        if (right && right.type !== 'ObjectExpression') {
          return
        }
        if (left.type !== 'MemberExpression') {
          return
        }
        if (left.object.type !== 'ThisExpression' || left.property.type !== 'Identifier' || left.property.name !== 'state') {
          return
        }

        addStateFields(right)
      },
      MemberExpression (node) {
        const { property, object } = node
        if (object.type !== 'MemberExpression') {
          return
        }
        if (object.object.type !== 'ThisExpression' || object.property.type !== 'Identifier' || object.property.name !== 'props') {
          return
        }
        if (property.type === 'Identifier') {
          propsNameFields.add(property.name)
        }
      },
      VariableDeclarator (node) {
        const { id, init } = node
        if (!init) {
          return
        }
        if (init.type !== 'MemberExpression' || init.object.type !== 'ThisExpression' || init.property.type !== 'Identifier' || init.property.name !== 'props') {
          return
        }

        if (id.type !== 'ObjectPattern') {
          return
        }

        for (const property of id.properties) {
          if (property.type === 'Property' && property.key.type === 'Identifier') {
            propsNameFields.add(property.key.name)
          }
        }
      },
      'ClassDeclaration:exit' () {
        stateNameFields.forEach(node => {
          const key = node.key
          if (propsNameFields.has(key.name)) {
            context.report(node, `this.state.${key.name} 与 this.props.${key.name} 重复可能会导致渲染结不如意料之中的结果。`)
          }
        })
      }
    }
  }
}
