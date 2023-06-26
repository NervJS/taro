import * as hooks from '../constant'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  [
    hooks.MODIFY_WEBPACK_CHAIN,
    hooks.MODIFY_BUILD_ASSETS,
    hooks.MODIFY_MINI_CONFIGS,
    hooks.MODIFY_COMPONENT_CONFIG,
    hooks.ON_COMPILER_MAKE,
    hooks.ON_PARSE_CREATE_ELEMENT,
    hooks.ON_BUILD_START,
    hooks.ON_BUILD_FINISH,
    hooks.ON_BUILD_COMPLETE,
    hooks.MODIFY_RUNNER_OPTS
  ].forEach(methodName => {
    ctx.registerMethod(methodName)
  })
}
