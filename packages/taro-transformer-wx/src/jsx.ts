import generate from 'babel-generator'
import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import { kebabCase } from 'lodash'
import { DEFAULT_Component_SET, SPECIAL_COMPONENT_PROPS } from './constant'
import { createHTMLElement } from './create-html-element'
import { codeFrameError } from './utils'

export function isStartWithWX (str: string) {
  return str[0] === 'w' && str[1] === 'x'
}

export function removeJSXThisProperty (path: NodePath<t.ThisExpression>) {
  if (!path.parentPath.isCallExpression()) {
    const p = path.getSibling('property')
    if (
      p.isIdentifier({ name: 'props' }) ||
      p.isIdentifier({ name: 'state' })
    ) {
      path.parentPath.replaceWithSourceString('this')
    } else {
      path.parentPath.replaceWith(p)
    }
  }
}

export function buildRefTemplate (name: string, refName?: string, loop?: boolean, key?: t.JSXAttribute) {
  const attrs = [
    t.jSXAttribute(t.jSXIdentifier('is'), t.stringLiteral(name)),
    t.jSXAttribute(t.jSXIdentifier('data'), t.stringLiteral(`{{...${refName ? `${loop ? '' : '$$'}${refName}` : '__data'}}}`))
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

export function buildJSXAttr (name: string, value: t.Identifier | t.Expression) {
  return t.jSXAttribute(t.jSXIdentifier(name), t.jSXExpressionContainer(value))
}

export function newJSXIfAttr (
  jsx: t.JSXElement,
  value: t.Identifier | t.Expression
) {
  jsx.openingElement.attributes.push(buildJSXAttr('wx:if', value))
}

export function setJSXAttr (
  jsx: t.JSXElement,
  name: string,
  value?: t.StringLiteral | t.JSXExpressionContainer | t.JSXElement,
  path?: NodePath<t.JSXElement>
) {
  const element = jsx.openingElement
  if (!t.isJSXIdentifier(element.name)) {
    return
  }
  if (element.name.name === 'Block' || element.name.name === 'block' || !path) {
    jsx.openingElement.attributes.push(
      t.jSXAttribute(t.jSXIdentifier(name), value)
    )
  } else {
    const block = buildBlockElement()
    setJSXAttr(block, name, value)
    block.children = [jsx]
    path.node = block
  }
}

export function isAllLiteral (...args) {
  return args.every(p => t.isLiteral(p))
}

export function buildBlockElement () {
  return t.jSXElement(
    t.jSXOpeningElement(t.jSXIdentifier('block'), []),
    t.jSXClosingElement(t.jSXIdentifier('block')),
    []
  )
}

function parseJSXChildren (
  children: (t.JSXElement | t.JSXText | t.JSXExpressionContainer)[]
): string {
  return children
    .filter(child => {
      return !(t.isJSXText(child) && child.value.trim() === '')
    })
    .reduce((str, child) => {
      if (t.isJSXText(child)) {
        return str + child.value
      }
      if (t.isJSXElement(child)) {
        return str + parseJSXElement(child)
      }
      if (t.isJSXExpressionContainer(child)) {
        if (t.isJSXElement(child.expression)) {
          return str + parseJSXElement(child.expression)
        }
        return str + `{${
          generate(child)
          .code
          .replace(/(this\.props\.)|(this\.state\.)/, '')
          .replace(/this\./, '')
        }}`
      }
      return str
    }, '')
}

export function parseJSXElement (element: t.JSXElement): string {
  const children = element.children
  const { attributes, name } = element.openingElement
  if (t.isJSXMemberExpression(name)) {
    throw codeFrameError(name.loc, '暂不支持 JSX 成员表达式')
  }
  const isDefaultComponent = DEFAULT_Component_SET.has(name.name)
  const componentSpecialProps = SPECIAL_COMPONENT_PROPS.get(name.name)
  return createHTMLElement({
    name: kebabCase(name.name),
    attributes: attributes.reduce((obj, attr) => {
      if (t.isJSXSpreadAttribute(attr)) {
        throw codeFrameError(attr.loc, 'JSX 参数暂不支持 ...spread 表达式')
      }
      const name = attr.name.name === 'className' ? 'class' : attr.name.name
      let value: string | boolean = true
      let attrValue = attr.value
      if (typeof name === 'string') {
        if (t.isStringLiteral(attrValue)) {
          value = attrValue.value
        } else if (t.isJSXExpressionContainer(attrValue)) {
          const isBindEvent =
            name.startsWith('bind') || name.startsWith('catch')
          let { code } = generate(attrValue.expression)
          code = code
            .replace(/(this\.props\.)|(this\.state\.)/g, '')
            .replace(/this\./g, '')
          value = isBindEvent ? code : `{{${code}}}`
          if (t.isStringLiteral(attrValue.expression)) {
            value = attrValue.expression.value
          }
        } else if (attrValue === null && name !== 'wx:else') {
          value = `{{true}}`
        }
        if (
          componentSpecialProps &&
          componentSpecialProps.has(name)
        ) {
          obj[name] = value
        } else {
          obj[isDefaultComponent && !name.includes('-') && !name.includes(':') ? kebabCase(name) : name] = value
        }
      }
      return obj
    }, {}),
    value: parseJSXChildren(children)
  })
}

export function generateHTMLTemplate (template: t.JSXElement, name: string) {
  return createHTMLElement({
    name: 'template',
    attributes: {
      name
    },
    value: parseJSXElement(template)
  })
}
