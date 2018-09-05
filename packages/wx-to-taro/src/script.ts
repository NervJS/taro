import * as t from 'babel-types'
import traverse, { NodePath } from 'babel-traverse'
import { transform } from 'babel-core'
import { buildImportStatement } from './utils'
import { usedComponents } from './wxml'

function parseScript (script: string) {
  const { ast } = transform(script, {
    parserOpts: {
      sourceType: 'module',
      plugins: [
        'classProperties',
        'jsx',
        'flow',
        'flowComment',
        'trailingFunctionCommas',
        'asyncFunctions',
        'exponentiationOperator',
        'asyncGenerators',
        'objectRestSpread',
        'decorators',
        'dynamicImport'
      ]
    }
  })
  traverse(ast, {
    CallExpression (path) {
      const callee = path.get('callee')
      if (callee.isIdentifier({ name: 'Page' })) {
        parsePage(path)
        path.stop()
      }
    }
  })

  const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents])
  const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
}

function parsePage (path: NodePath<t.CallExpression>) {
}

function renameSetData (path: NodePath<t.CallExpression>, guard?: (node: NodePath<t.Node>) => node is NodePath<t.Identifier>) {
  const callee = path.get('callee')
  if (callee.isMemberExpression() && callee.get('property').isIdentifier({ name: 'setData' })) {
    const obj = callee.get('object')
    const property = callee.get('property')
    if (obj.isThisExpression()) {
      property.replaceWith(t.identifier('setState'))
      return
    }
  }
}
