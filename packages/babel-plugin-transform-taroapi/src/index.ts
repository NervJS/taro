import { isMatchWith, setWith } from 'lodash'

import type * as BabelCore from '@babel/core'

interface IState extends BabelCore.PluginPass {
  apis: Set<string>
  bindingName: string
  packageName: string
  canIUse: string
  definition: Record<string, any>
}

const plugin = function (babel: typeof BabelCore): BabelCore.PluginObj<IState> {
  const t = babel.types

  // 默认属性映射：将驼峰命名转换为 kebab-case（仅 H5 平台使用）
  const DEFAULT_ATTRIBUTE_MAP: Record<string, string> = {
    ariaRole: 'role',
    ariaLabel: 'aria-label',
    ariaHidden: 'aria-hidden',
    ariaChecked: 'aria-checked',
    ariaSelected: 'aria-selected',
    ariaRoledescription: 'aria-roledescription',
    ariaValuemax: 'aria-valuemax',
    ariaValuemin: 'aria-valuemin',
    ariaValuenow: 'aria-valuenow',
    ariaValuetext: 'aria-valuetext',
  }

  function stripTSCast (node: any): any {
    while (
      t.isTSAsExpression(node) ||
      t.isTSTypeAssertion(node) ||
      t.isTSNonNullExpression(node) ||
      (t.isTSSatisfiesExpression && t.isTSSatisfiesExpression(node))
    ) {
      node = node.expression
    }
    return node
  }

  function getTaroNamespaceCall (
    t: typeof BabelCore.types,
    callee: BabelCore.types.Expression,
    taroName: string,
    file?: BabelCore.BabelFile | null
  ): { namespaceName: string, methodName: string } | null {
    let target: any = callee

    // 如果是可选调用（例如 Taro.JDMTA.isTrafficMapEnable?.()），先取里面的 callee
    if (t.isOptionalCallExpression(target)) {
      target = target.callee
    }

    // 去掉 TS 断言 / 非空等包裹
    target = stripTSCast(target)

    if (!t.isMemberExpression(target) && !t.isOptionalMemberExpression(target)) {
      return null
    }

    // target.object 通常是 Taro.xx 这一层，
    // 也可能是形如 (_tmp = Taro.xx) 这样的赋值表达式，需要再解一层。
    let inner: any = stripTSCast(target.object)
    // 兼容 222 这类形态：(_tmp = Taro.JDMTA).isTrafficMapEnable?.()
    if (t.isAssignmentExpression(inner)) {
      inner = stripTSCast(inner.right)
    }

    if (!t.isMemberExpression(inner) && !t.isOptionalMemberExpression(inner)) {
      return null
    }

    if (!t.isIdentifier(inner.object, { name: taroName })) {
      return null
    }

    let namespaceName: string | null = null
    if (t.isIdentifier(inner.property)) {
      namespaceName = inner.property.name
    } else if (t.isStringLiteral(inner.property)) {
      namespaceName = inner.property.value
    }

    let methodName: string | null = null
    if (t.isIdentifier(target.property)) {
      methodName = target.property.name
    } else if (t.isStringLiteral(target.property)) {
      methodName = target.property.value
    }

    if (!namespaceName || !methodName) return null

    if (process.env.JDAPI_DEBUG_TAROAPI === 'true') {
      const filename = file?.opts?.filename || ''
      // eslint-disable-next-line no-console
      console.log(
        '[jdapi-core-taroapi] getTaroNamespaceCall hit:',
        `${namespaceName}_${methodName}`,
        'file =',
        filename
      )
    }

    return { namespaceName, methodName }
  }

  // 这些变量需要在每个 program 里重置
  const invokedApis: Map<string, string> = new Map()
  let taroName: string
  let needDefault: boolean

  let referTaro: any[]

  function canIUse (definition, scheme = '') {
    if (!scheme) return false
    const o = setWith({}, scheme, true, Object)
    return isMatchWith(definition, o, (a, b) => {
      if (a === '*' || b === true) return true
    })
  }

  function replaceCanIUse (ast: BabelCore.NodePath<BabelCore.types.CallExpression>, definition) {
    const args = ast.node.arguments

    if (args.length < 1) return

    // Note: 暂不考虑其他类型的参数映射
    if (t.isStringLiteral(args[0])) {
      const isSupported = canIUse(definition, args[0].value)
      ast.replaceInline(t.booleanLiteral(isSupported))
    }
  }

  return {
    name: 'babel-plugin-transform-taro-api',
    pre () {
      const { opts = {} as any } = this
      const { apis = new Set<string>(), bindingName = 'Taro', packageName = '@tarojs/taro-h5', definition = {} } = opts
      this.definition = {
        ...definition.apis,
        ...definition.components,
        [this.canIUse]: '*'
      }
      this.bindingName = bindingName
      this.packageName = packageName
      this.canIUse = 'canIUse'
      if (apis.size < 1) {
        apis.add(this.canIUse)
        Object.keys(definition.apis || {}).forEach(key => apis.add(key))
      }
      this.apis = apis
    },
    visitor: {
      ImportDeclaration (ast: BabelCore.NodePath<any>) {
        if (ast.node.source.value !== this.packageName) return

        ast.node.specifiers.forEach(node => {
          if (t.isImportDefaultSpecifier(node)) {
            needDefault = true
            taroName = node.local.name
          } else if (t.isImportSpecifier(node)) {
            const { imported } = node
            const propertyName = t.isIdentifier(imported) ? imported.name : imported.value
            if (this.apis.has(propertyName)) { // 记录 api 名字
              ast.scope.rename(node.local.name)
              invokedApis.set(propertyName, node.local.name)
            } else { // 如果是未实现的 api 改成 Taro.xxx
              needDefault = true
              const localName = node.local.name
              const binding = ast.scope.getBinding(localName)
              const idn = t.identifier(taroName)
              referTaro.push(idn)
              binding && binding.referencePaths.forEach(reference => {
                reference.replaceWith(
                  t.memberExpression(
                    idn,
                    t.identifier(propertyName)
                  ) as any
                )
              })
            }
          }
        })
      },
      'MemberExpression|OptionalMemberExpression' (ast: BabelCore.NodePath<any>) {
        const node = ast.node

        // 处理两层命名空间属性访问：Taro.xx.yy / Taro?.xx?.yy（非调用场景）
        // 调用场景由 CallExpression|OptionalCallExpression 负责
        const isCalleeOfCall = (t.isCallExpression(ast.parent) || t.isOptionalCallExpression(ast.parent)) && (ast.parent as any).callee === node
        if (!isCalleeOfCall) {
          const innerObj = stripTSCast(node.object)
          if (t.isMemberExpression(innerObj) || t.isOptionalMemberExpression(innerObj)) {
            const isTaroNamespace = t.isIdentifier(innerObj.object, { name: taroName })
            if (isTaroNamespace) {
              const namespaceName = t.isIdentifier(innerObj.property) ? innerObj.property.name : (t.isStringLiteral(innerObj.property) ? innerObj.property.value : null)
              const methodName = t.isIdentifier(node.property) ? node.property.name : (t.isStringLiteral(node.property) ? node.property.value : null)
              if (namespaceName && methodName) {
                const flatName = `${namespaceName}_${methodName}`
                if (this.apis.has(flatName)) {
                  let identifier: BabelCore.types.Identifier
                  if (invokedApis.has(flatName)) {
                    identifier = t.identifier(invokedApis.get(flatName)!)
                  } else {
                    const newName = ast.scope.generateUid(flatName)
                    invokedApis.set(flatName, newName)
                    identifier = t.identifier(newName)
                  }
                  ast.replaceWith(identifier as any)
                  return
                }
              }
            }
          }
        }

        /* 处理 Taro.xxx */
        const isTaro = t.isIdentifier(node.object, { name: taroName })
        const property = node.property
        let propertyName: string | null = null
        let propName = 'name'

        if (!isTaro) return

        // 兼容一下 Taro['xxx']
        if (t.isStringLiteral(property)) {
          propName = 'value'
        }
        propertyName = property[propName]

        if (!propertyName) return

        // 同一 api 使用多次，读取变量名
        if (this.apis.has(propertyName)) {
          const parentNode = ast.parent as BabelCore.types.AssignmentExpression
          const isAssignment = t.isAssignmentExpression(parentNode) && parentNode.left === node

          if (!isAssignment) {
            let identifier: BabelCore.types.Identifier
            if (invokedApis.has(propertyName)) {
              identifier = t.identifier(invokedApis.get(propertyName)!)
            } else {
              const newPropertyName = ast.scope.generateUid(propertyName)
              invokedApis.set(propertyName, newPropertyName)
              /* 未绑定作用域 */
              identifier = t.identifier(newPropertyName)
            }
            ast.replaceWith(identifier as any)
          }
        } else {
          needDefault = true
        }
      },
      'CallExpression|OptionalCallExpression' (ast: BabelCore.NodePath<any>) {
        const callee = ast.node.callee
        // 对存在命名空间的 API 支持 tree-shaking：Taro.xx.yy -> xx_yy
        // 同时兼容：可选链调用（Taro?.JDMTA.pv() / Taro.JDMTA?.pv()）、TS 类型断言（as any / ! / satisfies）
        const nsInfo = getTaroNamespaceCall(t, callee as any, taroName, this.file as any)
        if (nsInfo) {
          const { namespaceName, methodName } = nsInfo
          const flatName = `${namespaceName}_${methodName}`
          if (this.apis.has(flatName)) {
            let identifier: BabelCore.types.Identifier
            if (invokedApis.has(flatName)) {
              identifier = t.identifier(invokedApis.get(flatName)!)
            } else {
              const newName = ast.scope.generateUid(flatName)
              invokedApis.set(flatName, newName)
              identifier = t.identifier(newName)
            }
            // 如果当前是可选调用（OptionalCallExpression），直接将整条调用改写为普通函数调用，
            // 避免后续 preset-env 再对可选链做降级，导致重新依赖 Taro.JDMTA。
            if (t.isOptionalCallExpression(ast.node)) {
              ast.replaceWith(
                t.callExpression(
                  identifier,
                  ast.node.arguments as any
                )
              )
            } else {
              ast.node.callee = identifier as any
            }
            return
          }
        }

        if (!ast.scope.hasReference(this.canIUse)) return
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: taroName })) {
          let propertyName: string | null = null
          let propName = 'name'

          // 兼容一下 Taro['xxx']
          if (t.isStringLiteral(callee.property)) {
            propName = 'value'
          }
          propertyName = callee.property[propName]
          if (propertyName === this.canIUse) {
            // Taro.canIUse or Taro['canIUse']
            replaceCanIUse(ast, this.definition)
          }
        } else if (invokedApis.has(this.canIUse)) {
          const { name } = t.identifier(invokedApis.get(this.canIUse)!)
          const isCanIUse = t.isIdentifier(callee, { name })
          // canIUse as _canIUse
          if (isCanIUse) replaceCanIUse(ast, this.definition)
        }
      },
      JSXAttribute (ast: BabelCore.NodePath<any>) {
        // 仅在 H5 平台进行属性转换
        if (process.env.TARO_ENV !== 'h5') return

        const { name } = ast.node
        if (!t.isJSXIdentifier(name)) return

        // 使用默认属性映射进行转换
        if (DEFAULT_ATTRIBUTE_MAP[name.name]) {
          name.name = DEFAULT_ATTRIBUTE_MAP[name.name]
        }
      },
      Program: {
        enter (ast) {
          needDefault = false
          referTaro = []
          invokedApis.clear()

          taroName = ast.scope.getBinding(this.bindingName)
            ? ast.scope.generateUid(this.bindingName)
            : this.bindingName

          // 预扫描：在正式 visitor 遍历之前，先找到 import 确定 taroName，
          // 然后把所有 namespace API 的 OptionalCallExpression 降级为普通 CallExpression。
          // 这样可以抢在 @babel/plugin-transform-optional-chaining 展开可选链之前完成替换。
          const pkgName = this.packageName
          let preScanTaroName = ''
          ast.traverse({
            ImportDeclaration (importPath: BabelCore.NodePath<BabelCore.types.ImportDeclaration>) {
              if (importPath.node.source.value !== pkgName) return
              for (const spec of importPath.node.specifiers) {
                if (t.isImportDefaultSpecifier(spec)) {
                  preScanTaroName = spec.local.name
                  break
                }
              }
              importPath.stop()
            }
          })

          if (preScanTaroName) {
            const apis = this.apis
            const file = this.file as any
            ast.traverse({
              OptionalCallExpression (optPath: BabelCore.NodePath<BabelCore.types.OptionalCallExpression>) {
                const nsInfo = getTaroNamespaceCall(t, optPath.node.callee as any, preScanTaroName, file)
                if (nsInfo) {
                  const flatName = `${nsInfo.namespaceName}_${nsInfo.methodName}`
                  if (apis.has(flatName)) {
                    if (process.env.JDAPI_DEBUG_TAROAPI === 'true') {
                      const filename = file?.opts?.filename || ''
                      // eslint-disable-next-line no-console
                      console.log(
                        '[jdapi-core-taroapi] pre-transform: strip optional call for',
                        flatName,
                        'in file:',
                        filename,
                        'code =',
                        optPath.toString()
                      )
                    }
                    optPath.replaceWith(
                      t.callExpression(
                        optPath.node.callee as any,
                        optPath.node.arguments as any
                      )
                    )
                  }
                }
              }
            })
          }
        },
        exit (ast) {
          const that = this
          // 防止重复引入
          let isTaroApiImported = false
          referTaro.forEach(node => {
            node.name = taroName
          })

          ast.traverse({
            ImportDeclaration (ast) {
              const isImportingTaroApi = ast.node.source.value === that.packageName
              if (!isImportingTaroApi) return
              if (isTaroApiImported) return ast.remove()
              isTaroApiImported = true
              const namedImports = Array.from(invokedApis.entries()).map(([imported, local]) => t.importSpecifier(t.identifier(local), t.identifier(imported)))
              if (needDefault) {
                const defaultImport = t.importDefaultSpecifier(t.identifier(taroName))
                ast.node.specifiers = [
                  defaultImport,
                  ...namedImports
                ]
                needDefault = false
              } else {
                ast.node.specifiers = namedImports
              }
            },
            CallExpression (ast: BabelCore.NodePath<any>) {
              if (!invokedApis.has(that.canIUse)) return
              const callee = ast.node.callee
              const { name } = t.identifier(invokedApis.get(that.canIUse)!)
              const isCanIUse = t.isIdentifier(callee, { name })
              if (isCanIUse) {
                // canIUse as _use
                replaceCanIUse(ast, that.definition)
              }
            },
          })
        }
      }
    }
  }
}

export default plugin
