import * as webpack from 'webpack'
import * as t from '@babel/types'
import * as parser from '@babel/parser'
import { Framework } from './types'
import { TARO_RUNTIME_PACKAGE_NAME } from './constants'

export class Loader {
  protected context: webpack.loader.LoaderContext

  protected framework: Framework

  protected ast: t.File

  protected source: string

  protected maybeSafeToInsertIndex = 0

  protected runtimeImportStem: t.ImportDeclaration | null = null

  protected exportDefaultDecl: t.ExportDefaultDeclaration | null = null

  protected mainModuleImported = false

  public constructor (source: string, context: webpack.loader.LoaderContext, framework: Framework) {
    this.context = context
    this.framework = framework
    this.source = source
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
        'decorators',
        'decorators-legacy',
        'doExpressions',
        'dynamicImport',
        'estree',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'flow',
        'flowComments',
        'functionBind',
        'functionSent',
        'importMeta',
        'jsx',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        'pipelineOperator',
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

        if (t.isExportDefaultDeclaration(stem)) {
          this.exportDefaultDecl = stem
        }
      }
    }

    return file
  }

  protected insertToTheFront<T extends t.Statement> (stem: T) {
    this.ast.program.body.push(stem)

    return stem
  }
}
