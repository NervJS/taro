import { types as Types, PluginObj } from 'babel-core';

const plugin = function (babel: {
  types: typeof Types;
}): PluginObj {
  const t = babel.types

  // 这些变量需要在每个programe里重置
  let taroName: string = ''
  let needDefault = false
  const invokedApis: Map<string, string> = new Map()

  return {
    name: 'babel-plugin-transform-taro-api',
    visitor: {
      ImportDeclaration (ast, state) {
        const apis = state.opts.apis
        const packageName = state.opts.packageName
        if (ast.node.source.value !== packageName) return

        taroName = 'Taro'
        ast.node.specifiers.forEach(node => {
          if (t.isImportDefaultSpecifier(node)) {
            taroName = node.local.name
          } else if (t.isImportSpecifier(node)) {
            const propertyName = node.imported.name
            if (apis.has(propertyName)) { // 记录api名字
              ast.scope.rename(node.local.name)
              invokedApis.set(propertyName, node.local.name)
            } else { // 如果是未实现的api 改成Taro.xxx
              const binding = ast.scope.getBinding(propertyName)!
              binding.referencePaths.forEach(reference => {
                reference.replaceWith(
                  t.memberExpression(
                    t.identifier(taroName),
                    t.identifier(propertyName)
                  )
                )
              })
            }
          }
        })
      },
      MemberExpression (ast, state) {
        const apis = state.opts.apis
        const isTaro = t.isIdentifier(ast.node.object, { name: taroName })
        const property = ast.node.property
        let propertyName: string | null = null
        let propName = 'name'

        if (!isTaro) return

        // 兼容一下 Taro['xxx']
        if (t.isStringLiteral(property)) {
          propName = 'value'
        }
        propertyName = property[propName]

        if (!propertyName) return

        // 同一api使用多次, 读取变量名
        if (apis.has(propertyName)) {
          let identifier: Types.Identifier
          if (invokedApis.has(propertyName)) {
            identifier = t.identifier(invokedApis.get(propertyName)!)
          } else {
            const newPropertyName = ast.scope.generateUid(propertyName)
            invokedApis.set(propertyName, newPropertyName)
            /* 未绑定作用域 */
            identifier = t.identifier(newPropertyName)
          }
          ast.replaceWith(identifier)
        } else {
          needDefault = true
        }
      },
      Program: {
        enter (ast, state) {
          taroName = ''
          needDefault = false
          invokedApis.clear()
        },
        exit (ast, state) {
          // 防止重复引入
          let isTaroApiImported = false

          ast.traverse({
            ImportDeclaration (ast) {
              const packageName = state.opts.packageName
              const isImportingTaroApi = ast.node.source.value === packageName
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
            }
          })
        }
      }
    }
  }
}
export default plugin
