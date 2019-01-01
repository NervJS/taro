import * as t from 'babel-types'
import generate from 'better-babel-generator'

import babylonConfig from '../config/babylon'

const template = require('babel-template')

export function convertObjectToAstExpression (obj: object): t.ObjectProperty[] {
  const objArr = Object.keys(obj).map(key => {
    const value = obj[key]
    if (typeof value === 'string') {
      return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value))
    }
    if (typeof value === 'number') {
      return t.objectProperty(t.stringLiteral(key), t.numericLiteral(value))
    }
    if (typeof value === 'boolean') {
      return t.objectProperty(t.stringLiteral(key), t.booleanLiteral(value))
    }
    if (Array.isArray(value)) {
      return t.objectProperty(t.stringLiteral(key), t.arrayExpression(convertArrayToAstExpression(value as [])))
    }
    if (typeof value === 'object') {
      return t.objectProperty(t.stringLiteral(key), t.objectExpression(convertObjectToAstExpression(value)))
    }
    return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
  })
  return objArr
}

// 最低限度的转义： https://github.com/mathiasbynens/jsesc#minimal
export function generateMinimalEscapeCode (ast: t.File) {
  return generate(ast, {
    jsescOption: {
      minimal: true
    }
  }).code
}

export function convertArrayToAstExpression (arr: any[]): any[] {
  return arr.map(value => {
    if (typeof value === 'string') {
      return t.stringLiteral(value)
    }
    if (typeof value === 'number') {
      return t.numericLiteral(value)
    }
    if (typeof value === 'boolean') {
      return t.booleanLiteral(value)
    }
    if (Array.isArray(value)) {
      return convertArrayToAstExpression(value)
    }
    if (typeof value === 'object') {
      return t.objectExpression(convertObjectToAstExpression(value))
    }
    return t.nullLiteral()
  })
}

export function convertSourceStringToAstExpression (str: string, opts: object = {}) {
  return template(str, Object.assign({}, babylonConfig, opts))()
}

export const getObjKey = (node) => {
  if (t.isIdentifier(node)) {
    return node.name
  } else {
    return node.value
  }
}

// exports.obj = convertObjectToAstExpression
// exports.array = convertArrayToAstExpression
// exports.source = convertSourceStringToAstExpression
// exports.getObjKey = getObjKey
// exports.generateMinimalEscapeCode = generateMinimalEscapeCode
