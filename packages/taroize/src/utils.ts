import { codeFrameColumns } from '@babel/code-frame'
import classProperties from '@babel/plugin-proposal-class-properties'
import decorators from '@babel/plugin-proposal-decorators'
import objectRestSpread from '@babel/plugin-proposal-object-rest-spread'
import asyncGenerators from '@babel/plugin-syntax-async-generators'
import dynamicImport from '@babel/plugin-syntax-dynamic-import'
import exponentiationOperator from '@babel/plugin-transform-exponentiation-operator'
import flowStrip from '@babel/plugin-transform-flow-strip-types'
import jsxPlugin from '@babel/plugin-transform-react-jsx'
import { default as template } from '@babel/template'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { parse } from 'babylon'
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
  return parse(code, {
    plugins: [
      classProperties,
      jsxPlugin,
      flowStrip,
      exponentiationOperator,
      asyncGenerators,
      objectRestSpread,
      [decorators, { legacy: true }],
      dynamicImport,
    ],
    sourceFilename: scriptPath,
  }) as t.File
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
        t.objectPattern(
          Array.from(new Set(stateKeys))
            .filter((s) => !propsKeys.includes(s))
            .map((s) => t.objectProperty(t.identifier(s), t.identifier(s), false, true)) as any
        ),
        t.memberExpression(t.thisExpression(), t.identifier('data'))
      ),
    ])
    returnStatement.unshift(stateDecl)
  }

  if (propsKeys.length) {
    let patterns = t.objectPattern(
      Array.from(new Set(propsKeys)).map((s) => t.objectProperty(t.identifier(s), t.identifier(s), false, true)) as any
    )
    if (typeof templateType === 'string') {
      patterns = t.objectPattern([
        t.objectProperty(
          t.identifier('data'),
          templateType === 'wxParseData'
            ? (t.objectPattern([
              t.objectProperty(t.identifier('wxParseData'), t.identifier('wxParseData')) as any,
            ]) as any)
            : t.identifier(templateType)
        ) as any,
      ])
    } else if (Array.isArray(templateType)) {
      patterns = t.objectPattern([t.objectProperty(t.identifier('data'), patterns as any) as any])
    }
    const stateDecl = t.variableDeclaration('const', [
      t.variableDeclarator(patterns, t.memberExpression(t.thisExpression(), t.identifier('props'))),
    ])
    returnStatement.unshift(stateDecl)
  }
  return t.classMethod('method', t.identifier('render'), [], t.blockStatement(returnStatement))
}

export function buildImportStatement (
  source: string,
  specifiers: string[] = [],
  defaultSpec?: string,
  isCommonjsModule?: boolean
) {
  if (isCommonjsModule) {
    if (defaultSpec && specifiers.length > 0) {
      throw new Error(
        `commomjs模块不支持同时引入default和非default模块，default：${defaultSpec}, 非default：${specifiers}`
      )
    }
    return t.variableDeclaration('const', [
      t.variableDeclarator(
        defaultSpec
          ? t.identifier(defaultSpec)
          : t.objectPattern(
            specifiers.map((specifier) => t.objectProperty(t.identifier(specifier), t.identifier(specifier)))
          ),
        t.callExpression(t.identifier('require'), [t.stringLiteral(source)])
      ),
    ])
  }

  return t.importDeclaration(
    defaultSpec
      ? [defaultSpec, ...specifiers].map((spec, index) => {
        if (index === 0) {
          return t.importDefaultSpecifier(t.identifier(defaultSpec))
        }
        return t.importSpecifier(t.identifier(spec), t.identifier(spec))
      })
      : specifiers.map((s) => t.importSpecifier(t.identifier(s), t.identifier(s))),
    t.stringLiteral(source)
  )
}

export const setting = {
  sourceCode: '',
  rootPath: '',
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
  'AdCustom',
])

/**
 * 根据关键字exports判断是否为commonjs模块
 *
 * @param {} bodyNode
 * @returns {boolean}
 */
export function isCommonjsModule (bodyNode) {
  return bodyNode.some((p) => {
    if (t.isExpressionStatement(p) && t.isAssignmentExpression(p.expression)) {
      const expression = p.expression
      // 1、module.exports.num = num 2、module.exports = {}
      const isModuleExports =
        (expression.left.type === 'MemberExpression' &&
          expression.left.object.type === 'MemberExpression' &&
          expression.left.object.property.type === 'Identifier' &&
          expression.left.object.property.name === 'exports') ||
        (expression.left.type === 'MemberExpression' &&
          expression.left.property.type === 'Identifier' &&
          expression.left.property.name === 'exports')

      // exports.num = num
      const isExports =
        expression.left.type === 'MemberExpression' &&
        expression.left.object.type === 'Identifier' &&
        expression.left.object.name === 'exports'
      return isModuleExports || isExports
    }
    return false
  })
}

interface Position {
  line: number
  column: number
}

/**
 * 将oldElement的location信息赋值给newElement的loc属性
 *
 * @param newElement 新节点
 * @param oldElement 旧节点
 * @returns newElement 添加位置信息的新节点
 */
export function addLocInfo (newElement, oldElement, filePath?: string) {
  if (oldElement && oldElement.position) {
    const position = oldElement.position
    const locStart: Position = { line: position.start.line + 1, column: position.start.column }
    const locEnd: Position = { line: position.end.line + 1, column: position.end.column }
    newElement.loc = {
      start: locStart,
      end: locEnd,
      filename: filePath,
    }
  }
  return newElement
}

/**
 * 判断字符串只包含换行符和空格
 * 换行符，win: \r\n mac: \r
 *
 * @param { string } str
 * @returns { boolean }
 */
export function isLineBreak (str: string) {
  if (isNullOrUndefined(str)) {
    return false
  }

  const regex = /^[\r\n\s]+$/
  return regex.test(str)
}

/**
 * 判断参数是否为null或undefined
 *
 * @param param
 * @returns { boolean }
 */
export function isNullOrUndefined (param) {
  return param === null || param === undefined
}

/**
 * 获取不同操作系统下的换行符
 *
 * @returns { string } 换行符
 */
export function getLineBreak () {
  if (process.platform === 'win32') {
    return '\r\n'
  }
  return '\n'
}
