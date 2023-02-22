/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { codeFrameColumns } from '@babel/code-frame'
import { transform } from 'babel-core'
import * as template from 'babel-template'
import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import { camelCase, capitalize } from 'lodash'

export function isAliasThis (p: NodePath<t.Node>, name: string) {
  const binding = p.scope.getBinding(name)
  if (binding) {
    return binding.path.isVariableDeclarator() && binding.path.get('init').isThisExpression()
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

export function parseCode (code: string) {
  return (transform(code, {
    parserOpts: {
      sourceType: 'module',
      plugins: [
        'classProperties',
        'jsx',
        'flow',
        'flowComment',
        'trailingFunctionCommas',
        'asyncFunctions',
        'exponentiationOperator',
        'asyncGenerators',
        'objectRestSpread',
        'decorators',
        'dynamicImport'
      ]
    }
  }) as { ast: t.File }).ast
}

export const buildTemplate = (str: string) => template(str)().expression as t.Expression

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
