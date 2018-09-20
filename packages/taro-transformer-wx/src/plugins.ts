import * as t from 'babel-types'

function isString (node) {
  return t.isLiteral(node as any) && typeof node.value === 'string'
}

function buildBinaryExpression (left, right) {
  return t.binaryExpression('+', left, right)
}
export function templateLiterals (path, state) {

  let nodes: Array<Object> = []

  const expressions = path.get('expressions')

  for (const elem of (path.node.quasis)) {
    nodes.push(t.stringLiteral(elem.value.cooked))

    const expr = expressions.shift()
    if (expr) {
      // tslint:disable-next-line:no-multi-spaces
      if (state.opts.spec && !expr.isBaseType('string') && !expr.isBaseType('number'))  {
        nodes.push(t.callExpression(t.identifier('String'), [expr.node]))
      } else {
        nodes.push(expr.node)
      }
    }
  }

  // filter out empty string literals
  nodes = nodes.filter((n) => !t.isLiteral(n, { value: '' }))

  // since `+` is left-to-right associative
  // ensure the first node is a string if first/second isn't
  if (!isString(nodes[0]) && !isString(nodes[1])) {
    nodes.unshift(t.stringLiteral(''))
  }

  if (nodes.length > 1) {
    let root = buildBinaryExpression(nodes.shift(), nodes.shift())

    for (const node of nodes) {
      root = buildBinaryExpression(root, node)
    }

    path.replaceWith(root)
  } else {
    path.replaceWith(nodes[0])
  }
}
