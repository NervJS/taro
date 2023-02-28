import { CallExpression } from '@swc/core'
import { Visitor } from '@swc/core/Visitor.js'

export class InjectDefineConfigHeader extends Visitor {
  visitTsType (expression) {
    return expression
  }

  visitCallExpression (expression: CallExpression) {
    const callee = expression.callee
    if (callee.type === 'Identifier' && (callee.value === 'definePageConfig' || callee.value === 'defineAppConfig')) {
      return expression.arguments[0].expression
    }

    return expression
  }
}

interface ICreateSwcRegisterParam {
  only
  plugins?: [string, any][]
}

export default function createSwcRegister ({ only, plugins }: ICreateSwcRegisterParam) {
  const config: Record<string, any> = {
    only: Array.from(new Set([...only])),
    jsc: {
      parser: {
        syntax: 'typescript',
        decorators: true
      },
      transform: {
        legacyDecorator: true
      }
    },
    module: {
      type: 'commonjs'
    }
  }

  if (plugins) {
    config.jsc.experimental = {
      plugins
    }
  }

  require('@swc/register')(config)
}
