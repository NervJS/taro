import * as hooks from '../constant'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  [
    hooks.MODIFY_CREATE_TEMPLATE,
  ].forEach(methodName => {
    ctx.registerMethod(methodName)
  })
}
