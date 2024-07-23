import { ESLint, type Linter } from 'eslint'

import { codeFrameError } from './utils'

import type { PluginPass } from '@babel/core'
import type { Visitor } from '@babel/traverse'

const eslintInstance = new ESLint({
  useEslintrc: false,
  baseConfig: {
    extends: ['plugin:taro/transformer'],
    plugins: ['react'],
    rules: {
      'react/no-multi-comp': [2, { ignoreStateless: false }],
    },
    parserOptions: {
      requireConfigFile: false,
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
})

export const eslintValidation: () => {
  visitor: Visitor
} = () => {
  return {
    visitor: {
      Program(_, state: PluginPass) {
        const {
          file: { code },
        } = state
        eslintInstance.lintText(code)
          .then(results => {
            let messages: Linter.LintMessage[] = []
            results.forEach(res => {
              if (res.errorCount > 0) {
                messages.push(...res.messages)
              }
            })
            for (const msg of messages) {
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
          })
          .catch(err => {
            console.error('lint error: ', err)
          })
      },
    },
  }
}
