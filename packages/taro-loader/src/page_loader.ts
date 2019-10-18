import * as webpack from 'webpack'
import { Loader } from './loader'
import * as t from '@babel/types'
import template from '@babel/template'
import traverse, { NodePath } from '@babel/traverse'

import { TARO_RUNTIME_PACKAGE_NAME, CONNECT_TO_REACT_PAGE, CONNECT_TO_VUE_PAGE, INJECT_PAGE_INSTANCE, TARO_PAGE_ID } from './constants'

export function pageLoader (this: webpack.loader.LoaderContext, source: string) {
  const loader = new PageLoader(source, this, 'react')
  return loader.apply()
}

const ReactLifeCycle = new Set([
  'componentDidMount',
  'shouldComponentUpdate',
  'componentWillUnmount',
  'componentDidCatch',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentWillReceiveProps',
  'UNSAFE_componentWillReceiveProps',
  'componentWillUpdate',
  'UNSAFE_componentWillUpdate',
  'getDerivedStateFromProps',
  'getDerivedStateFromError',
  'render'
])

const idTmpl = template(`const ${TARO_PAGE_ID} = PAGE_ID;`)

const connectReactTmpl = template(`${CONNECT_TO_REACT_PAGE}(PRAGMA, ID, PURE_COMPONENT)(EXPR)`)

const connectVueTmpl = template(`${CONNECT_TO_REACT_PAGE}(PRAGMA, ID, PURE_COMPONENT)(EXPR)`)

class PageLoader extends Loader {
  public apply () {
    const specifier = this.framework === 'react' ? t.identifier(CONNECT_TO_REACT_PAGE) : t.identifier(CONNECT_TO_VUE_PAGE)

    this.runtimeImportStem = this.insertToTheFront(
      t.importDeclaration(
        [
          t.importSpecifier(specifier, specifier)
        ],
        t.stringLiteral(TARO_RUNTIME_PACKAGE_NAME)
      )
    )

    this.ast.program.body.splice(
      this.maybeSafeToInsertIndex,
      0,
      idTmpl({
        PAGE_ID: this.context.resourcePath
      })
    )

    traverse(this.ast, {
      ClassDeclaration: this.injectReactComponent.bind(this),
      ClassExpression: this.injectReactComponent.bind(this),
      Program: this.ensureMainModuleImported.bind(this)
    })
  }

  private looksLikeReactComponent (classBody: t.ClassBody) {
    let result = false
    for (const m of classBody.body) {
      if (t.isClassMethod(m) && t.isIdentifier(m.key) && ReactLifeCycle.has(m.key.name)) {
        result = true
        break
      }
    }

    return result
  }

  private injectReactComponent (classDecl: NodePath<t.ClassDeclaration | t.ClassExpression>) {
    if (this.framework !== 'vue') {
      return
    }

    const classBody = classDecl.node.body

    if (!this.looksLikeReactComponent(classBody)) {
      return
    }

    this.runtimeImportStem!.specifiers.push(
      t.importSpecifier(
        t.identifier(INJECT_PAGE_INSTANCE),
        t.identifier(INJECT_PAGE_INSTANCE)
      )
    )

    classBody.body.push(t.classProperty(
      t.identifier('_do_not_use'),
      t.callExpression(t.identifier(INJECT_PAGE_INSTANCE), [
        t.identifier(TARO_PAGE_ID),
        t.thisExpression()
      ])
    ))
  }

  private ensureMainModuleImported (program: NodePath<t.Program>) {
    if (this.framework === 'vue') {
      const importedName = 'Vue'
      if (program.scope.getBinding(importedName)) {
        this.insertToTheFront(
          t.importDeclaration(
            [
              t.importDefaultSpecifier(t.identifier(importedName))
            ],
            t.stringLiteral('vue')
          )
        )
      }
    }

    if (this.framework === 'react') {
      const importedName = 'React'
      if (program.scope.getBinding(importedName)) {
        this.insertToTheFront(
          t.importDeclaration(
            [
              t.importDefaultSpecifier(t.identifier(importedName))
            ],
            t.stringLiteral('react')
          )
        )
      }
    }

    if (this.framework === 'nerv') {
      const importedName = 'Nerv'
      if (program.scope.getBinding(importedName)) {
        this.insertToTheFront(
          t.importDeclaration(
            [
              t.importDefaultSpecifier(t.identifier(importedName))
            ],
            t.stringLiteral('nervjs')
          )
        )
      }
    }
  }
}
