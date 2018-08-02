import traverse, { Binding, NodePath } from 'babel-traverse'
import generate from 'babel-generator'
import { Transformer } from './class'
import { prettyPrint } from 'html'
import { setting, findFirstIdentifierFromMemberExpression, isContainJSXElement } from './utils'
import * as t from 'babel-types'
import { DEFAULT_Component_SET, INTERNAL_SAFE_GET, TARO_PACKAGE_NAME, ASYNC_PACKAGE_NAME, REDUX_PACKAGE_NAME, INTERNAL_DYNAMIC, IMAGE_COMPONENTS, INTERNAL_INLINE_STYLE } from './constant'
import { transform as parse } from 'babel-core'
import * as ts from 'typescript'
const template = require('babel-template')

export interface Options {
  isRoot?: boolean,
  isApp: boolean,
  outputPath: string,
  sourcePath: string,
  code: string,
  isTyped: boolean,
  isNormal?: boolean
}

function getIdsFromMemberProps (member: t.MemberExpression) {
  let ids: string[] = []
  const { object, property } = member
  if (t.isMemberExpression(object)) {
    ids = ids.concat(getIdsFromMemberProps(object))
  }
  if (t.isThisExpression(object)) {
    ids.push('this')
  }
  if (t.isIdentifier(object)) {
    ids.push(object.name)
  }
  if (t.isIdentifier(property)) {
    ids.push(property.name)
  }
  return ids
}

function buildFullPathThisPropsRef (id: t.Identifier, memberIds: string[], path: NodePath<t.Node>) {
  const binding = path.scope.getOwnBinding(id.name)
  if (binding) {
    const bindingPath = binding.path
    if (bindingPath.isVariableDeclarator()) {
      const dclId = bindingPath.get('id')
      const dclInit = bindingPath.get('init')
      let dclInitIds: string[] = []
      if (dclInit.isMemberExpression()) {
        dclInitIds = getIdsFromMemberProps(dclInit.node)
        if (dclId.isIdentifier()) {
          memberIds.shift()
        }
        if (dclInitIds[0] === 'this' && dclInitIds[1] === 'props') {
          return template(dclInitIds.concat(memberIds).join('.'))().expression
        }
      }
    }
  }
}

export interface Result {
  template: string
  components: {
    name: string,
    path: string
  }[]
}

interface TransformResult extends Result {
  code: string,
  ast: t.File
}

export default function transform (options: Options): TransformResult {
  const code = options.isTyped
    ? ts.transpile(options.code, {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      noEmitHelpers: true, // 这两者
      importHelpers: true, // 配合使用tslib helper函数
    })
    : options.code
  setting.sourceCode = code
  // babel-traverse 无法生成 Hub
  // 导致 Path#getSource|buildCodeFrameError 都无法直接使用
  // 原因大概是 babylon.parse 没有生成 File 实例导致 scope 和 path 原型上都没有 `file`
  // 将来升级到 babel@7 可以直接用 parse 而不是 transform
  const ast = parse(code, {
    parserOpts: {
      sourceType: 'module',
      plugins: [
        'typescript',
        'classProperties',
        'jsx',
        'flow',
        'flowComment',
        'trailingFunctionCommas',
        'asyncFunctions',
        'exponentiationOperator',
        'asyncGenerators',
        'objectRestSpread',
        'decorators'
      ] as any[]
    }
  }).ast as t.File
  if (options.isNormal) {
    return { ast } as any
  }
  // transformFromAst(ast, code)
  let result
  const componentSourceMap = new Map<string, string[]>()
  const imageSource = new Set<string>()
  let mainClass!: NodePath<t.ClassDeclaration>
  let storeName!: string
  let renderMethod!: NodePath<t.ClassMethod>
  traverse(ast, {
    ClassDeclaration (path) {
      mainClass = path
    },
    ClassExpression (path) {
      mainClass = path as any
    },
    ClassMethod (path) {
      if (t.isIdentifier(path.node.key) && path.node.key.name === 'render') {
        renderMethod = path
      }
    },
    CallExpression (path) {
      const callee = path.get('callee')
      if (isContainJSXElement(path)) {
        return
      }

      if (callee.isReferencedMemberExpression()) {
        const id = findFirstIdentifierFromMemberExpression(callee.node)
        const calleeIds = getIdsFromMemberProps(callee.node)
        if (t.isIdentifier(id)) {
          const fullPath = buildFullPathThisPropsRef(id, calleeIds, path)
          if (fullPath) {
            path.replaceWith(
              t.callExpression(
                fullPath,
                path.node.arguments
              )
            )
          }
        }
      }

      if (callee.isReferencedIdentifier()) {
        const id = callee.node
        const ids = [id.name]
        if (t.isIdentifier(id)) {
          const fullPath = buildFullPathThisPropsRef(id, ids, path)
          if (fullPath) {
            path.replaceWith(
              t.callExpression(
                fullPath,
                path.node.arguments
              )
            )
          }
        }
      }
    },
    AwaitExpression () {
      const isAsyncImported = ast.program.body.some(statement => {
        return t.isImportDeclaration(statement) && statement.source.value === ASYNC_PACKAGE_NAME
      })
      if (!isAsyncImported) {
        ast.program.body.unshift(
          t.importDeclaration([], t.stringLiteral(ASYNC_PACKAGE_NAME))
        )
      }
    },
    // JSXIdentifier (path) {
    //   const parentPath = path.parentPath
    //   if (!parentPath.isJSXAttribute()) {
    //     return
    //   }
    //   const element = parentPath.parentPath
    //   if (!element.isJSXOpeningElement()) {
    //     return
    //   }
    //   const elementName = element.get('name')
    //   if (!elementName.isJSXIdentifier()) {
    //     return
    //   }
    //   if (DEFAULT_Component_SET.has(elementName.node.name)) {
    //     return
    //   }

    //   const expr = parentPath.get('value.expression')

    // },
    JSXOpeningElement (path) {
      const { name } = path.node.name as t.JSXIdentifier
      if (name === 'Provider') {
        const modules = path.scope.getAllBindings('module')
        const providerBinding = Object.values(modules).some((m: Binding) => m.identifier.name === 'Provider')
        if (providerBinding) {
          path.node.name = t.jSXIdentifier('View')
          const store = path.node.attributes.find(attr => attr.name.name === 'store')
          if (store && t.isJSXExpressionContainer(store.value) && t.isIdentifier(store.value.expression)) {
            storeName = store.value.expression.name
          }
          path.node.attributes = []
        }
      }

      if (IMAGE_COMPONENTS.has(name)) {
        for (const attr of path.node.attributes) {
          if (
            t.isIdentifier(attr) &&
            attr.name.name === 'src'
          ) {
            if (t.isStringLiteral(attr.value)) {
              imageSource.add(attr.value.value)
            } else if (t.isJSXExpressionContainer(attr.value)) {
              if (t.isStringLiteral(attr.value.expression)) {
                imageSource.add(attr.value.expression.value)
              }
            }
          }
        }
      }
    },
    JSXAttribute (path) {
      const { name, value } = path.node
      if (!t.isJSXIdentifier(name) || value === null || t.isStringLiteral(value) || t.isJSXElement(value)) {
        return
      }

      const expr = value.expression as any
      const exprPath = path.get('value.expression')
      if (!t.isBinaryExpression(expr, { operator: '+' }) && !t.isLiteral(expr) && name.name === 'style') {
        exprPath.replaceWith(
          t.callExpression(t.identifier(INTERNAL_INLINE_STYLE), [expr])
        )
      }

      if (name.name.startsWith('on')) {
        if (exprPath.isReferencedIdentifier()) {
          const ids = [expr.name]
          const fullPath = buildFullPathThisPropsRef(expr, ids, path)
          if (fullPath) {
            exprPath.replaceWith(fullPath)
          }
        }

        if (exprPath.isReferencedMemberExpression()) {
          const id = findFirstIdentifierFromMemberExpression(expr)
          const ids = getIdsFromMemberProps(expr)
          if (t.isIdentifier(id)) {
            const fullPath = buildFullPathThisPropsRef(id, ids, path)
            if (fullPath) {
              exprPath.replaceWith(fullPath)
            }
          }
        }

        // @TODO: bind 的处理待定
      }
    },
    ImportDeclaration (path) {
      const source = path.node.source.value
      const names: string[] = []
      if (source === TARO_PACKAGE_NAME) {
        path.node.specifiers.push(
          t.importSpecifier(t.identifier(INTERNAL_SAFE_GET), t.identifier(INTERNAL_SAFE_GET)),
          t.importSpecifier(t.identifier(INTERNAL_DYNAMIC), t.identifier(INTERNAL_DYNAMIC)),
          t.importSpecifier(t.identifier(INTERNAL_INLINE_STYLE), t.identifier(INTERNAL_INLINE_STYLE))
        )
      }
      if (
        source === REDUX_PACKAGE_NAME
      ) {
        path.node.specifiers.forEach((s, index, specs) => {
          if (s.local.name === 'Provider') {
            specs.splice(index, 1)
            specs.push(
              t.importSpecifier(t.identifier('setStore'), t.identifier('setStore'))
            )
          }
        })
      }
      path.traverse({
        ImportDefaultSpecifier (path) {
          const name = path.node.local.name
          DEFAULT_Component_SET.has(name) || names.push(name)
        },
        ImportSpecifier (path) {
          const name = path.node.imported.name
          DEFAULT_Component_SET.has(name) || names.push(name)
          if (source === TARO_PACKAGE_NAME && name === 'Component') {
            path.node.local = t.identifier('BaseComponent')
          }
        }
      })
      componentSourceMap.set(source, names)
    }
  })
  const storeBinding = mainClass.scope.getBinding(storeName)
  mainClass.scope.rename('Component', 'BaseComponent')
  if (storeBinding) {
    const statementPath = storeBinding.path.getStatementParent()
    if (statementPath) {
      ast.program.body.forEach((node, index, body) => {
        if (node === statementPath.node) {
          body.splice(index + 1, 0, t.expressionStatement(
            t.callExpression(t.identifier('setStore'), [
              t.identifier(storeName)
            ])
          ))
        }
      })
    }
  }
  if (options.isApp) {
    renderMethod.remove()
    return { ast } as TransformResult
  }
  result = new Transformer(mainClass, options.sourcePath).result
  result.code = generate(ast).code
  result.ast = ast
  // if (process.env.NODE_ENV !== 'test') {
  //   result.template = prettyPrint(result.template)
  // }
  result.template = prettyPrint(result.template)
  result.imageSrcs = Array.from(imageSource)
  return result
}
