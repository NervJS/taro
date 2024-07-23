// @ts-nocheck

export type TTreeNode = {
  type: string
  name?: string
  content?: string
  attributes?: Record<string, string>
  children?: TTreeNode[]
  endIndex?: number
  selfClosing?: boolean
}

function parseHTML(htmlString: string): TTreeNode[] {
  const stack: TTreeNode[] = []
  let current: TTreeNode
  let index = 0
  const jsonTree: TTreeNode[] = []

  while (index < htmlString.length) {
    const char = htmlString[index]

    if (char === '<') {
      const tag = parseTag(htmlString, index)
      if (tag.type === 'open') {
        const element: TTreeNode = {
          type: 'element',
          name: tag.name,
          attributes: tag.attributes,
          children: [],
        }
        if (!current) {
          jsonTree.push(element)
        } else {
          current.children?.push(element)
        }
        if (!tag.selfClosing) {
          stack.push(current!)
          current = element
        }
      } else if (tag.type === 'close') {
        if (stack.length > 0) {
          current = stack.pop()
        }
      }
      index = tag.endIndex + 1
    } else {
      const endIndex = htmlString.indexOf('<', index)
      const text = htmlString.slice(index, endIndex !== -1 ? endIndex : undefined)
      if (text.trim() !== '') {
        current.children?.push({ type: 'text', content: text })
      }
      index = endIndex !== -1 ? endIndex : htmlString.length
    }
  }

  return jsonTree
}

function parseTag(htmlString, startIndex) {
  let index = startIndex
  const tag: TTreeNode = {
    type: '',
    name: '',
    attributes: {},
    selfClosing: false,
  }

  // Skip '<'
  index++

  if (htmlString[index] === '/') {
    tag.type = 'close'
    index++
  } else {
    tag.type = 'open'
  }

  // Parse tag name
  tag.name = htmlString.slice(index).match(/^\s*([^/\s>]+)/)[1]
  index += tag.name.length

  // Parse attributes
  let attrMatch
  while ((attrMatch = htmlString.slice(index).match(/^\s+([^=]+)="([^"]*)"/))) {
    const [, attr, value] = attrMatch
    tag.attributes[attr] = value
    index += attrMatch[0].length
  }

  if (htmlString[index] === '/' || htmlString[index + 1] === '/') {
    tag.selfClosing = true
  }

  // Skip '>'
  index = htmlString.indexOf('>', index) + 1

  tag.endIndex = index - 1

  return tag
}

export default parseHTML
