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
