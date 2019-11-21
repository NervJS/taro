import * as webpack from 'webpack'
import * as t from '@babel/types'
import * as parser from '@babel/parser'
import { NodePath } from '@babel/traverse'
import * as babel from '@babel/core'
import { Framework } from './types'
import { TARO_RUNTIME_PACKAGE_NAME } from './constants'
import { capitalize } from './utils'
import { RawSourceMap } from 'source-map'

export class Loader {
  protected context: webpack.loader.LoaderContext

  protected framework: Framework

  protected ast: t.File

  protected source: string

  protected maybeSafeToInsertIndex = 0

  protected runtimeImportStem: t.ImportDeclaration | null = null

  protected exportDefaultDecl: t.ExportDefaultDeclaration

  protected needToImportMainModule = false

  protected sourcemap: RawSourceMap

  public constructor (source: string, context: webpack.loader.LoaderContext, framework: Framework = 'react', sourcemap: RawSourceMap) {
    this.context.async()
    this.context = context
    this.framework = framework
    this.source = source
    this.sourcemap = sourcemap
    this.ast = this.parse()
  }

  private parse () {
    const file = parser.parse(this.source, {
      allowImportExportEverywhere: false,
      sourceType: 'module',
      plugins: [
        'asyncGenerators',
        'bigInt',
        'classPrivateMethods',
        'classPrivateProperties',
        'classProperties',
        ['decorators', { decoratorsBeforeExport: true }],
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'flowComments',
        'functionBind',
        'functionSent',
        ['pipelineOperator', { proposal: 'smart' }],
        'importMeta',
        'jsx',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        'placeholders',
        'throwExpressions',
        'typescript'
      ]
    })

    for (let i = 0; i < file.program.body.length; i++) {
      const stem = file.program.body[i]
      const next = file.program.body[i + 1]

      if (t.isImportDeclaration(stem)) {
        if (stem.source.value === TARO_RUNTIME_PACKAGE_NAME) {
          this.runtimeImportStem = stem
        }

        if (!t.isImportDeclaration(next)) {
          this.maybeSafeToInsertIndex = i
        }
      }

      if (t.isExportDefaultDeclaration(stem)) {
        this.exportDefaultDecl = stem
      }
    }

    if (this.exportDefaultDecl == null) {
      this.context.emitError(new Error(`文件: ${this.context.resourcePath} 没有找到 export default 语句!`))
    }

    return file
  }

  protected insertToTheFront<T extends t.Statement> (stem: T) {
    this.ast.program.body.unshift(stem)

    return stem
  }

  protected insertToTheEnd<T extends t.Statement> (stem: T) {
    this.ast.program.body.push(stem)

    return stem
  }

  protected generate () {
    const decl = this.exportDefaultDecl!
    const body = this.ast.program.body
    body.splice(body.indexOf(decl), 1)

    try {
      const { code, map } = babel.transformFromAstSync(this.ast, this.source, {
        ast: false,
        babelrc: false,
        configFile: false,
        sourceType: 'module',
        inputSourceMap: this.sourcemap,
        filename: this.context.resourcePath,
        sourceFileName: this.context.resourcePath
      })!
      this.context.callback(null, code!, map as RawSourceMap)
    } catch (error) {
      this.context.callback(error)
      this.context.emitError(error)
    }
  }

  protected ensureTaroRuntimeImported (specifier: t.Identifier) {
    if (this.runtimeImportStem === null) {
      this.runtimeImportStem = this.insertToTheFront(
        t.importDeclaration(
          [
            t.importSpecifier(specifier, specifier)
          ],
          t.stringLiteral(TARO_RUNTIME_PACKAGE_NAME)
        )
      )
    } else {
      const specs = this.runtimeImportStem.specifiers
      if (specs.some(s => t.isImportSpecifier(s) && t.isIdentifier(s.imported, { name: specifier.name }))) {
        return
      }

      specs.push(t.importSpecifier(specifier, specifier))
    }
  }

  protected ensureMainModuleImported (program: NodePath<t.Program>) {
    if (!this.needToImportMainModule) {
      return
    }

    const framework = capitalize(this.framework)
    const packageName = framework === 'Nerv' ? 'nervjs' : framework.toLowerCase()

    if (program.scope.getBinding(framework)) {
      return
    }

    this.insertToTheFront(
      t.importDeclaration(
        [
          t.importDefaultSpecifier(t.identifier(framework))
        ],
        t.stringLiteral(packageName)
      )
    )
  }
}
