const t = require('babel-types')
const babylonConfig = require('../config/babylon')
const template = require('babel-template')
const generate = require('better-babel-generator').default

function convertObjectToAstExpression (obj) {
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
      return t.objectProperty(t.stringLiteral(key), t.arrayExpression(convertArrayToAstExpression(value)))
    }
    if (value == null) {
      return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
    }
    if (typeof value === 'object') {
      return t.objectProperty(t.stringLiteral(key), t.objectExpression(convertObjectToAstExpression(value)))
    }
  })
  return objArr
}

// 最低限度的转义： https://github.com/mathiasbynens/jsesc#minimal
function generateMinimalEscapeCode (ast) {
  return generate(ast, {
    jsescOption: {
      minimal: true
    }
  }).code
}

function convertArrayToAstExpression (arr) {
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
    if (value == null) {
      return t.nullLiteral()
    }
    if (typeof value === 'object') {
      return t.objectExpression(convertObjectToAstExpression(value))
    }
  })
}

function convertSourceStringToAstExpression (str, opts = {}) {
  return template(str, Object.assign({}, babylonConfig, opts))()
}

const convertAstExpressionToVariable = (node) => {
  if (t.isObjectExpression(node)) {
    const obj = {}
    const properties = node.properties
    properties.forEach(property => {
      const key = convertAstExpressionToVariable(property.key)
      const value = convertAstExpressionToVariable(property.value)
      obj[key] = value
    })
    return obj
  } else if (t.isArrayExpression(node)) {
    return node.elements.map(convertAstExpressionToVariable)
  } else if (t.isLiteral(node)) {
    return node.value
  } else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
    const name = node.name
    return name === 'undefined'
      ? undefined
      : name
  } else if (t.isJSXExpressionContainer(node)) {
    return convertAstExpressionToVariable(node.expression)
  }
}

exports.obj = convertObjectToAstExpression
exports.array = convertArrayToAstExpression
exports.source = convertSourceStringToAstExpression
exports.generateMinimalEscapeCode = generateMinimalEscapeCode
exports.toVariable = convertAstExpressionToVariable
