import * as webpack from 'webpack'
import { Loader } from './loader'
import * as t from '@babel/types'
import { CREATE_REACT_APP, CREATE_VUE_APP } from './constants'
import { capitalize } from './utils'

export function appLoader (this: webpack.loader.LoaderContext, source: string) {
  const loader = new AppLoader(source, this, 'react')
  return loader.apply()
}

class AppLoader extends Loader {
  public apply () {
    const isReact = this.framework !== 'vue'
    const createApp = isReact ? t.identifier(CREATE_REACT_APP) : t.identifier(CREATE_VUE_APP)
    this.ensureTaroRuntimeImported(createApp)

    let render: undefined | t.MemberExpression

    if (isReact) {
      if (this.framework === 'react') {
        this.insertToTheFront(
          t.importDeclaration([t.importDefaultSpecifier(t.identifier('ReactDOM'))], t.stringLiteral('react-dom'))
        )

        render = t.memberExpression(t.identifier('ReactDOM'), t.identifier('render'))
      } else {
        render = t.memberExpression(t.identifier('Nerv'), t.identifier('render'))
      }
    }

    if (this.exportDefaultDecl) {
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
    }

    return this.generate()
  }
}
