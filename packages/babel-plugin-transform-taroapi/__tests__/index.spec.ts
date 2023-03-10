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

import * as apis from '@tarojs/taro-h5'
import * as babel from 'babel-core'
import * as t from 'babel-types'

import plugin from '../src'

const pluginOptions = [
  plugin,
  {
    apis,
    packageName: '@tarojs/taro-h5'
  }
]

const getNamedImports = (importSpecifiers: (t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier)[]) => {
  return importSpecifiers.reduce((prev, curr: t.ImportSpecifier) => {
    if (t.isImportSpecifier(curr)) {
      prev.add(curr.imported.name)
    }
    return prev
  }, new Set())
}

it('should work!', function () {
  const code = `
    import Taro, { setStorage, initPxTransform, param } from '@tarojs/taro-h5';
    initPxTransform(param)
    Taro.initPxTransform()
    Taro.initPxTransform()
    Taro['getStorage']()
    setStorage()
    export { Taro }
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()
})

it('should leave other apis untouched', function () {
  const code = `
    import Taro from '@tarojs/taro-h5'
    Taro.noop
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()

  const ast = result.ast as t.File
  const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement]
  expect(t.isImportDeclaration(body[0])).toBeTruthy()
  expect(t.isExpressionStatement(body[1])).toBeTruthy()
  const defaultImport = body[0].specifiers.find(v => t.isImportDefaultSpecifier(v))
  expect(defaultImport).toBeTruthy()

  const taroName = defaultImport.local.name
  const namedImports = getNamedImports(body[0].specifiers)
  expect(namedImports).toEqual(new Set())
  expect(t.isMemberExpression(body[1].expression)).toBeTruthy()
  expect((body[1].expression as t.MemberExpression)).toMatchObject(t.memberExpression(
    t.identifier(taroName),
    t.identifier('noop')
  ))
})

it('should move static apis under "Taro"', function () {
  const code = `
    import { noop } from '@tarojs/taro-h5';
    noop;
    noop();
  `

  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()

  const ast = result.ast as t.File
  const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement]
  expect(t.isImportDeclaration(body[0])).toBeTruthy()
  expect(t.isExpressionStatement(body[1])).toBeTruthy()
  const defaultImport = body[0].specifiers.find(v => t.isImportDefaultSpecifier(v))
  expect(defaultImport).toBeTruthy()

  const taroName = defaultImport!.local.name
  let memberExpression = body[1].expression
  if (t.isCallExpression(body[1])) {
    memberExpression = (body[1].expression as t.CallExpression).callee
  }
  expect(memberExpression).toMatchObject(t.memberExpression(
    t.identifier(taroName),
    t.identifier('noop')
  ))
})

it('should not import taro duplicatly', function () {
  const code = `
    import { Component } from "@tarojs/taro-h5";
    import Taro from '@tarojs/taro-h5';
    Component
    Taro.createAnimation()
    Taro.initPxTransform()
  `

  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()

  const ast = result.ast as t.File
  const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement, t.ExpressionStatement]
  expect(t.isImportDeclaration(body[0])).toBeTruthy()
  expect(t.isExpressionStatement(body[1])).toBeTruthy()
  expect(t.isExpressionStatement(body[2])).toBeTruthy()
})

it('should not go wrong when using an api twice', function () {
  const code = `
    import Taro from '@tarojs/taro-h5';
    const animation = Taro.createAnimation({
      duration: dura * 1000,
      timingFunction: 'linear'
    })
    const resetAnimation = Taro.createAnimation({
      duration: 0,
      timingFunction: 'linear'
    })
  `
  expect(() => {
    const result = babel.transform(code, { plugins: [pluginOptions] })
    expect(result.code).toMatchSnapshot()
  }).not.toThrowError()
})

it('should preserve default imports', function () {
  const code = `
    import Taro from '@tarojs/taro-h5'
    console.log(Taro)
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()
})

it('should preserve assignments in lefthands', function () {
  const code = `
    import Taro from '@tarojs/taro-h5'
    let animation
    animation = Taro.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    });
    Taro.request()
    Taro.request = ''
    Taro['request'] = ''
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()
})

it('should support rename of imported names', function () {
  const code = `
  // import { inject as mobxInject, observer as mobxObserver } from '@tarojs/mobx'
  import { Component as TaroComponent } from "@tarojs/taro-h5";
  export class Connected extends TaroComponent {}
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot()
})
