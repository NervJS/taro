import * as t from '@babel/types'

import config from '../config'
import { isComponent, isTaroComponent } from './utils'

const { isValidHTMLNesting } = require('validate-html-nesting')

// From https://github.com/MananTank/babel-plugin-validate-jsx-nesting/blob/main/src/index.js
const JSXValidator = {
  JSXElement(path) {
    const elName = path.node.openingElement.name
    const parent = path.parent
    if (!t.isJSXElement(parent) || !t.isJSXIdentifier(elName)) return
    const elTagName = elName.name
    if (isComponent(elTagName)) return
    const parentElName = parent.openingElement.name
    if (!t.isJSXIdentifier(parentElName)) return
    const parentElTagName = parentElName.name
    if (!isComponent(parentElTagName)) {
      if (!isValidHTMLNesting(parentElTagName, elTagName)) {
        throw path.buildCodeFrameError(`Invalid JSX: <${elTagName}> cannot be child of <${parentElTagName}>`)
      }
    }
  },
}

export default (path, { opts }) => {
  const merged = (path.hub.file.metadata.config = Object.assign({}, config, opts))
  const taroComponentsMap = (path.hub.file.metadata.taroComponentsMap ||= new Map())
  const lib = merged.requireImportSource
  if (lib) {
    const comments = path.hub.file.ast.comments
    let process = false
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i]
      const index = comment.value.indexOf('@jsxImportSource')
      if (index > -1 && comment.value.slice(index).includes(lib)) {
        process = true
        break
      }
    }
    if (!process) {
      path.skip()
      return
    }
  }
  for (const stmt of path.get('body')) {
    if (t.isImportDeclaration(stmt.node)) {
      if (isTaroComponent(stmt.node.source.value)) {
        stmt.node.specifiers.forEach((specifier) => {
          // 包体导出的变量名
          const importedName = specifier.imported.name
          // 当前使用的变量名 防止别名
          // import { Button as MyButton } from '@tarojs/components'
          const localName = specifier.local.name
          taroComponentsMap.set(localName, importedName)
        })
      }
    }
  }
  if (merged.validate) path.traverse(JSXValidator)
}
