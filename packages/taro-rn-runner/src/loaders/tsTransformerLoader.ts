import * as t from '@babel/types'
import { TransformOptions } from '@babel/core'
import { transformSync } from '@babel/core'
import { REG_TYPESCRIPT } from '../utils/constants'
import { parserOpts } from './utils/config'

const Status = {
  isSFC: false
}

export default function tsTransformerLoader (source) {
  // const {buildAdapter} = getOptions(this)
  const filePath = this.resourcePath
  try {
    // @ts-ignore
    const {ast, code} = transformSync(source, buildBabelTransformOptions(filePath))
    if (REG_TYPESCRIPT.test(filePath)) {
      // @ts-ignore
      const mainClassNode = ast!.program.body.find(v => {
        return t.isClassDeclaration(v)
      }) as t.ClassDeclaration | undefined
      if (mainClassNode) {
        resetTSClassProperty(mainClassNode.body.body)
      }
    }
    // @ts-ignore
    // const code = generate(ast).code
    this.callback(null, code, ast)
    return code
  } catch (error) {
    this.emitError(error)
    this.callback(null, source, null)
    return source
  }
}

export const buildBabelTransformOptions: (filePath) => TransformOptions = (filePath) => {
  Status.isSFC = false
  return {
    ast: true,
    filename: filePath,
    babelrc: false,
    presets: [
      [
        require('@babel/preset-typescript'),
        {
          isTSX: true,
          allExtensions: true
        }
      ]
    ],
    parserOpts
  }
}

/**
 * TS 编译器会把 class property 移到构造器，
 * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
 * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
 * 如果有 config 就给他还原
 */
function resetTSClassProperty (body: (t.ClassMethod | t.ClassProperty)[]) {
  for (const method of body) {
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      if (t.isBlockStatement(method.body)) {
        method.body.body = method.body.body.filter(statement => {
          if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
            const expr = statement.expression
            const {left, right} = expr
            if (
              t.isMemberExpression(left) &&
              t.isThisExpression(left.object) &&
              t.isIdentifier(left.property)
            ) {
              if (
                (t.isArrowFunctionExpression(right) || t.isFunctionExpression(right))
                ||
                (left.property.name === 'config' && t.isObjectExpression(right))
              ) {
                const classProp = t.classProperty(left.property, right)
                body.push(classProp)
                return false
              }
            }
          }
          return true
        })
      }
    }
  }
}
