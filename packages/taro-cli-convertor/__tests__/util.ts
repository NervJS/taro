import generate from '@babel/generator'
import * as t from '@babel/types'

// 最低限度的转义： https://github.com/mathiasbynens/jsesc#minimal
export function generateMinimalEscapeCode (ast: t.File) {
  return generate(ast as any, {
    jsescOption: {
      minimal: true,
    },
  }).code
}
