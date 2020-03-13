import { getOptions } from 'loader-utils'
import { transformFromAst } from 'babel-core'
import * as t from 'babel-types'
import generate from 'better-babel-generator'
import * as _ from 'lodash'
import { processAst } from './utils/processAst'
import { PARSE_AST_TYPE } from '../utils/constants'

const cannotRemoves = ['@tarojs/taro', 'react', 'nervjs']

/**
 * @description use babel and processAst
 * @param source
 * @param ast
 */
export default function fileParseLoader (source, ast) {
  const {
    alias,
    buildAdapter,
    designWidth,
    deviceRatio,
    sourceDir
  } = getOptions(this)
  // console.log('fileParseLoader before:', source)
  const filePath = this.resourcePath
  const newAst = transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-preval')], // Pre-evaluate code at build-time
      [require('babel-plugin-danger-remove-unused-import'), {ignore: cannotRemoves}]
    ]
  }).ast as t.File
  const miniType = this._module.miniType || PARSE_AST_TYPE.NORMAL

  let resultAst

  try {
    resultAst = processAst({
      ast: newAst,
      buildAdapter,
      type: miniType,
      designWidth,
      deviceRatio,
      sourceFilePath: filePath,
      sourceDir,
      alias
    })
  } catch (e) {
    console.log(e)
    throw e
  }
  const code = generate(resultAst).code
  // if (miniType === PARSE_AST_TYPE.ENTRY) console.log('fileParseLoader', code)
  this.callback(null, code, resultAst)
  return code
}
