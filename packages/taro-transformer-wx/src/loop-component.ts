import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import {
  newJSXIfAttr,
  reverseBoolean,
  findIdentifierFromStatement,
  isEmptyDeclarator,
  codeFrameError,
  isBlockIfStatement,
  isContainFunction,
  setTemplate,
  buildConstVariableDeclaration
} from './utils'
import {
  setJSXAttr,
  buildBlockElement
} from './jsx'
import { LOOP_STATE } from './constant'
import { Adapter } from './adapter'

// @TODO
// 重构 parseRender 和 parseLoop 失败
// 尚不清楚 babel 的 state 和 context 传参机制
// 目前先写两份代码，有时间看看 babel 具体对 state 和 context 做了什么导致传参失败
export function parseLoopBody (
  body: NodePath<t.BlockStatement>,
  jsxDeclarations: Set<NodePath<t.Node>>,
  // @TODO
  // 把 templates 换成 Map 可以支持 shalow variables declared
  // 现在先用 ESLint 的 no-shalow 顶着
  templates: Map<string, t.JSXElement>,
  loopScopes: Set<string>,
  finalReturnElement: t.JSXElement,
  returnedPaths: NodePath<t.Node>[]
) {
  const bodyScope = body.scope
  body.traverse({
    JSXElement (jsxElementPath) {
      const parentNode = jsxElementPath.parent
      const parentPath = jsxElementPath.parentPath
      const isFinalReturn = jsxElementPath.getFunctionParent().isClassMethod()
      const isJSXChildren = t.isJSXElement(parentNode)
      if (!isJSXChildren) {
        let statementParent = jsxElementPath.getStatementParent()
        if (
          !(
            statementParent.isVariableDeclaration() ||
            statementParent.isExpressionStatement()
          )
        ) {
          statementParent = statementParent.findParent(
            s => s.isVariableDeclaration() || s.isExpressionStatement()
          ) as NodePath<t.Statement>
        }
        jsxDeclarations.add(statementParent)
        if (t.isVariableDeclarator(parentNode)) {
          if (statementParent) {
            const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
            // setTemplate(name, path, templates)
            name && templates.set(name, jsxElementPath.node)
          }
        } else if (t.isLogicalExpression(parentNode)) {
          const { left, operator } = parentNode
          if (operator === '&&') {
            if (t.isExpression(left)) {
              newJSXIfAttr(jsxElementPath.node, left)
              parentPath.replaceWith(jsxElementPath.node)
              if (statementParent) {
                const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
                setTemplate(name, jsxElementPath, templates)
                // name && templates.set(name, path.node)
              }
            }
          }
        } else if (t.isConditionalExpression(parentNode)) {
          const { test, consequent, alternate } = parentNode
          const block = buildBlockElement()
          if (t.isJSXElement(consequent) && t.isLiteral(alternate)) {
            const { value, confident } = parentPath.get('alternate').evaluate()
            if (confident && !value) {
              newJSXIfAttr(block, test)
              block.children = [ jsxElementPath.node ]
              // newJSXIfAttr(jsxElementPath.node, test)
              parentPath.replaceWith(block)
              if (statementParent) {
                const name = findIdentifierFromStatement(
                  statementParent.node as t.VariableDeclaration
                )
                setTemplate(name, jsxElementPath, templates)
                // name && templates.set(name, path.node)
              }
            }
          } else if (t.isLiteral(consequent) && t.isJSXElement(consequent)) {
            if (t.isNullLiteral(consequent)) {
              newJSXIfAttr(block, reverseBoolean(test))
              // newJSXIfAttr(jsxElementPath.node, reverseBoolean(test))
              parentPath.replaceWith(block)
              if (statementParent) {
                const name = findIdentifierFromStatement(
                  statementParent.node as t.VariableDeclaration
                )
                setTemplate(name, jsxElementPath, templates)
                // name && templates.set(name, path.node)
              }
            }
          } else if (t.isJSXElement(consequent) && t.isJSXElement(alternate)) {
            const block2 = buildBlockElement()
            block.children = [consequent]
            newJSXIfAttr(block, test)
            setJSXAttr(block2, Adapter.else)
            block2.children = [alternate]
            const parentBlock = buildBlockElement()
            parentBlock.children = [block, block2]
            parentPath.replaceWith(parentBlock)
            if (statementParent) {
              const name = findIdentifierFromStatement(
                statementParent.node as t.VariableDeclaration
              )
              setTemplate(name, jsxElementPath, templates)
            }
          } else {
            // console.log('todo')
          }
        } else if (t.isReturnStatement(parentNode)) {
          if (!isFinalReturn) {
            const caller = parentPath.findParent(p => p.isCallExpression())
            if (caller.isCallExpression()) {
              const callee = caller.node.callee
              if (
                t.isMemberExpression(callee) &&
                t.isIdentifier(callee.property) &&
                callee.property.name === 'map'
              ) {
                let ary = callee.object
                const blockStatementPath = parentPath.findParent(p => p.isBlockStatement()) as NodePath<t.BlockStatement>
                const body = blockStatementPath.node.body
                let stateToBeAssign = new Set<string>()
                for (const statement of body) {
                  if (t.isVariableDeclaration(statement)) {
                    for (const dcl of statement.declarations) {
                      if (t.isIdentifier(dcl.id)) {
                        const scope = blockStatementPath.scope
                        const stateName = scope.generateUid(LOOP_STATE)
                        stateToBeAssign.add(stateName)
                        blockStatementPath.scope.rename(dcl.id.name, stateName)
                      }
                    }
                  }
                }
                if (t.isCallExpression(ary) || isContainFunction(caller.get('callee').get('object'))) {
                  const variableName = `anonymousState_${bodyScope.generateUid()}`
                  caller.getStatementParent().insertBefore(
                    buildConstVariableDeclaration(variableName, ary)
                  )
                  ary = t.identifier(variableName)
                }
                setJSXAttr(jsxElementPath.node, Adapter.for, t.jSXExpressionContainer(ary))
                const [func] = caller.node.arguments
                if (
                  t.isFunctionExpression(func) ||
                  t.isArrowFunctionExpression(func)
                ) {
                  const [item, index] = func.params
                  if (t.isIdentifier(item)) {
                    setJSXAttr(
                      jsxElementPath.node,
                      Adapter.forItem,
                      t.stringLiteral(item.name)
                    )
                    loopScopes.add(item.name)
                  } else {
                    setJSXAttr(
                      jsxElementPath.node,
                      Adapter.forItem,
                      t.stringLiteral('__item')
                    )
                  }
                  if (t.isIdentifier(index)) {
                    setJSXAttr(
                      jsxElementPath.node,
                      Adapter.forIndex,
                      t.stringLiteral(index.name)
                    )
                    loopScopes.add(index.name)
                  }
                  caller.replaceWith(jsxElementPath.node)
                  if (statementParent) {
                    const name = findIdentifierFromStatement(
                      statementParent.node as t.VariableDeclaration
                    )
                    // setTemplate(name, path, templates)
                    name && templates.set(name, jsxElementPath.node)
                  }
                }
              }
            }
          } else {
            const ifStatement = parentPath.findParent(p => p.isIfStatement())
            const blockStatement = parentPath.findParent(p => p.isBlockStatement())
            const block = finalReturnElement || buildBlockElement()
            if (isBlockIfStatement(ifStatement, blockStatement)) {
              const { test, alternate, consequent } = ifStatement.node
              if (alternate === blockStatement.node) {
                throw codeFrameError(parentNode.loc, '不必要的 else 分支，请遵从 ESLint consistent-return: https://eslint.org/docs/rules/consistent-return')
              } else if (consequent === blockStatement.node) {
                const parentIfStatement = ifStatement.findParent(p => p.isIfStatement())
                if (parentIfStatement) {
                  setJSXAttr(
                    jsxElementPath.node,
                    Adapter.elseif,
                    t.jSXExpressionContainer(test)
                  )
                } else {
                  newJSXIfAttr(jsxElementPath.node, test)
                }
              }
            } else if (block.children.length !== 0) {
              setJSXAttr(jsxElementPath.node, Adapter.else)
            }
            block.children.push(jsxElementPath.node)
            finalReturnElement = block
            returnedPaths.push(parentPath)
          }
        } else if (t.isArrowFunctionExpression(parentNode)) {
          //
        } else if (t.isAssignmentExpression(parentNode)) {
          if (t.isIdentifier(parentNode.left)) {
            const name = parentNode.left.name
            const bindingNode = bodyScope.getOwnBinding(name)!.path.node
            const block = templates.get(name) || buildBlockElement()
            if (isEmptyDeclarator(bindingNode)) {
              const ifStatement = parentPath.findParent(p => p.isIfStatement())
              const blockStatement = parentPath.findParent(p =>
                p.isBlockStatement()
              )
              if (isBlockIfStatement(ifStatement, blockStatement)) {
                const { test, alternate, consequent } = ifStatement.node
                if (alternate === blockStatement.node) {
                  setJSXAttr(jsxElementPath.node, Adapter.else)
                } else if (consequent === blockStatement.node) {
                  const parentIfStatement = ifStatement.findParent(p =>
                    p.isIfStatement()
                  ) as NodePath<t.IfStatement>
                  if (parentIfStatement && parentIfStatement.get('alternate') === ifStatement) {
                    setJSXAttr(
                      jsxElementPath.node,
                      Adapter.elseif,
                      t.jSXExpressionContainer(test)
                    )
                  } else {
                    if (parentIfStatement) {
                      newJSXIfAttr(block, parentIfStatement.node.test)
                    }
                    newJSXIfAttr(jsxElementPath.node, test)
                  }
                }
                block.children.push(jsxElementPath.node)
                // setTemplate(name, path, templates)
                name && templates.set(name, block)
              }
            } else {
              throw codeFrameError(
                jsxElementPath.node.loc,
                '请将 JSX 赋值表达式初始化为 null，然后再进行 if 条件表达式赋值。'
              )
            }
          }
        } else if (!t.isJSXElement(parentNode)) {
          // throwError(path, '考虑只对 JSX 元素赋值一次。')
        }
      }
    }
  })
}
