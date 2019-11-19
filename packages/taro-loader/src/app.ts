import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
import traverse, { NodePath } from '@babel/traverse'
import { Loader } from './loader'
import * as t from '@babel/types'
import { CREATE_REACT_APP, CREATE_VUE_APP } from './constants'
import { capitalize } from './utils'

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

    let reactDOMImported = false

    traverse(this.ast, {
      Program: {
        enter: (path) => {
          path.scope.rename('App', '__App')
          reactDOMImported = !!path.scope.getBinding('ReactDOM')
        },
        exit: this.ensureMainModuleImported.bind(this)
      }
    })

    let render: undefined | t.MemberExpression

    if (isReact) {
      if (this.framework === 'react') {
        if (!reactDOMImported) {
          this.insertToTheFront(
            t.importDeclaration([t.importDefaultSpecifier(t.identifier('ReactDOM'))], t.stringLiteral('react-dom'))
          )
        }

        render = t.memberExpression(t.identifier('ReactDOM'), t.identifier('render'))
      } else {
        render = t.memberExpression(t.identifier('Nerv'), t.identifier('render'))
      }
    }

    this.insertToTheEnd(t.expressionStatement(
      t.callExpression(
        t.identifier('App'),
        [
          t.callExpression(
            createApp,
            [
              t.identifier(capitalize(this.framework)),
              this.exportDefaultDecl.declaration as t.Expression
            ].concat(render ? [render] : [])
          )
        ]
      )
    ))

    return this.generate()
  }
}
