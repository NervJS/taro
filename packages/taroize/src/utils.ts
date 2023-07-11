import { codeFrameColumns } from '@babel/code-frame'
import * as babel from '@babel/core'
import { parse } from '@babel/parser'
import classProperties from '@babel/plugin-proposal-class-properties'
import decorators from '@babel/plugin-proposal-decorators'
import objectRestSpread from '@babel/plugin-proposal-object-rest-spread'
import optionalChaining from '@babel/plugin-proposal-optional-chaining'
import asyncGenerators from '@babel/plugin-syntax-async-generators'
import dynamicImport from '@babel/plugin-syntax-dynamic-import'
import asyncFunctions from '@babel/plugin-transform-async-to-generator'
import exponentiationOperator from '@babel/plugin-transform-exponentiation-operator'
import flowStrip from '@babel/plugin-transform-flow-strip-types'
import jsxPlugin from '@babel/plugin-transform-react-jsx'
import presetTypescript from '@babel/preset-typescript'
import { default as template } from '@babel/template'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { camelCase, capitalize } from 'lodash'

export function isAliasThis (p: NodePath<t.Node>, name: string) {
  const binding = p.scope.getBinding(name)
  if (binding) {
    return binding.path.isVariableDeclarator() && t.isThisExpression(binding.path.get('init'))
  }
  return false
}

export function isValidVarName (str?: string) {
  if (typeof str !== 'string') {
    return false
  }

  if (str.trim() !== str) {
    return false
  }

  try {
    // eslint-disable-next-line no-new, no-new-func
    new Function(str, 'var ' + str)
  } catch (e) {
    return false
  }

  return true
}

export function parseCode (code: string, scriptPath?: string) {
  // 支持TS的解析
  if (typeof scriptPath !== 'undefined') {
    return (babel.transformSync(code, {
      ast: true,
      sourceType: 'module',
      filename: scriptPath,
      presets: [presetTypescript],
      plugins: [
        classProperties,
        jsxPlugin,
        flowStrip,
        asyncFunctions,
        exponentiationOperator,
        asyncGenerators,
        objectRestSpread,
        [decorators, { legacy: true }],
        dynamicImport,
        optionalChaining
      ]
    }) as { ast: t.File }).ast
  }

  return (babel.transformSync(code, {
    ast: true,
    sourceType: 'module',
    plugins: [
      classProperties,
      jsxPlugin,
      flowStrip,
      asyncFunctions,
      exponentiationOperator,
      asyncGenerators,
      objectRestSpread,
      [decorators, { legacy: true }],
      dynamicImport,
      optionalChaining
    ]
  }) as { ast: t.File }).ast
}

export const buildTemplate = (str: string) => {

  // 检查字符串中是否包含占位符
  const hasPlaceholder = /{{\s*(\w+)\s*}/.test(str)

  let ast
  if (hasPlaceholder) {
    // 如果存在占位符，则使用模板创建AST
    const astTemplate = template(str)
    ast = astTemplate({})
  } else {
    // 否则直接解析字符串为AST
    ast = parse(str).program.body[0]
  }
  if (t.isExpressionStatement(ast)) {
    return ast.expression
  } else {
    throw new Error(`Invalid AST. Expected an ExpressionStatement`)
  }
}

export function buildBlockElement () {
  return t.jSXElement(
    t.jSXOpeningElement(t.jSXIdentifier('Block'), []),
    t.jSXClosingElement(t.jSXIdentifier('Block')),
    []
  )
}

export function pascalName (s: string) {
  const str = camelCase(s)
  return capitalize(str[0]) + str.slice(1)
}

export function buildRender (
  returned: t.Expression,
  stateKeys: string[],
  propsKeys: string[],
  templateType?: string | never[]
) {
  const returnStatement: t.Statement[] = [t.returnStatement(returned)]
  if (stateKeys.length) {
    const stateDecl = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.objectPattern(Array.from(new Set(stateKeys)).filter(s => !propsKeys.includes(s)).map(s =>
          t.objectProperty(t.identifier(s), t.identifier(s), false, true)
        ) as any),
        t.memberExpression(t.thisExpression(), t.identifier('data'))
      )
    ])
    returnStatement.unshift(stateDecl)
  }

  if (propsKeys.length) {
    let patterns = t.objectPattern(Array.from(new Set(propsKeys)).map(s =>
      t.objectProperty(t.identifier(s), t.identifier(s), false, true)
    ) as any)
    if (typeof templateType === 'string') {
      patterns = t.objectPattern([
        t.objectProperty(
          t.identifier('data'),
          templateType === 'wxParseData'
            ? t.objectPattern([t.objectProperty(t.identifier('wxParseData'), t.identifier('wxParseData')) as any]) as any
            : t.identifier(templateType)
        ) as any
      ])
    } else if (Array.isArray(templateType)) {
      patterns = t.objectPattern([
        t.objectProperty(t.identifier('data'), patterns as any) as any
      ])
    }
    const stateDecl = t.variableDeclaration('const', [
      t.variableDeclarator(
        patterns,
        t.memberExpression(t.thisExpression(), t.identifier('props'))
      )
    ])
    returnStatement.unshift(stateDecl)
  }
  return t.classMethod(
    'method',
    t.identifier('render'),
    [],
    t.blockStatement(returnStatement)
  )
}

export function buildImportStatement (source: string, specifiers: string[] = [], defaultSpec?: string) {
  return t.importDeclaration(
    defaultSpec ? [defaultSpec, ...specifiers].map((spec, index) => {
      if (index === 0) {
        return t.importDefaultSpecifier(t.identifier(defaultSpec))
      }
      return t.importSpecifier(t.identifier(spec), t.identifier(spec))
    }) : specifiers.map(s => t.importSpecifier(t.identifier(s), t.identifier(s))),
    t.stringLiteral(source)
  )
}

export const setting = {
  sourceCode: '',
  rootPath: ''
}

export function codeFrameError (node, msg: string) {
  let errMsg = ''
  try {
    errMsg = codeFrameColumns(setting.sourceCode, node && node.type && node.loc ? node.loc : node)
  } catch (error) {
    errMsg = 'failed to locate source'
  }
  return new Error(`${msg}
  -----
  ${errMsg}`)
}

// eslint-disable-next-line camelcase
export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'Icon',
  'Progress',
  'RichText',
  'Text',
  'Button',
  'Checkbox',
  'CheckboxGroup',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'PickerViewColumn',
  'Radio',
  'RadioGroup',
  'Slider',
  'Switch',
  'CoverImage',
  'Textarea',
  'CoverView',
  'MovableArea',
  'MovableView',
  'ScrollView',
  'Swiper',
  'SwiperItem',
  'Navigator',
  'Audio',
  'Camera',
  'Image',
  'LivePlayer',
  'Video',
  'Canvas',
  'Ad',
  'WebView',
  'Block',
  'Map',
  'Slot',
  'SlotView',
  'Editor',
  'MatchMedia',
  'FunctionalPageNavigator',
  'LivePusher',
  'OfficialAccount',
  'OpenData',
  'NavigationBar',
  'PageMeta',
  'VoipRoom',
  'AdCustom'
])
