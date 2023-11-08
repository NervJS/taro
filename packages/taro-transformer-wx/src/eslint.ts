// import * as t from '@babel/types'
import { PluginPass } from '@babel/core'
import { Visitor } from '@babel/traverse'
import { CLIEngine } from 'eslint'

import { codeFrameError } from './utils'

const cli = new CLIEngine({
  baseConfig: {
    extends: ['plugin:taro/transformer'],
  },
  rules: {
    'react/no-multi-comp': [2, { ignoreStateless: false }],
  },
  plugins: ['react'],
  useEslintrc: false,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  settings: {
    react: {
      pragma: 'Taro',
      version: 'detect',
    },
  },
} as any)

export const eslintValidation: () => {
  visitor: Visitor
} = () => {
  return {
    visitor: {
      Program(_, state: PluginPass) {
        const {
          file: { code },
        } = state
        const report = cli.executeOnText(code)
        if (report.errorCount > 0) {
          for (const result of report.results) {
            for (const msg of result.messages) {
              const err = codeFrameError(
                {
                  start: {
                    line: msg.line,
                    column: msg.column,
                  },
                  end: {
                    line: msg.endLine,
                    column: msg.endColumn,
                  },
                },
                msg.message
              )
              // tslint:disable-next-line
              console.warn(
                '\n' +
                  `ESLint(${msg.ruleId}) 错误：` +
                  err.message.replace(
                    'Declare only one React component per file',
                    '一个文件只能定义一个 Taro 类或 Taro 函数式组件'
                  ) +
                  '\n'
              )
            }
          }
        }
      },
    },
  }
}
