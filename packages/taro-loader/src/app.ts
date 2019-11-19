import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
import traverse from '@babel/traverse'
import { Loader } from './loader'
import * as t from '@babel/types'
import { CREATE_REACT_APP, CREATE_VUE_APP } from './constants'

export default function (this: webpack.loader.LoaderContext, source: string) {
  const options = getOptions(this)
  const loader = new AppLoader(source, this, options.framework)
  return loader.apply()
}

class AppLoader extends Loader {
  public apply () {
    const isReact = this.framework !== 'vue'
    const createApp = isReact ? t.identifier(CREATE_REACT_APP) : t.identifier(CREATE_VUE_APP)

    this.ensureTaroRuntimeImported(createApp)

    this.needToImportMainModule = true

    traverse(this.ast, {
      Program: {
        enter: (path) => {
          path.scope.rename('App', '__App')
        }
      }
    })

    this.insertToTheEnd(t.expressionStatement(
      t.callExpression(
        t.identifier('App'),
        [
          t.callExpression(
            createApp,
            [
              this.exportDefaultDecl.declaration as t.Expression
            ]
          )
        ]
      )
    ))

    return this.generate()
  }
}
