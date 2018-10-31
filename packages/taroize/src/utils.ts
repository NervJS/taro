import * as template from 'babel-template'
import * as t from 'babel-types'
import { codeFrameColumns } from '@babel/code-frame'
import { camelCase, capitalize } from 'lodash'

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
        t.objectPattern(stateKeys.map(s =>
          t.objectProperty(t.identifier(s), t.identifier(s))
        ) as any),
        t.memberExpression(t.thisExpression(), t.identifier('state'))
      )
    ])
    returnStatement.unshift(stateDecl)
  }

  if (propsKeys.length) {
    let patterns = t.objectPattern(propsKeys.map(s =>
      t.objectProperty(t.identifier(s), t.identifier(s))
    ) as any)
    if (typeof templateType === 'string') {
      patterns = t.objectPattern([
        t.objectProperty(t.identifier('data'), t.identifier(templateType)) as any
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

export const setting = {
  sourceCode: ''
}

// tslint:disable-next-line
export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'ScrollView',
  'Swiper',
  'MovableView',
  'CoverView',
  'CoverImage',
  'Icon',
  'Text',
  'RichText',
  'Progress',
  'Button',
  'Checkbox',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'Radio',
  'RadioGroup',
  'CheckboxGroup',
  'Slider',
  'Switch',
  'Textarea',
  'Navigator',
  'Audio',
  'Image',
  'Video',
  'Camera',
  'LivePlayer',
  'LivePusher',
  'Map',
  'Canvas',
  'OpenData',
  'WebView',
  'SwiperItem',
  'MovableArea',
  'MovableView',
  'FunctionalPageNavigator',
  'Ad',
  'Block'
])
