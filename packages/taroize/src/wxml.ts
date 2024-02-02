/* eslint-disable camelcase */
import { parse as parseFile } from '@babel/parser'
import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import { printLog, processTypeEnum } from '@tarojs/helper'
// @ts-ignore
import { toCamelCase } from '@tarojs/shared'
import { parse, parseDefaults } from 'himalaya-wxml'
import { camelCase, cloneDeep } from 'lodash'

import { getCacheWxml, saveCacheWxml } from './cache'
import { reserveKeyWords } from './constant'
import { specialEvents } from './events'
import { errors, globals, THIRD_PARTY_COMPONENTS, usedComponents } from './global'
import { parseModule, parseTemplate, preParseTemplate } from './template'
import {
  addLocInfo,
  astToCode,
  buildBlockElement,
  buildImportStatement,
  buildTemplate,
  codeFrameError,
  createErrorCodeMsg,
  DEFAULT_Component_SET,
  getLineBreak,
  IReportError,
  isValidVarName,
  normalizePath,
  parseCode,
  updateLogFileContent,
} from './utils'

const { prettyPrint } = require('html')
const pathTool = require('path')

const allCamelCase = (str: string) => str.charAt(0).toUpperCase() + camelCase(str.substr(1))

function buildSlotName (slotName: string) {
  return `render${slotName[0].toUpperCase() + slotName.replace('-', '').slice(1)}`
}

export enum NodeType {
  Element = 'element',
  Comment = 'comment',
  Text = 'text',
}

export interface Element {
  type: NodeType.Element
  tagName: string
  children: AllKindNode[]
  attributes: Attribute[]
}

export interface Attribute {
  key: string
  value: string | null
}

export interface Comment {
  type: NodeType.Comment
  content: string
}

export interface Text {
  type: NodeType.Text
  content: string
}

export interface WXS {
  module: string
  src: string
}

export type AllKindNode = Element | Comment | Text
export type Node = Element | Text
interface Condition {
  condition: string
  path: NodePath<t.JSXElement>
  tester: t.JSXExpressionContainer
  cachePath?: NodePath<t.JSXElement>
}

export type AttrValue = t.StringLiteral | t.JSXElement | t.JSXExpressionContainer | null

export interface Imports {
  ast: t.File
  name: string
  wxs?: boolean
  // 模板处理事件的function
  funcs?: Set<string>
  tmplName?: string
}

/**
 * wxml界面下的template模板信息
 *
 * @param { any[] } funcs 模板所用方法集
 * @param { any[] } applyTemplates 套用模板集
 */
interface Templates {
  funcs: Set<string>
  applyTemplates: Set<string>
}

export interface Wxml {
  wxses: WXS[]
  wxml?: t.Node
  imports: Imports[]
  refIds: Set<string>
}

export const WX_IF = 'wx:if'
export const WX_ELSE_IF = 'wx:elif'
export const WX_FOR = 'wx:for'
export const WX_FOR_ITEM = 'wx:for-item'
export const WX_FOR_INDEX = 'wx:for-index'
export const WX_KEY = 'wx:key'
export const WX_ELSE = 'wx:else'
export const WX_SHOW = 'wx:show'

export const wxTemplateCommand = [WX_IF, WX_ELSE_IF, WX_FOR, WX_FOR_ITEM, WX_FOR_INDEX, WX_KEY, 'wx:else']

function buildElement (name: string, children: Node[] = [], attributes: Attribute[] = []): Element {
  return {
    tagName: name,
    type: NodeType.Element,
    attributes,
    children,
  }
}

// 将 style 属性中属性名转小驼峰格式 并且将 {{}} 转为 ${}格式生成对应ast节点
function convertStyleAttrs (styleAttrsMap: any[]) {
  updateLogFileContent(`INFO [taroize] convertStyleAttrs - 进入函数 ${getLineBreak()}`)
  styleAttrsMap.forEach((attr) => {
    attr.attrName = toCamelCase(attr.attrName.trim())
    // 匹配 {{}} 内部以及左右两边值
    const attrValueReg = /([^{}]*)\{\{([^{}]*)\}\}([^{}]*)/
    const matchs = attrValueReg.exec(attr.value)
    if (matchs !== null) {
      const tempLeftValue = matchs[1] || ''
      const tempMidValue = matchs[2] || ''
      const tempRightValue = matchs[3] || ''
      // 将模版中的内容转换为 ast 节点
      const tempMidValueAst = parseFile(tempMidValue).program.body[0] as any
      attr.value = t.templateLiteral(
        [t.templateElement({ raw: tempLeftValue }), t.templateElement({ raw: tempRightValue }, true)],
        [tempMidValueAst.expression]
      )
    } else {
      attr.value = t.stringLiteral(attr.value.trim())
    }
  })
}

/**
 * 对 style 中单个属性值进行解析
 *
 * @param { any[] } styleAttrsMap 元素为单个属性值的数组
 * @param { any[] } attrKeyValueMap 属性解析为 {attrName: attrValue} 形式的数组
 */
function parseStyleAttrs (styleAttrsMap: any[], attrKeyValueMap: any[]) {
  updateLogFileContent(`INFO [taroize] parseStyleAttrs - 进入函数 ${getLineBreak()}`)
  styleAttrsMap.forEach((attr) => {
    if (attr) {
      // 对含三元运算符的写法 style="width:{{ xx ? xx : xx }}" 匹配第一个 : 避免匹配三元表达式中的 : 运算符
      const reg = /([^:]+):\s*([^;]+)/
      const matchs = attr.match(reg)
      const attrName = matchs[1]
      const value = matchs[2]
      if (attrName) {
        attrKeyValueMap.push({ attrName, value })
      }
    }
  })
}

export function convertStyleUnit (value: string) {
  let tempValue = value
  // 尺寸单位转换 都转为rem : 1rpx 转为 1/40rem,,1px 转为 1/20rem
  if (tempValue.indexOf('px') !== -1) {
    // 把 xxx="...[数字]rpx/px" 的尺寸单位都转为 rem, 转换方法类似postcss-taro-unit-transform
    try {
      tempValue = tempValue
        .replace(/\s*-?([0-9.]+)(px)\b/gi, function (match, size, unit) {
          if (Number(size) === 0) {
            return match.replace(size, '0').replace(unit, 'rem')
          }
          return match.replace(size, parseFloat(size) / 20 + '').replace(unit, 'rem')
        })
        .replace(/\s*-?([0-9.]+)(rpx)\b/gi, function (match, size, unit) {
          if (Number(size) === 0) {
            return match.replace(size, '0').replace(unit, 'rem')
          }
          return match.replace(size, parseFloat(size) / 40 + '').replace(unit, 'rem')
        })
      // 把 xx="...{{参数}}rpx/px"的尺寸单位都转为rem,比如"{{参数}}rpx" -> "{{参数/40}}rem"
      tempValue = tempValue
        .replace(/\{\{([^{}]*)\}\}(px)/gi, function (match, size, unit) {
          // 判断{{}}是否包含加减乘除算式和三元表达式, 是的话得加括号
          if (match.match(/[+\-*/?]/g)) {
            return match.replace(size, '(' + size + ')/20').replace(unit, 'rem')
          }
          return match.replace(size, size + '/20').replace(unit, 'rem')
        })
        .replace(/\{\{([^{}]*)\}\}(rpx)/gi, function (match, size, unit) {
          if (match.match(/[+\-*/?]/g)) {
            return match.replace(size, '(' + size + ')/40').replace(unit, 'rem')
          }
          return match.replace(size, size + '/40').replace(unit, 'rem')
        })
    } catch (error) {
      createErrorCodeMsg(
        'WxmlUnitConversionError',
        `wxml内px/rpx单位转换失败: ${error}`,
        tempValue,
        globals.currentParseFile
      )
      printLog(processTypeEnum.ERROR, `wxml内px/rpx单位转换失败: ${error}`)
      updateLogFileContent(
        `WARN [taroize] convertStyleUnit - wxml内px/rpx单位转换异常 ${getLineBreak()}${error} ${getLineBreak()}`
      )
    }
  }
  return tempValue
}

/**
 * 预解析，收集wxml所有的模板信息
 *
 * @param { any[] } templates wxml页面下的模板信息
 * @returns Visitor
 */
export const createPreWxmlVistor = (templates: Map<string, Templates>) => {
  updateLogFileContent(
    `INFO [taroize] createPreWxmlVistor - 入参 ${getLineBreak()}templates: ${templates} ${getLineBreak()}`
  )
  // const Applys = new Map<string, string[]>()
  return {
    JSXElement: {
      enter (path: NodePath<t.JSXElement>) {
        const openingElement = path.get('openingElement')
        const jsxName = openingElement.get('name')
        if (!jsxName.isJSXIdentifier()) {
          return
        }
        const tagName = jsxName.node.name
        if (tagName !== 'Template') {
          return
        }
        const templateInfo = preParseTemplate(path)
        if (templateInfo) {
          templates.set(templateInfo.name, {
            funcs: templateInfo.funcs,
            applyTemplates: templateInfo.applys,
          })
        }
      },
    },
  } as Visitor
}

/**
 * 根据template中使用的wxs组装需要导入的wxs语句
 * 如： import xxx from '../xxx.wxs.js'
 *
 * @param templateFileName template模版文件名
 * @param usedWxses template中使用的变量是wxs模块的集合
 * @param dirPath 当前解析文件的路径
 * @returns 需要导入的wxs语句集合
 */
export function getWxsImports (templateFileName, usedWxses, dirPath) {
  const templatePath = pathTool.join(globals.rootPath, 'imports', `${templateFileName}.js`)
  const wxsImports: (t.ImportDeclaration | t.VariableDeclaration)[] = []
  for (const usedWxs of usedWxses) {
    const wxsAbsPath = pathTool.resolve(dirPath, `${usedWxs.src}.js`)
    const wxsRelPath = pathTool.relative(pathTool.dirname(templatePath), wxsAbsPath)
    wxsImports.push(buildImportStatement(normalizePath(wxsRelPath), [], usedWxs.module))
  }
  return wxsImports
}

export const createWxmlVistor = (
  loopIds: Set<string>,
  refIds: Set<string>,
  dirPath: string,
  wxses: WXS[] = [],
  imports: Imports[] = [],
  templates?: Map<string, Templates>
) => {
  updateLogFileContent(`INFO [taroize] createWxmlVistor - 入参 ${getLineBreak()}dirPath: ${dirPath} ${getLineBreak()}`)

  const jsxAttrVisitor = (path: NodePath<t.JSXAttribute>) => {
    updateLogFileContent(
      `INFO [taroize] createWxmlVistor - 解析JSXAttribute ${getLineBreak()}${path} ${getLineBreak()}`
    )
    const name = path.node.name as t.JSXIdentifier
    const jsx = path.findParent((p) => p.isJSXElement()) as NodePath<t.JSXElement>

    // 把 hidden 转换为 wxif
    if (name.name === 'hidden') {
      const value = path.get('value') as NodePath<t.JSXExpressionContainer>
      if (t.isJSXExpressionContainer(value) && !t.isJSXEmptyExpression(value.node.expression)) {
        const exclamation = t.unaryExpression('!', value.node.expression)
        path.set('value', t.jSXExpressionContainer(exclamation))
        path.set('name', t.jSXIdentifier(WX_IF))
      }
    }

    // 当设置图片mode="",则改为默认值(且taro不支持mode空值)
    if (name.name === 'mode' && path.node.value === null) {
      path.set('value', t.stringLiteral('scaleToFill'))
    }

    // 当设置 style 属性但未赋值则删除该属性
    if (name.name === 'style' && !path.node.value) {
      path.remove()
      return
    }

    const valueCopy = cloneDeep(path.get('value').node)

    if (typeof valueCopy === 'undefined' || t.isJSXFragment(valueCopy)) {
      return
    }

    transformIf(name.name, path, jsx, valueCopy)
    const loopItem = transformLoop(name.name, path, jsx, valueCopy)
    if (loopItem) {
      if (loopItem.index && !refIds.has(loopItem.index)) {
        loopIds.add(loopItem.index)
      }
      if (loopItem.item && !refIds.has(loopItem.item)) {
        loopIds.add(loopItem.item)
      }
    }
  }

  const renameJSXKey = (path: NodePath<t.JSXIdentifier>) => {
    updateLogFileContent(
      `INFO [taroize] createWxmlVistor - 解析JSXIdentifier ${getLineBreak()}${path} ${getLineBreak()}`
    )
    const nodeName = path.node.name
    if (path.parentPath.isJSXAttribute()) {
      const cacheNode = cloneDeep(path.parentPath.parentPath.parent) as any
      if (nodeName === WX_SHOW) {
        path.replaceWith(t.jSXIdentifier(WX_IF)) // wx:show转换后不支持，不频繁切换的话wx:if可替代
        const position = {
          col: cacheNode.position?.start.column || 0,
          row: cacheNode.position?.start.line || 0
        }
        createErrorCodeMsg(
          'uncompilableAttribute',
          `属性  ${nodeName}不能编译,会被替换为wx:if`,
          astToCode(cacheNode) || '',
          globals.currentParseFile,
          position
        )
        // eslint-disable-next-line no-console
        console.log(`属性  ${nodeName}不能编译,会被替换为wx:if`)
        updateLogFileContent(
          `WARN [taroize] createWxmlVistor - ${nodeName} 属性不能编译，会被替换为 wx:if ${getLineBreak()}`
        )
      } else if (nodeName.startsWith('wx:') && !wxTemplateCommand.includes(nodeName)) {
        const position = {
          col: cacheNode.position?.start.column || 0,
          row: cacheNode.position?.start.line || 0
        }
        createErrorCodeMsg(
          'unknownScopeAttribute',
          `未知 wx 作用域属性： ${nodeName}，该属性会被移除掉。`,
          astToCode(cacheNode) || '',
          globals.currentParseFile,
          position
        )
        // eslint-disable-next-line no-console
        console.log(`未知 wx 作用域属性： ${nodeName}，该属性会被移除掉。`)
        updateLogFileContent(
          `WARN [taroize] createWxmlVistor - 未知 wx 作用域属性: ${nodeName}，该属性会被移除掉 ${getLineBreak()}`
        )
        path.parentPath.remove()
      }
    }
  }

  return {
    JSXAttribute: jsxAttrVisitor,
    JSXIdentifier: renameJSXKey,
    Identifier: {
      enter (path: NodePath<t.Identifier>) {
        updateLogFileContent(
          `INFO [taroize] createWxmlVistor - 解析Identifier ${getLineBreak()}${path} ${getLineBreak()}`
        )
        if (!path.isReferencedIdentifier()) {
          return
        }
        const jsxExprContainer = path.findParent((p) => p.isJSXExpressionContainer())
        if (!jsxExprContainer || !jsxExprContainer.isJSXExpressionContainer()) {
          return
        }
        if (isValidVarName(path.node.name)) {
          refIds.add(path.node.name)
        }
      },
    },
    JSXElement: {
      enter (path: NodePath<t.JSXElement>) {
        updateLogFileContent(
          `INFO [taroize] createWxmlVistor - 解析JSXElement ${getLineBreak()}${path} ${getLineBreak()}`
        )
        const openingElement = path.get('openingElement')
        const jsxName = openingElement.get('name')
        const attrs = openingElement.get('attributes')
        if (!jsxName.isJSXIdentifier()) {
          return
        }
        path.traverse({
          JSXAttribute: jsxAttrVisitor,
          JSXIdentifier: renameJSXKey,
        })
        const slotAttr = attrs.find((a) => t.isJSXAttribute(a.node) && a.node?.name.name === 'slot')
        if (slotAttr && t.isJSXAttribute(slotAttr.node)) {
          const slotValue = slotAttr.node.value
          let slotName = ''
          if (slotValue && t.isStringLiteral(slotValue)) {
            slotName = slotValue.value
            const parentComponent = path.findParent(
              (p) =>
                p.isJSXElement() &&
                t.isJSXIdentifier(p.node.openingElement.name) &&
                !DEFAULT_Component_SET.has(p.node.openingElement.name.name)
            )
            if (parentComponent && parentComponent.isJSXElement()) {
              slotAttr.remove()
              path.traverse({
                JSXAttribute: jsxAttrVisitor,
              })
              const block = buildBlockElement()
              block.children = [cloneDeep(path.node)]
              parentComponent.node.openingElement.attributes.push(
                t.jSXAttribute(t.jSXIdentifier(buildSlotName(slotName)), t.jSXExpressionContainer(block))
              )
              path.remove()
            }
          } else {
            // 当元素设置slot标签且值为空串时，移除slot属性
            slotAttr.remove()
          }
        }
        const tagName = jsxName.node.name
        if (tagName === 'Slot') {
          updateLogFileContent(`INFO [taroize] createWxmlVistor - tagName: Slot ${getLineBreak()}`)
          const nameAttr = attrs.find((a) => t.isJSXAttribute(a.node) && a.node.name.name === 'name')
          let slotName = ''
          if (nameAttr && t.isJSXAttribute(nameAttr.node)) {
            if (nameAttr.node.value && t.isStringLiteral(nameAttr.node.value)) {
              slotName = nameAttr.node.value.value
            } else {
              updateLogFileContent(`ERROR [taroize] createWxmlVistor - slot 的值不是一个字符串 ${getLineBreak()}`)
              // const error = codeFrameError(jsxName.node, 'slot 的值必须是一个字符串')
              // @ts-ignore
              const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
              const position = { col: column, row: line }
              throw new IReportError(
                'slot 的值必须是一个字符串',
                'SlotValueTypeError',
                'WXML_FILE',
                astToCode(path.node) || '',
                position
              )
            }
          }
          const children = t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('props')),
            t.identifier(slotName ? buildSlotName(slotName) : 'children')
          )
          try {
            path.replaceWith(path.parentPath.isJSXElement() ? t.jSXExpressionContainer(children) : children)
          } catch (error) {
            updateLogFileContent(
              `WARN [taroize] createWxmlVistor - Slot 节点替换异常 ${getLineBreak()}${error} ${getLineBreak()}`
            )
            //
          }
        }
        if (tagName === 'Wxs') {
          updateLogFileContent(`INFO [taroize] createWxmlVistor - tagName: Wxs ${getLineBreak()}`)
          wxses.push(
            getWXS(
              attrs.map((a) => a.node as t.JSXAttribute),
              path,
              imports
            )
          )
        }
        if (tagName === 'Template') {
          updateLogFileContent(`INFO [taroize] createWxmlVistor - tagName: Template ${getLineBreak()}`)
          const template = parseTemplate(path, dirPath, wxses)
          if (template) {
            let funcs = new Set<string>()
            const { ast: classDecl, name, tmplName, usedWxses } = template
            const wxsImports = getWxsImports(name, usedWxses, dirPath)
            const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents])
            const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
            const reactImport = buildImportStatement('react', [], 'React')
            // 引入 @tarojs/with-weapp
            const withWeappImport = buildImportStatement('@tarojs/with-weapp', [], 'withWeapp')
            const ast = t.file(t.program([]))
            ast.program.body.unshift(
              taroComponentsImport,
              reactImport,
              taroImport,
              withWeappImport,
              ...wxsImports,
              classDecl,
              t.exportDefaultDeclaration(t.identifier(name))
            )
            const usedTemplate = new Set<string>()
            // funcs的值首先来源于预解析结果
            if (templates) {
              const applyFuncs = templates.get(name)?.funcs
              if (applyFuncs) {
                funcs = applyFuncs
              }
            }

            traverse(ast, {
              JSXIdentifier (path) {
                updateLogFileContent(
                  `INFO [taroize] createWxmlVistor - 解析JSXIdentifier ${getLineBreak()}${path} ${getLineBreak()}`
                )
                const node = path.node
                if (node.name.endsWith('Tmpl') && node.name.length > 4 && path.parentPath.isJSXOpeningElement()) {
                  usedTemplate.add(node.name)
                  // 传递的方法有两处来源
                  const templateImport = imports.find((tmplImport) => tmplImport.name === `${node.name}`)
                  const templateInfo = templates?.get(node.name)
                  let templateFuncs = templateImport?.funcs
                  if (templateInfo?.funcs) {
                    if (templateFuncs) {
                      templateFuncs = new Set([...templateFuncs, ...templateInfo.funcs])
                    } else {
                      templateFuncs = templateInfo.funcs
                    }
                  }
                  if (templateFuncs && templateFuncs.size > 0) {
                    const openingElement = path.parentPath.node
                    const attributes: any[] = openingElement.attributes
                    templateFuncs.forEach((templateFunc) => {
                      const value = t.jsxExpressionContainer(t.identifier(templateFunc))
                      const name = t.jsxIdentifier(templateFunc)
                      // 传递的方法插入到Tmpl标签属性中
                      attributes.push(t.jsxAttribute(name, value))
                      if (!funcs.has(templateFunc)) {
                        funcs.add(templateFunc)
                      }
                    })
                  }
                }
              },
              JSXAttribute (path) {
                updateLogFileContent(
                  `INFO [taroize] createWxmlVistor - 解析JSXAttribute ${getLineBreak()}${path} ${getLineBreak()}`
                )
                // 识别template使用到的处理事件的func
                const node = path.node
                if (
                  t.isJSXExpressionContainer(node.value) &&
                  t.isMemberExpression(node.value.expression) &&
                  t.isThisExpression(node.value.expression.object) &&
                  t.isIdentifier(node.value.expression.property)
                ) {
                  const funcName = node.value.expression.property.name
                  // func的调用形式 this.func --> func
                  path.replaceWith(t.jsxAttribute(node.name, t.jsxExpressionContainer(t.identifier(funcName))))
                }
              },
            })

            traverse(ast, {
              // 将使用到的处理事件的func写入到props
              BlockStatement (path) {
                updateLogFileContent(
                  `INFO [taroize] createWxmlVistor - 解析BlockStatement ${getLineBreak()}${path} ${getLineBreak()}`
                )
                if (funcs.size > 0) {
                  const body = path.node.body
                  if (t.isVariableDeclaration(body[0])) {
                    // 如果已经定义了props
                    const declarator = body[0].declarations[0]
                    if (t.isObjectPattern(declarator.id)) {
                      const properties = declarator.id.properties
                      funcs.forEach((func) => {
                        properties.push(t.objectProperty(t.identifier(func), t.identifier(func), false, true))
                      })
                    }
                  } else {
                    // 没有定义，则插入 const {xxx} = this.props
                    const properties: t.ObjectProperty[] = []
                    funcs.forEach((func) => {
                      properties.push(t.objectProperty(t.identifier(func), t.identifier(func), false, true))
                    })
                    const id = t.objectPattern(properties)
                    const init = t.memberExpression(t.thisExpression(), t.identifier('props'))
                    const declarator = t.variableDeclarator(id, init)
                    const declaration = t.variableDeclaration('const', [declarator])
                    body.splice(0, 0, declaration)
                  }
                }
                path.stop()
              },
            })
            usedTemplate.forEach((componentName) => {
              if (componentName !== classDecl.id.name) {
                ast.program.body.unshift(buildImportStatement(`./${componentName}`, [], componentName))
              }
            })
            imports.push({
              ast,
              name,
              funcs,
              tmplName,
            })
          }
        }
        if (tagName === 'Import') {
          updateLogFileContent(`INFO [taroize] createWxmlVistor - tagName: Import ${getLineBreak()}`)
          const mods = parseModule(path, dirPath, 'import')
          if (mods) {
            imports.push(...mods)
          }
        }
        if (tagName === 'Include') {
          updateLogFileContent(`INFO [taroize] createWxmlVistor - tagName: Include ${getLineBreak()}`)
          parseModule(path, dirPath, 'include')
        }
      },
      exit (path: NodePath<t.JSXElement>) {
        const openingElement = path.get('openingElement')
        const jsxName = openingElement.get('name')
        if (!jsxName.isJSXIdentifier({ name: 'Block' })) {
          return
        }
        const children = path.node.children
        if (children.length === 1) {
          const caller = children[0]
          if (
            t.isJSXExpressionContainer(caller) &&
            t.isCallExpression(caller.expression) &&
            !path.parentPath.isExpressionStatement()
          ) {
            try {
              path.replaceWith(caller)
            } catch (error) {
              updateLogFileContent(
                `WARN [taroize] createWxmlVistor - block 节点替换异常 ${getLineBreak()}${error} ${getLineBreak()}`
              )
              //
            }
          }
        }
      },
    },
  } as Visitor
}

/**
 * @description 根据模板信息中的直接调用，遍历获取完整的调用
 * @param templates 模板信息
 */
function templateBfs (templates: Map<string, Templates>) {
  updateLogFileContent(`INFO [taroize] templateBfs - 进入函数 ${getLineBreak()}`)
  const names: string[] = []
  const applys = new Map<string, Set<string>>()
  for (const key of templates.keys()) {
    names.push(key)
    const templateInfo = templates.get(key)
    if (templateInfo) {
      applys.set(key, templateInfo.applyTemplates)
    }
  }
  for (const name of names) {
    const templateInfo = templates.get(name)
    if (!templateInfo || templateInfo.applyTemplates.size === 0) {
      continue
    }
    const visited = new Set<string>()
    const queue = [name]
    while (queue.length > 0) {
      const template = queue.shift() as string
      if (visited.has(template)) {
        continue
      }
      visited.add(template)
      const templateApplys = applys.get(template)
      if (!templateApplys || templateApplys.size === 0) {
        continue
      }
      templateApplys.forEach((item) => {
        if (names.includes(item)) {
          queue.push(item)
        }
      })
    }
    visited.delete(name)
    templateInfo.applyTemplates = visited
    for (const item of visited) {
      const applyFuncs = templates.get(item)?.funcs
      if (applyFuncs) {
        const funcs = templateInfo.funcs
        templateInfo.funcs = new Set([...funcs, ...applyFuncs])
      }
    }
    templates.set(name, templateInfo)
  }
}

export function parseWXML (dirPath: string, wxml?: string, parseImport?: boolean): Wxml {
  updateLogFileContent(
    `INFO [taroize] parseWXML - 入参 ${getLineBreak()}dirPath: ${dirPath} ${getLineBreak()}parseImport: ${parseImport} ${getLineBreak()}`
  )

  try {
    wxml = prettyPrint(wxml, {
      max_char: 0,
      indent_char: 0,
      unformatted: ['text', 'wxs'],
    })
  } catch (error) {
    updateLogFileContent(`WARN [taroize] parseWXML - wxml代码格式化异常 ${getLineBreak()}${error} ${getLineBreak()}`)
    //
  }

  if (!parseImport) {
    errors.length = 0
    usedComponents.clear()
  }
  usedComponents.add('Block')
  const wxses: WXS[] = []
  const imports: Imports[] = []
  const refIds = new Set<string>()
  const loopIds = new Set<string>()
  // 模板信息
  const templates = new Map<string, Templates>()
  if (!wxml) {
    return {
      wxses,
      imports,
      refIds,
      wxml: t.nullLiteral(),
    }
  }
  const nodes = removEmptyTextAndComment(parse(wxml.trim(), { ...parseDefaults, includePositions: true }))
  const ast = t.file(
    t.program([t.expressionStatement(parseNode(buildElement('block', nodes as Node[])) as t.Expression)], [])
  )
  // 确认当前解析页面是否已经解析过，如果解析过则直接获取缓存解析
  let parseResult = getCacheWxml(dirPath, hydrate(ast))
  if (parseResult) {
    return parseResult
  }
  // 在解析wxml页面前，先进行预解析
  // 当前预解析主要为了抽取页面下的模板信息
  traverse(ast, createPreWxmlVistor(templates))
  // 获取template调用后，需要通过遍历，获取某个模板完整的调用关系
  templateBfs(templates)

  traverse(ast, createWxmlVistor(loopIds, refIds, dirPath, wxses, imports, templates))

  refIds.forEach((id) => {
    if (
      loopIds.has(id) ||
      imports
        .filter((i) => i.wxs)
        .map((i) => i.name)
        .includes(id)
    ) {
      refIds.delete(id)
    }
  })

  parseResult = {
    wxses,
    imports,
    wxml: hydrate(ast),
    refIds,
  }
  saveCacheWxml(dirPath, parseResult)
  return parseResult
}

function getWXS (attrs: t.JSXAttribute[], path: NodePath<t.JSXElement>, imports: Imports[]): WXS {
  let moduleName: string | null = null
  let src: string | null = null

  for (const attr of attrs) {
    if (t.isJSXIdentifier(attr.name)) {
      const attrName = attr.name.name
      const attrValue = attr.value
      let value: string | null = null
      if (attrValue === null) {
        // @ts-ignore
        const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
        const position = { col: column, row: line }
        updateLogFileContent(`ERROR [taroize] getWXS - wxs 标签的属性值为空 ${getLineBreak()}`)
        throw new IReportError(
          'wxs 标签的属性值不得为空',
          'WxsTagAttributeEmptyError',
          'WXML_FILE',
          astToCode(path.node) || '',
          position
        )
      }
      if (t.isStringLiteral(attrValue)) {
        value = attrValue.value
      } else if (t.isJSXExpressionContainer(attrValue) && t.isStringLiteral(attrValue.expression)) {
        value = attrValue.expression.value
      }
      if (attrName === 'module') {
        moduleName = value
      }
      if (attrName === 'src') {
        src = value
      }
    }
  }

  if (!src) {
    const {
      children: [script],
    } = path.node
    if (!t.isJSXText(script)) {
      // @ts-ignore
      const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
      const position = { col: column, row: line }
      updateLogFileContent(`ERROR [taroize] getWXS - wxs 没有 src 属性且标签内部没有 wxs 代码 ${getLineBreak()}`)
      throw new IReportError(
        'wxs 如果没有 src 属性，标签内部必须有 wxs 代码。',
        'WxsTagCodeMissingError',
        'WXML_FILE',
        astToCode(path.node) || '',
        position
      )
    }
    src = './wxs__' + moduleName
    const ast = parseCode(script.value)
    traverse(ast, {
      CallExpression (path) {
        updateLogFileContent(`INFO [taroize] getWXS - 解析CallExpression ${getLineBreak()}${path} ${getLineBreak()}`)
        // wxs标签中getRegExp转换为new RegExp
        if (t.isIdentifier(path.node.callee, { name: 'getRegExp' })) {
          // 根据正则表达式是否定义了正则匹配修饰符，有则不变，没有就用默认
          if (path.node.arguments.length > 1) {
            const regex = path.node.arguments[0]
            const modifier = path.node.arguments[1]
            if (t.isStringLiteral(regex) && t.isStringLiteral(modifier)) {
              const regexStr = regex.extra?.raw as string
              const regexModifier = modifier.extra?.rawValue as string
              const regexWithoutQuotes = regexStr.replace(/^['"](.*)['"]$/, '$1')
              const newExpr = t.newExpression(t.identifier('RegExp'), [
                t.stringLiteral(regexWithoutQuotes),
                t.stringLiteral(regexModifier),
              ])
              path.replaceWith(newExpr)
            } else if (t.isIdentifier(regex) || t.isIdentifier(modifier)) {
              // @ts-ignore
              const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
              const position = { col: column, row: line }
              updateLogFileContent(
                `ERROR [taroize] getWXS - getRegExp 函数暂不支持传入变量类型的参数 ${getLineBreak()}`
              )
              throw new IReportError(
                'getRegExp 函数暂不支持传入变量类型的参数',
                'GetRegExpVariableTypeError',
                'WXML_FILE',
                astToCode(path.node) || '',
                position
              )
            } else {
              // @ts-ignore
              const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
              const position = { col: column, row: line }
              updateLogFileContent(
                `ERROR [taroize] getWXS - getRegExp 函数暂不支持传入非字符串类型的参数 ${getLineBreak()}`
              )
              throw new IReportError(
                'getRegExp 函数暂不支持传入非字符串类型的参数',
                'GetRegExpParameterTypeError',
                'WXML_FILE',
                astToCode(path.node) || '',
                position
              )
            }
          } else if (path.node.arguments.length === 1) {
            const regex = path.node.arguments[0]
            if (t.isStringLiteral(regex)) {
              const regexStr = regex.extra?.raw as string
              const regexWithoutQuotes = regexStr.replace(/^['"](.*)['"]$/, '$1')
              const newExpr = t.newExpression(t.identifier('RegExp'), [t.stringLiteral(regexWithoutQuotes)])
              path.replaceWith(newExpr)
            } else if (t.isIdentifier(regex)) {
              // @ts-ignore
              const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
              const position = { col: column, row: line }
              updateLogFileContent(
                `ERROR [taroize] getWXS - getRegExp 函数暂不支持传入变量类型的参数 ${getLineBreak()}`
              )
              throw new IReportError(
                'getRegExp 函数暂不支持传入变量类型的参数',
                'GetRegExpVariableTypeError',
                'WXML_FILE',
                astToCode(path.node) || '',
                position
              )
            } else {
              // @ts-ignore
              const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
              const position = { col: column, row: line }
              updateLogFileContent(
                `ERROR [taroize] getWXS - getRegExp 函数暂不支持传入非字符串类型的参数 ${getLineBreak()}`
              )
              throw new IReportError(
                'getRegExp 函数暂不支持传入非字符串类型的参数',
                'GetRegExpParameterTypeError',
                'WXML_FILE',
                astToCode(path.node) || '',
                position
              )
            }
          } else {
            const newExpr = t.newExpression(t.identifier('RegExp'), [])
            path.replaceWith(newExpr)
          }
        }

        // wxs标签中getDate()转换为new Date()
        if (t.isIdentifier(path.node.callee, { name: 'getDate' })) {
          let argument: any = []
          let newDate: t.NewExpression
          const date = path.node.arguments[0]
          if (t.isStringLiteral(date)) {
            argument = path.node.arguments.map((item) => t.stringLiteral(item.extra?.rawValue as string))
            newDate = t.newExpression(t.identifier('Date'), [...argument])
          } else if (t.isNumericLiteral(date)) {
            argument = path.node.arguments.map((item) => t.numericLiteral(item.extra?.rawValue as number))
            newDate = t.newExpression(t.identifier('Date'), [...argument])
          } else {
            newDate = t.newExpression(t.identifier('Date'), [])
          }
          path.replaceWith(newDate)
        }
      },
    })
    imports.push({
      ast,
      name: moduleName as string,
      wxs: true,
    })
  }

  if (!moduleName || !src) {
    // @ts-ignore
    const { line, column } = path.node?.position?.start || { line: 0, column: 0 }
    const position = { col: column, row: line }
    updateLogFileContent(`ERROR [taroize] getWXS - wxs 未同时存在 wxs、src 两个属性 ${getLineBreak()}`)
    throw new IReportError(
      '一个 wxs 需要同时存在两个属性：`module`, `src`',
      'WxsTagAttributesMissingError',
      'WXML_FILE',
      astToCode(path.node) || '',
      position
    )
  }

  path.remove()

  return {
    module: moduleName,
    src,
  }
}

function hydrate (file: t.File) {
  const ast = file.program.body[0]
  if (ast && t.isExpressionStatement(ast) && t.isJSXElement(ast.expression)) {
    const jsx = ast.expression
    if (jsx.children.length === 1) {
      const children = jsx.children[0]
      return t.isJSXExpressionContainer(children) ? children.expression : children
    } else {
      return jsx
    }
  }
}

function transformLoop (name: string, attr: NodePath<t.JSXAttribute>, jsx: NodePath<t.JSXElement>, value: AttrValue) {
  const jsxElement = jsx.get('openingElement')
  if (!jsxElement.node) {
    return
  }
  const attrs = jsxElement.get('attributes').map((a) => a.node)
  const wxForItem = attrs.find((a) => t.isJSXAttribute(a) && a.name.name === WX_FOR_ITEM)
  const hasSinglewxForItem =
    wxForItem && t.isJSXAttribute(wxForItem) && wxForItem.value && t.isJSXExpressionContainer(wxForItem.value)
  if (hasSinglewxForItem || name === WX_FOR || name === 'wx:for-items') {
    if (!value || !t.isJSXExpressionContainer(value)) {
      // @ts-ignore
      const { line, column } = jsx.node?.position?.start || { line: 0, column: 0 }
      const position = { col: column, row: line }
      updateLogFileContent(`ERROR [taroize] transformLoop - wx:for 的值未用 "{{}}" 包裹 ${getLineBreak()}`)
      throw new IReportError(
        'wx:for 的值必须使用 "{{}}"  包裹',
        'WxForValueFormatError',
        'WXML_FILE',
        astToCode(jsx.node) || '',
        position
      )
    }
    attr.remove()
    let item = t.stringLiteral('item')
    let index = t.stringLiteral('index')
    jsx
      .get('openingElement')
      .get('attributes')
      .forEach((p) => {
        const node = p.node as t.JSXAttribute
        if (node.name.name === WX_FOR_ITEM) {
          if (!node.value || !t.isStringLiteral(node.value)) {
            // @ts-ignore
            const { line, column } = jsx.node?.position?.start || { line: 0, column: 0 }
            const position = { col: column, row: line }
            updateLogFileContent(`ERROR [taroize] transformLoop - ${WX_FOR_ITEM} 的值不是一个字符串 ${getLineBreak()}`)
            throw new IReportError(
              WX_FOR_ITEM + ' 的值必须是一个字符串',
              'WxForItemValueError',
              'WXML_FILE',
              astToCode(jsx.node) || '',
              position
            )
          }
          item = node.value
          p.remove()
        }
        if (node.name.name === WX_FOR_INDEX) {
          if (!node.value || !t.isStringLiteral(node.value)) {
            // @ts-ignore
            const { line, column } = jsx.node?.position?.start || { line: 0, column: 0 }
            const position = { col: column, row: line }
            updateLogFileContent(`ERROR [taroize] transformLoop - ${WX_FOR_INDEX} 的值不是一个字符串 ${getLineBreak()}`)
            throw new IReportError(
              WX_FOR_INDEX + ' 的值必须是一个字符串',
              'WxForIndexValueError',
              'WXML_FILE',
              astToCode(jsx.node) || '',
              position
            )
          }
          index = node.value
          p.remove()
        }
      })

    jsx
      .get('openingElement')
      .get('attributes')
      .forEach((p) => {
        const node = p.node as t.JSXAttribute
        if (node.name.name === WX_KEY) {
          node.name = t.jSXIdentifier('key')
          if (t.isStringLiteral(node.value)) {
            if (node.value.value === '*this') {
              node.value = t.jSXExpressionContainer(t.identifier(item.value))
            } else if (node.value.value === 'index') {
              // index表示item在数组里的下标, 并不是item的某个property, 单独抽出来处理
              node.value = t.jSXExpressionContainer(t.identifier(node.value.value))
            } else {
              node.value = t.jSXExpressionContainer(
                t.memberExpression(t.identifier(item.value), t.identifier(node.value.value))
              )
            }
          }
        }
      })

    jsx
      .get('openingElement')
      .get('attributes')
      .forEach((p) => {
        const node = p.node as t.JSXAttribute
        if (node.name.name === WX_IF) {
          // 如果同时使用了 wx:if，分离
          const ifBlock = buildBlockElement()
          ifBlock.children = [cloneDeep(jsx.node)]
          try {
            jsx.replaceWith(ifBlock)
          } catch (error) {
            updateLogFileContent(
              `WARN [taroize] transformLoop - wx:if和wx:for合用时父组件使用wx:if导致使用replaceWith异常 ${getLineBreak()}${error} ${getLineBreak()}`
            )
            // jsx外层是wx:if的转换，替换（replaceWith）时会抛出异常
            // catch异常后，正常替换
          }
          p.remove()
        }
      })

    if (t.isJSXEmptyExpression(value.expression)) {
      printLog(processTypeEnum.WARNING, 'value.expression', 'wxml.ts -> t.isJSXEmptyExpression(value.expression)')
      return
    }
    const replacement = t.jSXExpressionContainer(
      t.callExpression(t.memberExpression(value.expression, t.identifier('map')), [
        t.arrowFunctionExpression(
          [t.identifier(item.value), t.identifier(index.value)],
          t.blockStatement([t.returnStatement(jsx.node)])
        ),
      ])
    )

    const block = buildBlockElement()
    block.children = [replacement]
    try {
      jsx.replaceWith(block)
    } catch (error) {
      updateLogFileContent(`WARN [taroize] transformLoop - 节点替换异常 ${getLineBreak()}${error} ${getLineBreak()}`)
      //
    }

    return {
      item: item.value,
      index: index.value,
    }
  }
}

function transformIf (name: string, attr: NodePath<t.JSXAttribute>, jsx: NodePath<t.JSXElement>, value: AttrValue) {
  if (name !== WX_IF) {
    return
  }
  if (jsx.node.openingElement.attributes.some((a) => t.isJSXAttribute(a) && a.name.name === 'slot')) {
    return
  }
  // 考虑到wx:if和wx:for的优先级，如果同时使用，先解析wx:for
  if (
    jsx.node.openingElement.attributes.some(
      (a) => t.isJSXAttribute(a) && (a.name.name === 'wx:for' || a.name.name === 'wx:for-items')
    )
  ) {
    return
  }
  const conditions: Condition[] = []
  let siblings: NodePath<t.Node>[] = []
  try {
    siblings = jsx
      .getAllNextSiblings()
      .filter((s) => !(s.isJSXExpressionContainer() && t.isJSXEmptyExpression(s.get('expression')))) as any
  } catch (error) {
    updateLogFileContent(`WARN [taroize] transformIf - 节点过滤异常 ${getLineBreak()}${error} ${getLineBreak()}`)
    return
  }
  if (value === null || !t.isJSXExpressionContainer(value)) {
    const cacheNode = cloneDeep(attr.parentPath.parent) as any
    const position = {
      col: cacheNode.position?.start.column || 0,
      row: cacheNode.position?.start.line || 0,
    }
    createErrorCodeMsg(
      'wxIfValueFormatError',
      'wx:if 的值需要用双括号 `{{}}` 包裹它的值',
      astToCode(cacheNode) || '',
      globals.currentParseFile,
      position
    )
    console.error('wx:if 的值需要用双括号 `{{}}` 包裹它的值')
    updateLogFileContent(`WARN [taroize] transformIf - wx:if 的值需要用双括号 {{}} 包裹它的值 ${getLineBreak()}`)
    if (value && t.isStringLiteral(value)) {
      value = t.jSXExpressionContainer(buildTemplate(value.value))
    }
  }
  conditions.push({
    condition: WX_IF,
    path: jsx,
    tester: value as t.JSXExpressionContainer,
    cachePath: cloneDeep(jsx)
  })
  attr.remove()
  for (let index = 0; index < siblings.length; index++) {
    const sibling = siblings[index] as NodePath<t.JSXElement>
    const cacheSibling = cloneDeep(sibling)
    const next = cloneDeep(siblings[index + 1]) as NodePath<t.JSXElement>
    const currMatches = findWXIfProps(sibling)
    const nextMatches = findWXIfProps(next)
    if (currMatches === null) {
      break
    }
    conditions.push({
      condition: currMatches.reg.input as string,
      path: sibling as any,
      tester: currMatches.tester as t.JSXExpressionContainer,
      cachePath: cacheSibling
    })
    if (nextMatches === null) {
      break
    }
  }
  handleConditions(conditions)
}

function handleConditions (conditions: Condition[]) {
  if (conditions.length === 1) {
    const ct = conditions[0]
    if (!t.isJSXEmptyExpression(ct.tester.expression)) {
      try {
        ct.path.replaceWith(
          t.jSXExpressionContainer(t.logicalExpression('&&', ct.tester.expression, cloneDeep(ct.path.node)))
        )
      } catch (error) {
        updateLogFileContent(
          `WARN [taroize] handleConditions - 替换节点异常 ${getLineBreak()}${error} ${getLineBreak()}`
        )
        //
      }
    }
  }
  if (conditions.length > 1) {
    const lastLength = conditions.length - 1
    const lastCon = conditions[lastLength]
    // 记录当前操作的 condition
    let currentCondition: any = null
    let lastAlternate: t.Expression = cloneDeep(lastCon.path.node)
    try {
      if (lastCon.condition === WX_ELSE_IF && !t.isJSXEmptyExpression(lastCon.tester.expression)) {
        lastAlternate = t.logicalExpression('&&', lastCon.tester.expression, lastAlternate)
      }
      const node = conditions.slice(0, lastLength).reduceRight((acc: t.Expression, condition) => {
        currentCondition = condition
        if (t.isJSXEmptyExpression(condition.tester.expression)) {
          printLog(
            processTypeEnum.WARNING,
            'condition.tester.expression',
            't.isJSXEmptyExpression(condition.tester.expression)'
          )
          updateLogFileContent(
            `WARN [taroize] handleConditions - t.isJSXEmptyExpression(condition.tester.expression) ${getLineBreak()}`
          )
          return null
        }
        return t.conditionalExpression(condition.tester.expression, cloneDeep(condition.path.node), acc)
      }, lastAlternate)
      if (node != null) {
        conditions[0].path.replaceWith(t.jSXExpressionContainer(node))
        conditions.slice(1).forEach((c) => c.path.remove())
      }
    } catch (error) {
      updateLogFileContent(
        `WARN [taroize] handleConditions - wx:elif 转换异常 ${getLineBreak()}${error} ${getLineBreak()}`
      )
      const { line, column } = currentCondition.cachePath.node?.position?.start || { line: 0, column: 0 }
      const position = { col: column, row: line }
      throw new IReportError(
        '属性转换错误 wx:elif 的值需要用双括号 `{{}}` 包裹它的值',
        'wxElifValueFormatError',
        'WXML_FILE',
        astToCode(currentCondition.cachePath.node) || '',
        position
      )
    }
  }
}

function findWXIfProps (jsx: NodePath<t.JSXElement>): { reg: RegExpMatchArray, tester: AttrValue } | null {
  let matches: { reg: RegExpMatchArray, tester: AttrValue } | null = null
  jsx &&
    jsx.isJSXElement() &&
    jsx
      .get('openingElement')
      .get('attributes')
      .some((path) => {
        const attr = path.node as any
        if (t.isJSXIdentifier(attr.name) && attr != null) {
          const name = attr.name.name
          if (name === WX_IF) {
            return true
          }
          const match = name.match(/wx:else|wx:elif/)
          if (match) {
            path.remove()
            matches = {
              reg: match,
              tester: attr.value,
            }
            return true
          }
        }
        return false
      })

  return matches
}

function parseNode (node: AllKindNode, tagName?: string) {
  updateLogFileContent(`INFO [taroize] parseNode - 入参 ${getLineBreak()}tagName: ${tagName} ${getLineBreak()}`)
  if (node.type === NodeType.Text) {
    return parseText(node, tagName)
  } else if (node.type === NodeType.Comment) {
    const emptyStatement = t.jSXEmptyExpression()
    emptyStatement.innerComments = [
      {
        type: 'CommentBlock',
        value: ' ' + node.content + ' ',
      },
    ] as any[]
    const jsxExpressionContainer: t.JSXExpressionContainer = t.jSXExpressionContainer(emptyStatement)
    return addLocInfo(jsxExpressionContainer, node)
  }
  return parseElement(node)
}

function parseElement (element: Element): t.JSXElement {
  updateLogFileContent(`INFO [taroize] parseElement - 进入函数 ${getLineBreak()}`)
  const tagName = t.jSXIdentifier(
    THIRD_PARTY_COMPONENTS.has(element.tagName) ? element.tagName : allCamelCase(element.tagName)
  )
  if (DEFAULT_Component_SET.has(tagName.name)) {
    usedComponents.add(tagName.name)
  }
  let attributes = element.attributes
  if (tagName.name === 'Template') {
    let isSpread = false
    attributes = attributes.map((attr) => {
      if (attr.key === 'data') {
        const value = attr.value || ''
        const content = parseContent(value)
        if (content.type === 'expression') {
          isSpread = true
          const str = content.content
          const strLastIndex = str.length - 1
          if (str.includes('...') && str.includes(',')) {
            attr.value = `{{${str.slice(1, strLastIndex)}}}`
          } else {
            if (str.includes('...')) {
              // (...a) => {{a}}
              attr.value = `{{${str.slice(4, strLastIndex)}}}`
            } else if (/^\(([A-Za-z,\s]+)\)$/.test(str)) {
              // (a) => {{a:a}}
              attr.value = `{{${str.slice(1, strLastIndex).replace(/([A-Za-z]+)/g, '$1:$1')}}}`
            } else {
              // (a:'a') => {{a:'a'}}
              attr.value = `{{${str.slice(1, strLastIndex)}}}`
            }
          }
        } else {
          attr.value = content.content
        }
      }
      return attr
    })
    if (isSpread) {
      attributes.push({
        key: 'spread',
        value: null,
      })
    }
  }
  // return t.jSXElement(
  //   t.jSXOpeningElement(tagName, attributes.map(parseAttribute)),
  //   t.jSXClosingElement(tagName),
  //   removEmptyTextAndComment(element.children).map((el) => parseNode(el, element.tagName)),
  //   false
  // )

  const jSXElement = t.jSXElement(
    t.jSXOpeningElement(tagName, attributes.map(parseAttribute)),
    t.jSXClosingElement(tagName),
    removEmptyTextAndComment(element.children).map((el) => parseNode(el, element.tagName)),
    false
  )
  return addLocInfo(jSXElement, element)
}

export function removEmptyTextAndComment (nodes: AllKindNode[]) {
  return nodes
    .filter((node) => {
      return (
        node.type === NodeType.Element ||
        (node.type === NodeType.Text && node.content.trim().length !== 0) ||
        node.type === NodeType.Comment
      )
    })
    .filter((node, index) => !(index === 0 && node.type === NodeType.Comment))
}

function parseText (node: Text, tagName?: string) {
  updateLogFileContent(`INFO [taroize] parseText - 进入函数 ${getLineBreak()}`)
  if (tagName === 'wxs') {
    // return t.jSXText(node.content)
    return addLocInfo(t.jSXText(node.content), node)
  }
  const { type, content } = parseContent(node.content)
  if (type === 'raw') {
    const text = content.replace(/([{}]+)/g, "{'$1'}")
    // return t.jSXText(text)
    return addLocInfo(t.jSXText(text), node)
  }

  // return t.jSXExpressionContainer(buildTemplate(content))
  return addLocInfo(t.jSXExpressionContainer(buildTemplate(content)), node)
}

// 匹配{{content}}
const handlebarsRE = /\{\{((?:.|\n)+?)\}\}/g

function singleQuote (s: string) {
  return `'${s}'`
}

export function parseContent (content: string, single = false): { type: 'raw' | 'expression', content: string } {
  updateLogFileContent(`INFO [taroize] parseContent - 进入函数 ${getLineBreak()}`)
  content = content.trim()
  if (!handlebarsRE.test(content)) {
    return {
      type: 'raw',
      content,
    }
  }
  const tokens: string[] = []
  let lastIndex = (handlebarsRE.lastIndex = 0)
  let match
  let index
  let tokenValue
  while ((match = handlebarsRE.exec(content))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokenValue = content.slice(lastIndex, index)
      tokens.push(single ? singleQuote(tokenValue) : JSON.stringify(tokenValue))
    }
    // tag token
    const exp = match[1].trim()
    tokens.push(`(${exp})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < content.length) {
    tokenValue = content.slice(lastIndex)
    tokens.push(single ? singleQuote(tokenValue) : JSON.stringify(tokenValue))
  }
  return {
    type: 'expression',
    content: tokens.join('+'),
  }
}

/**
 * 判断 style 中的属性是否都是 attrName: attrValue 格式
 *
 * @param styleAttrsMap
 */
function isAllKeyValueFormat (styleAttrsMap: any[]): boolean {
  // 匹配 attrName: attrValue 格式
  const isKeyValueFormat = /^(([A-Za-z-]+)\s*):(\s*).*/
  const filterStyleAttrs = styleAttrsMap.filter((attr) => attr.trim() !== '')
  const isStringAttr = filterStyleAttrs.every((attr) => isKeyValueFormat.test(attr.trim()))
  return isStringAttr
}

/**
 * 解析内联style属性
 *
 * @param key 内联属性的类型
 * @param value 内联属性的值
 * @returns
 */
export function parseStyle (key: string, value: string) {
  updateLogFileContent(
    `INFO [taroize] parseStyle - 入参 ${getLineBreak()}key: ${key} ${getLineBreak()}value: ${value} ${getLineBreak()}`
  )
  const styleAttrs = value.trim().split(';')
  // 针对attrName: attrValue 格式做转换处理, 其他类型采用'+'连接符
  if (isAllKeyValueFormat(styleAttrs)) {
    const attrKeyValueMap: any[] = []
    parseStyleAttrs(styleAttrs, attrKeyValueMap)
    convertStyleAttrs(attrKeyValueMap)
    const objectLiteral = t.objectExpression(
      attrKeyValueMap.map((attr) => t.objectProperty(t.identifier(attr.attrName), attr.value))
    )
    return t.jSXAttribute(t.jSXIdentifier(key), t.jsxExpressionContainer(objectLiteral))
  } else {
    return parseContent(value)
  }
}

function parseAttribute (attr: Attribute) {
  updateLogFileContent(
    `INFO [taroize] parseAttribute - 入参 ${getLineBreak()}attr: ${JSON.stringify(attr)} ${getLineBreak()}`
  )
  let { key, value } = attr
  let jsxValue: null | t.JSXExpressionContainer | t.StringLiteral = null
  let type = ''
  let content = ''
  if (value) {
    const cacheValue = value
    if (key === 'class' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, value.length - 1).replace(',', '')
      createErrorCodeMsg(
        'unsupportedClassArray',
        'Taro/React 不支持 class 传入数组，此写法可能无法得到正确的 class',
        `class=${JSON.stringify(cacheValue).replace(/"/g, "'")}`,
        globals.currentParseFile
      )
      updateLogFileContent(
        `WARN [taroize] parseAttribute - Taro/React 不支持 class 传入数组，此写法可能无法得到正确的 class ${getLineBreak()}`
      )
      // eslint-disable-next-line no-console
      console.log(codeFrameError(attr, 'Taro/React 不支持 class 传入数组，此写法可能无法得到正确的 class'))
    }

    value = convertStyleUnit(value)
    // 判断属性是否为style属性
    if (key === 'style' && value) {
      try {
        const styleParseReslut = parseStyle(key, value)
        if (t.isJSXAttribute(styleParseReslut)) {
          return styleParseReslut
        } else {
          content = styleParseReslut.content
          type = styleParseReslut.type
        }
      } catch (error) {
        updateLogFileContent(
          `ERROR [taroize] parseAttribute - 属性 style="${value}" 解析异常 ${getLineBreak()}${error} ${getLineBreak()}`
        )
        throw new IReportError(
          `属性解析失败 style="${value}"解析失败，${error}`,
          'StyleAttributeParsingError',
          'WXML_FILE',
          `style="${value}"`
        )
      }
    } else {
      const parseContentResult = parseContent(value)
      content = parseContentResult.content
      type = parseContentResult.type
    }

    if (type === 'raw') {
      jsxValue = t.stringLiteral(content.replace(/"/g, "'"))
    } else {
      let expr: t.Expression
      try {
        expr = buildTemplate(content)
      } catch (error) {
        const pureContent = content.slice(1, content.length - 1)
        if (reserveKeyWords.has(pureContent)) {
          const err = `转换模板参数： \`${key}: ${value}\` 报错: \`${pureContent}\` 是 JavaScript 保留字，请不要使用它作为值。`
          if (key === WX_KEY) {
            expr = t.stringLiteral('')
          } else {
            updateLogFileContent(
              `ERROR [taroize] parseAttribute - 模板参数转换异常 ${getLineBreak()}${err} ${getLineBreak()}`
            )
            throw new IReportError(
              err,
              'TemplateParameterConversionError',
              'WXML_FILE',
              `${key}: ${value}`
            )
          }
        } else if (content.includes(':') || content.includes('...')) {
          const file = parseFile(`var a = ${attr.value!.slice(1, attr.value!.length - 1)}`, {
            plugins: ['objectRestSpread'],
          })
          expr = (file.program.body[0] as any).declarations[0].init
        } else {
          const err = `转换模板参数： \`${key}: ${value}\` 报错`
          updateLogFileContent(
            `ERROR [taroize] parseAttribute - 模板参数转换异常 ${getLineBreak()}${err} ${getLineBreak()}`
          )
          throw new IReportError(
            err,
            'TemplateParameterConversionError',
            'WXML_FILE',
            `${key}: ${value}`
          )
        }
      }
      if (t.isThisExpression(expr)) {
        createErrorCodeMsg(
          'ThisKeywordUsageWarning',
          '在参数中使用 `this` 可能会造成意想不到的结果，已将此参数修改为 `__placeholder__`，你可以在转换后的代码查找这个关键字修改。',
          value,
          globals.currentParseFile
        )
        updateLogFileContent(
          `WARN [taroize] parseAttribute - 在参数中使用 this 可能会造成意想不到的结果 ${getLineBreak()}`
        )
        console.error(
          '在参数中使用 `this` 可能会造成意想不到的结果，已将此参数修改为 `__placeholder__`，你可以在转换后的代码查找这个关键字修改。'
        )
        expr = t.stringLiteral('__placeholder__')
      }
      jsxValue = t.jSXExpressionContainer(expr)
    }
  }

  let jsxKey = handleAttrKey(key)
  if (/^on[A-Z]/.test(jsxKey) && !/^catch/.test(key) && jsxValue && t.isStringLiteral(jsxValue)) {
    jsxValue = t.jSXExpressionContainer(t.memberExpression(t.thisExpression(), t.identifier(jsxValue.value)))
  }

  if (key.startsWith('catch') && value) {
    if (value === 'true' || value.trim() === '') {
      jsxValue = t.jSXExpressionContainer(t.memberExpression(t.thisExpression(), t.identifier('privateStopNoop')))
      globals.hasCatchTrue = true
    } else if (t.isStringLiteral(jsxValue)) {
      jsxValue = t.jSXExpressionContainer(t.memberExpression(t.thisExpression(), t.identifier(jsxValue.value)))
    }
  }
  // 如果data-xxx自定义属性名xxx不是以-分隔的写法就要转成全小写属性名
  if (value && jsxKey.startsWith('data-')) {
    const realKey = jsxKey.replace(/^data-/, '')
    if (realKey.indexOf('-') === -1) {
      jsxKey = `data-${realKey.toLowerCase()}`
    }
  }
  return t.jSXAttribute(t.jSXIdentifier(jsxKey), jsxValue)
}

function handleAttrKey (key: string) {
  if (key.startsWith('wx:') || key.startsWith('wx-') || key.startsWith('data-')) {
    return key
  } else if (key === 'class') {
    return 'className'
  } else if (/^(bind|catch)[a-z|:]/.test(key)) {
    if (specialEvents.has(key)) {
      return specialEvents.get(key)!
    } else {
      key = key.replace(/^(bind:|catch:|bind|catch)/, 'on')
      key = camelCase(key)
      if (!isValidVarName(key)) {
        updateLogFileContent(`ERROR [taroize] handleAttrKey - ${key} 不是一个有效 JavaScript 变量名 ${getLineBreak()}`)
        throw new IReportError(
          `属性名"${key}" 不是一个有效 JavaScript 变量名`,
          'InvalidVariableNameError',
          'WXML_FILE',
          `${key}`,
        )
      }
      return key.substr(0, 2) + key[2].toUpperCase() + key.substr(3)
    }
  }

  return camelCase(key)
}
