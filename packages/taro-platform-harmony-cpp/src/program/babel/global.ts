import { isLocalPath, parseLocalPath } from '../../utils'
import { PKG_NAME } from '../../utils/constant'
import { globalVarName, loadLibraryFunctionName, setLibraryFunctionName } from '../template/entry'

import type * as BabelCore from '@babel/core'

interface IPluginOption {
  chorePackagePrefix?: string
  projectId: string
  sourcePath: string
  fileName: string
  isGlobal?: boolean
  type?: string
}

export default function transformGlobalModePlugin ({
  chorePackagePrefix = '',
  isGlobal = true,
  projectId,
  sourcePath,
  fileName,
  type = ''
}: IPluginOption) {
  const importFunc = isGlobal ? `${globalVarName}.${loadLibraryFunctionName}` : loadLibraryFunctionName
  const exportFunc = isGlobal ? `${globalVarName}.${setLibraryFunctionName}` : setLibraryFunctionName
  const exportPaths: [boolean, ...string[]] = [isGlobal, projectId, fileName]
  chorePackagePrefix = chorePackagePrefix || `${PKG_NAME}/src/main/ets/npm`

  return ({ types: t }: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> => ({
    visitor: {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value

        if (path.node.importKind === 'type') {
          return path.remove()
        }

        const specifiers = createLoadSpecifiers(t, path, sourceValue, type)
        if (specifiers.length > 0) {
          path.replaceWithMultiple([
            t.variableDeclaration('const', specifiers),
          ])
        } else {
          // import 'xxx' => loadLibrary('xxx', '*')
          path.replaceWith(
            createImportExpression(t, path.node.source, '*')
          )
        }
      },
      ExportNamedDeclaration(path) {
        handleExport(t, path, exportPaths)
      },
      ExportDefaultDeclaration(path) {
        handleExport(t, path, exportPaths)
      },
      ExportAllDeclaration(path) {
        handleExport(t, path, exportPaths)
      },
      TSExportAssignment(path) {
        handleExport(t, path, exportPaths)
      },
      // Note: 忽略该情况，可能存在模块嵌套
      // AssignmentExpression(path) {
      //   handleExport(t, path, exportPaths)
      // },
      MemberExpression(path) {
        if (
          t.isIdentifier(path.node.property, { name: 'nextTick' }) &&
          t.isIdentifier(path.node.object)
        ) {
          // 处理 Taro.nextTick
          if (path.node.object.name === 'Taro') {
            path.replaceWith(t.identifier('__taro_registryNextFrame'))
          } else if (path.node.object.name.startsWith('Taro_')) {
            // 处理 Taro__default.nextTick 或其他类似情况
            path.replaceWith(t.identifier('__taro_registryNextFrame'))
          }
        }
      }
    }
  })

  type TString = string | BabelCore.types.StringLiteral
  function createImportExpression (t: typeof BabelCore.types, source: TString, name: TString = '') {
    const sourceValue = typeof source === 'string' ? source : source.value
    const params = [typeof name === 'string' ? t.stringLiteral(name) : name]
    if (isLocalPath(sourceValue)) {
      params.unshift(t.stringLiteral(parseLocalPath(fileName, sourcePath, sourceValue)))
      params.push(t.stringLiteral(projectId))
    } else {
      params.unshift(t.stringLiteral(sourceValue.replace(chorePackagePrefix, '').replace(/^\//, '')))
    }
    return t.callExpression(t.identifier(`${importFunc}`), params)
  }

  function createLoadSpecifiers(
    t: typeof BabelCore.types,
    path: BabelCore.NodePath<BabelCore.types.ImportDeclaration>,
    libraryName: string,
    type = '',
  ) {
    return path.node.specifiers.filter((s: BabelCore.types.ImportSpecifier) => s.importKind !== 'type').map(specifier => {
      const varName = `${specifier.local.name}${type ? `: ${type}` : ''}`
      if (t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)) {
        return t.variableDeclarator(
          t.identifier(varName), createImportExpression(t, libraryName, ''),
        )
      } else if (t.isImportSpecifier(specifier)) {
        return t.variableDeclarator(
          t.identifier(varName), createImportExpression(t, libraryName, t.isIdentifier(specifier.imported)
            ? specifier.imported.name
            : specifier.imported.value))
      }
    }).filter(Boolean) as BabelCore.types.VariableDeclarator[]
  }

  function createExportExpression (
    t: typeof BabelCore.types,
    params: (boolean | string)[],
    value: BabelCore.types.Expression,
  ) {
    return t.expressionStatement(
      t.callExpression(
        t.identifier(`${exportFunc}`),
        [value, ...params.map(e => typeof e === 'string' ? t.stringLiteral(e) : t.booleanLiteral(e))],
      )
    )
  }

  function handleExportDeclaration (
    t: typeof BabelCore.types,
    path: BabelCore.NodePath,
    params: (boolean | string)[],
    declaration: BabelCore.types.Declaration | BabelCore.types.Expression,
    isDefault = false
  ) {
    const expressions: BabelCore.types.ExpressionStatement[] = []

    if (t.isVariableDeclaration(declaration)) {
      // export const a = 1;
      expressions.push(...declaration.declarations
        .filter(decl => t.isIdentifier(decl.id))
        .map(decl => createExportExpression(t, [...params, (decl.id as BabelCore.types.Identifier).name], decl.init!))
      )
    } else if (t.isFunctionDeclaration(declaration) && t.isIdentifier(declaration.id)) {
      // export function a() {}
      // export default a;
      // export default function a() {}
      expressions.push(createExportExpression(t, [...params, isDefault ? 'default' : declaration.id.name], t.arrowFunctionExpression(declaration.params, declaration.body)))
    } else if (t.isObjectExpression(declaration) || t.isIdentifier(declaration)) {
      // export default { a, b }
      // export default { a as b }
      const properties = (declaration as BabelCore.types.ObjectExpression).properties
        .filter(prop => t.isObjectProperty(prop))
        .map((prop: BabelCore.types.ObjectProperty) => t.objectProperty(prop.key, prop.value)) as BabelCore.types.ObjectProperty[]
      expressions.push(isDefault
        ? createExportExpression(t, [...params, 'default'], t.objectExpression(properties))
        : createExportExpression(t, [...params], t.objectExpression(properties)))
    }

    if (expressions.length === 1) {
      path.replaceWith(expressions[0])
    } else if (expressions.length > 1) {
      path.replaceWithMultiple(expressions)
    }
  }

  /**
   * export const a = 1 => global[projectId][path]['a'] = 1
   * export function a () {} => global[projectId][path]['a'] = function a () {}
   * export { a, b } => global[projectId][path]['a'] = a; global[projectId][path]['b'] = b
   * export { a as b } => global[projectId][path]['b'] = a
   * export default a => global[projectId][path]['default'] = a
   * export default function a () {} => global[projectId][path]['default'] = function a () {}
   * export default { a, b } => global[projectId][path]['default'] = { a, b }
   * export default { a as b } => global[projectId][path]['default'] = { b: a }
   * export default { a: { b } } => global[projectId][path]['default'] = { a: { b } }
   * export = a => global[projectId][path] = a
   * export = { a, b } => global[projectId][path] = { a, b }
   * module.exports = a => global[projectId][path] = a
   * module.exports.default = a => global[projectId][path]['default'] = a
   * module.exports.a = a => global[projectId][path]['a'] = a
   */
  function handleExport (
    t: typeof BabelCore.types,
    path: BabelCore.NodePath<BabelCore.types.ExportDeclaration | BabelCore.types.TSExportAssignment | BabelCore.types.AssignmentExpression>,
    exportPaths: [boolean, ...string[]]
  ) {
    const { node } = path
    if (t.isExportDefaultDeclaration(node) || t.isExportNamedDeclaration(node)) {
      if (node.declaration) {
        handleExportDeclaration(t, path, [...exportPaths], node.declaration, t.isExportDefaultDeclaration(node))
      } else {
        // export { a, b }
        // export { a as b }
        // export * as a from 'a' => global[projectId][path].a = global[projectId][path].a
        if (t.isExportNamedDeclaration(node)) {
          const assignments = node.specifiers.map(specifier => {
            let exportedName = ''
            let localName = ''
            if (t.isExportSpecifier(specifier)) {
              localName = specifier.local.name
              exportedName = t.isIdentifier(specifier.exported) ? specifier.exported.name : specifier.exported.value
            } else if (t.isExportDefaultSpecifier(specifier)) {
              localName = specifier.exported.name
              exportedName = 'default'
            } else if (t.isExportNamespaceSpecifier(specifier)) {
              localName = specifier.exported.name
              exportedName = localName
            }

            let importIdentifier: BabelCore.types.Expression
            if (t.isExportNamedDeclaration(node) && node.source) {
              importIdentifier = createImportExpression(t, node.source, localName)
            } else {
              importIdentifier = t.identifier(localName)
            }
            return createExportExpression(
              t,
              [...exportPaths, exportedName],
              importIdentifier,
            )
          }).filter(Boolean) as BabelCore.types.ExpressionStatement[]

          path.replaceWithMultiple(assignments)
        }
      }
    } else if (t.isExportAllDeclaration(node)) {
      if (node.source) {
        // export * from 'a' => Object.assign(global[projectId][path], loadLibrary('a', '*'))
        path.replaceWith(
          createExportExpression(t, [...exportPaths, '*'], createImportExpression(t, node.source, '*')),
        )
      } else {
        path.remove()
      }
    } else if (t.isTSExportAssignment(node)) {
      // export = a;
      // export = { a, b };
      handleExportDeclaration(t, path, [...exportPaths], node.expression)
    } else if (t.isAssignmentExpression(node)) {
      if (t.isMemberExpression(node.left) && t.isIdentifier(node.left.object) && node.left.object.name === 'module') {
        if (t.isIdentifier(node.left.property) && node.left.property.name === 'exports') {
          // module.exports = a;
          // module.exports = { a, b };
          handleExportDeclaration(t, path, [...exportPaths], node.right)
        } else if (t.isIdentifier(node.left.property)) {
          // module.exports.default = a;
          // module.exports.a = a;
          path.replaceWith(
            createExportExpression(t, [...exportPaths, node.left.property.name], node.right)
          )
        }
      }
    }
  }
}
