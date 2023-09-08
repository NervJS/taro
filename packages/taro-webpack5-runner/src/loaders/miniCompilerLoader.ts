// import { swc } from '@tarojs/helper'
// import { parse } from "@babel/parser"
// import { transformFromAstSync } from "@babel/core"
// import { getComponentsAlias } from '@tarojs/shared'
// import { getOptions } from 'loader-utils'

export default async function (source) {
  const callback = this.async()
  // const options = getOptions(this)

  if (!(/\.[tj]sx$/.test(this.resourcePath))) {
    return callback(null, source)
  }
  // swc
  //   .transform(source, {
  //     filename: this.resourcePath,
  //     sourceMaps: false,
  //     jsc: {
  //       target: 'es2020'
  //     },
  //   })
  //   .then((output) => {
  //     console.log('output.code: ', output.code)
  //     callback(null, source)
  //   })
  //   .catch(err => callback(err))

  // const parsedAst = await parse(source, {
  //   sourceType: 'module',
  //   sourceFilename: this.resourcePath,
  //   plugins: [
  //     'classProperties',
  //     'jsx',
  //     'flowComments',
  //     'asyncGenerators',
  //     'objectRestSpread',
  //     ['decorators', { decoratorsBeforeExport: true }],
  //     'dynamicImport',
  //     'doExpressions',
  //     'typescript',
  //   ],
  // })
  // const { code } = transformFromAstSync(
  //   parsedAst,
  //   source,
  //   {
  //     // configFile: false,
  //     filename: this.resourcePath,
  //     plugins: [],
  //     presets: []
  //   }
  // )!
  // console.log('output.code: ', code)
  callback(null, source)
}
