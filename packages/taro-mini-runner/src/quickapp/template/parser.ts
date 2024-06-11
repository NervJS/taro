import { NodeType } from './constant'
const sax = require('sax')

export default function parseCode (code: string): NodeType {
  const parser = sax.parser(false, {
    trim: true,
    lowercase: true,
    position: true
  })

  let root
  let currentParent
  const stack: any[] = []

  parser.onerror = function (e) {
    console.log(e)
  }

  parser.oncdata = function (t) {
    currentParent && (currentParent.content = t.trim() || '')
  }

  parser.ontext = function (t) {
    currentParent && (currentParent.content = t.trim() || '')
  }

  parser.onopentag = function (node) {
    node.children = []
    node.location = {
      line: this.line,
      column: this.column
    }
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    currentParent = node
    stack.push(currentParent)
  }

  parser.onclosetag = function () {
    stack.length -= 1
    currentParent = stack[stack.length - 1]
  }

  parser.write(code).close()

  return root
}
