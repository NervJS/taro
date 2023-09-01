import generate from '@babel/generator'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { kebabCase, snakeCase } from 'lodash'

import { Adapter, Adapters, isNewPropsSystem } from './adapter'
import {
  DEFAULT_Component_SET,
  DEFAULT_Component_SET_COPY,
  FN_PREFIX,
  lessThanSignPlacehold,
  SPECIAL_COMPONENT_PROPS,
  swanSpecialAttrs,
  THIRD_PARTY_COMPONENTS,
  TRANSFORM_COMPONENT_PROPS,
} from './constant'
import { createHTMLElement } from './create-html-element'
import { Status } from './functional'
import { transformOptions } from './options'
import { codeFrameError, decodeUnicode } from './utils'

export function isStartWithWX(str: string) {
  return str[0] === 'w' && str[1] === 'x'
}

const specialComponentName = ['block', 'Block', 'slot', 'Slot']

export function removeJSXThisProperty(path: NodePath<t.ThisExpression>) {
  if (!path.parentPath.isCallExpression()) {
    const p = path.getSibling('property')
    if (p.isIdentifier({ name: 'props' }) || p.isIdentifier({ name: 'state' })) {
      path.parentPath.replaceWithSourceString('this')
    } else {
      path.parentPath.replaceWith(p)
    }
  }
}

export function findJSXAttrByName(attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[], name: string) {
  for (const attr of attrs) {
    if (!t.isJSXAttribute(attr)) continue

    if (!t.isJSXIdentifier(attr.name)) {
      break
    }
    if (attr.name.name === name) {
      return attr
    }
  }
  return null
}

export function buildRefTemplate(name: string, refName?: string, loop?: boolean, key?: t.JSXAttribute) {
  const isSwan = Adapter.type === Adapters.swan
  const dataString = isSwan
    ? `{{{...${refName ? `${loop ? '' : '$$'}${refName}` : '__data'}}}}`
    : `{{...${refName ? `${loop ? '' : '$$'}${refName}` : '__data'}}}`
  const attrs = [
    t.jSXAttribute(t.jSXIdentifier('is'), t.stringLiteral(name)),
    t.jSXAttribute(t.jSXIdentifier('data'), t.stringLiteral(dataString)),
  ]
  if (key) {
    attrs.push(key)
  }
  return t.jSXElement(
    t.jSXOpeningElement(t.jSXIdentifier('template'), attrs),
    t.jSXClosingElement(t.jSXIdentifier('template')),
    []
  )
}

export function buildJSXAttr(name: string, value: t.Identifier | t.Expression) {
  return t.jSXAttribute(t.jSXIdentifier(name), t.jSXExpressionContainer(value))
}

export function newJSXIfAttr(jsx: t.JSXElement, value: t.Identifier | t.Expression) {
  jsx.openingElement.attributes.push(buildJSXAttr(Adapter.if, value))
}

export function setJSXAttr(
  jsx: t.JSXElement,
  name: string,
  value?: t.StringLiteral | t.JSXExpressionContainer | t.JSXElement,
  path?: NodePath<t.JSXElement>
) {
  if ((name === Adapter.forIndex || name === Adapter.forItem) && Adapter.type === Adapters.quickapp) {
    return
  }
  const element = jsx.openingElement
  // tslint:disable-next-line: strict-type-predicates
  if (element == null || !t.isJSXIdentifier(element.name)) {
    return
  }
  if (element.name.name === 'Block' || element.name.name === 'block' || !path) {
    jsx.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier(name), value))
  } else {
    const block = buildBlockElement()
    setJSXAttr(block, name, value)
    block.children = [jsx]
    path.node = block
  }
}

export function buildTrueJSXAttrValue() {
  return t.jSXExpressionContainer(t.booleanLiteral(true))
}

export function generateJSXAttr(ast: t.Node) {
  const options = {
    quotes: 'single',
    retainFunctionParens: true, // 如果您需要 JSON 兼容的字符串，请改用此选项
  }
  const code = decodeUnicode(generate(ast as any, options).code).replace(/</g, lessThanSignPlacehold)
  if (Status.isSFC) {
    return code
  }
  return code
    .replace(/(this\.props\.)|(this\.state\.)/g, '')
    .replace(/(props\.)|(state\.)/g, '')
    .replace(/this\./g, '')
}

export function isAllLiteral(...args) {
  return args.every((p) => t.isLiteral(p))
}

export function buildBlockElement(attrs: t.JSXAttribute[] = [], isView = false) {
  let blockName = Adapter.type === Adapters.quickapp ? 'div' : 'block'
  if (isView) {
    blockName = 'View'
  }
  return t.jSXElement(
    t.jSXOpeningElement(t.jSXIdentifier(blockName), attrs),
    t.jSXClosingElement(t.jSXIdentifier(blockName)),
    []
  )
}

function parseJSXChildren(children: (t.JSXElement | t.JSXText | t.JSXExpressionContainer)[]): string {
  return children.reduce((str, child) => {
    if (t.isJSXText(child)) {
      const strings: string[] = []
      child.value.split(/(\r?\n\s*)/).forEach((val) => {
        const value = val
          .replace(/\u00a0/g, '&nbsp;')
          .replace(/\u2002/g, '&ensp;')
          .replace(/\u2003/g, '&emsp;')
        if (!value) {
          return
        }
        if (value.startsWith('\n')) {
          return
        }
        strings.push(value)
      })
      return str + strings.join('')
    }
    if (t.isJSXElement(child)) {
      return str + parseJSXElement(child)
    }
    if (t.isJSXExpressionContainer(child)) {
      if (t.isJSXElement(child.expression)) {
        return str + parseJSXElement(child.expression)
      }
      return str + `{${generateJSXAttr(child)}}`
    }
    return str
  }, '')
}

export function parseJSXElement(element: t.JSXElement, isFirstEmit = false): string {
  const children = element.children
  const { attributes, name } = element.openingElement
  const TRIGGER_OBSERER =
    Adapter.type === Adapters.swan || Adapter.type === Adapters.quickapp ? 'privateTriggerObserer' : '__triggerObserer'
  const TRIGGER_OBSERER_KEY = Adapter.type === Adapters.quickapp ? 'privateTriggerObsererKey' : '_triggerObserer'
  if (t.isJSXMemberExpression(name)) {
    throw codeFrameError(name.loc, '暂不支持 JSX 成员表达式')
  }
  const componentName = name.name
  const isDefaultComponent = DEFAULT_Component_SET.has(componentName as string)
  const componentSpecialProps = SPECIAL_COMPONENT_PROPS.get(componentName as string)
  const componentTransfromProps = TRANSFORM_COMPONENT_PROPS.get(Adapter.type)
  let hasElseAttr = false
  const isJSXMetHod =
    componentName === 'Template' &&
    attributes.some(
      (a) =>
        t.isJSXAttribute(a) && a.name.name === 'is' && t.isStringLiteral(a.value) && a.value.value.startsWith('render')
    )
  attributes.forEach((a, index) => {
    if (
      t.isJSXAttribute(a) &&
      a.name.name === Adapter.else &&
      !['block', 'Block'].includes(componentName as string) &&
      !isDefaultComponent
    ) {
      hasElseAttr = true
      attributes.splice(index, 1)
    }
  })
  if (hasElseAttr) {
    return createHTMLElement({
      name: 'block',
      attributes: {
        [Adapter.else]: true,
      },
      value: parseJSXChildren([element]),
    })
  }
  let attributesTrans = {}
  if (attributes.length) {
    attributesTrans = attributes.reduce((obj, attr) => {
      if (t.isJSXSpreadAttribute(attr)) {
        if (isNewPropsSystem()) return {}
        // @ts-ignore
        throw codeFrameError(attr.loc, 'JSX 参数暂不支持 ...spread 表达式')
      }
      let name = attr.name.name
      if (DEFAULT_Component_SET.has(componentName as string)) {
        if (name === 'className') {
          name = 'class'
        }
        if (typeof name === 'string' && /(^on[A-Z_])|(^catch[A-Z_])/.test(name) && Adapter.type === Adapters.quickapp) {
          name = name.toLowerCase()
        }
      }
      if (
        Adapters.quickapp === Adapter.type &&
        !DEFAULT_Component_SET_COPY.has(componentName as string) &&
        typeof name === 'string' &&
        !/(^on[A-Z_])|(^catch[A-Z_])/.test(name)
      ) {
        name = snakeCase(name)
      }
      let value: string | boolean = true
      let attrValue = attr.value
      if (typeof name === 'string') {
        const isAlipayOrQuickappEvent =
          (Adapter.type === Adapters.alipay || Adapter.type === Adapters.quickapp) &&
          /(^on[A-Z_])|(^catch[A-Z_])/.test(name)
        if (t.isStringLiteral(attrValue)) {
          value = attrValue.value
        } else if (t.isJSXExpressionContainer(attrValue)) {
          let isBindEvent =
            (name.startsWith('bind') && name !== 'bind') || (name.startsWith('catch') && name !== 'catch')
          const options = {
            quotes: 'single',
            concise: true,
          }
          let code = decodeUnicode(generate(attrValue.expression as any, options).code)
            .replace(/"/g, "'")
            .replace(/(this\.props\.)|(this\.state\.)/g, '')
            .replace(/this\./g, '')
          if (
            Adapters.swan === Adapter.type &&
            code !== 'true' &&
            code !== 'false' &&
            swanSpecialAttrs[componentName as string] &&
            swanSpecialAttrs[componentName as string].includes(name)
          ) {
            value = `{= ${code} =}`
          } else {
            if (Adapter.key === name) {
              const splitCode = code.split('.')
              if (splitCode.length > 1) {
                value = splitCode.slice(1).join('.')
              } else {
                value = code
              }
            } else {
              const isTemplateData = isJSXMetHod && name === 'data'
              value =
                isBindEvent || isAlipayOrQuickappEvent
                  ? code
                  : `{{${isJSXMetHod && name === 'data' ? '...' : ''}${code}}}`
              if (isTemplateData && Adapters.swan === Adapter.type) {
                value = `{${value}}`
              }
            }
          }
          if (Adapter.type === Adapters.swan && name === Adapter.for) {
            value = code
          }
          if (t.isStringLiteral(attrValue.expression)) {
            value = attrValue.expression.value
          }
          // tslint:disable-next-line: strict-type-predicates
        } else if (attrValue === null && name !== Adapter.else) {
          value = `{{true}}`
        }
        if (THIRD_PARTY_COMPONENTS.has(componentName as string) && /^bind/.test(name) && name.includes('-')) {
          name = name.replace(/^bind/, 'bind:')
        }
        if (componentTransfromProps && componentTransfromProps[componentName as string]) {
          const transfromProps = componentTransfromProps[componentName as string]
          Object.keys(transfromProps).forEach((oriName) => {
            if (name === oriName) {
              name = transfromProps[oriName]
            }
          })
        }
        if ((componentName === 'Input' || componentName === 'input') && name === 'maxLength') {
          // @ts-ignore
          obj.maxlength = value
        } else if (
          (componentSpecialProps && componentSpecialProps.has(name)) ||
          name.startsWith(FN_PREFIX) ||
          isAlipayOrQuickappEvent
        ) {
          obj[name] = value
        } else {
          obj[isDefaultComponent && !name.includes('-') && !name.includes(':') ? kebabCase(name) : name] = value
        }
      }
      if (!isDefaultComponent && !specialComponentName.includes(componentName as string) && !isNewPropsSystem()) {
        obj[TRIGGER_OBSERER] = `{{ ${TRIGGER_OBSERER_KEY} }}`
      }
      return obj
    }, {})
  } else if (!isDefaultComponent && !specialComponentName.includes(componentName as string)) {
    if (!isNewPropsSystem()) {
      attributesTrans[TRIGGER_OBSERER] = `{{ ${TRIGGER_OBSERER_KEY} }}`
    }
  }

  let elementStr

  if (isFirstEmit && Adapters.quickapp === Adapter.type && !transformOptions.isRoot) {
    const rootAttributes = Object.assign({}, attributesTrans)
    delete rootAttributes[Adapter.if]
    elementStr = createHTMLElement(
      {
        name: kebabCase(componentName as string),
        attributes: rootAttributes,
        value: createHTMLElement({
          name: 'block',
          attributes: { [Adapter.if]: attributesTrans[Adapter.if] },
          value: parseJSXChildren(children as any),
        }),
      },
      isFirstEmit
    )
  } else {
    elementStr = createHTMLElement(
      {
        name: kebabCase(componentName as string),
        attributes: attributesTrans,
        value: parseJSXChildren(children as any),
      },
      isFirstEmit
    )
  }

  return elementStr
}

export function generateHTMLTemplate(template: t.JSXElement, name: string) {
  return createHTMLElement({
    name: 'template',
    attributes: {
      name,
    },
    value: parseJSXElement(template),
  })
}
