import traverse, { Binding, NodePath } from 'babel-traverse'
import generate from 'babel-generator'
import { Transformer } from './class'
import { prettyPrint } from 'html'
import { setting } from './utils'
import * as t from 'babel-types'
import { DEFAULT_Component_SET, INTERNAL_SAFE_GET, TARO_PACKAGE_NAME, ASYNC_PACKAGE_NAME, REDUX_PACKAGE_NAME, INTERNAL_DYNAMIC, IMAGE_COMPONENTS } from './constant'
import { transform as parse } from 'babel-core'
import { transform as babel7Transform } from '@babel/core'

export interface Options {
  isRoot: boolean,
  isApp: boolean,
  path: string,
  code: string,
  isTyped: boolean,
  isNormal?: boolean
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
    ? babel7Transform(options.code, {
      parserOpts: {
        sourceType: 'module',
        plugins: [
          'typescript',
          'classProperties',
          'jsx',
          'trailingFunctionCommas',
          'asyncFunctions',
          'exponentiationOperator',
          'asyncGenerators',
          'objectRestSpread',
          'decorators'
        ] as any[]
      }
    }).code
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
    ClassMethod (path) {
      if (t.isIdentifier(path.node.key) && path.node.key.name === 'render') {
        renderMethod = path
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
    ImportDeclaration (path) {
      const source = path.node.source.value
      const names: string[] = []
      if (source === TARO_PACKAGE_NAME) {
        path.node.specifiers.push(
          t.importSpecifier(t.identifier(INTERNAL_SAFE_GET), t.identifier(INTERNAL_SAFE_GET)),
          t.importSpecifier(t.identifier(INTERNAL_DYNAMIC), t.identifier(INTERNAL_DYNAMIC))
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
          const name = path.node.local.name
          DEFAULT_Component_SET.has(name) || names.push(name)
        }
      })
      componentSourceMap.set(source, names)
    }
  })
  const storeBinding = mainClass.scope.getBinding(storeName)
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
  result = new Transformer(mainClass, options.isRoot, componentSourceMap, options.path).result
  result.code = generate(ast).code
  result.ast = ast
  // if (process.env.NODE_ENV !== 'test') {
  //   result.template = prettyPrint(result.template)
  // }
  result.template = prettyPrint(result.template)
  result.imageSrcs = Array.from(imageSource)
  return result
}
