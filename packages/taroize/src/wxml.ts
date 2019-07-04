import { parse } from 'himalaya-wxml'
import * as t from 'babel-types'
import { camelCase, cloneDeep } from 'lodash'
import traverse, { NodePath, Visitor } from 'babel-traverse'
import { buildTemplate, DEFAULT_Component_SET, buildImportStatement, buildBlockElement, parseCode, codeFrameError, isValidVarName } from './utils'
import { specialEvents } from './events'
import { parseTemplate, parseModule } from './template'
import { usedComponents, errors, globals } from './global'
import { reserveKeyWords } from './constant'
import { parse as parseFile } from 'babylon'

const allCamelCase = (str: string) =>
  str.charAt(0).toUpperCase() + camelCase(str.substr(1))

function buildSlotName (slotName: string) {
  return `render${slotName[0].toUpperCase() + slotName.replace('-', '').slice(1)}`
}

enum NodeType {
  Element = 'element',
  Comment = 'comment',
  Text = 'text'
}

interface Element {
  type: NodeType.Element
  tagName: string
  children: Node[]
  attributes: Attribute[]
}

interface Attribute {
  key: string
  value: string | null
}

interface Comment {
  type: NodeType.Comment
  content: string
}

interface Text {
  type: NodeType.Text
  content: string
}

export interface WXS {
  module: string
  src: string
}

type AllKindNode = Element | Comment | Text
type Node = Element | Text
interface Condition {
  condition: string
  path: NodePath<t.JSXElement>
  tester: t.JSXExpressionContainer
}

type AttrValue =
  | t.StringLiteral
  | t.JSXElement
  | t.JSXExpressionContainer
  | null

export interface Imports {
  ast: t.File,
  name: string,
  wxs?: boolean
}

const WX_IF = 'wx:if'
const WX_ELSE_IF = 'wx:elif'
const WX_FOR = 'wx:for'
const WX_FOR_ITEM = 'wx:for-item'
const WX_FOR_INDEX = 'wx:for-index'
const WX_KEY = 'wx:key'

export const wxTemplateCommand = [
  WX_IF,
  WX_ELSE_IF,
  WX_FOR,
  WX_FOR_ITEM,
  WX_FOR_INDEX,
  WX_KEY,
  'wx:else'
]

function buildElement (
  name: string,
  children: Node[] = [],
  attributes: Attribute[] = []
): Element {
  return {
    tagName: name,
    type: NodeType.Element,
    attributes,
    children
  }
}

export const createWxmlVistor = (
  loopIds: Set<string>,
  refIds: Set<string>,
  dirPath: string,
  wxses: WXS[] = [],
  imports: Imports[] = []
) => {
  const jsxAttrVisitor = (path: NodePath<t.JSXAttribute>) => {
    const name = path.node.name as t.JSXIdentifier
    const jsx = path.findParent(p => p.isJSXElement()) as NodePath<
      t.JSXElement
    >
    const valueCopy = cloneDeep(path.get('value').node)
    transformIf(name.name, path, jsx, valueCopy)
    const loopItem = transformLoop(name.name, path, jsx, valueCopy)
    if (loopItem) {
      if (loopItem.index) {
        loopIds.add(loopItem.index)
      }
      if (loopItem.item) {
        loopIds.add(loopItem.item)
      }
    }
  }
  return {
    JSXAttribute: jsxAttrVisitor,
    JSXIdentifier (path) {
      const nodeName = path.node.name
      if (path.parentPath.isJSXAttribute()) {
        if (nodeName === WX_KEY) {
          path.replaceWith(t.jSXIdentifier('key'))
        }
        if (nodeName.startsWith('wx:') && !wxTemplateCommand.includes(nodeName)) {
          // tslint:disable-next-line
          console.log(`未知 wx 作用域属性： ${nodeName}，该属性会被移除掉。`)
          path.parentPath.remove()
        }
      }
    },
    JSXElement: {
      enter (path: NodePath<t.JSXElement>) {
        const openingElement = path.get('openingElement')
        const jsxName = openingElement.get('name')
        const attrs = openingElement.get('attributes')
        if (!jsxName.isJSXIdentifier()) {
          return
        }
        path.traverse({
          Identifier (p) {
            if (!p.isReferencedIdentifier()) {
              return
            }
            const jsxExprContainer = p.findParent(p => p.isJSXExpressionContainer())
            if (!jsxExprContainer || !jsxExprContainer.isJSXExpressionContainer()) {
              return
            }
            if (isValidVarName(p.node.name)) {
              refIds.add(p.node.name)
            }
          },
          JSXAttribute: jsxAttrVisitor
        })
        const slotAttr = attrs.find(a => a.node.name.name === 'slot')
        if (slotAttr) {
          const slotValue = slotAttr.node.value
          if (slotValue && t.isStringLiteral(slotValue)) {
            const slotName = slotValue.value
            const parentComponent = path.findParent(p => p.isJSXElement() && t.isJSXIdentifier(p.node.openingElement.name) && !DEFAULT_Component_SET.has(p.node.openingElement.name.name))
            if (parentComponent && parentComponent.isJSXElement()) {
              slotAttr.remove()
              path.traverse({
                JSXAttribute: jsxAttrVisitor
              })
              const block = buildBlockElement()
              block.children = [cloneDeep(path.node)]
              parentComponent.node.openingElement.attributes.push(
                t.jSXAttribute(
                  t.jSXIdentifier(buildSlotName(slotName)),
                  t.jSXExpressionContainer(block)
                )
              )
              path.remove()
            }
          } else {
            throw codeFrameError(slotValue, 'slot 的值必须是一个字符串')
          }
        }
        const tagName = jsxName.node.name
        if (tagName === 'Slot') {
          const nameAttr = attrs.find(a => a.node.name.name === 'name')
          let slotName = ''
          if (nameAttr) {
            if (nameAttr.node.value && t.isStringLiteral(nameAttr.node.value)) {
              slotName = nameAttr.node.value.value
            } else {
              throw codeFrameError(jsxName.node, 'slot 的值必须是一个字符串')
            }
          }
          const children = t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('props')),
            t.identifier(slotName ? buildSlotName(slotName) : 'children')
          )
          try {
            path.replaceWith(path.parentPath.isJSXElement() ? t.jSXExpressionContainer(children) : children)
          } catch (error) {
            //
          }
        }
        if (tagName === 'Wxs') {
          wxses.push(getWXS(attrs.map(a => a.node), path, imports))
        }
        if (tagName === 'Template') {
          // path.traverse({
          //   JSXAttribute: jsxAttrVisitor
          // })
          const template = parseTemplate(path, dirPath)
          if (template) {
            const { ast: classDecl, name } = template
            const taroComponentsImport = buildImportStatement('@tarojs/components', [
              ...usedComponents
            ])
            const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
            // const withWeappImport = buildImportStatement(
            //   '@tarojs/with-weapp',
            //   [],
            //   'withWeapp'
            // )
            const ast = t.file(t.program([]))
            ast.program.body.unshift(
              taroComponentsImport,
              taroImport,
              // withWeappImport,
              t.exportDefaultDeclaration(classDecl)
            )
            let usedTemplate = new Set<string>()

            traverse(ast, {
              JSXIdentifier (p) {
                const node = p.node
                if (node.name.endsWith('Tmpl') && node.name.length > 4 && p.parentPath.isJSXOpeningElement()) {
                  usedTemplate.add(node.name)
                }
              }
            })
            usedTemplate.forEach(componentName => {
              if (componentName !== classDecl.id.name) {
                ast.program.body.unshift(
                  buildImportStatement(`./${componentName}`, [], componentName)
                )
              }
            })
            imports.push({
              ast,
              name
            })
          }
        }
        if (tagName === 'Import') {
          const mods = parseModule(path, dirPath, 'import')
          if (mods) {
            imports.push(...mods)
          }
        }
        if (tagName === 'Include') {
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
          if (t.isJSXExpressionContainer(caller) && t.isCallExpression(caller.expression) && !path.parentPath.isExpressionStatement()) {
            try {
              path.replaceWith(caller)
            } catch (error) {
              //
            }
          }
        }
      }
    }
  } as Visitor
}

export function parseWXML (dirPath: string, wxml?: string, parseImport?: boolean): {
  wxses: WXS[]
  wxml?: t.Node
  imports: Imports[]
  refIds: Set<string>
} {
  if (!parseImport) {
    errors.length = 0
    usedComponents.clear()
  }
  usedComponents.add('Block')
  let wxses: WXS[] = []
  let imports: Imports[] = []
  const refIds = new Set<string>()
  const loopIds = new Set<string>()
  if (!wxml) {
    return {
      wxses,
      imports,
      refIds,
      wxml: t.nullLiteral()
    }
  }
  const nodes = removEmptyTextAndComment(parse(wxml.trim()))
  const ast = t.file(
    t.program(
      [
        t.expressionStatement(parseNode(
          buildElement('block', nodes as Node[])
        ) as t.Expression)
      ],
      []
    )
  )

  traverse(ast, createWxmlVistor(loopIds, refIds, dirPath, wxses, imports))

  refIds.forEach(id => {
    if (loopIds.has(id) || imports.filter(i => i.wxs).map(i => i.name).includes(id)) {
      refIds.delete(id)
    }
  })

  return {
    wxses,
    imports,
    wxml: hydrate(ast),
    refIds
  }
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
        throw new Error('WXS 标签的属性值不得为空')
      }
      if (t.isStringLiteral(attrValue)) {
        value = attrValue.value
      } else if (
        t.isJSXExpressionContainer(attrValue) &&
        t.isStringLiteral(attrValue.expression)
      ) {
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
    const { children: [ script ] } = path.node
    if (!t.isJSXText(script)) {
      throw new Error('wxs 如果没有 src 属性，标签内部必须有 wxs 代码。')
    }
    src = './wxs__' + moduleName
    imports.push({
      ast: parseCode(script.value),
      name: moduleName as string,
      wxs: true
    })
  }

  if (!moduleName || !src) {
    throw new Error('一个 WXS 需要同时存在两个属性：`wxs`, `src`')
  }

  path.remove()

  return {
    module: moduleName,
    src
  }
}

function hydrate (file: t.File) {
  const ast = file.program.body[0]
  if (ast && t.isExpressionStatement(ast) && t.isJSXElement(ast.expression)) {
    const jsx = ast.expression
    if (jsx.children.length === 1) {
      const children = jsx.children[0]
      return t.isJSXExpressionContainer(children)
        ? children.expression
        : children
    } else {
      return jsx
    }
  }
}

function transformLoop (
  name: string,
  attr: NodePath<t.JSXAttribute>,
  jsx: NodePath<t.JSXElement>,
  value: AttrValue
) {
  const jsxElement = jsx.get('openingElement')
  if (!jsxElement.node) {
    return
  }
  const attrs = jsxElement.get('attributes').map(a => a.node)
  const wxForItem = attrs.find(a => a.name.name === WX_FOR_ITEM)
  const hasSinglewxForItem = wxForItem && wxForItem.value && t.isJSXExpressionContainer(wxForItem.value)
  if (hasSinglewxForItem || name === WX_FOR || name === 'wx:for-items') {
    if (!value || !t.isJSXExpressionContainer(value)) {
      throw new Error('wx:for 的值必须使用 "{{}}"  包裹')
    }
    attr.remove()
    let item = t.stringLiteral('item')
    let index = t.stringLiteral('index')
    jsx
      .get('openingElement')
      .get('attributes')
      .forEach(p => {
        const node = p.node
        if (node.name.name === WX_FOR_ITEM) {
          if (!node.value || !t.isStringLiteral(node.value)) {
            throw new Error(WX_FOR_ITEM + ' 的值必须是一个字符串')
          }
          item = node.value
          p.remove()
        }
        if (node.name.name === WX_FOR_INDEX) {
          if (!node.value || !t.isStringLiteral(node.value)) {
            throw new Error(WX_FOR_INDEX + ' 的值必须是一个字符串')
          }
          index = node.value
          p.remove()
        }
      })

    const replacement = t.jSXExpressionContainer(
      t.callExpression(
        t.memberExpression(value.expression, t.identifier('map')),
        [
          t.arrowFunctionExpression(
            [t.identifier(item.value), t.identifier(index.value)],
            t.blockStatement([t.returnStatement(jsx.node)])
          )
        ]
      )
    )

    const block = buildBlockElement()
    block.children = [replacement]
    try {
      jsx.replaceWith(block)
    } catch (error) {
      //
    }

    return {
      item: item.value,
      index: index.value
    }
  }
}

function transformIf (
  name: string,
  attr: NodePath<t.JSXAttribute>,
  jsx: NodePath<t.JSXElement>,
  value: AttrValue
) {
  if (name !== WX_IF) {
    return
  }
  const conditions: Condition[] = []
  let siblings: NodePath<t.Node>[] = []
  try {
    siblings = jsx.getAllNextSiblings().filter(s => !(s.isJSXExpressionContainer() && s.get('expression').isJSXEmptyExpression()))
  } catch (error) {
    return
  }
  if (value === null || !t.isJSXExpressionContainer(value)) {
    // tslint:disable-next-line
    console.error('wx:if 的值需要用双括号 `{{}}` 包裹它的值')
    if (value && t.isStringLiteral(value)) {
      value = t.jSXExpressionContainer(buildTemplate(value.value))
    }
  }
  conditions.push({
    condition: WX_IF,
    path: jsx,
    tester: value as t.JSXExpressionContainer
  })
  attr.remove()
  for (let index = 0; index < siblings.length; index++) {
    const sibling = siblings[index]
    const next = cloneDeep(siblings[index + 1])
    const currMatches = findWXIfProps(sibling)
    const nextMatches = findWXIfProps(next)
    if (currMatches === null) {
      break
    }
    conditions.push({
      condition: currMatches.reg.input as string,
      path: sibling as any,
      tester: currMatches.tester as t.JSXExpressionContainer
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
    try {
      ct.path.replaceWith(
        t.jSXExpressionContainer(
          t.logicalExpression('&&', ct.tester.expression, cloneDeep(ct.path.node))
        )
      )
    } catch (error) {
      //
    }
  }
  if (conditions.length > 1) {
    const lastLength = conditions.length - 1
    const lastCon = conditions[lastLength]
    let lastAlternate: t.Expression = cloneDeep(lastCon.path.node)
    if (lastCon.condition === WX_ELSE_IF) {
      lastAlternate = t.logicalExpression(
        '&&',
        lastCon.tester.expression,
        lastAlternate
      )
    }
    const node = conditions
      .slice(0, lastLength)
      .reduceRight((acc: t.Expression, condition) => {
        return t.conditionalExpression(
          condition.tester.expression,
          cloneDeep(condition.path.node),
          acc
        )
      }, lastAlternate)
    conditions[0].path.replaceWith(t.jSXExpressionContainer(node))
    conditions.slice(1).forEach(c => c.path.remove())
  }
}

function findWXIfProps (
  jsx: NodePath<t.Node>
): { reg: RegExpMatchArray; tester: AttrValue } | null {
  let matches: { reg: RegExpMatchArray; tester: AttrValue } | null = null
  jsx &&
    jsx.isJSXElement() &&
    jsx
      .get('openingElement')
      .get('attributes')
      .some(path => {
        const attr = path.node
        if (t.isJSXIdentifier(attr.name)) {
          const name = attr.name.name
          if (name === WX_IF) {
            return true
          }
          const match = name.match(/wx:else|wx:elif/)
          if (match) {
            path.remove()
            matches = {
              reg: match,
              tester: attr.value
            }
            return true
          }
        }
        return false
      })

  return matches
}

function parseNode (node: AllKindNode, tagName?: string) {
  if (node.type === NodeType.Text) {
    return parseText(node, tagName)
  } else if (node.type === NodeType.Comment) {
    const emptyStatement = t.jSXEmptyExpression()
    emptyStatement.innerComments = [{
      type: 'CommentBlock',
      value: ' ' + node.content + ' '
    }] as any[]
    return t.jSXExpressionContainer(emptyStatement)
  }
  return parseElement(node)
}

function parseElement (element: Element): t.JSXElement {
  const tagName = t.jSXIdentifier(allCamelCase(element.tagName))
  if (DEFAULT_Component_SET.has(tagName.name)) {
    usedComponents.add(tagName.name)
  }
  let attributes = element.attributes
  if (tagName.name === 'Template') {
    let isSpread = false
    attributes = attributes.map(attr => {
      if (attr.key === 'data') {
        const value = attr.value || ''
        const content = parseContent(value)
        if (content.type === 'expression') {
          isSpread = true
          const str = content.content
          if (str.includes('...') && str.includes(',')) {
            attr.value = `{{${str.slice(1, str.length - 1)}}}`
          } else {
            attr.value = `{{${str.slice(str.includes('...') ? 4 : 1 , str.length - 1)}}}`
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
        value: null
      })
    }
  }
  return t.jSXElement(
    t.jSXOpeningElement(tagName, attributes.map(parseAttribute)),
    t.jSXClosingElement(tagName),
    removEmptyTextAndComment(element.children).map((el) => parseNode(el, element.tagName)),
    false
  )
}

function removEmptyTextAndComment (nodes: AllKindNode[]) {
  return nodes.filter(node => {
    return node.type === NodeType.Element
      || (node.type === NodeType.Text && node.content.trim().length !== 0)
      || node.type === NodeType.Comment
  }).filter((node, index) => !(index === 0 && node.type === NodeType.Comment))
}

function parseText (node: Text, tagName?: string) {
  if (tagName === 'wxs') {
    return t.jSXText(node.content)
  }
  const { type, content } = parseContent(node.content)
  if (type === 'raw') {
    const text = content.replace(/([{}]+)/g,"{'$1'}")
    return t.jSXText(text)
  }
  return t.jSXExpressionContainer(buildTemplate(content))
}

const handlebarsRE = /\{\{((?:.|\n)+?)\}\}/g

function parseContent (content: string) {
  content = content.trim()
  if (!handlebarsRE.test(content)) {
    return {
      type: 'raw',
      content
    }
  }
  const tokens: string[] = []
  let lastIndex = (handlebarsRE.lastIndex = 0)
  let match
  let index
  let tokenValue
  // tslint:disable-next-line
  while ((match = handlebarsRE.exec(content))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokenValue = content.slice(lastIndex, index)
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = match[1].trim()
    tokens.push(`(${exp})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < content.length) {
    tokenValue = content.slice(lastIndex)
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    type: 'expression',
    content: tokens.join('+')
  }
}

function parseAttribute (attr: Attribute) {
  let { key, value } = attr
  let jsxValue: null | t.JSXExpressionContainer | t.StringLiteral = null
  if (value) {
    if (key === 'class' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, value.length - 1).replace(',', '')
      // tslint:disable-next-line
      console.log(codeFrameError(attr, 'Taro/React 不支持 class 传入数组，此写法可能无法得到正确的 class'))
    }
    const { type, content } = parseContent(value)

    if (type === 'raw') {
      jsxValue = t.stringLiteral(content)
    } else {
      let expr: t.Expression
      try {
        expr = buildTemplate(content)
      } catch (error) {
        const pureContent = content.slice(1, content.length - 1)
        if (reserveKeyWords.has(pureContent) && type !== 'raw') {
          const err = `转换模板参数： \`${key}: ${value}\` 报错: \`${pureContent}\` 是 JavaScript 保留字，请不要使用它作为值。`
          if (key === WX_KEY) {
            expr = t.stringLiteral('')
          } else {
            throw new Error(err)
          }
        } else if (content.includes(':') || (content.includes('...') && content.includes(','))) {
          const file = parseFile(`var a = ${attr.value!.slice(1, attr.value!.length - 1)}`, { plugins: ['objectRestSpread'] })
          expr = file.program.body[0].declarations[0].init
        } else {
          const err = `转换模板参数： \`${key}: ${value}\` 报错`
          throw new Error(err)
        }
      }
      if (t.isThisExpression(expr)) {
        // tslint:disable-next-line
        console.error('在参数中使用 `this` 可能会造成意想不到的结果，已将此参数修改为 `__placeholder__`，你可以在转换后的代码查找这个关键字修改。')
        expr = t.stringLiteral('__placeholder__')
      }
      jsxValue = t.jSXExpressionContainer(expr)
    }
  }

  const jsxKey = handleAttrKey(key)
  if (/^on[A-Z]/.test(jsxKey) && jsxValue && t.isStringLiteral(jsxValue)) {
    jsxValue = t.jSXExpressionContainer(
      t.memberExpression(t.thisExpression(), t.identifier(jsxValue.value))
    )
  }

  if (key.startsWith('catch') && value && (value === 'true' || value.trim() === '')) {
    jsxValue = t.jSXExpressionContainer(
      t.memberExpression(t.thisExpression(), t.identifier('privateStopNoop'))
    )
    globals.hasCatchTrue = true
  }
  return t.jSXAttribute(t.jSXIdentifier(jsxKey), jsxValue)
}

function handleAttrKey (key: string) {
  if (
    key.startsWith('wx:') ||
    key.startsWith('wx-') ||
    key.startsWith('data-')
  ) {
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
        throw new Error(`"${key}" 不是一个有效 JavaScript 变量名`)
      }
      return key.substr(0, 2) + key[2].toUpperCase() + key.substr(3)
    }
  }

  return camelCase(key)
}
