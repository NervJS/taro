import * as t from '@babel/types'

import { getConfig, getNumberedId, registerImportMethod } from '../shared/utils'
import { setAttr } from './element'

export function createTemplate(path, result, wrap) {
  const config = getConfig(path)
  if (result.id) {
    result.decl = t.variableDeclaration('var', result.declarations)
    if (
      !(result.exprs.length || result.dynamics.length || result.postExprs.length) &&
      result.decl.declarations.length === 1
    ) {
      return result.decl.declarations[0].init
    } else {
      return t.callExpression(
        t.arrowFunctionExpression(
          [],
          t.blockStatement([
            result.decl,
            ...result.exprs.concat(
              wrapDynamics(path, result.dynamics) || [],
              result.postExprs || []
            ),
            t.returnStatement(result.id)
          ])
        ),
        []
      )
    }
  }
  if (wrap && result.dynamic && config.memoWrapper) {
    return t.callExpression(registerImportMethod(path, config.memoWrapper), [result.exprs[0]])
  }
  return result.exprs[0]
}

function wrapDynamics(path, dynamics) {
  if (!dynamics.length) return
  const config = getConfig(path)

  const effectWrapperId = registerImportMethod(path, config.effectWrapper)

  if (dynamics.length === 1) {
    const prevValue = t.identifier('_$p')

    return t.expressionStatement(
      t.callExpression(effectWrapperId, [
        t.arrowFunctionExpression(
          [prevValue],
          setAttr(path, dynamics[0].elem, dynamics[0].key, dynamics[0].value, {
            dynamic: true,
            prevId: prevValue
          })
        )
      ])
    )
  }

  const prevId = t.identifier('_p$')

  /** @type {t.VariableDeclarator[]} */
  const declarations = []
  /** @type {t.ExpressionStatement[]} */
  const statements = []
  /** @type {t.Identifier[]} */
  const properties = []

  dynamics.forEach(({ elem, key, value }, index) => {
    const varIdent = path.scope.generateUidIdentifier('v$')

    const propIdent = t.identifier(getNumberedId(index))
    const propMember = t.memberExpression(prevId, propIdent)

    properties.push(propIdent)
    declarations.push(t.variableDeclarator(varIdent, value))

    statements.push(
      t.expressionStatement(
        t.logicalExpression(
          '&&',
          t.binaryExpression('!==', varIdent, propMember),
          t.assignmentExpression(
            '=',
            propMember,
            setAttr(path, elem, key, varIdent, { dynamic: true, prevId: propMember }),
          ),
        ),
      ),
    )
  })

  return t.expressionStatement(
    t.callExpression(effectWrapperId, [
      t.arrowFunctionExpression(
        [prevId],
        t.blockStatement([
          t.variableDeclaration('var', declarations),
          ...statements,
          t.returnStatement(prevId),
        ]),
      ),
      t.objectExpression(
        properties.map((id) => t.objectProperty(id, t.identifier('undefined'))),
      ),
    ]),
  )
}
