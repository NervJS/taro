import traverse, { Binding, NodePath } from 'babel-traverse'
import generate from 'babel-generator'
import { prettyPrint } from 'html'
import { transform as parse } from 'babel-core'
import * as ts from 'typescript'
import { Transformer } from './class'
import {
  setting,
  findFirstIdentifierFromMemberExpression,
  isContainJSXElement,
  codeFrameError,
  isArrayMapCallExpression,
  replaceJSXTextWithTextComponent,
  getSuperClassCode
} from './utils'
import * as t from 'babel-types'
import {
  DEFAULT_Component_SET,
  INTERNAL_SAFE_GET,
  TARO_PACKAGE_NAME,
  REDUX_PACKAGE_NAME,
  MOBX_PACKAGE_NAME,
  IMAGE_COMPONENTS,
  INTERNAL_INLINE_STYLE,
  THIRD_PARTY_COMPONENTS,
  INTERNAL_GET_ORIGNAL,
  setLoopOriginal,
  GEL_ELEMENT_BY_ID,
  lessThanSignPlacehold,
  COMPONENTS_PACKAGE_NAME,
  quickappComponentName,
  setFnPrefix,
  setLoopCallee,
  setLoopState,
  PROPS_MANAGER,
  GEN_COMP_ID,
  GEN_LOOP_COMPID,
  CONTEXT_PROVIDER
} from './constant'
import { Adapters, setAdapter, Adapter } from './adapter'
import { Options, setTransformOptions, buildBabelTransformOptions } from './options'
import { get as safeGet, cloneDeep, snakeCase } from 'lodash'
import { isTestEnv } from './env'

const template = require('babel-template')

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

  /**
   * TS 编译器会把 class property 移到构造器，
   * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
   * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
   * 如果有 config 就给他还原
   */
function resetTSClassProperty (body: (t.ClassMethod | t.ClassProperty)[]) {
  for (const method of body) {
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      if (t.isBlockStatement(method.body)) {
        method.body.body = method.body.body.filter(statement => {
          if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
            const expr = statement.expression
            const { left, right } = expr
            if (
              t.isMemberExpression(left) &&
              t.isThisExpression(left.object) &&
              t.isIdentifier(left.property)
            ) {
              if (
                (t.isArrowFunctionExpression(right) || t.isFunctionExpression(right))
                ||
                (left.property.name === 'config' && t.isObjectExpression(right))
              ) {
                const classProp = t.classProperty(left.property, right)
                body.push(classProp)
                handleThirdPartyComponent(classProp)
                return false
              }
            }
          }
          return true
        })
      }
    }
  }
}

function handleClosureJSXFunc (jsx: NodePath<t.JSXElement>, mainClass: NodePath<t.ClassDeclaration>) {
  // 在 ./functional.ts 会把 FunctionExpression 转化为 arrowFunctionExpr
  // 所以我们这里只处理一种情况
  const arrowFunc = jsx.findParent(p => p.isArrowFunctionExpression())
  if (arrowFunc && arrowFunc.isArrowFunctionExpression()) {
    const parentPath = arrowFunc.parentPath
    if (parentPath.isVariableDeclarator()) {
      const id = parentPath.node.id
      if (t.isIdentifier(id) && /^render[A-Z]/.test(id.name)) {
        const funcName = `renderClosure${id.name.slice(6, id.name.length)}`
        mainClass.node.body.body.push(
          t.classProperty(
            t.identifier(funcName),
            cloneDeep(arrowFunc.node)
          )
        )
        parentPath.scope.rename(id.name, funcName)
        arrowFunc.replaceWith(t.memberExpression(
          t.thisExpression(),
          t.identifier(funcName)
        ))
      }
    }
  }
}

function findDeclarationScope (path: NodePath<t.Node>, id: t.Identifier) {
  const scopePath = path.findParent(p => !!p.scope.getOwnBindingIdentifier(id.name))
  if (scopePath) {
    return scopePath
  }
  throw codeFrameError(path.node, '该引用从未被定义')
}

function buildFullPathThisPropsRef (id: t.Identifier, memberIds: string[], path: NodePath<t.Node>) {
  const scopePath = findDeclarationScope(path, id)
  const binding = scopePath.scope.getOwnBinding(id.name)
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

function handleThirdPartyComponent (expr: t.ClassMethod | t.ClassProperty) {
  if (t.isClassProperty(expr) && expr.key.name === 'config' && t.isObjectExpression(expr.value)) {
    const properties = expr.value.properties
    for (const prop of properties) {
      if (
        t.isObjectProperty(prop) &&
        (t.isIdentifier(prop.key, { name: 'usingComponents' }) || t.isStringLiteral(prop.key, { value: 'usingComponents' })) &&
        t.isObjectExpression(prop.value)
      ) {
        for (const value of prop.value.properties) {
          if (t.isObjectProperty(value)) {
            if (t.isStringLiteral(value.key)) {
              THIRD_PARTY_COMPONENTS.add(value.key.value)
            }
            if (t.isIdentifier(value.key)) {
              THIRD_PARTY_COMPONENTS.add(value.key.name)
            }
          }
        }
      }
    }
  }
}

export interface Result {
  template: string
  components: {
    name: string,
    path: string,
    type: string
  }[],
  componentProperies: string[]
}

interface TransformResult extends Result {
  code: string,
  ast: t.File
}

export default function transform (options: Options): TransformResult {
  if (options.adapter) {
    setAdapter(options.adapter)
    if (Adapter.type === Adapters.quickapp) {
      DEFAULT_Component_SET.clear()
      DEFAULT_Component_SET.add('div')
      DEFAULT_Component_SET.add('Text')
      setFnPrefix('prv-fn-')
    }
  }
  if (Adapter.type === Adapters.swan || Adapter.type === Adapters.quickapp) {
    setLoopOriginal('privateOriginal')
    setLoopCallee('anonymousCallee_')
    setLoopState('loopState')
  }
  THIRD_PARTY_COMPONENTS.clear()
  const code = options.isTyped
    ? ts.transpile(options.code, {
      jsx: options.sourcePath.endsWith('.tsx') ? ts.JsxEmit.Preserve : ts.JsxEmit.None,
      target: ts.ScriptTarget.ESNext,
      importHelpers: true,
      noEmitHelpers: true
    })
    : options.code
  options.env = Object.assign({ 'process.env.TARO_ENV': options.adapter || 'weapp' }, options.env || {})
  setTransformOptions(options)
  setting.sourceCode = code
  let hasReduxBinding = false
  // babel-traverse 无法生成 Hub
  // 导致 Path#getSource|buildCodeFrameError 都无法直接使用
  // 原因大概是 babylon.parse 没有生成 File 实例导致 scope 和 path 原型上都没有 `file`
  // 将来升级到 babel@7 可以直接用 parse 而不是 transform
  const ast = parse(code, buildBabelTransformOptions()).ast as t.File
  if (options.isNormal) {
    if (options.isTyped) {
      const mainClassNode = ast.program.body.find(v => {
        return t.isClassDeclaration(v)
      }) as t.ClassDeclaration | undefined
      if (mainClassNode) {
        resetTSClassProperty(mainClassNode.body.body)
      }
    }
    return { ast } as any
  }
  // transformFromAst(ast, code)
  let result
  const componentSourceMap = new Map<string, string[]>()
  const imageSource = new Set<string>()
  const importSources = new Set<string>()
  let componentProperies: string[] = []
  let mainClass!: NodePath<t.ClassDeclaration>
  let storeName!: string
  let renderMethod!: NodePath<t.ClassMethod>
  let isImportTaro = false
  traverse(ast, {
    Program: {
      exit (path: NodePath<t.Program>) {
        for (const stem of path.node.body) {
          if (t.isImportDeclaration(stem)) {
            if (stem.source.value === TARO_PACKAGE_NAME) {
              const specs = stem.specifiers
              if (specs.some(s => t.isImportDefaultSpecifier(s) && s.local.name === 'Taro')) {
                continue
              }
              specs.unshift(t.importDefaultSpecifier(t.identifier('Taro')))
            }
          }
        }
      }
    },
    JSXText (path) {
      if (Adapter.type !== Adapters.quickapp) {
        return
      }
      const value = path.node.value
      if (!value.trim()) {
        return
      }

      replaceJSXTextWithTextComponent(path)
    },
    TemplateLiteral (path) {
      const nodes: t.Expression[] = []
      const { quasis, expressions } = path.node
      let index = 0
      if (path.parentPath.isTaggedTemplateExpression()) {
        return
      }
      for (const elem of quasis) {
        if (elem.value.cooked) {
          nodes.push(t.stringLiteral(elem.value.cooked))
        }

        if (index < expressions.length) {
          const expr = expressions[index++]
          if (!t.isStringLiteral(expr, { value: '' })) {
            nodes.push(expr)
          }
        }
      }

      // + 号连接符必须保证第一和第二个 node 都是字符串
      if (!t.isStringLiteral(nodes[0]) && !t.isStringLiteral(nodes[1])) {
        nodes.unshift(t.stringLiteral(''))
      }

      let root = nodes[0]
      for (let i = 1; i < nodes.length; i++) {
        root = t.binaryExpression('+', root, nodes[i])
      }
      path.replaceWith(root)
    },
    ClassDeclaration (path) {
      mainClass = path
      const superClass = getSuperClassCode(path)
      if (superClass) {
        try {
          componentProperies = transform({
            isRoot: false,
            isApp: false,
            code: superClass.code,
            isTyped: true,
            sourcePath: superClass.sourcePath,
            outputPath: superClass.sourcePath,
            sourceDir: options.sourceDir
          }).componentProperies
        } catch (error) {
          //
        }
      }
    },
    ClassExpression (path) {
      mainClass = path as any
    },
    ClassMethod (path) {
      if (t.isIdentifier(path.node.key) && path.node.key.name === 'render') {
        renderMethod = path
      }
    },
    IfStatement (path) {
      const consequent = path.get('consequent')
      if (!consequent.isBlockStatement()) {
        consequent.replaceWith(
          t.blockStatement([
            consequent.node as any
          ])
        )
      }
    },
    CallExpression (path) {
      const callee = path.get('callee')
      if (isContainJSXElement(path)) {
        return
      }
      if (callee.isReferencedMemberExpression()) {
        const id = findFirstIdentifierFromMemberExpression(callee.node)
        const property = callee.node.property
        if (t.isIdentifier(property) && property.name.startsWith('on')) {
          const funcExpr = path.findParent(p => p.isFunctionExpression())
          if (funcExpr && funcExpr.isFunctionExpression()) {
            const taroAPI = funcExpr.findParent(p => p.isCallExpression() && t.isMemberExpression(p.node.callee) && t.isIdentifier(p.node.callee.object, { name: 'Taro' }))
            if (taroAPI && taroAPI.isCallExpression()) {
              throw codeFrameError(funcExpr.node, '在回调函数使用从 props 传递的函数时，请把回调函数改造为箭头函数并一直使用 `this` 取值')
            }
          }
        }
        const calleeIds = getIdsFromMemberProps(callee.node)
        if (t.isIdentifier(id) && id.name.startsWith('on') && Adapters.alipay !== Adapter.type) {
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
        if (t.isIdentifier(id) && id.name.startsWith('on')) {
          const funcExpr = path.findParent(p => p.isFunctionExpression())
          if (funcExpr && funcExpr.isFunctionExpression()) {
            const taroAPI = funcExpr.findParent(p => p.isCallExpression() && t.isMemberExpression(p.node.callee) && t.isIdentifier(p.node.callee.object, { name: 'Taro' }))
            if (taroAPI && taroAPI.isCallExpression()) {
              throw codeFrameError(funcExpr.node, '在回调函数使用从 props 传递的函数时，请把回调函数改造为箭头函数并一直使用 `this` 取值')
            }
          }
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
    JSXMemberExpression (path) {
      const { property, object } = path.node
      if (!t.isJSXIdentifier(property, { name: 'Provider' })) {
        throw codeFrameError(property, '只能在使用 Context.Provider 的情况下才能使用 JSX 成员表达式')
      }
      if (!t.isJSXIdentifier(object)) {
        return
      }
      const jsx = path.parentPath.parentPath
      if (jsx.isJSXElement()) {
        const componentName = `${object.name}${CONTEXT_PROVIDER}`
        jsx.node.openingElement.name = t.jSXIdentifier(componentName)
        if (jsx.node.closingElement) {
          jsx.node.closingElement.name = t.jSXIdentifier(componentName)
        }
      }
    },
    JSXElement (path) {
      const assignment = path.findParent(p => p.isAssignmentExpression())
      if (assignment && assignment.isAssignmentExpression() && !options.isTyped) {
        const left = assignment.node.left
        if (t.isIdentifier(left)) {
          const binding = assignment.scope.getBinding(left.name)
          if (binding && binding.scope === assignment.scope) {
            if (binding.path.isVariableDeclarator()) {
              binding.path.node.init = path.node
              assignment.remove()
            } else {
              throw codeFrameError(path.node, '同一个作用域的JSX 变量延时赋值没有意义。详见：https://github.com/NervJS/taro/issues/550')
            }
          }
        }
      }

      const switchStatement = path.findParent(p => p.isSwitchStatement())
      if (switchStatement && switchStatement.isSwitchStatement()) {
        const { discriminant, cases } = switchStatement.node
        const ifStatement = cases.map((Case, index) => {
          const [ consequent ] = Case.consequent
          if (!t.isBlockStatement(consequent)) {
            throw codeFrameError(switchStatement.node, '含有 JSX 的 switch case 语句必须每种情况都用花括号 `{}` 包裹结果')
          }
          const block = t.blockStatement(consequent.body.filter(b => !t.isBreakStatement(b)))
          if (index !== cases.length - 1 && t.isNullLiteral(Case.test)) {
            throw codeFrameError(Case, '含有 JSX 的 switch case 语句只有最后一个 case 才能是 default')
          }
          // tslint:disable-next-line: strict-type-predicates
          const test = Case.test === null ? t.nullLiteral() : t.binaryExpression('===', discriminant, Case.test)
          return { block, test }
        }).reduceRight((ifStatement, item) => {
          if (t.isNullLiteral(item.test)) {
            ifStatement.alternate = item.block
            return ifStatement
          }
          const newStatement = t.ifStatement(
            item.test,
            item.block,
            t.isBooleanLiteral(ifStatement.test, { value: false })
              ? ifStatement.alternate
              : ifStatement
          )
          return newStatement
        }, t.ifStatement(t.booleanLiteral(false), t.blockStatement([])))

        switchStatement.insertAfter(ifStatement)
        switchStatement.remove()
      }
      const isForStatement = (p) => p && (p.isForStatement() || p.isForInStatement() || p.isForOfStatement())

      const forStatement = path.findParent(isForStatement)
      if (isForStatement(forStatement)) {
        throw codeFrameError(forStatement.node, '不行使用 for 循环操作 JSX 元素，详情：https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/manipulate-jsx-as-array.md')
      }

      const loopCallExpr = path.findParent(p => isArrayMapCallExpression(p))
      if (loopCallExpr && loopCallExpr.isCallExpression()) {
        const [ func ] = loopCallExpr.node.arguments
        if (t.isArrowFunctionExpression(func) && !t.isBlockStatement(func.body)) {
          func.body = t.blockStatement([
            t.returnStatement(func.body)
          ])
        }
      }
      handleClosureJSXFunc(path, mainClass)
    },
    JSXOpeningElement (path) {
      const { name } = path.node.name as t.JSXIdentifier
      const binding = path.scope.getBinding(name)
      if (process.env.NODE_ENV !== 'test' && DEFAULT_Component_SET.has(name) && binding && binding.kind === 'module') {
        const bindingPath = binding.path
        if (bindingPath.parentPath.isImportDeclaration()) {
          const source = bindingPath.parentPath.node.source
          if (source.value !== COMPONENTS_PACKAGE_NAME) {
            throw codeFrameError(bindingPath.parentPath.node, `内置组件名: '${name}' 只能从 ${COMPONENTS_PACKAGE_NAME} 引入。`)
          }
        }
      }
      if (Adapter.type === Adapters.quickapp) {
        if (name === 'View') {
          path.node.name = t.jSXIdentifier('div')
        }
        if (name === 'Block') {
          path.node.name = t.jSXIdentifier('block')
        }
      }

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

      if (options.jsxAttributeNameReplace) {
        for (const r in options.jsxAttributeNameReplace) {
          if (options.jsxAttributeNameReplace.hasOwnProperty(r)) {
            const element = options.jsxAttributeNameReplace[r]
            if (t.isJSXIdentifier(name, { name: r })) {
              path.node.name = t.jSXIdentifier(element)
            }
          }
        }
      }

      // tslint:disable-next-line: strict-type-predicates
      if (!t.isJSXIdentifier(name) || value === null || t.isStringLiteral(value) || t.isJSXElement(value)) {
        return
      }

      const expr = value.expression as any
      const exprPath = path.get('value.expression')
      const classDecl = path.findParent(p => p.isClassDeclaration())
      const classDeclName = classDecl && classDecl.isClassDeclaration() && safeGet(classDecl, 'node.id.name', '')
      let isConverted = false
      if (classDeclName) {
        isConverted = classDeclName === '_C' || classDeclName.endsWith('Tmpl')
      }
      if (!t.isBinaryExpression(expr, { operator: '+' }) && !t.isLiteral(expr) && name.name === 'style' && !isConverted) {
        const jsxID = path.findParent(p => p.isJSXOpeningElement()).get('name')
        if (jsxID && jsxID.isJSXIdentifier() && DEFAULT_Component_SET.has(jsxID.node.name)) {
          exprPath.replaceWith(
            t.callExpression(t.identifier(INTERNAL_INLINE_STYLE), [expr])
          )
        }
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
    ClassProperty (path) {
      if (Adapter.type !== Adapters.quickapp) {
        return
      }
      if (path.node.key.name === 'defaultProps' && t.isObjectExpression(path.node.value)) {
        const props = path.node.value.properties
        for (const prop of props) {
          if (t.isObjectProperty(prop)) {
            if (t.isStringLiteral(prop.key) && /[A-Z]/.test(prop.key.value) && !prop.key.value.startsWith('on')) {
              prop.key = t.stringLiteral(snakeCase(prop.key.value))
            }
            if (t.isIdentifier(prop.key) && /[A-Z]/.test(prop.key.name) && !prop.key.name.startsWith('on')) {
              prop.key = t.identifier(snakeCase(prop.key.name))
            }
          }
        }
      }
    },
    AssignmentExpression (path) {
      if (Adapter.type !== Adapters.quickapp) {
        return
      }
      const { left, right } = path.node
      if (t.isMemberExpression(left) && t.isIdentifier(left.property, { name: 'defaultProps' }) && t.isObjectExpression(right)) {
        const props = right.properties
        for (const prop of props) {
          if (t.isObjectProperty(prop)) {
            if (t.isStringLiteral(prop.key) && /[A-Z]/.test(prop.key.value) && !prop.key.value.startsWith('on')) {
              prop.key = t.stringLiteral(snakeCase(prop.key.value))
            }
            if (t.isIdentifier(prop.key) && /[A-Z]/.test(prop.key.name) && !prop.key.name.startsWith('on')) {
              prop.key = t.identifier(snakeCase(prop.key.name))
            }
          }
        }
      }
    },
    ImportDeclaration (path) {
      const source = path.node.source.value
      if (importSources.has(source)) {
        throw codeFrameError(path.node, '无法在同一文件重复 import 相同的包。')
      } else {
        importSources.add(source)
      }
      const names: string[] = []
      if (source === COMPONENTS_PACKAGE_NAME && Adapters.quickapp === Adapter.type) {
        path.node.specifiers.forEach((s) => {
          if (t.isImportSpecifier(s)) {
            const originalName = s.imported.name
            if (quickappComponentName.has(originalName)) {
              const importedName = `Taro${originalName}`
              s.imported.name = importedName
              s.local.name = importedName
            }
          }
        })
      }
      if (source === TARO_PACKAGE_NAME) {
        isImportTaro = true
        path.node.specifiers.push(
          t.importSpecifier(t.identifier(INTERNAL_SAFE_GET), t.identifier(INTERNAL_SAFE_GET)),
          t.importSpecifier(t.identifier(INTERNAL_GET_ORIGNAL), t.identifier(INTERNAL_GET_ORIGNAL)),
          t.importSpecifier(t.identifier(INTERNAL_INLINE_STYLE), t.identifier(INTERNAL_INLINE_STYLE)),
          t.importSpecifier(t.identifier(GEL_ELEMENT_BY_ID), t.identifier(GEL_ELEMENT_BY_ID)),
          t.importSpecifier(t.identifier(GEN_COMP_ID), t.identifier(GEN_COMP_ID)),
          t.importSpecifier(t.identifier(GEN_LOOP_COMPID), t.identifier(GEN_LOOP_COMPID))
        )
        if (Adapter.type !== Adapters.alipay) {
          path.node.specifiers.push(
            t.importSpecifier(t.identifier(PROPS_MANAGER), t.identifier(PROPS_MANAGER))
          )
        }
      }
      if (
        source === REDUX_PACKAGE_NAME || source === MOBX_PACKAGE_NAME
      ) {
        path.node.specifiers.forEach((s, index, specs) => {
          if (s.local.name === 'Provider') {
            specs.splice(index, 1)
            specs.push(
              t.importSpecifier(t.identifier('setStore'), t.identifier('setStore'))
            )
            if (source === REDUX_PACKAGE_NAME) {
              hasReduxBinding = true
              specs.push(
                t.importSpecifier(t.identifier('ReduxContext'), t.identifier('ReduxContext'))
              )
            }
          }
        })
      }
      path.traverse({
        ImportDefaultSpecifier (path) {
          const name = path.node.local.name
          names.push(name)
        },
        ImportSpecifier (path) {
          const name = path.node.imported.name
          names.push(name)
          if (source === TARO_PACKAGE_NAME && name === 'Component') {
            path.node.local = t.identifier('__BaseComponent')
          }
        }
      })
      componentSourceMap.set(source, names)
    }
  })

  if (!isImportTaro) {
    const specifiers = [
      t.importDefaultSpecifier(t.identifier('Taro')),
      t.importSpecifier(t.identifier(INTERNAL_SAFE_GET), t.identifier(INTERNAL_SAFE_GET)),
      t.importSpecifier(t.identifier(INTERNAL_GET_ORIGNAL), t.identifier(INTERNAL_GET_ORIGNAL)),
      t.importSpecifier(t.identifier(INTERNAL_INLINE_STYLE), t.identifier(INTERNAL_INLINE_STYLE)),
      t.importSpecifier(t.identifier(GEL_ELEMENT_BY_ID), t.identifier(GEL_ELEMENT_BY_ID)),
      t.importSpecifier(t.identifier(GEN_COMP_ID), t.identifier(GEN_COMP_ID)),
      t.importSpecifier(t.identifier(GEN_LOOP_COMPID), t.identifier(GEN_LOOP_COMPID))
    ]
    if (Adapter.type !== Adapters.alipay) {
      specifiers.push(t.importSpecifier(t.identifier(PROPS_MANAGER), t.identifier(PROPS_MANAGER)))
    }
    ast.program.body.unshift(
      t.importDeclaration(specifiers, t.stringLiteral('@tarojs/taro'))
    )
  }

  if (!mainClass) {
    throw new Error('未找到 Taro.Component 的类定义')
  }

  if (Adapter.type === Adapters.alipay) {
    const body = ast.program.body
    for (const i in body) {
      if (t.isImportDeclaration(body[i]) && !t.isImportDeclaration(body[Number(i) + 1])) {
        body.splice(Number(i) + 1, 0, t.variableDeclaration(
          'const',
          [t.variableDeclarator(
            t.identifier('propsManager'),
            t.memberExpression(
              t.identifier('my'),
              t.identifier('propsManager')
            )
          )]
        ))
        break
      }
    }
  }

  mainClass.node.body.body.forEach(handleThirdPartyComponent)
  const storeBinding = mainClass.scope.getBinding(storeName)
  mainClass.scope.rename('Component', '__BaseComponent')
  if (storeBinding) {
    const statementPath = storeBinding.path.getStatementParent()
    if (statementPath) {
      ast.program.body.every((node, index, body) => {
        if (node === statementPath.node) {
          const settingReduxProvider = t.expressionStatement(
            t.callExpression(t.memberExpression(t.identifier('ReduxContext'), t.identifier('Provider')), [
              t.objectExpression([
                t.objectProperty(t.identifier('store'), t.identifier(storeName))
              ])
            ])
          )
          const ifStem = t.ifStatement(t.memberExpression(t.identifier('ReduxContext'), t.identifier('Provider')), t.blockStatement([
            settingReduxProvider,
            settingReduxProvider // 第一次调用初始化，第二次赋值
          ]))
          body.splice(index + 1, 0, t.expressionStatement(
            t.callExpression(t.identifier('setStore'), [
              t.identifier(storeName)
            ])
          ), hasReduxBinding ? ifStem : t.emptyStatement())
          return false
        }
        return true
      })
    }
  }
  resetTSClassProperty(mainClass.node.body.body)
  if (options.isApp) {
    renderMethod.replaceWith(
      t.classMethod('method', t.identifier('_createData'), [], t.blockStatement([]))
    )
    return { ast } as TransformResult
  }
  result = new Transformer(mainClass, options.sourcePath, componentProperies, options.sourceDir!).result
  result.code = generate(ast).code
  result.ast = ast
  const lessThanSignReg = new RegExp(lessThanSignPlacehold, 'g')
  result.compressedTemplate = result.template.replace(lessThanSignReg, '<')
  result.template = prettyPrint(result.template, {
    max_char: 0,
    unformatted: isTestEnv ? [] : ['text']
  })
  result.template = result.template.replace(lessThanSignReg, '<')
  result.imageSrcs = Array.from(imageSource)
  return result
}
