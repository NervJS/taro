import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'

import { navigateFunc } from './constant'
import { usedComponents } from './global'
import {
  buildBlockElement,
  buildImportStatement,
  buildRender,
  getLineBreak,
  isCommonjsModule,
  parseCode,
  updateLogFileContent,
} from './utils'
import { WXS } from './wxml'

const defaultClassName = '_C'

const buildDecorator = (id: t.Identifier | t.ObjectExpression | t.CallExpression, isApp = false) => {
  const args: any[] = [id]
  isApp && args.push(t.booleanLiteral(true))
  return t.decorator(t.callExpression(t.identifier('withWeapp'), args))
}

export function replaceIdentifier (callee: NodePath<t.Node>) {
  if (callee.isIdentifier()) {
    const name = callee.node.name
    if (name === 'getApp' || name === 'getCurrentPages') {
      callee.replaceWith(t.memberExpression(t.identifier('Taro'), callee.node))
    }
  }
}

// babel 6升级babel 7适配
export function replaceMemberExpression (callee: NodePath<t.Node>) {
  if (callee.isMemberExpression()) {
    const object = callee.get('object') as NodePath<t.Identifier>
    if (t.isIdentifier(object.node, { name: 'wx' })) {
      object.replaceWith(t.identifier('Taro'))
    }
  }
}

/**
 * 跳转插件页面时，将插件页面的路径转换为子包页面的路径
 *
 * @param node
 * @param pluginInfo
 * @returns
 */
function replacePluginUrl (node, pluginInfo) {
  if (node.callee.type === 'MemberExpression' && navigateFunc.has(node.callee.property.name)) {
    const urlNode = node.arguments.find((arg) => arg.type === 'ObjectExpression')
    if (urlNode) {
      const urlProperty = urlNode.properties.find((property) => property.key.name === 'url')
      if (urlProperty) {
        if (!t.isStringLiteral(urlProperty.value)) {
          // navigateFunc的url如果是动态化则不转换
          updateLogFileContent(`WARN [taroize] replacePluginUrl - navigateFunc 的 url 是动态的 ${getLineBreak()}`)
          return
        }

        const urlValue = urlProperty.value.value
        let url
        // 捕获跳转路径中的插件名和页面名，替换为子包路径
        const regexPluginUrl = /plugin:\/\/([^/]+)\/([^/?]+)/
        const matchPluginUrl = urlValue.match(regexPluginUrl)
        if (!matchPluginUrl) {
          // 非插件路径，不做处理
          updateLogFileContent(`WARN [taroize] replacePluginUrl - 非插件路径 ${getLineBreak()}`)
          return
        }

        // 将跳转的插件页面url替换为子包的url
        // 捕获插件名
        const pluginName = matchPluginUrl[1]
        // 捕获页面名
        const pageName = matchPluginUrl[2]

        url = `/${pluginName}/${pluginInfo.pagesMap.get(pageName)}`

        // 捕获跳转路径中的参数
        const regexParams = /\?(.+)/
        const matchParams = urlValue.match(regexParams)

        if (matchParams) {
          const paramsString = matchParams[1]
          url = `${url}?${paramsString}`
        }
        urlProperty.value.value = url
      }
    }
  }
}

export function parseScript (
  script?: string,
  scriptPath?: string,
  returned?: t.Expression,
  wxses: WXS[] = [],
  refId?: Set<string>,
  isApp = false,
  pluginInfo?
) {
  updateLogFileContent(`INFO [taroize] parseScript - 入参 ${getLineBreak()}scriptPath: ${scriptPath} ${getLineBreak()}`)
  script = script || 'Page({})'
  if (t.isJSXText(returned as any)) {
    const block = buildBlockElement()
    block.children = [returned as any]
    returned = block
  }
  let ast = parseCode(script, scriptPath as string)
  let classDecl!: t.ClassDeclaration
  let foundWXInstance = false
  const vistor: Visitor = {
    BlockStatement (path) {
      updateLogFileContent(`INFO [taroize] parseScript - 解析BlockStatement ${getLineBreak()}${path} ${getLineBreak()}`)
      path.scope.rename('wx', 'Taro')
    },
    Identifier (path) {
      updateLogFileContent(`INFO [taroize] parseScript - 解析Identifier ${getLineBreak()}${path} ${getLineBreak()}`)
      if (path.isReferenced() && path.node.name === 'wx') {
        path.replaceWith(t.identifier('Taro'))
      }
    },
    CallExpression (path) {
      updateLogFileContent(`INFO [taroize] parseScript - 解析CallExpression ${getLineBreak()}${path} ${getLineBreak()}`)
      const callee = path.get('callee')
      replaceIdentifier(callee as NodePath<t.Node>)
      replaceMemberExpression(callee as NodePath<t.Node>)

      if (
        callee.isIdentifier({ name: 'Page' }) ||
        callee.isIdentifier({ name: 'Component' }) ||
        callee.isIdentifier({ name: 'App' })
      ) {
        foundWXInstance = true
        const componentType = callee.node.name
        classDecl = parsePage(path, returned || t.nullLiteral(), componentType, refId, wxses, isApp, pluginInfo)

        // 将类组件进行导出
        if (isCommonjsModule(ast.program.body)) {
          // 组件导出格式为module.exports =
          ast.program.body.push(
            classDecl,
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('module'), t.identifier('exports')),
                t.identifier(componentType !== 'App' ? defaultClassName : 'App')
              )
            )
          )
        } else {
          // 组件导出格式为export default
          ast.program.body.push(
            classDecl,
            t.exportDefaultDeclaration(t.identifier(componentType !== 'App' ? defaultClassName : 'App'))
          )
        }
      }
    },
  }

  traverse(ast, vistor)

  if (!foundWXInstance) {
    ast = parseCode(script + ';Component({})')
    traverse(ast, vistor)
  }

  const requirewithWeapp = t.variableDeclaration('const', [
    t.variableDeclarator(
      t.objectPattern([t.objectProperty(t.identifier('default'), t.identifier('withWeapp'), false, true)]),
      t.callExpression(t.identifier('require'), [t.stringLiteral('@tarojs/with-weapp')])
    ),
  ])
  if (isCommonjsModule(ast.program.body)) {
    const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents], '', true)
    const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro', true)
    const reactImport = buildImportStatement('react', [], 'React', true)
    ast.program.body.unshift(
      taroComponentsImport,
      reactImport,
      taroImport,
      requirewithWeapp,
      ...wxses
        .filter((wxs) => !wxs.src.startsWith('./wxs__'))
        .map((wxs) => buildImportStatement(wxs.src, [], wxs.module, true))
    )
  } else {
    const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents])
    const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
    const reactImport = buildImportStatement('react', [], 'React')
    ast.program.body.unshift(
      taroComponentsImport,
      reactImport,
      taroImport,
      requirewithWeapp,
      ...wxses
        .filter((wxs) => !wxs.src.startsWith('./wxs__'))
        .map((wxs) => buildImportStatement(wxs.src, [], wxs.module))
    )
  }

  return ast
}

function parsePage (
  pagePath: NodePath<t.CallExpression>,
  returned: t.Expression,
  componentType?: string,
  refId?: Set<string>,
  wxses?: WXS[],
  isApp = false,
  pluginInfo?
) {
  updateLogFileContent(`INFO [taroize] parsePage - 入参 ${getLineBreak()}pagePath: ${pagePath} ${getLineBreak()}`)
  const stateKeys: string[] = []
  pagePath.traverse({
    CallExpression (path) {
      updateLogFileContent(`INFO [taroize] parsePage - 解析CallExpression ${getLineBreak()}${path} ${getLineBreak()}`)
      const callee = path.get('callee')
      replaceIdentifier(callee as NodePath<t.Node>)
      replaceMemberExpression(callee as NodePath<t.Node>)

      // 将引用插件的路径转换为子包的路径
      replacePluginUrl(path.node, pluginInfo)
    },
  })
  if (refId) {
    refId.forEach((id) => {
      if (!stateKeys.includes(id)) {
        stateKeys.push(id)
      }
    })
  }
  const propsKeys: string[] = []
  const classBody: any[] = []
  const wxsNames = new Set(wxses ? wxses.map((w) => w.module) : [])
  const renderFunc = buildRender(
    componentType === 'App'
      ? t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier('props')), t.identifier('children'))
      : returned,
    stateKeys.filter((s) => !wxsNames.has(s)),
    propsKeys
  )

  const classDecl = t.classDeclaration(
    t.identifier(componentType === 'App' ? 'App' : defaultClassName),
    t.memberExpression(t.identifier('React'), t.identifier('Component')),
    t.classBody(classBody.concat(renderFunc)),
    []
  )

  // @withWeapp 通过调用 cacheOptions.getOptionsFromCache() 获取 options
  const withWeappArgmentNode = t.callExpression(
    t.memberExpression(t.identifier('cacheOptions'), t.identifier('getOptionsFromCache')),
    []
  )
  classDecl.decorators = [buildDecorator(withWeappArgmentNode, isApp)]

  return classDecl
}
