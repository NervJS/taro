import { IPluginContext } from '@tarojs/service'

import * as hooks from '../constant'

export default (ctx: IPluginContext) => {
  [
    hooks.MODIFY_CREATE_TEMPLATE,
  ].forEach(methodName => {
    ctx.registerMethod(methodName)
  })
}
