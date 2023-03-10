/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import generate from '@babel/generator'
import template from '@babel/template'
import * as t from '@babel/types'

import babylonConfig from '../config/babylon'

export function convertObjectToAstExpression (obj: Record<string, any>): t.ObjectProperty[] {
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
    if (value === null) {
      return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
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

export function convertSourceStringToAstExpression (str: string, opts: Record<string, any> = {}) {
  return template(str, Object.assign({}, babylonConfig, opts))()
}

export function convertAstExpressionToVariable<T = any> (node): T {
  if (t.isObjectExpression(node)) {
    const obj = {}
    const properties = node.properties
    properties.forEach(property => {
      if (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') {
        const key = convertAstExpressionToVariable(property.key)
        const value = convertAstExpressionToVariable((property as t.ObjectProperty).value)
        obj[key] = value
      }
    })
    return (obj as any) as T
  } else if (t.isArrayExpression(node)) {
    return (node.elements.map(convertAstExpressionToVariable) as any) as T
  } else if (t.isLiteral(node)) {
    return (node as any).value
  } else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
    const name = node.name
    return name === 'undefined' ? ((undefined as any) as T) : ((name as any) as T)
  } else if (t.isJSXExpressionContainer(node)) {
    return convertAstExpressionToVariable<T>(node.expression)
  } else {
    return (undefined as any) as T
  }
}

export const getObjKey = node => {
  if (t.isIdentifier(node)) {
    return node.name
  } else {
    return node.value
  }
}
