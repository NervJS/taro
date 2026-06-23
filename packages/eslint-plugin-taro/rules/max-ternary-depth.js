module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit the depth of nested ternary expressions',
      category: 'Best Practices',
      recommended: true
    },
    fixable: null,
    schema: [
      {
        type: 'integer',
        minimum: 1,
        maximum: 10
      }
    ],
    messages: {
      tooDeep: 'Ternary expression is nested {{depth}} levels deep (max: {{maxDepth}}). Consider refactoring to if-else statements.'
    }
  },

  create(context) {
    const maxDepth = context.options[0] || 2

    function getTernaryDepth(node) {
      if (node.type !== 'ConditionalExpression') {
        return 0
      }

      const consequentDepth = getTernaryDepth(node.consequent)
      const alternateDepth = getTernaryDepth(node.alternate)

      return 1 + Math.max(consequentDepth, alternateDepth)
    }

    return {
      ConditionalExpression(node) {
        const depth = getTernaryDepth(node)

        if (depth > maxDepth) {
          context.report({
            node,
            messageId: 'tooDeep',
            data: {
              depth,
              maxDepth
            }
          })
        }
      }
    }
  }
}
