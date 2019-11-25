import * as webpack from 'webpack'
// import { getOptions } from 'loader-utils'
// import { Loader } from './loader'
// import * as t from '@babel/types'
// import traverse, { NodePath } from '@babel/traverse'
// import { INJECT_PAGE_INSTANCE, CREATE_PAGE_CONFIG } from './constants'

export default function (this: webpack.loader.LoaderContext) {
  return `import { createPageConfig } from '@tarojs/runtime'
import component from '${this.request.split('!').slice(1).join('!')}'
Page(createPageConfig(component))
`
}

// const ReactLifeCycle = new Set([
//   'componentDidMount',
//   'shouldComponentUpdate',
//   'componentWillUnmount',
//   'componentDidCatch',
//   'getSnapshotBeforeUpdate',
//   'componentDidUpdate',
//   'componentWillMount',
//   'UNSAFE_componentWillMount',
//   'componentWillReceiveProps',
//   'UNSAFE_componentWillReceiveProps',
//   'componentWillUpdate',
//   'UNSAFE_componentWillUpdate',
//   'getDerivedStateFromProps',
//   'getDerivedStateFromError',
//   'render',
//   'componentDidShow',
//   'componentDidHide'
// ])

// class PageLoader extends Loader {
//   public apply () {
//     const specifier = t.identifier(CREATE_PAGE_CONFIG)
//     this.ensureTaroRuntimeImported(specifier)

//     traverse(this.ast, {
//       ClassDeclaration: this.injectReactComponent.bind(this),
//       ClassExpression: this.injectReactComponent.bind(this),
//       Program: {
//         enter (path) {
//           path.scope.rename('Page', '__Page')
//         }
//       }
//     })

//     this.insertToTheEnd(t.expressionStatement(
//       t.callExpression(
//         t.identifier('Page'),
//         [
//           t.callExpression(
//             t.identifier(CREATE_PAGE_CONFIG),
//             [this.exportDefaultDecl.declaration as t.Expression]
//           )
//         ]
//       )
//     ))

//     return this.generate()
//   }

//   private looksLikeReactComponent (classBody: t.ClassBody) {
//     for (const m of classBody.body) {
//       if (t.isClassMethod(m) && t.isIdentifier(m.key) && ReactLifeCycle.has(m.key.name)) {
//         this.needToImportMainModule = true
//         break
//       }
//     }

//     return this.needToImportMainModule
//   }

//   private injectReactComponent (classDecl: NodePath<t.ClassDeclaration | t.ClassExpression>) {
//     if (this.framework === 'vue') {
//       return
//     }

//     const classBody = classDecl.node.body

//     if (!this.looksLikeReactComponent(classBody)) {
//       return
//     }

//     this.runtimeImportStem!.specifiers.push(
//       t.importSpecifier(
//         t.identifier(INJECT_PAGE_INSTANCE),
//         t.identifier(INJECT_PAGE_INSTANCE)
//       )
//     )

//     classBody.body.push(t.classProperty(
//       t.identifier('_do_not_use'),
//       t.callExpression(t.identifier(INJECT_PAGE_INSTANCE), [
//         t.thisExpression()
//       ])
//     ))
//   }
// }
