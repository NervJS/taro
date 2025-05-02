import { fs } from '@tarojs/helper'
import { paramCase } from 'change-case'
import ts from 'typescript'

import { generateDocumentation } from '../utils/ast'

import type { DocEntry } from '../utils/ast'

const tsconfig: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  noResolve: false,
  paths: {
    '@tarojs/api': ['node_modules/@tarojs/taro/types']
  },
  types: ['@tarojs/taro-h5/types']
}
const CompRGX = /^Taro(.*)Core$/
const IgnoreSymbols = [
  ts.SymbolFlags.Interface,
  ts.SymbolFlags.TypeLiteral,
  ts.SymbolFlags.TypeAlias,
]

export function parseComponents (docTree: DocEntry[]) {
  // ${component}.${attribute}.${option}
  return docTree.reduce((p, e) => {
    let { name = '', members = [] } = e
    if (CompRGX.test(name)) {
      name = paramCase(name.replace(CompRGX, '$1'))
      p[name] = members.reduce((p2, e2) => {
        p2[e2.name ?? ''] = parseComponentAttribute(e2)

        return p2
      }, {})
    }
    return p
  }, {})
}

export function parseAPIs (docTree: DocEntry[]) {
  // ${API}.${method}.${param}.${option}
  return docTree.reduce((p, e) => {
    if (!IgnoreSymbols.includes(e.flags!)) {
      p[e.name ?? ''] = parseAPIMethod(e)
    }

    return p
  }, {})
}

const anyTypes = ['any', 'TaroStatic', '{}', 'IAnyObject', 'T']
const voidTypes = ['', 'void', 'null', 'undefined']
const anyStr = '*'
const voidStr = 'void'
export function parseComponentAttribute (e: DocEntry) {
  return parseAnyOrVoid(e.type, e.type)
}

export function parseAPIMethod (e: DocEntry) {
  const o: Record<string, any> = {}
  const { type = 'any', flags = ts.SymbolFlags.None, declarations = [] } = e
  if (anyTypes.includes(type)) {
    return anyStr
  } else if (flags === ts.SymbolFlags.BlockScopedVariable && declarations.length > 0) {
    const [declaration = {}] = declarations
    const { parameters = [], returnType = '' } = declaration
    const [parameter] = parameters
    const isCallback = parameter?.name === 'callback'
    // console.log('parseAPIMethod', e.name, parameters)
    if (isCallback) {
      const [callback] = parameter?.declarations || []
      const obj = callback?.parameters?.[0] || {}
      // FIXME parse callback ${param}.${option}
      o.callback = parseAnyOrVoid(obj?.type)
    } else {
      // FIXME parse parameter ${param}.${option}
      o.object = parseAnyOrVoid(parameter?.type)
      // FIXME parse successCallback ${param}.${option}
      o.success = voidStr
    }
    // FIXME parse returnType ${param}.${option}
    const returnValue = parseAnyOrVoid(returnType)
    if (returnValue !== voidStr) {
      o.return = returnValue
    }
  }
  return o
}

export function parseAnyOrVoid (str = '', obj: unknown = str) {
  return anyTypes.includes(str) ? anyStr : voidTypes.includes(str) ? voidStr : obj || str
}

export function parseDefinitionJSON ({
  apisPath = require.resolve('@tarojs/taro-h5/dist/index.esm.d.ts'),
  componentsPath = require.resolve('@tarojs/components/dist/types/components.d.ts'),
} = {},
config: ts.CompilerOptions = tsconfig,
) {
  const apis = parseAPIs(generateDocumentation([apisPath], config))
  const Components = generateDocumentation([componentsPath], config).find(e => e.name === 'Components')?.children || []
  const components = parseComponents(Components)

  // Note: 写入文件
  fs.ensureDirSync('dist')
  fs.writeJSONSync('dist/definition.json', {
    apis,
    components,
  }, { spaces: 2 })
}
