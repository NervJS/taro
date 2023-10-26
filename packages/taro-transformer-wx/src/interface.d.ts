import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

interface LoopRef {
  id: string | t.Expression
  fn: t.FunctionExpression | t.ArrowFunctionExpression | t.MemberExpression
  type: 'component' | 'dom'
  component: NodePath<t.JSXElement>
}
