import * as babel from '@babel/core'
import * as t from '@babel/types'

import plugin from '../src'
import * as definition from './__mocks__/harmony-definition.json'

type ImportType = babel.types.ImportSpecifier | babel.types.ImportDefaultSpecifier | babel.types.ImportNamespaceSpecifier

const packageName = '@tarojs/taro-h5'
const pluginOptions = [
  plugin,
  {
    packageName,
    definition,
  }
]
const getNamedImports = (importSpecifiers: (t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier)[]) => {
  return importSpecifiers.reduce((prev, curr) => {
    if (t.isImportSpecifier(curr)) {
      prev.add(((curr as t.ImportSpecifier).imported as babel.types.Identifier).name)
    }
    return prev
  }, new Set())
}
const babelTransform = (code = '') => babel.transform(code, { ast: true, configFile: false, plugins: [pluginOptions] })

describe('babel-plugin-transform-taroapi', () => {
  test('should work!', function () {
    const code = `
      import Taro, { setStorage, initPxTransform, param } from '${packageName}';
      initPxTransform(param)
      Taro.initPxTransform()
      Taro.initPxTransform()
      Taro['getStorage']()
      setStorage()
      export { Taro }
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })

  test('should leave other apis untouched', function () {
    const code = `
      import Taro from '${packageName}'
      Taro.noop
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()

    const ast = result?.ast as t.File
    const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement]
    expect(t.isImportDeclaration(body[0])).toBeTruthy()
    expect(t.isExpressionStatement(body[1])).toBeTruthy()
    const defaultImport = body[0].specifiers.find(v => t.isImportDefaultSpecifier(v)) as ImportType
    expect(defaultImport).toBeTruthy()

    const taroName = defaultImport.local.name
    const namedImports = getNamedImports(body[0].specifiers)
    expect(namedImports).toEqual(new Set())
    expect(t.isMemberExpression(body[1].expression)).toBeTruthy()

    const obj = t.memberExpression(
      t.identifier(taroName),
      t.identifier('noop'),
    )
    delete obj.optional

    expect((body[1].expression as t.MemberExpression)).toMatchObject(obj)
  })

  test('should move static apis under "Taro"', function () {
    const code = `
      import { noop } from '${packageName}';
      noop;
      noop();
    `

    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()

    const ast = result?.ast as t.File
    const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement]
    expect(t.isImportDeclaration(body[0])).toBeTruthy()
    expect(t.isExpressionStatement(body[1])).toBeTruthy()
    const defaultImport = body[0].specifiers.find(v => t.isImportDefaultSpecifier(v))
    expect(defaultImport).toBeTruthy()

    const taroName = defaultImport!.local.name
    let memberExpression: any = body[1].expression
    if (t.isCallExpression(body[1])) {
      memberExpression = ((body[1] as t.ExpressionStatement).expression as t.CallExpression).callee
    }
    expect(memberExpression).toMatchObject(t.memberExpression(
      t.identifier(taroName),
      t.identifier('noop')
    ))
  })

  test('should not import taro duplicity', function () {
    const code = `
      import { Component } from '${packageName}';
      import Taro from '${packageName}';
      Component
      Taro.createAnimation()
      Taro.initPxTransform()
    `

    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
    const ast = result?.ast as t.File
    const body = ast.program.body as [t.ImportDeclaration, t.ExpressionStatement, t.ExpressionStatement]
    expect(t.isImportDeclaration(body[0])).toBeTruthy()
    expect(t.isExpressionStatement(body[1])).toBeTruthy()
    expect(t.isExpressionStatement(body[2])).toBeTruthy()
  })

  test('should not go wrong when using an api twice', function () {
    const code = `
      import Taro from '${packageName}';
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
      const result = babelTransform(code)
      expect(result?.code).toMatchSnapshot()
    }).not.toThrowError()
  })

  test('should preserve default imports', function () {
    const code = `
      import Taro from '${packageName}'
      console.log(Taro)
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })

  test('should preserve assignments in left hands', function () {
    const code = `
      import Taro from '${packageName}'
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
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })

  test('should support rename of imported names', function () {
    const code = `
    // import { inject as mobxInject, observer as mobxObserver } from '@tarojs/mobx'
    import { Component as TaroComponent } from '${packageName}';
    export class Connected extends TaroComponent {}
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })

  test('should canIUse work or skip!', function () {
    const code = `
    import Taro from '${packageName}'
    function canIUse() {}
    Taro.canIUse('showToast.object.image')
    Taro['canIUse']('showToast.object.image')
    canIUse('showToast.object.image')
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })

  test('should canIUse support!', function () {
    const code = `
    import { canIUse as canUse } from '${packageName}';
    // 对象的属性或方法
    canUse('console.log')
    canUse('CameraContext.onCameraFrame')
    canUse('CameraFrameListener.start')
    canUse('Image.src')

    // 接口参数、回调或者返回值
    canUse('openBluetoothAdapter')
    canUse('getSystemInfoSync.return.safeArea.left')
    canUse('getSystemInfo.success.screenWidth')
    canUse('showToast.object.image')
    canUse('onCompassChange.callback.direction')
    canUse('request.object.method.GET')

    // 组件的属性
    canUse('live-player')
    canUse('text.selectable')
    canUse('button.open-type.contact')
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })

  test('should canIUse support scheme with numeric attributes!', function () {
    const code = `
    import { canIUse as canUse } from '${packageName}';
    // 入参带有数字属性的对象路径
    canUse('live-pusher.audio-reverb-type.4')
    canUse('live-pusher.aspect.9:16')
    `
    const result = babelTransform(code)
    expect(result?.code).toMatchSnapshot()
  })
})
