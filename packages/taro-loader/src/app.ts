import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
// import traverse from '@babel/traverse'
// import { Loader } from './loader'
// import * as t from '@babel/types'
// import { CREATE_REACT_APP, CREATE_VUE_APP } from './constants'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const method = options.framework === 'vue' ? 'createVueApp' : 'createReactApp'
  return `import { ${method} } from '@tarojs/runtime'
import component from '${this.request.split('!').slice(1).join('!')}'
App(${method}(component))
`
}

// class AppLoader extends Loader {
//   public apply () {
//     const isReact = this.framework !== 'vue'
//     const createApp = isReact ? t.identifier(CREATE_REACT_APP) : t.identifier(CREATE_VUE_APP)

//     this.ensureTaroRuntimeImported(createApp)

//     this.needToImportMainModule = true

//     traverse(this.ast, {
//       Program: {
//         enter: (path) => {
//           path.scope.rename('App', '__App')
//         }
//       }
//     })

//     this.insertToTheEnd(t.expressionStatement(
//       t.callExpression(
//         t.identifier('App'),
//         [
//           t.callExpression(
//             createApp,
//             [
//               this.exportDefaultDecl.declaration as t.Expression
//             ]
//           )
//         ]
//       )
//     ))

//     return this.generate()
//   }
// }
