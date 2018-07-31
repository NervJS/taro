import traverse from 'babel-traverse'
import * as t from 'babel-types'
import generate from 'babel-generator'

export function buildComponent (
  renderBody: string,
  classMethod = '',
  head = ''
) {
  return `
${head}
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

export default class Index extends Component {
  ${classMethod}


  render () {
    ${renderBody}
  }
}
`
}

export const baseCode = `
return (
  <View className='index'>
    <View className='title'>title</View>
    <View className='content'>
      {this.state.list.map(item => {
        return (
          <View className='item'>{item}</View>
        )
      })}
      <Button className='add' onClick={this.add}>添加</Button>
    </View>
  </View>
)
`

export function removeShadowData (obj: any) {
  if (obj['__data']) {
    delete obj['__data']
  }
  return obj
}

export const baseOptions = {
  isRoot: false,
  isApp: false,
  sourcePath: __dirname,
  outputPath: __dirname,
  code: '',
  isTyped: false
}

export function evalClass (ast: t.File, props = '', isRequire = false) {
  let mainClass!: t.ClassDeclaration
  const statements = new Set<t.ExpressionStatement>()

  traverse(ast, {
    ClassDeclaration (path) {
      mainClass = path.node
    },
    /**
     * 目前 node 的版本支持不了 class-properties
     * 但 babel 又有 bug，某些情况竟然把转换后的 class-properties 编译到 super 之前
     * 不然用 babel.transformFromAst 就完事了
     * 现在只能自己实现这个 feature 的部分功能了，真 tm 麻烦
     * @TODO 有空再给他们提 PR 吧
     */
    ClassProperty (path) {
      const { key, value } = path.node
      statements.add(t.expressionStatement(t.assignmentExpression(
        '=',
        t.memberExpression(
          t.thisExpression(),
          key
        ),
        value
      )))
      path.remove()
    }
  })

  for (const method of mainClass.body.body) {
    // constructor 即便没有被定义也会被加上
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      const index = method.body.body.findIndex(node => t.isSuper(node))
      method.body.body.push(
        t.expressionStatement(t.assignmentExpression(
          '=',
          t.memberExpression(
            t.thisExpression(),
            t.identifier('state')
          ),
          t.callExpression(t.memberExpression(t.thisExpression(), t.identifier('_createData')), [])
        ))
      )
      method.body.body.splice(index, 0, ...statements)
    }
  }

  let code = `function f() {};` +
    generate(t.classDeclaration(t.identifier('Test'), t.identifier('f'), mainClass.body, [])).code +
    ';' + `new Test(${props})`
  if (isRequire) {
    code = 'const { internal_inline_style } = require("@tarojs/taro");' + code
  }
  // tslint:disable-next-line
  return eval(code)
}

export class Custom {}
