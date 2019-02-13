import * as apis from '@tarojs/taro-h5/dist/taroApis'
import * as babel from 'babel-core'
import * as t from 'babel-types'

import plugin from '../'

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
  const result = babel.transform(code, {plugins: [pluginOptions]});
  expect(result.code).toMatchSnapshot();
});

it('should transform fullfilled apis to named import', function () {
  const code = `
    import Taro from '@tarojs/taro-h5'
    ${Array.from(apis).map(api => `Taro.${api}();`)
    .join('')}
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot();

  const ast = result.ast as t.File
  const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement]
  expect(t.isImportDeclaration(body[0])).toBeTruthy()

  const namedImports = getNamedImports(body[0].specifiers)
  expect(namedImports).toEqual(new Set(apis))
})

it('should leave other apis untouched', function () {
  const code = `
    import Taro from '@tarojs/taro-h5'
    Taro.noop
  `
  const result = babel.transform(code, { plugins: [pluginOptions] })
  expect(result.code).toMatchSnapshot();

  const ast = result.ast as t.File
  const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement]
  expect(t.isImportDeclaration(body[0])).toBeTruthy()
  expect(t.isExpressionStatement(body[1])).toBeTruthy()
  const defaultImport = body[0].specifiers.find(v => t.isImportDefaultSpecifier(v))
  expect(defaultImport).toBeTruthy()

  const taroName = defaultImport!.local.name
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
  expect(result.code).toMatchSnapshot();

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
  expect(result.code).toMatchSnapshot();

  const ast = result.ast as t.File
  const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement, t.ExpressionStatement]
  expect(t.isImportDeclaration(body[0])).toBeTruthy()
  expect(t.isExpressionStatement(body[1])).toBeTruthy()
  expect(t.isExpressionStatement(body[2])).toBeTruthy()
})

it('should not go wrong when use an api twice', function () {
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
    const result = babel.transform(code, { plugins: [ pluginOptions ]})
    expect(result.code).toMatchSnapshot();
  }).not.toThrowError()
})