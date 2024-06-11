import { addComment } from './utils'

const ATTRS_NAME = ['checked', 'disabled']

const createAttrsCode = (attrs) => {
  if (!attrs) {
    return ''
  }
  let attrsCode = ''
  const attrsKey = Object.keys(attrs)
  if (attrsKey.length) {
    attrsCode = ' ' + attrsKey.map(name => {
      if (!attrs[name] && ~ATTRS_NAME.indexOf(name)) {
        return `${name}='true'`
      }
      return name === 'else' ? `${name}` : `${name}='${attrs[name]}'`
    }).join(' ')
  }
  return attrsCode
}

const createNodeCode = (name, children, content, attrsCode, $delete, url) => {
  let childrenNodes = children.map(childNode => {
    return walk(childNode)
  }).join('')
  // 针对不支持子组件的组件，子组件需注释
  childrenNodes = $delete ? addComment(childrenNodes, url) : childrenNodes
  return `<${name}${attrsCode}>${content || ''}${childrenNodes}</${name}>`
}

const walk = (node) => {
  const attrsCode = createAttrsCode(node.attributes)
  const nodeCode = createNodeCode(
    node.name,
    node.children,
    node.content,
    attrsCode,
    node.$delete,
    node.url
  )
  return nodeCode
}

export default function serialize (nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes]
  }
  const code = nodes.map(node => walk(node)).join('\r\n')
  return code
}
