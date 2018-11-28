import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'

interface LoopRef {
  id: string,
  fn: t.FunctionExpression | t.ArrowFunctionExpression | t.MemberExpression,
  type: 'component' | 'dom',
}
