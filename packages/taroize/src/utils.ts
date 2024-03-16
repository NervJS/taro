import { codeFrameColumns } from '@babel/code-frame'
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import { default as template } from '@babel/template'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { fs } from '@tarojs/helper'
import { camelCase, capitalize } from 'lodash'
import * as prettier from 'prettier'

import { globals } from './global'

const prettierJSConfig: prettier.Options = {
  semi: false,
  singleQuote: true,
  parser: 'babel',
}

// export function isAliasThis (p: NodePath<t.Node>, name: string) {
//   const binding = p.scope.getBinding(name)
//   if (binding) {
//     return binding.path.isVariableDeclarator() && t.isThisExpression(binding.path.get('init'))
//   }
//   return false
// }

/**
 * 标准化传入路径
 *
 * @param path 如D:\\admin格式路径
 * @returns 替换\\返回标准路径
 */
export function normalizePath (path) {
  if (typeof path === 'undefined') {
    return ''
  }
  return path.replace(/\\/g, '/')
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
  updateLogFileContent(`INFO [taroize] parseCode - 入参${getLineBreak()}scriptPath: ${scriptPath} ${getLineBreak()}`)
  let ast: any = {}
  try {
    if (typeof scriptPath !== 'undefined') {
      ast = parse(code, {
        sourceFilename: scriptPath,
        sourceType: 'module',
        plugins: [
          'jsx',
          'flow',
          'decorators-legacy',
          ['optionalChainingAssign', { version: '2023-07' }],
          'sourcePhaseImports',
          'throwExpressions',
          'deferredImportEvaluation',
          'exportDefaultFrom'
        ],
      })
    } else {
      ast = parse(code, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'flow',
          'decorators-legacy',
          ['optionalChainingAssign', { version: '2023-07' }],
          'sourcePhaseImports',
          'throwExpressions',
          'deferredImportEvaluation',
          'exportDefaultFrom'
        ],
      })
    }
  } catch (error) {
    updateLogFileContent(`ERROR [taroize] parseCode - 转换代码异常 ${getLineBreak()}${error} ${getLineBreak()}`)
    // 结尾注释会引起 parseCode 报错，因此收录到报告中
    if (error.message.includes('Unterminated comment')) {
      throw new IReportError(
        'WXML代码解析失败, 代码中存在不完整的注释',
        'UnterminatedComment',
        'WXML_FILE',
        code || ''
      )
    }
  }
  // 移除Flow类型注释
  traverse(ast, {
    TypeAnnotation (path) {
      path.remove()
    },
  })
  return ast
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
    throw new IReportError(
      `Invalid AST. Expected an ExpressionStatement`,
      'InvalidASTError',
      'WXML_FILE',
      str
    )
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

/**
 * 记录数据到logFileContent中
 *
 * @param data 日志数据
 */
export function updateLogFileContent (data: string) {
  try {
    globals.logFileContent += data
  } catch (error) {
    console.error(`记录日志数据异常 ${error.message}`)
  }
}

/**
 * 写入数据到日志文件中
 *
 */
export function printToLogFile () {
  try {
    fs.appendFile(globals.logFilePath, globals.logFileContent)
    globals.logFileContent = ''
  } catch (error) {
    console.error(`写入日志文件异常 ${error.message}`)
    throw new IReportError(
      '写日志文件异常',
      'WriteLogException',
      globals.logFilePath,
      ''
    )
  }
}

/**
 * 将部分 ast 节点转为代码片段
 * @param ast
 * @returns
 */
export function astToCode (ast) {
  if (!ast) return ''
  try {
    let formatCode = prettier.format(generate(ast).code, prettierJSConfig)
    if (formatCode.startsWith(';')) {
      formatCode = formatCode.slice(1)
    }
    return formatCode
  } catch (err) {
    //
  }
}

/**
 * 创建 errorCodeMsg 对象
 * @param msgType 错误类型
 * @param describe 错误描述
 * @param code 错误代码
 * @param filePath 错误信息所在文件路径
 * @returns
 */
export function createErrorCodeMsg (
  msgType: string,
  describe: string,
  code: string,
  filePath: string,
  position?: { col: number, row: number } | undefined
) {
  const errorCodeMsg = {
    msgType,
    describe,
    codeBeforeConvert: {
      filePath,
      code,
      location: { start: position || { col: 0, row: 0 } },
    },
  }
  globals.errCodeMsgs.push(errorCodeMsg)
}

/**
 *  拓展原生 Error 属性
 */
export class IReportError extends Error {
  // 错误信息类型
  msgType: string

  // 错误信息路径
  filePath: string | 'JS_FILE' | 'WXML_FILE'

  // 错误代码
  code: string

  // 错误代码位置信息
  location: { col: number, row: number } | undefined

  constructor (
    message: string,
    msgType?: string,
    filePath?: string | 'JS_FILE' | 'WXML_FILE',
    code?: string,
    location?: { col: number, row: number } | undefined
  ) {
    super(message)
    this.msgType = msgType || ''
    this.filePath = filePath || ''
    this.code = code || ''
    this.location = location || { col: 0, row: 0 }
  }
}

/**
 * 将oldElement的position信息赋值给newElement的position属性
 *
 * @param newElement 新节点
 * @param oldElement 旧节点
 * @returns newElement 添加位置信息的新节点
 */
export function addLocInfo (newElement, oldElement) {
  if (oldElement && oldElement.position) {
    const position = oldElement.position
    const newPosition = {
      start: { line: position?.start.line + 1, column: position?.start.column + 1 },
      end: { line: position?.end.line + 1, column: position?.end.column + 1 }
    }
    newElement.position = newPosition
  }
  return newElement
}